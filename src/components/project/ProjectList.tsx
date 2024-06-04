import { Project, TaskStatus } from '../../types.ts'
import '../../styles/ProjectView.css'

interface Props {
	projects: Project[]
	setActiveProject: (projectId: string) => void
}

export function ProjectList({ projects, setActiveProject }: Props) {
	const handleCardClick = (projectId: string) => {
		console.log('Project card clicked', projectId)
		setActiveProject(projectId)
	}

	return (
		<div className="grid-container">
			{projects.map(p => (
				<button key={p.id} className="grid-item" onClick={() => handleCardClick(p.id)} aria-label={`Edit project ${p.name}`}>
					<p className="grid-item-title">
						<b>{p.name}</b>
					</p>
					<p>
						<span
							className="task-count"
							style={{
								color: p.tasks.filter(task => task.status !== TaskStatus.Completed).length ? 'white' : 'lime'
							}}
						>
							{p.tasks.filter(task => task.status !== TaskStatus.Completed).length}
						</span>{' '}
						active tasks
					</p>
				</button>
			))}
		</div>
	)
}
