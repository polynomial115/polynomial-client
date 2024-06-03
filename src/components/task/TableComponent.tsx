import { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { getPriority, getStatus, priorities, Priority, Project, TaskStatus } from '../../types'
import { DiscordAvatar } from '../User'
import { useGuildMembers } from '../../hooks/useGuildMembers'
import TaskDetails from './TaskDetails'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	project: Project
	mini?: boolean
}

interface TaskRow {
	id: string
	name: string
	status: TaskStatus
	assignees: string
	deadline: string
	priority: Priority
}

export function TableComponent({ project, mini }: Props) {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const { members, getMember } = useGuildMembers()

	// Determine the tasks array based on the input props
	let taskList = project.tasks

	// Limit the number of tasks to 5 in the mini task list
	if (mini) taskList = taskList.slice(0, 5)

	// Map tasks to TaskRow format
	const taskData = taskList.map(task => ({
		id: task.id,
		name: task.name,
		status: task.status,
		description: task.description,
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
			sortable: true,
			cell: (row: TaskRow) => {
				return <span style={{ fontWeight: 'bold' }}>{row.name}</span>
			}
		},
		{
			name: 'Status',
			width: '125px',
			selector: (row: TaskRow) => row.status,
			sortable: true,
			cell: (row: TaskRow) => {
				const status = getStatus(row.status)
				return <span style={{ fontWeight: 'bolder', color: status.color }}>{status.label}</span>
			}
		},
		{
			name: 'Assignees',
			selector: (row: TaskRow) => row.assignees,
			sortable: false,
			cell: (row: TaskRow) => (
				<div style={{ display: 'flex', flexWrap: 'nowrap' }}>
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
				return <span style={{ fontWeight: 'bolder', color: priority.color }}>{priority.label}</span>
			}
		},
		{
			name: 'Deadline',
			selector: (row: TaskRow) => row.deadline,
			sortable: true,
			right: true
		}
	]

	return (
		<div className="table">
			<DataTable
				columns={columns}
				data={taskData}
				highlightOnHover
				pointerOnHover
				onRowClicked={(row: TaskRow) => {
					const task = project?.tasks.find(task => task.id === row.id)
					if (task) {
						swal.fire({
							html: <TaskDetails project={project} task={task} members={members} />,
							background: '#202225',
							color: 'white',
							showConfirmButton: false,
							width: '800px'
						})
					} else {
						console.error('Task not found')
					}
				}}
				persistTableHead
				theme="dark"
				striped
				customStyles={{
					headRow: {
						style: {
							fontSize: '16px',
							backgroundColor: '#191919'
						}
					},
					rows: {
						style: {
							color: 'white',
							backgroundColor: '#303030',
							border: '0px solid',
							fontSize: '15px',
							borderCollapse: 'collapse'
						},
						stripedStyle: {
							color: 'white',
							backgroundColor: '#282828',
							fontSize: '15px',
							borderCollapse: 'collapse'
						}
					},
					pagination: {
						style: {
							backgroundColor: '#191919'
						}
					}
				}}
			/>
		</div>
	)
}
