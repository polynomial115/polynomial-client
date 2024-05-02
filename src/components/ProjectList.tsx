import type { Project } from '../types'
import '../styles/ProjectView.css'

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
					<p className="id">ID: {p.id}</p>
					<p>Name: {p.name}</p>
				</button>
			))}
		</div>
	)
}
