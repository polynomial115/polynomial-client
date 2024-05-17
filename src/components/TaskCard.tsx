import { useDraggable } from '@dnd-kit/core'
import { Task } from '../types'
import { DiscordAvatar } from './User'

interface Props {
	task: Task
}

export function TaskCard({ task }: Props) {
	const { attributes, listeners, setNodeRef, transform, isDragging, over } = useDraggable({ id: task.id })

	return (
		<div
			ref={setNodeRef}
			style={{
				fontWeight: 500,
				margin: 10,
				borderRadius: 10,
				background: '#121212',
				position: 'relative',
				transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
				transition: isDragging ? undefined : 'transform 0.2s',
				cursor: isDragging ? (over ? 'grabbing' : 'no-drop') : 'grab',
				zIndex: isDragging ? 2 : undefined
			}}
			{...listeners}
			{...attributes}
		>
			<p style={{ margin: 3, padding: 3 }}>{task.name}</p>
			<div style={{ margin: 12 }}>
				{task.assignees.map(assigneeId => (
					<DiscordAvatar key={assigneeId} memberId={assigneeId} size={25} />
				))}
			</div>
		</div>
	)
}
