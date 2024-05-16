import { useEffect } from 'react'
import { Task } from '../types'
import { CDataTable } from '@coreui/react'

interface TaskListProps {
	tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<div>
			{!tasks || tasks.length === 0 ? (
				<div style={{ margin: '10px 5px', padding: '40px 25px', backgroundColor: 'black' }}>
					<p>Add some Tasks to see task list!</p>
				</div>
			) : (
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
			)}
		</div>
	)
}
