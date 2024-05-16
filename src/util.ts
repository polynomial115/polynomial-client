import { APIGuildMember, CDNRoutes, DefaultUserAvatarAssets, ImageFormat, RouteBases } from 'discord-api-types/v10'
import { discordSdk } from './services/discord'

export const getAvatar = (member: APIGuildMember, size: number, animate?: boolean) => {
	const getFormat = (hash: string) => (animate && hash.startsWith('a_') ? ImageFormat.GIF : ImageFormat.PNG)

	let str = RouteBases.cdn
	if (member.avatar) {
		str += CDNRoutes.guildMemberAvatar(discordSdk.guildId!, member.user!.id, member.avatar, getFormat(member.avatar))
	} else if (member.user?.avatar) {
		str += CDNRoutes.userAvatar(member.user.id, member.user.avatar, getFormat(member.user.avatar))
	} else {
		str += CDNRoutes.defaultUserAvatar(((BigInt(member.user!.id) >> 22n) % 6n) as unknown as DefaultUserAvatarAssets)
	}
	return str + '?size=' + size
}

export const getDisplayName = (member: APIGuildMember) => {
	return member.nick ?? member.user!.global_name ?? member.user!.username
}
