import { createRef, useEffect, useState } from 'react'
import type { APIRole, APITextChannel } from 'discord-api-types/v10'
import { discordSdk } from '../../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { Timestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'
import { Task } from '../../types.ts'

const transformColor = (color: number) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')
interface Props {
	name: string
	managerRoles: string[]
	tasks: Task[]
	projectId: string
	currUserRoles: string[]
	token: string
	notificationsChannel?: string | null
}

interface mockAPIRole {
	name: string
	id: string
	color: string
}

export function EditProject({ name, managerRoles, tasks, projectId, currUserRoles, token, notificationsChannel }: Props) {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [selectedRoles, setSelectedRoles] = useState<mockAPIRole[]>([])
	const nameInputRef = createRef<HTMLInputElement>()
	const [edited, setEdited] = useState(false)
	const [mgmt, setMgmt] = useState<string[]>(managerRoles)
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
	const [channels, setChannels] = useState<APITextChannel[]>([])

	useEffect(() => {
		if (notificationsChannel != null) {
			setSelectedChannel(notificationsChannel)
		}
		fetch('/api/roles', { headers: { Authorization: token } })
			.then(r => r.json())
			.then(roles => {
				setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position))
				setSelectedRoles(
					(roles as APIRole[])
						.filter(r => mgmt.includes(r.id))
						.map(r => ({ name: r.name, id: r.id, color: transformColor(r.color) }) as mockAPIRole)
				)
			})
		fetch('/api/channels', { headers: { Authorization: token } })
			.then(r => r.json())
			.then(channels => setChannels((channels as APITextChannel[]).sort((a, b) => a.position - b.position)))
	}, [mgmt, notificationsChannel, token])

	// checks if currnet user has manager role or @everyone has manager role
	if (managerRoles.length && !currUserRoles.filter(r => managerRoles.includes(r)).length && !managerRoles.includes(discordSdk.guildId!))
		return <div>You do not have permissions to edit this project!</div>
	if (edited) return <div>Project edited!</div>
	const projectDoc = doc(db, 'projects', projectId)
	return (
		<div style={{ height: '400px' }}>
			<h2>Editing Project {name}</h2>
			<form
				onSubmit={async (e: { preventDefault: () => void }) => {
					e.preventDefault()

					await updateDoc(projectDoc, {
						guildId: discordSdk.guildId,
						name: nameInputRef.current?.value,
						managerRoles: selectedRoles.map(r => r.id),
						memberRoles: [],
						managerUsers: [],
						memberUsers: [],
						tasks: tasks,
						notificationsChannel: selectedChannel,
						timestamp: Timestamp.now()
					})
					setEdited(true)
				}}
			>
				Project name: <input type="text" name="name" className="textbox" required ref={nameInputRef} defaultValue={name} />
				<Select
					isMulti
					onChange={selected => {
						setSelectedRoles(selected.map(e => ({ name: e.label, id: e.value, color: e.color }) as mockAPIRole))
						setMgmt(selected.map(e => e.value as string))
					}}
					placeholder="Select the roles with manager permissions"
					value={selectedRoles.map(r => ({ value: r.id, label: r.name, color: r.color }))}
					options={roles.map(r => ({ value: r.id, label: r.name, color: transformColor(r.color) }))}
					styles={selectStyles}
					name="roles"
					menuPosition="fixed"
				/>
				<br />
				<Select
					isMulti={false}
					options={[{ value: null, label: 'None' }, ...channels.map(r => ({ value: r.id, label: '#' + r.name }))]}
					value={selectedChannel ? channels.filter(r => r.id == selectedChannel).map(r => ({ value: r.id, label: '#' + r.name })) : null}
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
