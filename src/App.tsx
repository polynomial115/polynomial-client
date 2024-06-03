import { useEffect, useState } from 'react'

import './styles/App.css'
import './providers/auth.tsx'
import { ProjectView, PayloadType, sendPayload } from './party'
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
import { useGuildMembers } from './hooks/useGuildMembers.ts'

const swal = withReactContent(Swal)

function App() {
	const [channel, setChannel] = useState('')
	const [projects, setProjects] = useState<Project[]>([])
	const [activeProject, setActiveProject] = useState('')
	const [activeProjectView, setActiveProjectView] = useState(ProjectView.Overview)
	const participants = useParticipants()
	const { getMember } = useGuildMembers()

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

	useEvent(PayloadType.PageUpdate, data => {
		setActiveProject(data.project)
		setActiveProjectView(data.projectView)
	})

	const auth = useAuth()

	function updateProject({ project, projectView }: { project?: string; projectView?: ProjectView }) {
		if (project !== undefined) setActiveProject(project)
		if (projectView !== undefined) setActiveProjectView(projectView)
		sendPayload(PayloadType.PageUpdate, { project: project ?? activeProject, projectView: projectView ?? activeProjectView })
	}

	if (activeProject)
		return (
			<ProjectPage
				project={projects.find(p => p.id === activeProject)!}
				close={() => updateProject({ project: '', projectView: ProjectView.Overview })}
				activeView={activeProjectView}
				setActiveView={view => updateProject({ projectView: view })}
			/>
		)

	return (
		<div className="root-project">
			<h3>Participants: </h3>
			{participants.map(p => {
				return <DiscordAvatar size={50} key={p.id} member={getMember(p.id)} />
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
			<ProjectList projects={projects} setActiveProject={project => updateProject({ project })} />
			<p className="read-the-docs">
				Connected to Firebase as user {auth.claims.user_id as string} with roles {JSON.stringify(auth.claims.roles)}
			</p>
		</div>
	)
}

export default App
