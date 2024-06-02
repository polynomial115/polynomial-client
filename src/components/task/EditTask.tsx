import { FormEvent, useState } from 'react'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { db } from '../../services/firebase.ts'
import { doc, updateDoc } from 'firebase/firestore'
import { APIGuildMember } from 'discord-api-types/v10'
import { ChoiceButtons } from '../ChoiceButtons.tsx'
import { Task, priorities, taskStatuses, deadlines, Deadline, Project } from '../../types.ts'
import TaskDetails from './TaskDetails'
import calculateDeadline from '../../scripts/CalculateDeadline.ts'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type FormData = Omit<Task, 'id' | 'deadline'> & {
	deadline: number | null
}

interface EditTaskProps {
	project: Project
	members: APIGuildMember[]
	currTask: Task
}

export function EditTask({ project, members, currTask }: EditTaskProps) {
	const [formData, setFormData] = useState<FormData>({
		status: currTask.status,
		priority: currTask.priority,
		assignees: currTask.assignees,
		deadline: calculateDeadline({ deadlineType: currTask.deadline }),
		name: currTask.name,
		description: currTask.description ?? ''
	})
	const [error, setError] = useState('')

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!formData.name.trim()) {
			setError('Please enter a task name.')
			return
		}

		const taskData = { ...formData, id: currTask.id }

		const projectDoc = doc(db, 'projects', project.id)

		try {
			await updateDoc(projectDoc, {
				tasks: project.tasks.map(t => (t.id === currTask.id ? taskData : t))
			})
			setError('Edited task successfully.')
			withReactContent(Swal).fire({
				html: <TaskDetails project={project} task={taskData as Task} members={members} />,
				background: '#202225',
				color: 'white',
				showConfirmButton: false,
				width: '800px'
			})
		} catch (error) {
			console.error('Error adding document:', error)
			setError('Failed to edit task.')
		}
	}

	const handleInputChange = (name: keyof FormData, value: string | string[] | number | Date | null) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	return (
		<div style={{ padding: '20px' }}>
			<h2>Edit Task: {currTask.name}</h2>
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
					value={members
						.filter((m: APIGuildMember) => formData.assignees.includes(m.user!.id))
						.map(m => ({ value: m.user!.id, label: m.user!.username }))}
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
				<ChoiceButtons
					choices={priorities}
					setValueCallback={value => handleInputChange('priority', value)}
					defaultValue={currTask.priority}
				/>

				<h3 style={{ marginBottom: 5 }}>Set Status</h3>
				<ChoiceButtons choices={taskStatuses} setValueCallback={value => handleInputChange('status', value)} defaultValue={currTask.status} />
				<br />
				<h3 style={{ marginBottom: 5 }}>When will this task be due?</h3>

				<Select
					isMulti={false}
					name="deadline"
					options={deadlines}
					placeholder="Select deadline..."
					onChange={selected => {
						if (selected) {
							const dl = calculateDeadline({ deadlineType: selected.value as Deadline })
							handleInputChange('deadline', dl)
						} else {
							console.error('Selected deadline is null or undefined')
						}
					}}
					styles={selectStyles}
					menuPosition="fixed"
				/>

				<button type="submit">Save</button>
			</form>
		</div>
	)
}
