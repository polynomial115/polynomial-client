import { useEffect, useState } from 'react'

import './styles/App.css'
import './providers/auth.tsx'
import { PayloadType, sendPayload } from './party'
import { discordSdk } from './services/discord.ts'
import { useAuth } from './hooks/useAuth.ts'
import { useParticipants } from './hooks/useParticipants.ts'
import { db } from './services/firebase.ts'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CreateProject } from './components/project/CreateProject.tsx'
import { ProjectList } from './components/project/ProjectList.tsx'
import { ProjectPage } from './components/project/ProjectPage.tsx'
import { type Project } from './types.ts'
import { DiscordAvatar } from './components/User.tsx'
import { useEvent } from './hooks/useEvent.ts'

const swal = withReactContent(Swal)

function App() {
	const [channel, setChannel] = useState('')
	const [projects, setProjects] = useState<Project[]>([])
	const [activeProject, setActiveProject] = useState('')
	const participants = useParticipants()

	useEffect(() => {
		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId! }).then(channel => setChannel(channel.name!))

		const projectsQuery = query(collection(db, 'projects'), where('guildId', '==', discordSdk.guildId))
		const unsubscribe = onSnapshot(
			projectsQuery,
			snapshot => {
				setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project))
				sendPayload(PayloadType.GetPage)
			},
			error => {
				console.error('Error fetching projects:', error)
			}
		)

		return () => unsubscribe()
	}, [])

	useEvent(PayloadType.PageUpdate, data => setActiveProject(data.project))

	const auth = useAuth()

	function updateProject(projectId: string) {
		setActiveProject(projectId)
		sendPayload(PayloadType.PageUpdate, { project: projectId })
	}

	if (activeProject) return <ProjectPage project={projects.find(p => p.id === activeProject)!} close={() => updateProject('')} />

	return (
		<div className="RootProject">
			<h3>Participants: </h3>
			{participants.map(p => {
				return <DiscordAvatar size={50} key={p.id} memberId={p.id} />
			})}
			<h1>{channel}</h1>
			<p>Projects: {projects.length}</p>
			<button
				onClick={() =>
					swal.fire({
						html: <CreateProject token={auth.serverToken} />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Create Project
			</button>
			<ProjectList projects={projects} setActiveProject={updateProject} />
			<p className="read-the-docs">
				Connected to Firebase as user {auth.claims.user_id as string} with roles {JSON.stringify(auth.claims.roles)}
			</p>
		</div>
	)
}

export default App
