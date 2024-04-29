import '../styles/ProjectView.css'
import type { Project } from '../types'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CreateTask, taskStatuses } from './CreateTask'

const swal = withReactContent(Swal)

interface Props {
	project: Project
	close: () => void
}

// interface FormData {
// 	assignees: string[]
// 	name: string
// }


export function ProjectPage({ project, close }: Props) {
	const { tasks } = project

	// const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => {
	// 	setFormData(prev => ({
	// 		...prev,
	// 		[name]: value
	// 	}))
	// }

	return (
		<div>
			<button onClick={close}>Close</button>
			<h2>{project.name}</h2>

			{/* <div>
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

				<input type="text" name="name" required />
				<button>Save</button>
			</div> */}

			<button
				onClick={() =>
					swal.fire({
						html: <CreateTask projectId={project.id} />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Create Task
			</button>

				{tasks.map(task => (
					<li key={task.id}>
						{/* <p>ID: {task.id}</p> */}
						<p>
							<b>Task Name</b>: {task.name} |
							<span style={{color:taskStatuses[task.status].color}}> <b>{taskStatuses[task.status].label}</b> </span> | 
							<b> Assignees</b>: {task.assignees.map(a => a).join(', ')}
						</p>
						<button>Edit Task</button>
						<br/>
					</li>
				))}
		</div>
	)
}
