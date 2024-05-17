import React from 'react'
import DataTable from 'react-data-table-component'
import { Project, taskStatuses, priorities } from '../types'
import { DiscordAvatar } from './User'
import { useGuildMembers } from '../hooks/useGuildMembers'

import { EditTask } from './EditTask'
import { DeleteTask } from './DeleteTask'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	project: Project
}

interface TaskRow {
	id: string
	name: string
	status: string
	assignees: string
	deadline: string
	priority: string
}

interface ExpandedComponentProps {
	data: TaskRow
}

export function TableComponent({ project }: Props) {
	const { tasks } = project
	const { members } = useGuildMembers()

	const taskData = tasks.map(task => ({
		id: task.id,
		name: task.name,
		status: taskStatuses[task.status].label,
		assignees: task.assignees.join(', '),
		deadline: new Date(task.deadline).toUTCString(),
		priority: priorities[task.priority].label
	}))

	const columns = [
		{
			name: 'Name',
			selector: (row: TaskRow) => row.name,
			sortable: true
		},
		{
			name: 'Status',
			width: '125px',
			selector: (row: TaskRow) => row.status,
			sortable: true,
			cell: (row: TaskRow) => {
				const statusChoice = taskStatuses.find(s => s.label === row.status)
				return <span style={{ color: statusChoice ? statusChoice.color : 'default' }}>{row.status}</span>
			}
		},
		{
			name: 'Assignees',
			selector: (row: TaskRow) => row.assignees,
			sortable: true,
			cell: (row: TaskRow) => (
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					{row.assignees.split(', ').map(id => (
						<DiscordAvatar size={35} key={id} memberId={id} />
					))}
				</div>
			)
		},
		{
			name: 'Priority',
			width: '115px',
			selector: (row: TaskRow) => row.priority,
			sortable: true,
			cell: (row: TaskRow) => {
				const priorityChoice = priorities.find(s => s.label === row.priority)
				return <span color={priorityChoice ? priorityChoice.color : 'default'}>{row.priority}</span>
			}
		},
		{
			name: 'Deadline',
			selector: (row: TaskRow) => row.deadline,
			sortable: true,
			right: true
		}
	]

	// const handleChange = state => {
	// 	setSelectedRows(state.selectedRows)
	// }

	// const GetColour = (status: string) => {
	// 	switch (status) {
	// 		case 'Completed':
	// 			return 'success'
	// 		case 'In Progress':
	// 			return 'secondary'
	// 		case 'Backlog':
	// 			return 'warning'
	// 		case 'To Do':
	// 			return 'danger'
	// 		default:
	// 			return 'primary'
	// 	}
	// }

	const ExpandedComponent: React.FC<ExpandedComponentProps> = ({ data }) => {
		const task = project.tasks.find(task => task.id === data.id)

		return (
			<div>
				<button
					onClick={() => {
						// const task = project.tasks.find(task => task.id === data.id)

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
					onClick={() => {
						if (task) {
							swal.fire({
								html: <DeleteTask projectId={project.id} tasks={project.tasks} delTask={task} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false
							})
						} else {
							console.error('Task not found for deletion')
						}
					}}
				>
					Delete Task
				</button>
			</div>
		)
	}

	return (
		<div className="TableDiv">
			<DataTable
				title="Tasks Overview"
				className="ActualTable"
				pagination
				columns={columns}
				data={taskData}
				selectableRows
				highlightOnHover
				pointerOnHover
				onRowClicked={row => console.log(row)}
				expandableRows
				persistTableHead
				expandableRowsComponent={ExpandedComponent}
				theme="dark"
			/>
		</div>
	)
}
