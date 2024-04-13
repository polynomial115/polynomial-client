import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './login'
import { conn } from './party'
import { discordSdk } from './discord'
import { Events, Types } from '@discord/embedded-app-sdk'

const sendCount = (count: number) => {
	console.log('updating count')
	conn.send(String(count))
}

function App() {
	const [count, setCount] = useState(0)
	const [participants, setParticipants] = useState([] as Types.GetActivityInstanceConnectedParticipantsResponse['participants'])
	const [channel, setChannel] = useState('')

	useEffect(() => {
		conn.send('')
		conn.addEventListener('message', (event) => {
			setCount(+event.data)
		})
		discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, e => {
			console.log(e)
			setParticipants(e.participants)
		})
		discordSdk.commands.getChannel({channel_id: discordSdk.channelId! }).then(channel => setChannel(channel.name!))
	}, [])

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
			<div className="card">
				<button onClick={() => {
					setCount((count) => count + 1)
					sendCount((count || 0) + 1)
				}}>
					count is {count}
				</button>
				<p>
					Participants: {participants.map(p => p.username).join(', ')}
				</p>
			</div>
			<p className="read-the-docs">
			</p>
		</>
	)
}

export default App
