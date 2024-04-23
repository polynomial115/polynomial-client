import { useEffect, useState } from 'react'

import './App.css'
import './auth'
import { conn } from './party'
import { discordSdk } from './discord'
import { useAuth } from './useAuth'
import { useParticipants } from './useParticipants'
import { db } from './firebase'
import { QueryDocumentSnapshot, collection, getDocs, query, where } from 'firebase/firestore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CreateProject } from './CreateProject'
import { CreateTask } from './CreateTask'
import { ProjectView } from './ProjectView'
// import { ListView } from './ListView'

const swal = withReactContent(Swal)

const sendCount = (count: number) => {
	conn.send(String(count))
}

function App() {
	const [count, setCount] = useState(0)
	const [channel, setChannel] = useState('')
	const [projects, setProjects] = useState<QueryDocumentSnapshot[]>([])

	const participants = useParticipants()

	useEffect(() => {
		conn.send('')
		conn.addEventListener('message', event => {
			setCount(+event.data)
		})
		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId! }).then(channel => setChannel(channel.name!))

		const projectsQuery = query(collection(db, 'projects'), where('guildId', '==', discordSdk.guildId))
		getDocs(projectsQuery).then(p => {
			console.log(p)
			setProjects(p.docs)
		})
	}, [])

	const auth = useAuth()

	return (
		<>
			{/* <div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div> */}
			<h1>{channel}</h1>
			<p>Projects: {projects.length}</p>
			<button
				onClick={() =>
					swal.fire({
						html: <CreateProject />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Create Project
			</button>
			<ProjectView></ProjectView>
			<button
				onClick={() =>
					swal.fire({
						html: <CreateTask />,
						background: '#202225',
						color: 'white',
						showConfirmButton: false
					})
				}
			>
				Create Task
			</button>
			<div className="card">
				<button
					onClick={() => {
						setCount(count => count + 1)
						sendCount((count || 0) + 1)
					}}
				>
					Count is equal to the value of {count}
				</button>
				<button
					onClick={() => {
						setCount(0)
						sendCount(0)
					}}
				>
					Reset Count
				</button>
				<p>Participants: {participants.map(p => p.username).join(', ')}</p>
			</div>

			<p className="read-the-docs">
				Connected to Firebase as user {auth.claims.user_id as string} with roles {JSON.stringify(auth.claims.roles)}
			</p>
		</>
	)
}

export default App
