import { createContext, useContext } from 'react'
import { FetchStatus } from '../types'
import { APIGuildMember } from 'discord-api-types/v10'

interface GuildMembersData {
	status: FetchStatus
	members: APIGuildMember[]
	getMember: (id: string) => APIGuildMember | undefined
	getRoleMembers: (roleId: string) => APIGuildMember[]
}

export const GuildMembersContext = createContext<GuildMembersData>(null!)

export function useGuildMembers() {
	return useContext(GuildMembersContext)
}
