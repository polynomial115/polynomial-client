import { Task, Project, getStatus, getPriority } from '../../types'
import { DeleteTask } from './DeleteTask'
import { APIGuildMember } from 'discord-api-types/v10'
import { DiscordAvatar } from '../User'
import '../../styles/TaskModal.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ManageTask } from './ManageTask'

const swal = withReactContent(Swal)

interface Props {
	project: Project
	task: Task
	members: APIGuildMember[]
	token: string
}

export default function TaskDetails(props: Props) {
	const { project, task, members, token } = props

	const getMember = (id: string) => members.find(m => m.user?.id === id)

	const reopen = () =>
		swal.fire({
			html: <TaskDetails {...props} />,
			background: '#202225',
			color: 'white',
			showConfirmButton: false,
			width: '800px',
			animation: false
		})

	const status = getStatus(task.status)

	return (
		<div className="modal">
			<h2 className="task-name">{task.name}</h2>
			<div className="container">
				<div className="left-column">
					<p className="description" style={{ color: task.description.length > 0 ? 'inherit' : '#888' }}>
						{task.description.length > 0 ? task.description : 'No description.'}
					</p>
				</div>
				<div className="divider" />
				<div className="right-column">
					<h3 className="margin-text">
						<b>{getPriority(task.priority).label} Priority</b>
					</h3>
					<h3 style={{ color: status.color }}>
						<b>{status.label}</b>
					</h3>
					<h3 className="deadline-text">Due {new Date(task.deadline).toLocaleDateString('en', { month: 'long', day: 'numeric' })}</h3>
					<h3 className="assign-header">{task.assignees.length > 0 ? 'Assigned to' : 'No assignees'}</h3>
					<div className="assignee-avatars">
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
								html: <ManageTask project={project} members={members} currTask={task} token={token} create={false} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false,
								width: '800px',
								willClose: reopen
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
								html: <DeleteTask projectId={project.id} tasks={project.tasks} delTask={task} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false,
								willClose: reopen
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
