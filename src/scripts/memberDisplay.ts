import { CDNRoutes, DefaultUserAvatarAssets, ImageFormat, RouteBases } from 'discord-api-types/v10'
import { discordSdk } from '../services/discord'
import type { GuildMember } from '../hooks/useGuildMembers'

export const getAvatar = (member: GuildMember, size: number, animate?: boolean) => {
	const getFormat = (hash: string) => (animate && hash.startsWith('a_') ? ImageFormat.GIF : ImageFormat.PNG)

	let str = RouteBases.cdn
	if (member.avatar) {
		// the member has a per-server avatar
		str += CDNRoutes.guildMemberAvatar(discordSdk.guildId!, member.user.id, member.avatar, getFormat(member.avatar))
	} else if (member.user.avatar) {
		// the user has a global avatar
		str += CDNRoutes.userAvatar(member.user.id, member.user.avatar, getFormat(member.user.avatar))
	} else {
		// the user has no avatar. calculate default avatar per https://discord.com/developers/docs/reference#image-formatting
		str += CDNRoutes.defaultUserAvatar(((BigInt(member.user.id) >> 22n) % 6n) as unknown as DefaultUserAvatarAssets)
	}
	return str + '?size=' + size
}

export const getDisplayName = (member: GuildMember) => {
	return member.nick ?? member.user.global_name ?? member.user.username
}
