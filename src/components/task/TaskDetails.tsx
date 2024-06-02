import { Task, Project, priorities, taskStatuses } from '../../types'
import { EditTask } from './EditTask'
import { DeleteTask } from './DeleteTask'
import { APIGuildMember } from 'discord-api-types/v10'
import { DiscordAvatar } from '../User'
import '../../styles/TaskModal.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	project: Project
	task: Task
	members: APIGuildMember[]
}

export default function TaskDetails({ project, task, members }: Props) {
	const { tasks } = project
	const taskList = tasks ?? project?.tasks ?? []
	const getMember = (id: string) => members.find(m => m.user?.id === id)

	return (
		<div className="modal">
			<h2 className="task-name">{task.name}</h2>
			<div className="container">
				<div className="left-column">
					<p className="description">{task.description}</p>
				</div>
				<div className="divider" />
				<div className="right-column">
					<h3 className="margin-text">
						<b>{priorities[task.priority].label} Priority</b>
					</h3>
					<h3 style={{ color: taskStatuses[task.status].color }}>
						<b>{taskStatuses[task.status].label}</b>
					</h3>
					<h3 className="deadline-text">Due {new Date(task.deadline).toLocaleDateString('en', { month: 'long', day: 'numeric' })}</h3>
					<h3 className="assign-header">Assigned to</h3>
					<div className="margin-text">
						{task.assignees.map(id => (
							<DiscordAvatar key={id} member={getMember(id)} size={48} />
						))}
					</div>
				</div>
			</div>
			<div>
				<button
					onClick={() => {
						if (task) {
							swal.fire({
								html: <EditTask project={project} members={members} currTask={task} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false,
								width: '625px'
							})
						} else {
							console.error('Task not found')
						}
					}}
				>
					Edit Task
				</button>

				<button
					onClick={() => {
						if (task) {
							swal.fire({
								html: <DeleteTask projectId={project.id} tasks={taskList} delTask={task} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false
							})
						} else {
							console.error('Task not found for deletion')
						}
					}}
				>
					Delete Task
				</button>
			</div>
		</div>
	)
}
