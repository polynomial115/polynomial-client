import { CDataTable } from '@coreui/react'
import { CBadge } from '@coreui/react'
import { taskStatuses } from './TaskStatuses'
// import { useGuildMembers } from '../hooks/useGuildMembers'
// import { getAvatar, getDisplayName } from '../util'
import { Project } from '../types'
import { useParticipants } from '../hooks/useParticipants'
import { DiscordAvatar } from './User'

interface Props {
	project: Project
}

export function TableComponent({ project }: Props) {
	const { tasks } = project
	const participants = useParticipants()

	// const { getMember } = useGuildMembers()

	const taskData = tasks.map(task => ({
		id: task.id,
		name: task.name,
		status: taskStatuses[task.status].label,
		// assignees: task.assignees.map(assigneeID => {
		// 	const member = getMember(assigneeID)
		// 	if (!member) return 'Unknown'
		// 	const name = getDisplayName(member)
		// 	return (
		// 		<div key={assigneeID} className="AvatarsView">
		// 			<img
		// 				className="Avatar"
		// 				src={getAvatar(member)}
		// 				alt={name}
		// 				title={name}
		// 				onClick={() => {
		// 					console.log('clicked')
		// 				}}
		// 			/>
		// 			<div className="ToolTip">{name}</div>
		// 		</div>
		// 	)
		// })
		// assignees: participants.map(p => {
		// 	<DiscordAvatar size={50} key={p.id} memberId={p.id} />
		// }),
		assignees: task.assignees.join(', '),
		deadline: new Date(task.deadline).toUTCString()
	}))
	

	const GetColour = status => {
		switch (status) {
			case 'Completed':
				return 'success'
			case 'Inactive':
				return 'secondary'
			case 'In Progress':
				return 'warning'
			case 'To Do':
				return 'danger'
			default:
				return 'primary'
		}
	}

	return (
		<CDataTable
			items={taskData}
			fields={[
				{ key: 'name', _style: { width: '20%' } },
				{ key: 'status', _style: { width: '20%' } },
				{ key: 'assignees', _style: { width: '30%' } },
				{ key: 'deadline', _style: { width: '30%' } }
			]}
			hover
			sorter
			columnFilter
			tableFilter
			pagination
			striped
			itemsPerPage={5}
			activePage={1}
			clickableRows
			// onRowClick={item => history.push(`/users/${item.id}`)}
			scopedSlots={{
				assignees: item => (
					<td>
						{tasks.map(p => {
							return (
								<CBadge key={p.id}>
									<DiscordAvatar size={50} key={p.id} memberId={p.id} />
								</CBadge>
							)
						})}
					</td>
				)
			}}
		/>
	)
}
