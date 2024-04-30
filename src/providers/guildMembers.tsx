import { discordSdk } from '../services/discord.ts'
import { useEffect, useRef, useState } from 'react'
import { APIGuildMember } from 'discord-api-types/v10'
import { FetchStatus } from '../types.ts'
import { GuildMembersContext } from '../hooks/useGuildMembers.ts'

export function GuildMembersProvider({ children }: { children: React.ReactNode }) {
	const [members, setMembers] = useState<APIGuildMember[]>([])
	const [status, setStatus] = useState(FetchStatus.Loading)
	const settingUp = useRef(false)

	useEffect(() => {
		function setup() {
			fetch(`/api/members/${discordSdk.guildId}`)
				.then(response => response.json() as Promise<APIGuildMember[] | { error: string }>)
				.then(data => {
					if (Array.isArray(data)) {
						setMembers(data)
						setStatus(FetchStatus.Succeeded)
					} else {
						console.log('Failed to load members (API error):', data)
						setStatus(FetchStatus.Failed)
					}
				})
				.catch(error => {
					console.log('Failed to load members (request error):', error)
					setStatus(FetchStatus.Failed)
				})
		}
		if (!settingUp.current) {
			settingUp.current = true
			setup()
		}
	}, [])

	const getMember = (id: string) => members.find(m => m.user?.id === id)

	const getRoleMembers = (roleId: string) => members.filter(m => m.roles.includes(roleId))

	if (status === FetchStatus.Failed) return <div>Failed to load guild members.</div>

	return <GuildMembersContext.Provider value={{ status, members, getMember, getRoleMembers }}>{children}</GuildMembersContext.Provider>
}
