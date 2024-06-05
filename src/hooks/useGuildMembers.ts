import { createContext, useContext } from 'react'
import { FetchStatus } from '../types'
import { APIGuildMember } from 'discord-api-types/v10'

export type GuildMember = APIGuildMember & Required<Pick<APIGuildMember, 'user'>>

interface GuildMembersData {
	status: FetchStatus
	members: GuildMember[]
	getMember: (id: string) => GuildMember | undefined
	getRoleMembers: (roleId: string) => GuildMember[]
}

export const GuildMembersContext = createContext<GuildMembersData>(null!)

export function useGuildMembers() {
	return useContext(GuildMembersContext)
}
