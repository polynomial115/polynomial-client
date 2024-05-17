import { useDroppable } from '@dnd-kit/core'
import { Task } from '../types'
import { TaskCard } from './TaskCard'

interface Props {
	id: number
	title: string
	color: string
	numCols: number
	tasks: Task[]
}

export function CardColumn({ id, title, color, numCols, tasks }: Props) {
	const { isOver, setNodeRef } = useDroppable({ id })

	return (
		<div
			ref={setNodeRef}
			style={{
				borderColor: color,
				borderRadius: 10,
				borderWidth: 3,
				borderStyle: isOver ? 'dashed' : 'solid',
				backgroundColor: '#1a1a1a',
				width: `${100 / numCols}%`,
				margin: 10
			}}
		>
			<h2 style={{ margin: 12 }}>{title}</h2>
			{tasks.map(task => (
				<TaskCard key={task.id} task={task} />
			))}
		</div>
	)
}
