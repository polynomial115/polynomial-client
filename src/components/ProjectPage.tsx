import '../styles/ProjectView.css'
import { type Project, taskStatuses } from '../types'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CreateTask } from './CreateTask'
import { useGuildMembers } from '../hooks/useGuildMembers'
import { TableComponent } from './TableComponent.tsx'
import { EditProject } from './EditProject.tsx'
import { UpdateTask } from './EditTask.tsx'
import { DiscordAvatar } from './User.tsx'
import { PieChart } from './PieChart.tsx'
import { useAuth } from '../hooks/useAuth.ts'
import { ChoiceButtons } from './ChoiceButtons.tsx'

const swal = withReactContent(Swal)

interface ProjectProps {
	project: Project
	close: () => void
}

export function ProjectPage({ project, close }: ProjectProps) {
	const { tasks } = project

	const { members } = useGuildMembers() // can't access context inside modal so getting here
	const auth = useAuth()

	// const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => {
	// 	setFormData(prev => ({
	// 		...prev,
	// 		[name]: value
	// 	}))
	// }
	const currUserRoles = useAuth().claims.roles as string[]
	return (
		<div>
			<button onClick={close}>{'< Back to Projects'}</button>
			<h2>{project.name}</h2>
			<ChoiceButtons
				choices={[
					{ value: 0, label: 'Overview', color: 'green' },
					{ value: 1, label: 'Tasks', color: 'yellow' }
				]}
			/>
			<button
				onClick={() =>
					swal.fire({
						html: (
							<EditProject
								name={project.name}
								managerRoles={project.managerRoles}
								tasks={project.tasks}
								projectId={project.id}
								currUserRoles={currUserRoles}
								token={auth.serverToken as string}
							/>
						),
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Edit Project
			</button>
			<button
				onClick={() =>
					swal.fire({
						html: <CreateTask projectId={project.id} members={members} />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false,
						width: '625px'
					})
				}
			>
				Create Task
			</button>
			<PieChart label={'Tasks'} property={'status'} tasks={tasks} data={taskStatuses} />
			<TableComponent project={project} />
			{tasks.map(task => (
				<li key={task.id}>
					{/* <p>ID: {task.id}</p> */}
					<button style={{ width: '75vw', height: '12vh', margin: 10 }} className="TaskContainer">
						<b>Task Name</b>: {task.name} |
						<span style={{ color: taskStatuses[task.status].color }}>
							{' '}
							<b>&nbsp;{taskStatuses[task.status].label}&nbsp;</b>{' '}
						</span>{' '}
						|<b>&nbsp;Assignees:</b>
						<div style={{ margin: 12 }}>
							{task.assignees.map(assigneeId => {
								return <DiscordAvatar key={assigneeId} memberId={assigneeId} />
							})}
						</div>
						<button
							onClick={() =>
								swal.fire({
									html: <UpdateTask projectId={project.id} members={members} currTask={task} allTasks={project.tasks} />,
									background: '#202225',
									color: 'white',
									showConfirmButton: false,
									width: '625px'
								})
							}
						>
							Edit Task
						</button>
					</button>
				</li>
			))}
			{/* <TaskList tasks={tasks} /> */}
		</div>
	)
}
