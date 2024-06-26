import { useDroppable } from '@dnd-kit/core'
import { Project, Task } from '../types'
import { TaskCard } from './task/TaskCard.tsx'

interface Props {
	id: number
	title: string
	color: string
	numCols: number
	tasks: Task[]
	project: Project
}

export function CardColumn({ id, title, color, numCols, tasks, project }: Props) {
	const { isOver, setNodeRef } = useDroppable({ id })

	return (
		<div
			ref={setNodeRef}
			className="card-column"
			style={{
				borderColor: color,
				borderStyle: isOver ? 'dashed' : 'solid',
				backgroundColor: isOver ? '#202020' : '#1a1a1a',
				width: `${100 / numCols}%`
			}}
		>
			<h2>{title}</h2>
			{tasks.map(task => (
				<TaskCard key={task.id} task={task} project={project} />
			))}
		</div>
	)
}
