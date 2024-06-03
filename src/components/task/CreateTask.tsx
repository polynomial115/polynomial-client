import { FormEvent, useState } from 'react'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { db } from '../../services/firebase.ts'
import { arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import { APIGuildMember } from 'discord-api-types/v10'
import { ChoiceButtons } from '../ChoiceButtons.tsx'
import { Priority, Task, TaskStatus, priorities, taskStatuses, deadlines, Deadline, Project } from '../../types.ts'
import calculateDeadline from '../../scripts/CalculateDeadline.ts'
import Swal from 'sweetalert2'
import { getAuth } from 'firebase/auth'

type FormData = Omit<Task, 'id'>

interface Props {
	project: Project
	members: APIGuildMember[]
	token: string
}

const firebaseAuth = getAuth()

export function CreateTask({ project, members, token }: Props) {
	const [formData, setFormData] = useState<FormData>({
		status: TaskStatus.ToDo,
		priority: Priority.Normal,
		assignees: [],
		deadline: 0,
		name: '',
		description: ''
	})
	const [error, setError] = useState('')

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!formData.name.trim()) {
			setError('Please enter a task name.')
			return
		}

		const taskData = { ...formData, id: doc(collection(db, 'tasks')).id } // generate random id

		const projectDoc = doc(db, 'projects', project.id)

		try {
			await updateDoc(projectDoc, {
				tasks: arrayUnion(taskData)
			})

			if (project.notificationsChannel) {
				await fetch(`/api/projects/${project.id}/tasks/${taskData.id}/notify/create`, {
					method: 'POST',
					headers: {
						Authorization: token,
						'Firebase-Token': await firebaseAuth.currentUser!.getIdToken()
					}
				})
			}

			Swal.close()
		} catch (error) {
			console.error('Error adding document:', error)
			setError('Failed to create task.')
		}
	}

	const handleInputChange = (name: keyof FormData, value: string | string[] | number | Date | null) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}
	return (
		<div style={{ padding: '20px' }}>
			<h2>Create Task</h2>
			{error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
			<form onSubmit={handleSubmit}>
				<input
					id="task-name"
					className="textbox"
					type="text"
					value={formData.name}
					onChange={e => handleInputChange('name', e.target.value)}
					placeholder="Enter task name..."
					required
				/>
				<textarea
					id="task-description"
					className="textbox"
					value={formData.description}
					onChange={e => handleInputChange('description', e.target.value)}
					placeholder="Enter task description..."
					maxLength={1000}
				/>
				<br />
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
					menuPosition="fixed"
				/>
				<h3 style={{ marginBottom: 5 }}>Set Priority</h3>
				<ChoiceButtons choices={priorities} setValueCallback={value => handleInputChange('priority', value)} defaultValue={NaN} />

				<h3 style={{ marginBottom: 5 }}>Set Status</h3>
				<ChoiceButtons choices={taskStatuses} setValueCallback={value => handleInputChange('status', value)} defaultValue={NaN} />
				<br />
				<h3 style={{ marginBottom: 5 }}>When will this task be due?</h3>
				<Select
					isMulti={false}
					name="deadline"
					options={deadlines}
					placeholder="Select deadline..."
					onChange={selected => {
						const dl = calculateDeadline({ deadlineType: selected!.value as Deadline })
						handleInputChange('deadline', dl)
					}}
					styles={selectStyles}
					menuPosition="fixed"
				/>

				<button type="submit">Create Task</button>
			</form>
		</div>
	)
}
