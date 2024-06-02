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
	tasks: Task[]
	project: Project
	task: Task
	getMember: (id: string) => APIGuildMember | undefined
	members: APIGuildMember[]
}

export default function TaskDetails({ tasks, project, task, getMember, members }: Props) {
	const taskList = tasks ?? project?.tasks ?? []

	return (
		<div
			style={{
				padding: '20px'
			}}
		>
			<h2
				style={{
					margin: '0px',
					fontSize: '40px'
				}}
			>
				{task.name}
			</h2>
			<div className="container">
				<div className="leftColumn">
					<p
						className="showLineBreaks"
						style={{
							textAlign: 'left',
							marginTop: '30px',
							fontSize: '15px'
						}}
					>
						{task.description}
					</p>
				</div>
				<div className="divider" />
				<div
					className="rightColumn"
					style={{
						verticalAlign: 'middle'
					}}
				>
					<h3
						style={{
							marginTop: '30px'
						}}
					>
						<b>{priorities[task.priority].label} Priority</b>
					</h3>
					<h3
						style={{
							color: taskStatuses[task.status].color,
							marginTop: '30px',
							marginBottom: '30px'
						}}
					>
						<b>{taskStatuses[task.status].label}</b>
					</h3>
					<h3
						style={{
							marginTop: '30px',
							marginBottom: '30px',
							color: '#FF5544'
						}}
					>
						Due {new Date(task.deadline).toLocaleDateString('en', { month: 'long', day: 'numeric' })}
					</h3>
					<h3
						style={{
							marginTop: '30px',
							marginBottom: '4px'
						}}
					>
						Assigned to
					</h3>
					<div
						style={{
							marginBottom: '30px'
						}}
					>
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
								html: <EditTask project={project} members={members} currTask={task} allTasks={taskList} />,
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
