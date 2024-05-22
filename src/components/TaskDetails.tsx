import { Task } from '../types'

interface Props {
	task: Task
}

export default function TaskDetails({ task }: Props) {
	return (
		<div style={{ padding: '20px' }}>
			<h1>{task.name}</h1>
			<h3>ID</h3>
			<p>{task.id}</p>
			<h3>Description</h3>
			<p>{task.description}</p>
		</div>
	)
}
