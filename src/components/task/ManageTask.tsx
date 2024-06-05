import { FormEvent, useState } from 'react'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { db } from '../../services/firebase.ts'
import { arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import { ChoiceButtons } from '../ChoiceButtons.tsx'
import { Task, priorities, taskStatuses, deadlines, Deadline, Project, TaskStatus, Priority } from '../../types.ts'
import TaskDetails from './TaskDetails'
import calculateDeadline from '../../scripts/calculateDeadline.ts'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getAuth } from 'firebase/auth'
import type { GuildMember } from '../../hooks/useGuildMembers.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons'

const firebaseAuth = getAuth()
const swal = withReactContent(Swal)

type FormData = Omit<Task, 'id' | 'deadline'> & {
	deadline: number | null
}

interface Props {
	project: Project
	members: GuildMember[]
	currTask: Task | null // if null, create a new task
	token: string
}

interface DeleteProps {
	projectId: string
	tasks: Task[]
	delTask: Task
}
export function DeleteTask({ projectId, tasks, delTask }: DeleteProps) {
	const projectDoc = doc(db, 'projects', projectId)

	const handleYes = async () => {
		await updateDoc(projectDoc, { tasks: tasks.filter(t => t.id !== delTask.id) })
		Swal.fire({
			title: `Deleted Task ${delTask.name}`,
			background: '#202225',
			color: 'white',
			icon: 'success',
			timer: 2000,
			showConfirmButton: false
		})
	}

	return (
		<div>
			<h2>Are you sure you want to delete {delTask.name}?</h2> <br />
			<button onClick={() => handleYes()}> Yes </button>
			<button onClick={() => Swal.close()}> No </button>
		</div>
	)
}

export function ManageTask({ project, members, currTask, token }: Props) {
	const [formData, setFormData] = useState<FormData>(
		currTask
			? {
					status: currTask.status,
					priority: currTask.priority,
					assignees: currTask.assignees,
					deadline: calculateDeadline({ deadlineType: currTask.deadline }),
					name: currTask.name,
					description: currTask.description ?? ''
				}
			: {
					status: TaskStatus.ToDo,
					priority: Priority.Normal,
					assignees: [],
					deadline: 0,
					name: '',
					description: ''
				}
	)
	const [error, setError] = useState('')

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!formData.name.trim()) {
			setError('Please enter a task name.')
			return
		}

		let taskData: Task
		if (!currTask) {
			taskData = { ...formData, id: doc(collection(db, 'tasks')).id, deadline: formData.deadline ?? 0 } // generate random id
		} else {
			taskData = { ...formData, id: currTask.id, deadline: formData.deadline ?? 0 }
		}
		const projectDoc = doc(db, 'projects', project.id)

		try {
			if (!currTask) {
				await updateDoc(projectDoc, {
					tasks: arrayUnion(taskData)
				})
			} else {
				await updateDoc(projectDoc, {
					tasks: project.tasks.map(t => (t.id === currTask.id ? taskData : t))
				})
			}

			if (project.notificationsChannel) {
				await fetch(`/api/projects/${project.id}/tasks/${taskData.id}/notify`, {
					method: 'POST',
					headers: {
						Authorization: token,
						'Firebase-Token': await firebaseAuth.currentUser!.getIdToken()
					},
					body: JSON.stringify({ oldTask: currTask })
				})
			}

			withReactContent(Swal).fire({
				html: <TaskDetails project={project} task={taskData} members={members} token={token} />,
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
		<div className="task-modal">
			<h2>{!currTask ? 'Create Task' : `Edit Task: ${currTask.name}`}</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<input
					id="task-name"
					className="textbox name-textbox"
					type="text"
					value={formData.name}
					onChange={e => handleInputChange('name', e.target.value)}
					placeholder="Enter task name..."
					required
				/>
				<textarea
					id="task-description"
					className="textbox description-textbox"
					value={formData.description}
					onChange={e => handleInputChange('description', e.target.value)}
					placeholder="Enter task description..."
					maxLength={1000}
				/>
				<br />
				<h3 className="label">Add Assignees</h3>
				<Select
					isMulti={true}
					name="assignees"
					options={members.map(m => ({
						value: m.user.id,
						label: m.user.username
					}))}
					value={members.filter(m => formData.assignees.includes(m.user.id)).map(m => ({ value: m.user.id, label: m.user.username }))}
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
				<h3 className="label">Set Priority</h3>
				<ChoiceButtons
					choices={priorities}
					setValueCallback={value => handleInputChange('priority', value)}
					defaultValue={formData.priority}
				/>

				<h3 className="label">Set Status</h3>
				<ChoiceButtons choices={taskStatuses} setValueCallback={value => handleInputChange('status', value)} defaultValue={formData.status} />
				<br />
				<h3 className="label">When will this task be due?</h3>

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

				{currTask && (
					<button
						onClick={() =>
							swal.fire({
								html: <DeleteTask projectId={project.id} tasks={project.tasks} delTask={currTask} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false
							})
						}
					>
						<FontAwesomeIcon icon={faTrash} color="red" /> Delete Project
					</button>
				)}
				<button type="submit">
					<FontAwesomeIcon icon={faFloppyDisk} color="green" /> Save
				</button>
			</form>
		</div>
	)
}
