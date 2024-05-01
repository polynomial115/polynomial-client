import { useEffect } from 'react'
import { Task, taskStatuses } from '../types'
import { CDataTable } from '@coreui/react'

interface TaskListProps {
	tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
	useEffect(() => {
		console.log('tasks: ', tasks[0].assignees[0])
	})
	return (
		<CDataTable
			addTableClasses={'table-row'}
			items={tasks}
			// fields={[
			// 	{ key: 'name' },
			// 	{ key: 'priority' },
			// 	{ key: 'status' },
			// 	{ key: 'assignees' },
			// ]}
			hover
			striped
			itemsPerPage={10}
			activePage={1}
			clickableRows
		/>
	)
}
