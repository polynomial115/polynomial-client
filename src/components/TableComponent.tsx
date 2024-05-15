import { CDataTable } from '@coreui/react'
import { taskStatuses } from './TaskStatuses'
// import { useGuildMembers } from '../hooks/useGuildMembers'
// import { getAvatar, getDisplayName } from '../util'
import { Project } from '../types'

interface Props {
	project: Project
}

export function TableComponent({ project }: Props) {
	const { tasks } = project
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
		assignees: task.assignees,
		deadline: new Date(task.deadline).toUTCString()
	}))

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
			striped
			itemsPerPage={8}
			activePage={1}
			clickableRows
			// onRowClick={item => history.push(`/users/${item.id}`)}
		/>
	)
}