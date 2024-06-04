import { createRef, useEffect, useState } from 'react'
import type { APIRole, APITextChannel } from 'discord-api-types/v10'
import { discordSdk } from '../../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'
import { ProjectView } from '../../party.ts'
import Swal from 'sweetalert2'

const transformColor = (color: number) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')

interface Props {
	token: string
	updateProject: ({ project, projectView }: { project?: string; projectView?: ProjectView }) => void
}

export function CreateProject({ token, updateProject }: Props) {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [channels, setChannels] = useState<APITextChannel[]>([])
	const [selectedRoles, setSelectedRoles] = useState<string[]>([])
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
	const nameInputRef = createRef<HTMLInputElement>()

	useEffect(() => {
		fetch('/api/roles', { headers: { Authorization: token } })
			.then(r => r.json())
			.then(roles => setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position)))

		fetch('/api/channels', { headers: { Authorization: token } })
			.then(r => r.json())
			.then(channels => setChannels((channels as APITextChannel[]).sort((a, b) => a.position - b.position)))
	}, [token])

	return (
		<div className="project-modal">
			<h2>Creating new project</h2>
			<form
				onSubmit={async (e: { preventDefault: () => void }) => {
					e.preventDefault()

					const doc = await addDoc(collection(db, 'projects'), {
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

					Swal.fire({
						title: `Created Project ${nameInputRef.current?.value}!`,
						background: '#202225',
						color: 'white',
						icon: 'success',
						timer: 2000,
						showConfirmButton: false,
						willClose: () => updateProject({ project: doc.id, projectView: ProjectView.Overview })
					})
				}}
			>
				Project name: <input type="text" name="name" className="textbox" required ref={nameInputRef} placeholder="Enter Project Name" />
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
