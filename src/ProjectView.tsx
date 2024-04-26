import { useEffect, useState, Fragment } from 'react'
import { db } from './firebase'
import { discordSdk } from './discord'
import { collection, onSnapshot, query, QueryDocumentSnapshot, where } from 'firebase/firestore'
import { Project } from './types'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { EditProject } from './components/EditProject'
import './styles/ProjectView.css'

const swal = withReactContent(Swal)

export function ProjectView() {
	const [projects, setProjects] = useState<Project[]>([])

	useEffect(() => {
		const projectsQuery = query(collection(db, 'projects'), where('guildId', '==', discordSdk.guildId))

		// Cast the unsubscribe function to the correct type
		const unsubscribe: () => void = onSnapshot(
			projectsQuery,
			snapshot => {
				setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project))
			},
			error => {
				console.error('Error fetching projects:', error)
			}
		)

		return () => unsubscribe()
	}, [])

	const handleCardClick = (projectId: string) => {
		console.log('Project card clicked', projectId)
		swal.fire({
			html: <EditProject projectId={projectId} />,
			background: '#202225',
			color: 'white',
			showConfirmButton: false
		}).then(r => {
			console.log('SweetAlert2 closed', r)
		})
	}

	return (
		<div className="grid-container">
			{projects.map(p => (
				<button key={p.id} className="grid-item" onClick={() => handleCardClick(p.id)} aria-label={`Edit project ${p.data().name}`}>
					<p className="id">ID: {p.id}</p>
					<p>Name: {p.name}</p>
				</button>
			))}
		</div>
	)
}
