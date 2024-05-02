import { APIGuildMember, CDNRoutes, DefaultUserAvatarAssets, ImageFormat, RouteBases } from 'discord-api-types/v10'
import { discordSdk } from './services/discord'

export const getAvatar = (member: APIGuildMember, size: number) => {
	let str = RouteBases.cdn
	if (member.avatar) {
		str += CDNRoutes.guildMemberAvatar(discordSdk.guildId!, member.user!.id, member.avatar, ImageFormat.PNG)
	} else if (member.user?.avatar) {
		str += CDNRoutes.userAvatar(member.user.id, member.user.avatar, ImageFormat.PNG)
	} else {
		str += CDNRoutes.defaultUserAvatar(((BigInt(member.user!.id) >> 22n) % 6n) as unknown as DefaultUserAvatarAssets)
	}
	return str + '?size=' + size
}

export const getDisplayName = (member: APIGuildMember) => {
	return member.nick ?? member.user!.global_name ?? member.user!.username
}
