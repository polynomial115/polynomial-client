import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './auth'
import { conn } from './party'
import { discordSdk } from './discord'
import { useAuth } from './useAuth'
import { useParticipants } from './useParticipants'

const sendCount = (count: number) => {
	console.log('updating count')
	conn.send(String(count))
}

function App() {
	const [count, setCount] = useState(0)
	const [channel, setChannel] = useState('')

	const participants = useParticipants()

	useEffect(() => {
		conn.send('')
		conn.addEventListener('message', (event) => {
			setCount(+event.data)
		})
		discordSdk.commands.getChannel({channel_id: discordSdk.channelId! }).then(channel => setChannel(channel.name!))
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
			<div className="card"  style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<button style={{margin: 3}} onClick={() => {
					setCount((count) => count + 1)
					sendCount((count || 0) + 1)
				}}>
					count is {count}
				</button>
				<button style={{margin: 3}} onClick={() => {
					setCount(0)
					sendCount(0)
				}}>
					reset count
				</button>
				<p>
					Participants: {participants.map(p => p.username).join(', ')}
				</p>
			</div>
			<p className="read-the-docs">
				Connected to Firebase as user {auth.claims.user_id as string} with roles {JSON.stringify(auth.claims.roles)}
			</p>
		</>
	)
}

export default App
