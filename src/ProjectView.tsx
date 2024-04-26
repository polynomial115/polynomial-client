import { useEffect, useState } from 'react'
import { db } from './services/firebase.ts'
import { discordSdk } from './services/discord.ts'
import { collection, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { EditProject } from './components/EditProject.tsx'

const swal = withReactContent(Swal)

export function ProjectView() {
	const [projects, setProjects] = useState<QueryDocumentSnapshot[]>([])

	useEffect(() => {
		const projectsQuery = query(collection(db, 'projects'), where('guildId', '==', discordSdk.guildId))
		getDocs(projectsQuery).then(p => {
			console.log(p)
			setProjects(p.docs)
		})
	}, [])
	return (
		<div className="flexbox-container ProjectCardContainer">
			{projects.map(p => (
				<button
					key={p.id}
					style={projectViewStyles.projectCard}
					className="projectCardButton"
					onClick={() => {
						console.log('Project card clicked')
						swal.fire({
							html: <EditProject />,
							background: '#202225',
							color: 'white',
							showConfirmButton: false
						})
					}}
				>
					<div>
						<p>ID: {p.id}</p>
						<p>Name: {p.data.name}</p>
						<p>Guild: {p.data.guildName}</p>
					</div>
				</button>
			))}
		</div>
	)
}

const projectViewStyles = {
	projectCard: {
		// backgroundColor: styles.colors.darker,
		color: 'white',
		borderRadius: 10,
		minWidth: '28vw',
		minHeight: '35vh',
		margin: 7.5,
		boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.25), 0 6px 20px 0 rgba(0, 0, 0, 0.3)'
	}
}