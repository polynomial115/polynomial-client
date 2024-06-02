import '../../styles/ProjectView.css'
import { type Project, taskStatuses } from '../../types.ts'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CreateTask } from '../task/CreateTask.tsx'
import { useGuildMembers } from '../../hooks/useGuildMembers.ts'
import { EditProject } from './EditProject.tsx'
import { useAuth } from '../../hooks/useAuth.ts'
import { ChoiceButtons } from '../ChoiceButtons.tsx'
import { Dashboard } from '../Dashboard.tsx'
import { CardView } from '../task/CardView.tsx'
import '../../styles/ProjectView.css'
import { TableComponent } from '../task/TableComponent.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faBarsStaggered, faChartPie, faListCheck } from '@fortawesome/free-solid-svg-icons'
import { ProjectView } from '../../party.ts'

const swal = withReactContent(Swal)

interface ProjectProps {
	project: Project
	close: () => void
	activeView: ProjectView
	setActiveView: (view: ProjectView) => void
}

export function ProjectPage({ project, close, activeView, setActiveView }: ProjectProps) {
	const { tasks } = project

	const { members } = useGuildMembers() // can't access context inside modal so getting here
	const auth = useAuth()

	const ActiveView = () => {
		switch (activeView) {
			case ProjectView.Overview:
				return <Dashboard tasks={tasks} />
			case ProjectView.Board:
				return <CardView projectId={project.id} tasks={tasks} columns={taskStatuses} property="status" />
			case ProjectView.TaskList:
				return <TableComponent project={project} tasks={tasks} />
		}
	}
	const currUserRoles = useAuth().claims.roles as string[]
	return (
		<div>
			<div className="top-blur" />
			<ChoiceButtons
				className="project-page-switcher"
				defaultValue={activeView}
				setValueCallback={(value: number) => setActiveView(value)}
				choices={[
					{
						value: ProjectView.Overview,
						label: (
							<>
								<FontAwesomeIcon icon={faChartPie} /> Overview
							</>
						),
						color: 'limegreen'
					},
					{
						value: ProjectView.Board,
						label: (
							<>
								<FontAwesomeIcon icon={faBarsStaggered} /> Board
							</>
						),
						color: 'orange'
					},
					{
						value: ProjectView.TaskList,
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
			</div>
		</div>
	)
}
