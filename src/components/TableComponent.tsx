import React, { useState } from 'react'
import { CDataTable, CBadge, CButton } from '@coreui/react'
import { DiscordAvatar } from './User'
import { Project } from '../types'
import { useParticipants } from '../hooks/useParticipants'

interface Props {
	project: Project
}

export function TableComponent({ project }: Props) {
	const { tasks } = project
	const participants = useParticipants()
	const [details, setDetails] = useState<number[]>([])

	const taskData = tasks.map(task => ({
		id: task.id,
		name: task.name,
		status: task.status,
		assignees: task.assignees.join(', '),
		deadline: new Date(task.deadline).toUTCString()
	}))

	const toggleDetails = (index: number) => {
		const position = details.indexOf(index)
		let newDetails = details.slice()
		if (position !== -1) {
			newDetails.splice(position, 1)
		} else {
			newDetails = [...details, index]
		}
		setDetails(newDetails)
	}

	const GetColour = (status: string) => {
		switch (status) {
			case 'Completed':
				return 'success'
			case 'In Progress':
				return 'secondary'
			case 'Backlog':
				return 'warning'
			case 'To Do':
				return 'danger'
			default:
				return 'primary'
		}
	}

	const fields = [
		{ key: 'name', _style: { width: '20%' } },
		{ key: 'status', _style: { width: '20%' } },
		{ key: 'assignees', _style: { width: '30%' } },
		{ key: 'deadline', _style: { width: '30%' } },
		{
			key: 'show_details',
			label: '',
			_style: { width: '1%' },
			sorter: false,
			filter: false
		}
	]

	return (
		<CDataTable
			items={taskData}
			fields={fields}
			columnFilter
			tableFilter
			itemsPerPageSelect
			itemsPerPage={5}
			hover
			sorter
			pagination
			scopedSlots={{
				assignees: item => (
					<td>
						{item.assignees.split(', ').map(id => (
							<DiscordAvatar size={50} key={id} memberId={id} />
						))}
					</td>
				),
				status: item => (
					<td>
						<CBadge color={GetColour(item.status)}>{item.status}</CBadge>
					</td>
				),
				show_details: (item, index) => (
					<td className="py-2">
						<CButton color="primary" variant="outline" shape="square" size="sm" onClick={() => toggleDetails(index)}>
							{details.includes(index) ? 'Hide' : 'Show'}
						</CButton>
					</td>
				),
				details: (item, index) => {
					if (!details.includes(index)) return null
					return (
						<tr>
							<td colSpan={4}>
								<div>
									<p className="text-muted">Deadline: {item.deadline}</p>
									<CButton size="sm" color="info">
										Edit
									</CButton>
									<CButton size="sm" color="danger" className="ml-1">
										Delete
									</CButton>
								</div>
							</td>
						</tr>
					)
				}
			}}
		/>
	)
}
