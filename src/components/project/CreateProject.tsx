import { createRef, useEffect, useState } from 'react'
import type { APIRole, APITextChannel } from 'discord-api-types/v10'
import { discordSdk } from '../../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'

const transformColor = (color: number) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')

interface Props {
	token: string
}

export function CreateProject({ token }: Props) {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [channels, setChannels] = useState<APITextChannel[]>([])
	const [selectedRoles, setSelectedRoles] = useState<string[]>([])
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
	const nameInputRef = createRef<HTMLInputElement>()
	const [created, setCreated] = useState(false)

	// const [users, setUsers] = useState<APIGuildMember[]>([])

	useEffect(() => {
		fetch(`/api/roles/${discordSdk.guildId}`, { headers: { Authorization: token } })
			.then(r => r.json())
			.then(roles => setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position)))

		fetch(`/api/channels/${discordSdk.guildId}`, { headers: { Authorization: token } })
			.then(r => r.json())
			.then(channels => setChannels((channels as APITextChannel[]).sort((a, b) => a.position - b.position)))

		// fetch(`/api/users/${discordSdk.guildId}`).then(u => u.json()).then(setUsers)
	}, [token])

	if (created) return <div>Project created!</div>

	return (
		<div style={{ height: '400px' }}>
			<h2>Creating new project</h2>
			<form
				onSubmit={async (e: { preventDefault: () => void }) => {
					e.preventDefault()
					await addDoc(collection(db, 'projects'), {
						guildId: discordSdk.guildId,
						name: nameInputRef.current?.value,
						managerRoles: selectedRoles,
						memberRoles: [],
						managerUsers: [],
						memberUsers: [],
						tasks: [],
						notificationsChannel: selectedChannel,
						timestamp: Timestamp.now()
					})
					setCreated(true)
				}}
			>
				Project name: <input type="text" name="name" required ref={nameInputRef} />
				{/* {roles.map(r => <div key={r.id}>{r.name}</div>)} */}
				<Select
					isMulti
					options={roles.map(r => ({ value: r.id, label: r.name, color: transformColor(r.color) }))}
					styles={selectStyles}
					placeholder="Roles with management power for this project"
					onChange={selected => setSelectedRoles(selected.map(e => e.value as string))}
					name="roles"
					menuPosition="fixed"
				/>
				<br />
				<Select
					isMulti={false}
					options={[{ value: null, label: 'None' }, ...channels.map(r => ({ value: r.id, label: '#' + r.name }))]}
					styles={selectStyles}
					placeholder="Notifications channel"
					onChange={selected => setSelectedChannel(selected?.value as string)}
					name="channels"
					menuPosition="fixed"
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}
