import { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { getPriority, getStatus, priorities, Priority, Project, TaskStatus, Deadline } from '../../types'
import { DiscordAvatar } from '../User'
import { useGuildMembers } from '../../hooks/useGuildMembers'
import TaskDetails from './TaskDetails'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/TableStyles.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Primitive } from 'react-data-table-component/dist/DataTable/types'

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
	deadline: Deadline
	priority: Priority
}

export function TableComponent({ project, mini }: Props) {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const { members, getMember } = useGuildMembers()
	const auth = useAuth()

	// Determine the tasks array based on the input props
	let taskList = project.tasks

	// If mini, remove completed tasks, then sort by priority & deadline. Show 5 top tasks
	if (mini) {
		taskList = taskList.filter(task => {
			return task.status != TaskStatus.Completed
		})
	}
	let timedTasks = taskList.filter(task => {
		return task.deadline != null
	})
	const unlimitedTasks = taskList.filter(task => {
		return task.deadline == null
	})
	timedTasks = timedTasks.sort((t1, t2) => t1.deadline - t2.deadline)
	taskList = [...timedTasks, ...unlimitedTasks]
	if (mini) {
		taskList = taskList.slice(0, 5)
	}

	// Map tasks to TaskRow format
	const taskData = taskList.map(task => ({
		id: task.id,
		name: task.name,
		status: task.status,
		description: task.description,
		assignees: task.assignees.join(', '),
		deadline: task.deadline,
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
				return <span className="row-name">{row.name}</span>
			}
		},
		{
			name: 'Status',
			width: '125px',
			selector: (row: TaskRow) => row.status,
			sortable: true,
			cell: (row: TaskRow) => {
				const status = getStatus(row.status)
				return (
					<span className="row-status" style={{ color: status.color }}>
						{status.label}
					</span>
				)
			}
		},
		{
			name: 'Assignees',
			selector: (row: TaskRow) => row.assignees,
			sortable: false,
			cell: (row: TaskRow) => (
				<div className="table-cell">
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
			selector: (row: TaskRow) =>
				// we use invisible character here to differentiate a task named "None" and the special nullable field
				row.deadline != null ? new Date(row.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'None‎',
			sortable: true,
			right: true
		}
	]
	const customSort = (rows: TaskRow[], selector: (_: TaskRow) => Primitive, direction: string) => {
		return rows.sort((a, b) => {
			// use the selector to resolve your field names by passing the sort comparators
			const aField = selector(a)
			const bField = selector(b)

			let comparison = 0

			// this forces None to always be at the bottom of sorting
			if (aField === 'None‎') {
				comparison = bField === 'None‎' ? 0 : 1
			} else if (bField === 'None‎') {
				comparison = -1
			} else {
				comparison = (aField < bField ? -1 : 1) * (direction === 'desc' ? -1 : 1)
			}

			return comparison
		})
	}

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
							html: <TaskDetails project={project} task={task} members={members} token={auth.serverToken} />,
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
				sortFunction={customSort}
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
