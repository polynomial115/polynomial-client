import { useEffect, useState } from "react";
import type { APIRole, APIGuildMember } from 'discord-api-types/v10'
import { discordSdk } from "./discord";
import Select from 'react-select';
import chroma from 'chroma-js'

const transformColor = (color: number) => color ? '#' + color.toString(16).padStart(6, '0') : 'white'

export function CreateProject() {
	const [roles, setRoles] = useState<APIRole[]>([])

	const [users, setUsers] = useState<APIGuildMember[]>([])

	useEffect(() => {
		fetch(`/api/roles/${discordSdk.guildId}`).then(r => r.json()).then(roles => setRoles((roles as APIRole[]).sort((a, b) => b.position - a.position)))
				fetch(`/api/users/${discordSdk.guildId}`).then(u => u.json()).then(setUsers)
	}, [])

	return <div style={{height: '400px'}}>
		<h2>Creating new project</h2>
				<form>Project name: <input type="text"></input></form>
		{/* {roles.map(r => <div key={r.id}>{r.name}</div>)} */}
		<Select
			isMulti
			options={roles.map(r => ({ value: r.id, label: r.name, color: transformColor(r.color) }))}
			styles={{
				control: (provided) => ({
					...provided,
					background: '#202225',
					color: 'white'
				}),
				menu: (provided) => ({
					...provided,
					background: '#111111',
					color: 'white'
				}),
				option: (styles, { data, isDisabled, isFocused, isSelected }) => {
					const color = chroma(data.color);
					return {
						...styles,
						backgroundColor: isDisabled
						? undefined
						: isSelected
						? data.color
						: isFocused
						? color.alpha(0.1).css()
						: undefined,
						color: isDisabled
						? '#ccc'
						: isSelected
						? chroma.contrast(color, 'white') > 2
							? 'white'
							: 'black'
						: data.color,
						cursor: isDisabled ? 'not-allowed' : 'default',
				
						':active': {
						...styles[':active'],
						backgroundColor: !isDisabled
							? isSelected
							? data.color
							: color.alpha(0.3).css()
							: undefined,
						},
					};
				},
				multiValue: (styles, { data }) => {
					const color = chroma(data.color);
					return {
						...styles,
						backgroundColor: color.alpha(0.1).css(),
					};
					},
					multiValueLabel: (styles, { data }) => ({
					...styles,
					color: data.color,
					}),
					multiValueRemove: (styles, { data }) => ({
					...styles,
					color: data.color,
					':hover': {
						backgroundColor: data.color,
						color: 'white',
					},
					}),
			}}
		/>
				{/* <Select 
				isMulti
				optinos = {users.map(u)}></Select> */}
	</div>
}