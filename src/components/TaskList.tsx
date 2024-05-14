import { useEffect } from 'react'
import { CDataTable } from '@coreui/react'
import { Task } from '../types'
import calculateDeadline from '../scripts/CalculateDeadline.ts'

interface TaskListProps {
	tasks: Task[]
	displayCount?: number
}

export function TaskList({ tasks, displayCount = tasks.length }: TaskListProps) {
	useEffect(() => {
		if (tasks.length > 0 && tasks[0].assignees && tasks[0].assignees.length > 0) {
			console.log('tasks: ', tasks[0].assignees[0])
		}
	})

	const tasksWithDueDates = tasks.map(task => ({
		...task,
		dueDate: task.deadline ? calculateDeadline({ deadlineType: task.deadline }) : null
	}))

	const sortedTasks = tasksWithDueDates
		.slice()
		.sort(
			(a, b) =>
				(a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - (b.dueDate ? new Date(b.dueDate).getTime() : Infinity) ||
				a.priority - b.priority
		)
		.slice(0, displayCount)

	return (
		<CDataTable
			addTableClasses={'table-row'}
			items={sortedTasks}
			fields={[
				{ key: 'name', label: 'Name' },
				{ key: 'priority', label: 'Priority' },
				{ key: 'status', label: 'Status' },
				{ key: 'assignees', label: 'Assignees' },
				{ key: 'dueDate', label: 'Due Date', _classes: 'text-right' }
			]}
			hover
			striped
			itemsPerPage={displayCount}
			activePage={1}
			clickableRows
			scopedSlots={{
				dueDate: item => <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No Due Date'}</td>
			}}
		/>
	)
}
