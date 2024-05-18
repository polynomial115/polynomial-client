import '../../styles/ProjectView.css'
import { type Project, taskStatuses } from '../../types.ts'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CreateTask } from '../task/CreateTask.tsx'
import { useGuildMembers } from '../../hooks/useGuildMembers.ts'
import { EditProject } from './EditProject.tsx'
import { useAuth } from '../../hooks/useAuth.ts'
import { DiscordAvatar } from '../User.tsx'
import { ChoiceButtons } from '../ChoiceButtons.tsx'
import { useState } from 'react'
import { Dashboard } from '../Dashboard.tsx'
import { CardView } from '../task/CardView.tsx'
import { EditTask } from '../task/EditTask.tsx'
import '../../styles/ProjectView.css'
import { TableComponent } from '../task/TableComponent.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faBarsStaggered, faChartPie, faListCheck } from '@fortawesome/free-solid-svg-icons'

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
				return <CardView projectId={project.id} tasks={tasks} columns={taskStatuses} property="status" />
			case ProjectView.Tasks:
				return <TableComponent project={project} />
		}
	}
	const currUserRoles = useAuth().claims.roles as string[]
	return (
		<div>
			<div className="top-blur" />
			<ChoiceButtons
				className="project-page-switcher"
				defaultValue={0}
				setValueCallback={(value: number) => setActiveView(value)}
				choices={[
					{
						value: 0,
						label: (
							<>
								<FontAwesomeIcon icon={faChartPie} /> Overview
							</>
						),
						color: 'limegreen'
					},
					{
						value: 1,
						label: (
							<>
								<FontAwesomeIcon icon={faBarsStaggered} /> Board
							</>
						),
						color: 'orange'
					},
					{
						value: 2,
						label: (
							<>
								<FontAwesomeIcon icon={faListCheck} /> Task List
							</>
						),
						color: 'aqua'
					}
				]}
			/>
			<button
				className="projectBackButton"
				style={{
					position: 'fixed',
					top: '4vh',
					left: '3.5vw',
					color: 'white',
					backgroundColor: 'crimson',
					borderRadius: 50,
					alignSelf: 'end',
					zIndex: 2
				}}
				onClick={close}
			>
				<FontAwesomeIcon icon={faAngleLeft} /> Projects
			</button>
			<div style={{ marginTop: 75 }}>
				<p className="project-title">{project.name}</p>
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
				{/* <TableComponent project={project} /> */}
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
			</div>
			{/* <TaskList tasks={tasks} /> */}
		</div>
	)
}
