import { Task, priorities, taskStatuses } from '../types'
import '../styles/TaskModal.css'

interface Props {
	task: Task
}

export default function TaskDetails({ task }: Props) {
	console.log(task.description)
	return (
		<div
			style={{
				padding: '20px'
			}}
		>
			<h2
				style={{
					margin: '0px',
					fontSize: '40px',
					color: priorities[task.priority].color
				}}
			>
				{task.name}
			</h2>
			<p
				style={{
					margin: '0px',
					fontSize: '15px'
				}}
			>
				<b>Priority:</b> {priorities[task.priority].label}
			</p>
			<p
				style={{
					color: taskStatuses[task.status].color,
					marginTop: '10px'
				}}
			>
				<b>{taskStatuses[task.status].label}</b>
			</p>
			<div className="container">
				<div className="leftColumn">
					<h3
						style={{
							marginBottom: '4px'
						}}
					>
						Description
					</h3>
					<p
						className="showLineBreaks"
						style={{
							textAlign: 'left',
							marginTop: '50px',
							marginBottom: '50px',
							fontSize: '15px'
						}}
					>
						<b>{task.description}</b>
					</p>
				</div>
				<div className="divider" />
				<div className="rightColumn">
					<h3
						style={{
							marginBottom: '4px',
							color: '#FF5544'
						}}
					>
						Deadline
					</h3>
					<p
						style={{
							marginTop: '0px',
							fontSize: '15px'
						}}
					>
						{new Date(task.deadline).toUTCString()}
					</p>
					<h3
						style={{
							marginTop: '30px',
							marginBottom: '4px'
						}}
					>
						Assignees
					</h3>
					<div>
						<p>PUT ASSIGNEES HERE!!</p>

						{/* {task.assignees.map(memberId => (
							<DiscordAvatar key={memberId} memberId={memberId} size={128} />
						))} */}
					</div>
				</div>
			</div>
		</div>
	)
}
