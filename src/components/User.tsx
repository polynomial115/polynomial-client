import { useGuildMembers } from '../hooks/useGuildMembers'
import { getAvatar, getDisplayName } from '../util'
import { APIGuildMember } from 'discord-api-types/v10'

interface DiscordAvatarProps {
	memberId: string
	size?: number
}

export function DiscordAvatar({ memberId, size }: DiscordAvatarProps) {
	const { getMember } = useGuildMembers()
	const member: APIGuildMember | undefined = getMember(memberId)
	if (!member) return null
	if (!size) size = 35 // Default avatar size
	const name = getDisplayName(member)
	return (
		<div className="AvatarContainer">
			<img className="Avatar" src={getAvatar(member, 128)} style={{ margin: 3.5, width: size, height: size }} alt={name} />
			<div className="ToolTip">{name}</div>
		</div>
	)
}
