import React, { useState } from 'react'
import { CBadge } from '@coreui/react'
import { useParticipants } from '../hooks/useParticipants'
import DataTable from 'react-data-table-component'
import { Project, taskStatuses, Task } from '../types'
import { DiscordAvatar } from './User'
import { APIGuildMember } from 'discord-api-types/v10'
import { useGuildMembers } from '../hooks/useGuildMembers'

import { EditTask } from './EditTask'
import { DeleteTask } from './DeleteTask'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	project: Project
}

export function TableComponent({ project }: Props) {
	const { tasks } = project
	const { members } = useGuildMembers()
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
			{/* <button
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
			</button> */}

			<button
				onClick={() => {
					// const a = JSON.stringify(data, null, 2)
					// const ID_Object = JSON.parse(a)
					// console.log('ID ========================================== ' + ID_Object.id)

					// swal.fire({
					// 	html: <EditTask projectId={project.id} members={members} currTask={ID_Object.id} allTasks={project.tasks} />,
					// 	// html: <pre>{JSON.stringify(data, null, 2)}</pre>,
					// 	background: '#202225',
					// 	color: 'white',
					// 	showConfirmButton: false,
					// 	width: '625px'
					// })

					const task = project.tasks.find(task => task.id === data.id)

					if (task) {
						swal.fire({
							html: <EditTask projectId={project.id} members={members} currTask={task} allTasks={project.tasks} />,
							background: '#202225',
							color: 'white',
							showConfirmButton: false,
							width: '625px'
						})
					} else {
						console.error('Task not found')
					}
				}}
			>
				Edit Task
			</button>

			<button
				onClick={() =>
					swal.fire({
						html: <DeleteTask projectId={project.id} tasks={project.tasks} delTask={data} />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Delete Task
			</button>

			{/* <button onClick={() => console.log(data)}>Log data to Console</button>

			<button
				onClick={() => {
					let a = JSON.stringify(data, null, 2)
					let ID_Object = JSON.parse(a)
					console.log('ID ========================================== ' + ID_Object.id)
				}}
			>
				Log TaskID to console
			</button> */}
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
