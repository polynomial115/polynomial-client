import '../../styles/ProjectView.css'
import { type Project, taskStatuses } from '../../types.ts'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useGuildMembers } from '../../hooks/useGuildMembers.ts'
import { ManageProject } from './ManageProject.tsx'
import { useAuth } from '../../hooks/useAuth.ts'
import { ChoiceButtons } from '../ChoiceButtons.tsx'
import { Dashboard } from '../Dashboard.tsx'
import { CardView } from '../task/CardView.tsx'
import '../../styles/ProjectView.css'
import { TableComponent } from '../task/TableComponent.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faBarsStaggered, faChartPie, faEdit, faListCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ProjectView } from '../../party.ts'
import { discordSdk } from '../../services/discord.ts'
import DeleteProject from './DeleteProject.tsx'
import { ManageTask } from '../task/ManageTask.tsx'

const swal = withReactContent(Swal)

interface ProjectProps {
	project: Project
	close: () => void
	activeView: ProjectView
	setActiveView: (view: ProjectView) => void
	updateProject: ({ project, projectView }: { project?: string; projectView?: ProjectView }) => void
}

export function ProjectPage({ project, close, activeView, setActiveView, updateProject }: ProjectProps) {
	const { members } = useGuildMembers() // can't access context inside modal so getting here
	const auth = useAuth()

	if (!project) {
		// crash message in case no project load
		return <div>No project loaded, relaunch Polynomial</div>
	}

	const ActiveView = () => {
		switch (activeView) {
			case ProjectView.Overview:
				return <Dashboard project={project} />
			case ProjectView.Board:
				return <CardView project={project} columns={taskStatuses} property="status" />
			case ProjectView.TaskList:
				return <TableComponent project={project} />
		}
	}
	const currUserRoles = auth.claims.roles as string[]
	const roleCheck = currUserRoles.filter(r => project.managerRoles.includes(r)).length > 0 || project.managerRoles.includes(discordSdk.guildId!)
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
			<button className="project-back-button" onClick={close}>
				<FontAwesomeIcon icon={faAngleLeft} /> Projects
			</button>
			<div className="project-top">
				<p className="project-title">{project.name}</p>
				<div className="task-button-row">
					{roleCheck && (
						<button
							onClick={() =>
								swal.fire({
									html: (
										<ManageProject
											name={project.name}
											managerRoles={project.managerRoles}
											tasks={project.tasks}
											projectId={project.id}
											token={auth.serverToken}
											notificationsChannel={project.notificationsChannel}
											create={false}
											updateProject={updateProject}
										/>
									),
									background: '#202225',
									color: 'white',
									showConfirmButton: false
								})
							}
						>
							<FontAwesomeIcon icon={faEdit} /> Edit Project
						</button>
					)}
					<button
						onClick={() =>
							swal.fire({
								html: <ManageTask project={project} members={members} currTask={null} token={auth.serverToken} />,
								background: '#202225',
								color: 'white',
								showConfirmButton: false,
								width: '800px'
							})
						}
					>
						<FontAwesomeIcon icon={faPlus} /> Create Task
					</button>
					{roleCheck && (
						<button
							onClick={() =>
								swal.fire({
									html: <DeleteProject project={project} closeProject={close} />,
									background: '#202225',
									icon: 'warning',
									color: 'white',
									showConfirmButton: false,
									width: '800px'
								})
							}
						>
							<FontAwesomeIcon icon={faTrash} /> Delete Project
						</button>
					)}
				</div>
				{ActiveView()}
			</div>
		</div>
	)
}
