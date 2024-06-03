import { useDraggable } from '@dnd-kit/core'
import { Project, Task } from '../../types.ts'
import { DiscordAvatar } from '../User.tsx'
import { useGuildMembers } from '../../hooks/useGuildMembers.ts'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TaskDetails from './TaskDetails.tsx'
import { useAuth } from '../../hooks/useAuth.ts'

const swal = withReactContent(Swal)

interface Props {
	task: Task
	project: Project
}

export function TaskCard({ task, project }: Props) {
	const { attributes, listeners, setNodeRef, transform, isDragging, over } = useDraggable({ id: task.id })
	const { members, getMember } = useGuildMembers()
	const auth = useAuth()

	return (
		<div
			ref={setNodeRef}
			className="task-card"
			style={{
				transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
				transition: isDragging ? undefined : '0.2s',
				cursor: isDragging ? (over ? 'grabbing' : 'no-drop') : 'pointer',
				zIndex: isDragging ? 2 : undefined
			}}
			{...listeners}
			{...attributes}
			onClick={() =>
				swal.fire({
					html: <TaskDetails project={project} task={task} members={members} token={auth.serverToken} />,
					background: '#202225',
					color: 'white',
					showConfirmButton: false,
					width: '800px'
				})
			}
		>
			<p className="name">{task.name}</p>
			<div className="assignees">
				{task.assignees.map(assigneeId => (
					<DiscordAvatar key={assigneeId} member={getMember(assigneeId)} size={25} />
				))}
			</div>
		</div>
	)
}
