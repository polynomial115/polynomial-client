import Select from 'react-select'
// import { APIGuildMember } from 'discord-api-types/v10'
import { useEffect, useState } from 'react'
import '../styles/ProjectView.css'
import { db } from '../services/firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { Task } from '../types'

interface EditProjectProps {
	projectId: string
}

// interface FormData {
// 	assignees: string[]
// 	name: string
// }

export function EditProject({ projectId }: Readonly<EditProjectProps>) {
	const [tasks, setTasks] = useState<Task[]>([])

	void projectId // todo query tasks for the project
	useEffect(() => {
		const tasksQuery = query(collection(db, 'tasks'))

		const unsubscribe = onSnapshot(
			tasksQuery,
			snapshot => {
				const tasksData = snapshot.docs.map(
					doc =>
						({
							id: doc.id,
							...doc.data()
						}) as Task
				)
				setTasks(tasksData)
			},
			error => {
				console.error('Error fetching tasks:', error)
			}
		)

		return () => unsubscribe()
	}, [])

	// const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => {
	// 	setFormData(prev => ({
	// 		...prev,
	// 		[name]: value
	// 	}))
	// }

	return (
		<div className="fullscreen-container">
			<h2>Editing project</h2>

			<div>
				<Select
					isMulti={true}
					name="assignees"
					// options={users.map((m: APIGuildMember) => ({ idk how this works lol someone pls fix
					// 	value: m.user!.username,
					// 	label: m.user!.username
					// }))}
					placeholder="Select task..."
					// onChange={selected =>
					// 	handleInputChange(
					// 		'assignees',
					// 		selected.map(s => s.value)
					// 	)
					// }
				/>

				<input type="text" name="name" required></input>
				<button>Save</button>
			</div>

			<ul>
				{tasks.map(task => (
					<li key={task.id}>
						<p>ID: {task.id}</p>
						<p>Name: {task.name}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
