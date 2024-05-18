import { useDraggable } from '@dnd-kit/core'
import { Task } from '../../types.ts'
import { DiscordAvatar } from '../User.tsx'

interface Props {
	task: Task
}

export function TaskCard({ task }: Props) {
	const { attributes, listeners, setNodeRef, transform, isDragging, over } = useDraggable({ id: task.id })

	return (
		<div
			ref={setNodeRef}
			className="task-card"
			style={{
				transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
				transition: isDragging ? undefined : 'transform 0.2s',
				cursor: isDragging ? (over ? 'grabbing' : 'no-drop') : 'grab',
				zIndex: isDragging ? 2 : undefined
			}}
			{...listeners}
			{...attributes}
		>
			<p className="name">{task.name}</p>
			<div className="assignees">
				{task.assignees.map(assigneeId => (
					<DiscordAvatar key={assigneeId} memberId={assigneeId} size={25} />
				))}
			</div>
		</div>
	)
}
