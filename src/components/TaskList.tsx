import { useEffect } from 'react'
import { Task, taskStatuses } from '../types'

interface TaskListProps {
	tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
	useEffect(() => {
		console.log('tasks: ', tasks[0].assignees[0])
	})
	return tasks.map(task => (
		<li key={task.id}>
			{}
			<p>
				<b>Task Name</b>: {task.name} |
				<span style={{ color: taskStatuses[task.status].color }}>
					{' '}
					<b>{taskStatuses[task.status].label}</b>{' '}
				</span>{' '}
				|<b> Assignees</b>: {task.assignees.join(', ')}
			</p>
			<button>Edit Task</button>
			<br />
		</li>
	))
}
