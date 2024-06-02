import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { getPriority, getStatus, priorities, Priority, Project, Task, TaskStatus } from '../../types'
import { DiscordAvatar } from '../User'
import { useGuildMembers } from '../../hooks/useGuildMembers'
import { EditTask } from './EditTask'
import { DeleteTask } from './DeleteTask'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	tasks?: Task[]
	project?: Project
}

interface TaskRow {
	id: string
	name: string
	status: TaskStatus
	assignees: string
	deadline: string
	priority: Priority
}

interface ExpandedComponentProps {
	data: TaskRow
}

export function TableComponent({ tasks, project }: Props) {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const { members, getMember } = useGuildMembers()

	// Determine the tasks array based on the input props
	let taskList = tasks ?? project?.tasks ?? []

	// Limit the number of tasks to 5
	if (!project) {
		taskList = taskList.slice(0, 5)
	}

	// Map tasks to TaskRow format
	const taskData = taskList.map(task => ({
		id: task.id,
		name: task.name,
		status: task.status,
		assignees: task.assignees.join(', '),
		deadline: new Date(task.deadline).toUTCString(),
		priority: task.priority
	})) satisfies TaskRow[]

	// Auto-sort by priority if no project is provided
	if (!project) {
		taskData.sort((a, b) => {
			const priorityOrder = priorities.map(p => p.value)
			return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
		})
	}

	// Define columns
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
				const status = getStatus(row.status)
				return <span style={{ color: status.color }}>{status.label}</span>
			}
		},
		{
			name: 'Assignees',
			selector: (row: TaskRow) => row.assignees,
			sortable: false,
			cell: (row: TaskRow) => (
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					{row.assignees.split(', ').map(id => (
						<DiscordAvatar size={35} key={id} member={getMember(id)} />
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
				const priority = getPriority(row.priority)
				return <span style={{ color: priority.color }}>{priority.label}</span>
			}
		},
		{
			name: 'Deadline',
			selector: (row: TaskRow) => row.deadline,
			sortable: true,
			right: true
		}
	]

	// Add "Assignees" column if project is provided
	// // if (project) {
	// columns.splice(2, 0, {
	// 	name: 'Assignees',
	// 	selector: (row: TaskRow) => row.assignees,
	// 	sortable: true,
	// 	cell: (row: TaskRow) => (
	// 		<div>
	// 			{row.assignees!.split(', ').map(assigneeId => {
	// 				return <DiscordAvatar key={assigneeId} memberId={assigneeId} />
	// 			})}
	// 		</div>
	// 	)
	// })
	// }

	const ExpandedComponent: React.FC<ExpandedComponentProps> = ({ data }) => {
		const task = taskList.find(task => task.id === data.id)

		return (
			<div>
				<button
					onClick={() => {
						if (task) {
							swal.fire({
								html: <EditTask projectId={project!.id} members={members} currTask={task} allTasks={taskList} />,
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
								html: <DeleteTask projectId={project!.id} tasks={taskList} delTask={task} />,
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
		<div className="table">
			<DataTable
				columns={columns}
				data={taskData}
				highlightOnHover
				pointerOnHover
				pagination={!!project}
				selectableRows={!!project}
				expandableRows={!!project}
				persistTableHead
				expandableRowsComponent={project ? ExpandedComponent : undefined}
				theme="dark"
			/>
		</div>
	)
}
