import { createRef, useEffect, useState } from 'react'
import type { APIRole, APITextChannel } from 'discord-api-types/v10'
import { discordSdk } from '../../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'
import { Task } from '../../types.ts'
import Swal from 'sweetalert2'
import { ProjectView } from '../../services/party.ts'

const transformColor = (color: number | undefined) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')

interface Props {
	create: boolean
	name?: string | null
	managerRoles: string[]
	tasks: Task[]
	projectId?: string | null
	token: string
	notificationsChannel?: string | null
	updateProject: ({ project, projectView }: { project?: string; projectView?: ProjectView }) => void
}

export function ManageProject({ create, name, managerRoles, tasks, projectId, token, notificationsChannel, updateProject }: Props) {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [selectedRoles, setSelectedRoles] = useState<string[]>(managerRoles)
	const [selectedChannel, setSelectedChannel] = useState<string | null>(notificationsChannel ?? null)
	const [channels, setChannels] = useState<APITextChannel[]>([])
	const nameInputRef = createRef<HTMLInputElement>()

	const getRole = (id: string) => roles.find(c => c.id === id)
	const getChannel = (id: string) => channels.find(c => c.id === id)
	const NullLabel = { value: null, label: 'None' }

	useEffect(() => {
		fetch('/api/roles', { headers: { Authorization: token } })
			.then(r => r.json())
			.then(roles => {
				setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position))
			})
		fetch('/api/channels', { headers: { Authorization: token } })
			.then(r => r.json())
			.then(channels => setChannels((channels as APITextChannel[]).sort((a, b) => a.position - b.position)))
	}, [token])

	if (!roles.length || !channels.length) return <div className="loading-project-modal">Loading...</div>

	return (
		<div className="project-modal">
			<h2>{create ? 'Creating new project' : `Editing Project ${name}`}</h2>
			<form
				onSubmit={async (e: { preventDefault: () => void }) => {
					e.preventDefault()
					const submitData = {
						guildId: discordSdk.guildId,
						name: nameInputRef.current?.value,
						managerRoles: selectedRoles,
						memberRoles: [],
						managerUsers: [],
						memberUsers: [],
						tasks: tasks,
						notificationsChannel: selectedChannel,
						timestamp: Timestamp.now()
					}
					let projId: string
					if (create) {
						const submittedDoc = await addDoc(collection(db, 'projects'), submitData)
						projId = submittedDoc.id
					} else {
						// projectId will not be null in the case where create is not true
						await updateDoc(doc(db, 'projects', projectId!), submitData)
						projId = projectId!
					}
					Swal.fire({
						title: `${create ? 'Created' : 'Edited'} ${nameInputRef.current?.value}!`,
						background: '#202225',
						color: 'white',
						icon: 'success',
						timer: 2000,
						showConfirmButton: false,
						willClose: () => updateProject({ project: projId, projectView: ProjectView.Overview })
					})
				}}
			>
				<h3 className="label">Project Name</h3>
				<input
					type="text"
					name="name"
					className="textbox"
					required
					ref={nameInputRef}
					placeholder="Enter your project name here"
					defaultValue={name ? name : ''}
				/>
				<h3 className="label">Managers of the project has this role</h3>
				<Select
					className="project-select"
					isMulti
					required
					onChange={selected => setSelectedRoles(selected.map(r => r.value as string))}
					placeholder="Select manager roles"
					defaultValue={managerRoles.map(rid => ({
						value: rid,
						label: getRole(rid)?.name ?? 'Unknown Role',
						color: transformColor(getRole(rid)?.color)
					}))}
					options={roles.map(r => ({ value: r.id, label: r.name, color: transformColor(r.color) }))}
					styles={selectStyles}
					name="roles"
					menuPosition="fixed"
				/>
				<h3 className="label">Notifications will be sent here:</h3>
				<Select
					className="project-select"
					isMulti={false}
					options={[NullLabel, ...channels.map(r => ({ value: r.id, label: '#' + r.name }))]}
					defaultValue={selectedChannel ? { value: selectedChannel, label: '#' + getChannel(selectedChannel)?.name } : NullLabel}
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
