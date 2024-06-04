import { createRef, useEffect, useState } from 'react'
import type { APIRole, APITextChannel } from 'discord-api-types/v10'
import { discordSdk } from '../../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../../styles/select-styles.ts'
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'
import { Task } from '../../types.ts'
import Swal from 'sweetalert2'
import { ProjectView } from '../../party.ts'

const transformColor = (color: number) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')
interface Props {
	create: boolean
	name?: string | null
	managerRoles: string[]
	tasks: Task[]
	projectId?: string | null
	currUserRoles: string[]
	token: string
	notificationsChannel?: string | null
	updateProject: ({ project, projectView }: { project?: string; projectView?: ProjectView }) => void
}

interface mockAPIRole {
	name: string
	id: string
	color: string
}

export function ProjectModal({ create, name, managerRoles, tasks, projectId, currUserRoles, token, notificationsChannel, updateProject }: Props) {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [selectedRoles, setSelectedRoles] = useState<mockAPIRole[]>([])
	const nameInputRef = createRef<HTMLInputElement>()
	const [mgmt, setMgmt] = useState<string[]>(managerRoles)
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
	const [channels, setChannels] = useState<APITextChannel[]>([])
	const [header, setHeader] = useState<string>()

	useEffect(() => {
		if (create) {
			setHeader('Creating new project')
		} else {
			setHeader(`Editing Project ${name}`)
		}

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
	}, [create, mgmt, name, notificationsChannel, token])

	// checks if currnet user has manager role or @everyone has manager role
	if (
		// we are not in create mode
		!create &&
		// there are managerial roles
		managerRoles.length &&
		// user does not have manager role
		!currUserRoles.filter(r => managerRoles.includes(r)).length &&
		// manager roles does not include @everyone
		!managerRoles.includes(discordSdk.guildId!)
	) {
		return <div>You do not have permissions to edit this project!</div>
	}
	return (
		<div className="project-modal">
			<h2>{header}</h2>
			<form
				onSubmit={async (e: { preventDefault: () => void }) => {
					e.preventDefault()
					const submitData = {
						guildId: discordSdk.guildId,
						name: nameInputRef.current?.value,
						managerRoles: selectedRoles.map(r => r.id),
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
				Project name:{' '}
				<input
					type="text"
					name="name"
					className="textbox"
					required
					ref={nameInputRef}
					placeholder="Enter your project name here"
					defaultValue={name ? name : ''}
				/>
				<Select
					isMulti
					onChange={selected => {
						setSelectedRoles(selected.map(e => ({ name: e.label, id: e.value, color: e.color }) as mockAPIRole))
						setMgmt(selected.map(e => e.value as string))
					}}
					placeholder="Select the roles with manager permissions(sets to @everyone if left empty)"
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
