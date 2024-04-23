import { useEffect, useState } from 'react'
import { db } from './firebase'
import { discordSdk } from './discord'
import { QueryDocumentSnapshot, collection, query, where, getDocs } from 'firebase/firestore'
// import { Project, DatabaseProject } from "./CreateProject"

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
		<div className="flexbox-container">
			{projects.map(p => (
				<div style={projectViewStyles.projectCard} className="projectCard" key={p.id}>
					<p>ID: {p.id}</p>
					<p>{p.data.name}</p>
					<p>Guild: {p.data.name}</p>
				</div>
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
