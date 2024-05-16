import { useEffect } from 'react'
import { Task, taskStatuses } from '../types'
import { CDataTable } from '@coreui/react'
import { DeadlineToString } from '../scripts/CalculateDeadline'

interface TaskListProps {
	tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	const taskData = tasks.map(task => ({
		id: task.id,
		name: task.name,
		status: taskStatuses[task.status].label,
		assignees: task.assignees,
		deadline: DeadlineToString(task.deadline)
	}))
	return (
		<div>
			{!tasks || tasks.length === 0 ? (
				<div style={{ margin: '10px 5px', padding: '40px 25px', backgroundColor: 'black' }}>
					<p>Add some Tasks to see task list!</p>
				</div>
			) : (
				<CDataTable
					addTableClasses={'table-row'}
					items={taskData}
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
			)}
		</div>
	)
}
