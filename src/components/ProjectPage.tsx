import '../styles/ProjectView.css'
import { type Project, taskStatuses } from '../types'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CreateTask } from './CreateTask'
import { useGuildMembers } from '../hooks/useGuildMembers'
import { TableComponent } from './TableComponent.tsx'
import { EditProject } from './EditProject.tsx'
import { useAuth } from '../hooks/useAuth.ts'
import { DiscordAvatar } from './User.tsx'
import { ChoiceButtons } from './ChoiceButtons.tsx'
import { useState } from 'react'
import { TaskList } from './TaskList.tsx'
import { Dashboard } from './Dashboard.tsx'
// import { UpdateTask } from './EditTask.tsx'
// import { Task } from '../types'
import { CardView } from './CardView.tsx'
import { EditTask } from './EditTask.tsx'

const swal = withReactContent(Swal)

enum ProjectView {
	Dashboard = 0,
	CardView = 1,
	Tasks = 2
}

interface ProjectProps {
	project: Project
	close: () => void
}

export function ProjectPage({ project, close }: ProjectProps) {
	const { tasks } = project

	const { members } = useGuildMembers() // can't access context inside modal so getting here
	const auth = useAuth()

	const [activeView, setActiveView] = useState<ProjectView>(ProjectView.Dashboard) // Default to dashboard
	const ActiveView = () => {
		switch (activeView) {
			case ProjectView.Dashboard:
				return <Dashboard tasks={tasks} />
			case ProjectView.CardView:
				return <CardView tasks={tasks} cards={taskStatuses} property={'status'} />
			case ProjectView.Tasks:
				return <TaskList tasks={tasks} />
		}
	}
	// const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => {
	// 	setFormData(prev => ({
	// 		...prev,
	// 		[name]: value
	// 	}))
	// }
	const currUserRoles = useAuth().claims.roles as string[]
	return (
		<div>
			<button
				className="projectBackButton"
				style={{
					position: 'fixed',
					top: '4vh',
					left: '3.5vw',
					color: 'white',
					backgroundColor: 'crimson',
					borderRadius: 50,
					alignSelf: 'end'
				}}
				onClick={close}
			>
				{'< Projects'}
			</button>
			<ChoiceButtons
				// style={{ position: 'sticky', top: '4vh' }}
				defaultValue={0}
				setValueCallback={(value: number) => setActiveView(value)}
				choices={[
					{ value: 0, label: 'Dashboard', color: 'limegreen' },
					{ value: 1, label: 'Card View', color: 'orange' },
					{ value: 2, label: 'All Tasks', color: 'aqua' }
				]}
			/>
			<h2>{project.name}</h2>
			{ActiveView()}
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
								token={auth.serverToken}
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
									html: <EditTask projectId={project.id} members={members} currTask={task} allTasks={project.tasks} />,
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
