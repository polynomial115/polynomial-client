import { useEffect } from 'react'
import { Task } from '../../types'

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
				<h1>TODO: REPLACE WITH DATATABLE FROM TABLECOMPONENT.TSX</h1>
			)}
		</div>
	)
}
