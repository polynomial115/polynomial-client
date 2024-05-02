import { getAvatar, getDisplayName } from '../util'
import { APIGuildMember } from 'discord-api-types/v10'

interface DiscordAvatarProps {
	memberId: string
	getMember: (id: string) => APIGuildMember | undefined
	size?: number
}

export function DiscordAvatar({ memberId, getMember, size }: DiscordAvatarProps) {
	const member: APIGuildMember | undefined = getMember(memberId)
	if (!member) return null
	if (!size) size = 35 // Default avatar size
	const name = getDisplayName(member)
	return (
		<>
			<img
				className="Avatar"
				src={getAvatar(member)}
				style={{ margin: 3.5, width: size, height: size }}
				alt={name}
				title={name}
				onClick={() => {
					console.log('clicked')
				}}
			/>
			<div className="ToolTip">{name}</div>
		</>
	)
}
