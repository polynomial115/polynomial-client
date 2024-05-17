import React, { useState } from 'react'
import { CBadge } from '@coreui/react'
import { useParticipants } from '../hooks/useParticipants'
import DataTable from 'react-data-table-component'
import { Project, taskStatuses, Task } from '../types'
import { DiscordAvatar } from './User'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	project: Project
}

export function TableComponent({ project }: Props) {
	const { tasks } = project
	const participants = useParticipants()
	const [selectedRows, setSelectedRows] = useState([])

	const taskData = tasks.map(task => ({
		id: task.id,
		name: task.name,
		status: taskStatuses[task.status].label,
		assignees: task.assignees.join(', '),
		deadline: new Date(task.deadline).toUTCString()
	}))

	const columns = [
		{
			name: 'Name',
			selector: row => row.name,
			sortable: true
		},
		{
			name: 'Status',
			selector: row => row.status,
			sortable: true,
			cell: row => <CBadge color={GetColour(row.status)}>{row.status}</CBadge>
		},
		{
			name: 'Assignees',
			selector: row => row.assignees,
			sortable: true,
			cell: row => (
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					{row.assignees.split(', ').map(id => (
						<DiscordAvatar size={35} key={id} memberId={id} />
					))}
				</div>
			)
		},
		{
			name: 'Deadline',
			selector: row => row.deadline,
			sortable: true,
			right: true
		}
	]

	const handleChange = state => {
		setSelectedRows(state.selectedRows)
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

	const ExpandedComponent = ({ data }) => (
		<div>
			<button
				onClick={() =>
					swal.fire({
						html: <pre>{JSON.stringify(data, null, 2)}</pre>,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Row Detalis
			</button>

			<button
				onClick={() =>
					swal.fire({
						html: <pre>{JSON.stringify(data, null, 2)}</pre>,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Edit Task
			</button>
		</div>
	)

	return (
		<div className="TableDiv">
			<DataTable
				className="ActualTable"
				pagination
				columns={columns}
				data={taskData}
				selectableRows
				expandableRows
				expandableRowsComponent={ExpandedComponent}
				onSelectedRowsChange={handleChange}
				theme="dark"
			/>
		</div>
	)
}
