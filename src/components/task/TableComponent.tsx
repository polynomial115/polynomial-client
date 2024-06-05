import { useScrollToTop } from '../../hooks/useScrollToTop'
import DataTable from 'react-data-table-component'
import { getPriority, getStatus, priorities, Priority, Project, TaskStatus, Deadline, taskStatuses } from '../../types'
import { DiscordAvatar } from '../User'
import { useGuildMembers } from '../../hooks/useGuildMembers'
import TaskDetails from './TaskDetails'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/TableStyles.css'

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
	deadline: Deadline
	priority: Priority
}

const statusRank = (status: TaskStatus) => taskStatuses.findIndex(s => s.value === status)
const priorityRank = (priority: Priority) => priorities.findIndex(p => p.value === priority)

export function TableComponent({ project, mini }: Props) {
	useScrollToTop()

	const { members, getMember } = useGuildMembers()
	const auth = useAuth()

	// Determine the tasks array based on the input props
	let taskList = project.tasks

	// If mini, remove completed tasks, then sort by deadline & priority. Show 5 top tasks
	if (mini) taskList = taskList.filter(task => task.status !== TaskStatus.Completed)
	taskList.sort((t1, t2) => (t1.deadline || Infinity) - (t2.deadline || Infinity) || priorityRank(t2.priority) - priorityRank(t1.priority))
	if (mini) taskList = taskList.slice(0, 5)

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

	// Define columns
	const columns = [
		{
			name: 'Name',
			selector: (row: TaskRow) => row.name,
			sortable: true,
			cell: (row: TaskRow) => <span className="row-name">{row.name}</span>
		},
		{
			name: 'Status',
			width: '125px',
			selector: (row: TaskRow) => statusRank(row.status),
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
			selector: (row: TaskRow) => priorityRank(row.priority),
			sortable: true,
			cell: (row: TaskRow) => {
				const priority = getPriority(row.priority)
				return <span style={{ fontWeight: 'bolder', color: priority.color }}>{priority.label}</span>
			}
		},
		{
			name: 'Deadline',
			selector: (row: TaskRow) => row.deadline || Infinity,
			sortable: true,
			cell: (row: TaskRow) =>
				row.deadline !== Deadline.Never ? new Date(row.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'None',
			right: true
		}
	]

	return (
		<div className={`table ${mini ? 'mini-table' : 'full-table'}`}>
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
