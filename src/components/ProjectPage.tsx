import '../styles/ProjectView.css'
import type { Project } from '../types'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CreateTask } from './CreateTask'
import { taskStatuses } from './TaskStatuses'
import { useGuildMembers } from '../hooks/useGuildMembers'
import { getAvatar, getDisplayName } from '../util'

import { TableComponent } from './TableComponent.tsx'

const swal = withReactContent(Swal)

interface ProjectProps {
	project: Project
	close: () => void
}

export function ProjectPage({ project, close }: ProjectProps) {
	const { tasks } = project

	const { members, getMember } = useGuildMembers() // can't access context inside modal so getting here

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
						html: <CreateTask projectId={project.id} members={members} />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Create Task
			</button>
			<TableComponent project={project} />
			{tasks.map(task => (
				<li key={task.id}>
					{/* <p>ID: {task.id}</p> */}
					<button style={{ width: '75vw', height: '12vh', margin: 10 }} className="TaskContainer">
						<b>Task Name</b>: {task.name} |
						<span style={{ color: taskStatuses[task.status].color }}>
							{' '}
							<b>&nbsp;{taskStatuses[task.status].label}&nbsp;</b>{' '}
						</span>{' '}
						|<b>&nbsp;Assignees</b>:&nbsp;
						{task.assignees.map(assigneeId => {
							const member = getMember(assigneeId)
							if (!member) return 'Unknown'
							const name = getDisplayName(member)
							return (
								<div key={assigneeId} style={{ margin: 2 }} className="AvatarsView">
									<img
										className="Avatar"
										src={getAvatar(member)}
										alt={name}
										title={name}
										onClick={() => {
											console.log('clicked')
										}}
									/>
									<div className="ToolTip">{name}</div>
								</div>
							)
						})}
						{<button>Edit Task</button>}
						<br />
					</button>
				</li>
			))}
			{/* <TaskList tasks={tasks} /> */}
		</div>
	)
}
