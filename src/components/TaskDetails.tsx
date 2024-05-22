import { Task } from '../types'

interface Props {
	task: Task
}

export default function TaskDetails({ task }: Props) {
	return (
		<div style={{ padding: '20px' }}>
			<h2
				style={{
					margin: '0px',
					fontSize: '36px'
				}}
			>
				{task.name}
			</h2>
			<h3
				style={{
					marginBottom: '4px'
				}}
			>
				ID
			</h3>
			<p
				style={{
					marginTop: '0px'
				}}
			>
				{task.id}
			</p>
			<h3
				style={{
					marginBottom: '4px'
				}}
			>
				Description
			</h3>
			<p
				style={{
					marginTop: '0px'
				}}
			>
				{task.description}
			</p>
		</div>
	)
}
