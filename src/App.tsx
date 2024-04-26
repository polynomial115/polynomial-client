import { useEffect, useState } from 'react'

import './styles/App.css'
import './auth'
import { conn } from './party'
import { discordSdk } from './services/discord.ts'
import { useAuth } from './hooks/useAuth.ts'
import { useParticipants } from './hooks/useParticipants.ts'
import { db } from './services/firebase.ts'
import { QueryDocumentSnapshot, collection, getDocs, query, where } from 'firebase/firestore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CreateProject } from './components/CreateProject.tsx'
import { ProjectView } from './ProjectView'

import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

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
			console.log('projects', p)
			setProjects(p.docs)
		})
	}, [])

	const auth = useAuth()

	return (
		<>
			<div className="AppBarCSS">
				<AppBar position="static">
					<Toolbar color="primary">
						<IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
							<MenuIcon />
						</IconButton>

						<Typography variant="h6" color="inherit" component="div">
							Polynomial Dashboard - &nbsp;
						</Typography>
						<h3>{channel}</h3>
					</Toolbar>
				</AppBar>
			</div>

			<div className="RootProject">
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
			</div>
		</>
	)
}

export default App
