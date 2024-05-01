import { FormEvent, useState } from 'react'
import Select from 'react-select'
import { styles } from '../styles/styles.ts'
import { selectStyles } from '../styles/select-styles.ts'
import { db } from '../services/firebase.ts'
import { arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import { APIGuildMember } from 'discord-api-types/v10'
import { type Choice, ChoiceButtons } from './ChoiceButtons.tsx'
import { Priority, Task, TaskStatus } from '../types.ts'
import Swal from 'sweetalert2'

export const taskStatuses: Choice[] = [
	{ value: TaskStatus.ToDo, label: 'To Do', color: 'crimson' },
	{ value: TaskStatus.Backlog, label: 'Backlog', color: 'orange' },
	{ value: TaskStatus.InProgress, label: 'In Progress', color: 'lightblue' },
	{ value: TaskStatus.Completed, label: 'Completed', color: 'lightgreen' }
]

export const priorities: Choice[] = [
	{ value: Priority.Low, label: 'Low', color: 'lightgreen' },
	{ value: Priority.Normal, label: 'Normal', color: 'yellow' },
	{ value: Priority.High, label: 'High', color: 'orange' },
	{ value: Priority.Urgent, label: 'Urgent', color: 'crimson' }
]

type FormData = Omit<Task, 'id'>

interface Props {
	projectId: string
	members: APIGuildMember[]
}

export function CreateTask({ projectId, members }: Props) {
	const [formData, setFormData] = useState<FormData>({
		status: TaskStatus.ToDo,
		priority: Priority.Normal,
		assignees: [],
		name: ''
	})
	const [error, setError] = useState('')

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!formData.name.trim()) {
			setError('Please enter a task name.')
			return
		}

		const taskData = { ...formData, id: doc(collection(db, 'tasks')).id } // generate random id

		const projectDoc = doc(db, 'projects', projectId)

		try {
			await updateDoc(projectDoc, {
				tasks: arrayUnion(taskData)
			})
			setError('Created task successfully.')
			Swal.close()
		} catch (error) {
			console.error('Error adding document:', error)
			setError('Failed to create task.')
		}
	}

	const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => setFormData(prev => ({ ...prev, [name]: value }))

	return (
		<div style={{ padding: '20px' }}>
			<h2>Create Task</h2>
			{error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
			<form onSubmit={handleSubmit}>
				<label htmlFor="task-name">Task name:</label>
				<input
					id="task-name"
					style={styles.textBox}
					type="text"
					value={formData.name}
					onChange={e => handleInputChange('name', e.target.value)}
					required
				/>
				<br />
				<Select
					isMulti={true}
					name="assignees"
					options={members.map((m: APIGuildMember) => ({
						value: m.user!.id,
						label: m.user!.username
					}))}
					placeholder="Select assignees..."
					onChange={selected =>
						handleInputChange(
							'assignees',
							selected.map(e => e.value as string)
						)
					}
					styles={selectStyles}
				/>
				<h3 style={{ marginBottom: 5 }}>Set Priority</h3>
				<ChoiceButtons choices={priorities} setValueCallback={value => handleInputChange('priority', value)} />
				{/* <br/> */}

				<h3 style={{ marginBottom: 5 }}>Set Status</h3>
				<ChoiceButtons choices={taskStatuses} setValueCallback={value => handleInputChange('status', value)} />
				<p>Priority: {priorities[formData.priority].label}</p>
				<br />
				<p>Status: {taskStatuses[formData.status].label}</p>
				<br />
				<button type="submit">Create Task</button>
			</form>
		</div>
	)
}
