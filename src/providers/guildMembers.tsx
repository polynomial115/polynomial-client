import { useEffect, useRef, useState } from 'react'
import { FetchStatus } from '../types.ts'
import { GuildMember, GuildMembersContext } from '../hooks/useGuildMembers.ts'
import { useAuth } from '../hooks/useAuth.ts'

export function GuildMembersProvider({ children }: { children: React.ReactNode }) {
	const [members, setMembers] = useState<GuildMember[]>([])
	const [status, setStatus] = useState(FetchStatus.Loading)
	const settingUp = useRef(false)
	const auth = useAuth()

	useEffect(() => {
		function setup() {
			fetch('/api/members', { headers: { Authorization: auth.serverToken } })
				.then(response => response.json() as Promise<GuildMember[] | { error: string }>)
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
	}, [auth.serverToken])

	const getMember = (id: string) => members.find(m => m.user.id === id)

	const getRoleMembers = (roleId: string) => members.filter(m => m.roles.includes(roleId))

	if (status === FetchStatus.Failed) return <div>Failed to load guild members.</div>

	return <GuildMembersContext.Provider value={{ status, members, getMember, getRoleMembers }}>{children}</GuildMembersContext.Provider>
}
