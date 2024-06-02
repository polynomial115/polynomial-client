import DataTable from 'react-data-table-component'
import { Project, taskStatuses, priorities } from '../../types'
import { DiscordAvatar } from '../User'
import { useGuildMembers } from '../../hooks/useGuildMembers'
import TaskDetails from './TaskDetails'

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

export function TableComponent({ project }: Props) {
	const { tasks } = project
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

	return (
		<div className="TableDiv" style={{ maxWidth: '1000px', margin: 'auto' }}>
			<DataTable
				title="Tasks Overview"
				className="ActualTable"
				columns={columns}
				data={taskData}
				highlightOnHover
				pointerOnHover
				onRowClicked={(row: TaskRow) => {
					const task = project?.tasks.find(task => task.id === row.id)
					if (task) {
						swal.fire({
							html: <TaskDetails project={project} task={task} getMember={getMember} members={members} />,
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
			/>
		</div>
	)
}
