import { createRef, useEffect, useState } from 'react'
import type { APIRole } from 'discord-api-types/v10'
import { discordSdk } from '../services/discord.ts'
import Select from 'react-select'
import { selectStyles } from '../styles/select-styles.ts'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../services/firebase.ts'

const transformColor = (color: number) => (color ? '#' + color.toString(16).padStart(6, '0') : 'white')

// export interface DatabaseProject {
// 	name: string,
// 	id: string,
// 	project: Project,
// }

// export interface Project {
// 	guildId: string,
// 	name: string,
// 	managerRoles: Array<string>,
// 	memberRoles: Array<string>,
// 	managerUsers: Array<string>,
// 	memberUsers: Array<string>,
// 	tasks: Array<string>, // Temporary, change this into tasks interface later
// 	timestamp: string
// }

export function CreateProject() {
	const [roles, setRoles] = useState<APIRole[]>([])
	const [selectedRoles, setSelectedRoles] = useState<string[]>([])
	const nameInputRef = createRef<HTMLInputElement>()
	const [created, setCreated] = useState(false)

	// const [users, setUsers] = useState<APIGuildMember[]>([])

	useEffect(() => {
		fetch(`/api/roles/${discordSdk.guildId}`)
			.then(r => r.json())
			.then(roles => setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position)))
		// fetch(`/api/users/${discordSdk.guildId}`).then(u => u.json()).then(setUsers)
	}, [])

	if (created) return <div>Project created!</div>

	return (
		<div style={{ height: '400px' }}>
			<h2>Creating new project</h2>
			<form
				onSubmit={async e => {
					e.preventDefault()
					await addDoc(collection(db, 'projects'), {
						guildId: discordSdk.guildId,
						name: nameInputRef.current?.value,
						managerRoles: selectedRoles,
						memberRoles: [],
						managerUsers: [],
						memberUsers: [],
						tasks: [],
						timestamp: Timestamp.now()
					})
					setCreated(true)
				}}
			>
				Project name: <input type="text" name="name" required ref={nameInputRef}></input>
				{/* {roles.map(r => <div key={r.id}>{r.name}</div>)} */}
				<Select
					isMulti
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