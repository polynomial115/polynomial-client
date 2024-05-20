import React from 'react'
import DataTable from 'react-data-table-component'
import { Project, taskStatuses, priorities, Task } from '../types'
import { DiscordAvatar } from './User'
import { useGuildMembers } from '../hooks/useGuildMembers'
import TaskDetails from './TaskDetails'

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
	status: string
	assignees: string
	deadline: string
	priority: string
}

interface ExpandedComponentProps {
	data: TaskRow
}

export function TableComponent({ tasks, project }: Props) {
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
		status: taskStatuses[task.status].label,
		description: task.description,
		assignees: task.assignees.join(', '),
		deadline: new Date(task.deadline).toUTCString(),
		priority: priorities[task.priority].label
	}))

	// Auto-sort by priority if no project is provided
	if (!project) {
		taskData.sort((a, b) => {
			const priorityOrder = priorities.map(p => p.label)
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
				const statusChoice = taskStatuses.find(s => s.label === row.status)
				return <span style={{ color: statusChoice ? statusChoice.color : 'default' }}>{row.status}</span>
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
				const priorityChoice = priorities.find(s => s.label === row.priority)
				return <span style={{ color: priorityChoice ? priorityChoice.color : 'default' }}>{row.priority}</span>
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
		<div className="TableDiv" style={{ maxWidth: '1000px', margin: 'auto' }}>
			<DataTable
				title="Tasks Overview"
				className="ActualTable"
				columns={columns}
				data={taskData}
				highlightOnHover
				pointerOnHover
				onRowClicked={(task: Task) => {
					swal.fire({
						html: <TaskDetails task={task} />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}}
				expandableRows
				persistTableHead
				expandableRowsComponent={project ? ExpandedComponent : undefined}
				theme="dark"
			/>
		</div>
	)
}
