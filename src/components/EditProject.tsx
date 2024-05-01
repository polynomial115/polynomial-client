import { createRef, useEffect, useState } from 'react'
import type { APIRole } from 'discord-api-types/v10'
import { discordSdk } from '../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../styles/select-styles.ts'
import { Timestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase.ts'
import { Task } from '../types.ts'

const transformColor = (color: number) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')
interface Props {
	name: string
	managerRoles: string[]
	tasks: Task[]
	projectId: string
}

export function EditProject({ name, managerRoles, tasks, projectId }: Props) {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [selectedRoles, setSelectedRoles] = useState<string[]>([])
	const nameInputRef = createRef<HTMLInputElement>()
	const [edited, setEdited] = useState(false)
	// const [users, setUsers] = useState<APIGuildMember[]>([])

	useEffect(() => {
		fetch(`/api/roles/${discordSdk.guildId}`)
			.then(r => r.json())
			.then(roles => {
				setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position))
			})
		// fetch(`/api/users/${discordSdk.guildId}`).then(u => u.json()).then(setUsers)
	}, [managerRoles])

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
						managerRoles: selectedRoles,
						memberRoles: [],
						managerUsers: [],
						memberUsers: [],
						tasks: tasks,
						timestamp: Timestamp.now()
					})
					setEdited(true)
				}}
			>
				Project name: <input type="text" name="name" required ref={nameInputRef} defaultValue={name} />
				{/* {roles.map(r => <div key={r.id}>{r.name}</div>)} */}
				<Select
					isMulti
					// value={selectedRoles
					// 	.filter(role => managerRoles.includes(role.id))
					// 	.map(r => ({ value: r.id, label: r.name, color: transformColor(r.color) }))}
					options={roles.map(r => ({ value: r.id, label: r.name, color: transformColor(r.color) }))}
					styles={selectStyles}
					onChange={selected => setSelectedRoles(selected.map(e => e.value as string))}
					name="roles"
				/>
				<button type="submit">Submit</button>
				{/* <Select 
				isMulti
				optinos = {users.map(u)}></Select> */}
			</form>
		</div>
	)
}
