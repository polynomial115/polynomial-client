import { useState } from 'react'
import { getAvatar, getDisplayName } from '../util'
import { APIGuildMember } from 'discord-api-types/v10'

interface DiscordAvatarProps {
	member: APIGuildMember | undefined
	size?: number
}

export function DiscordAvatar({ member, size }: DiscordAvatarProps) {
	const [animate, setAnimate] = useState(false)
	if (!member) return null
	if (!size) size = 35 // Default avatar size
	const name = getDisplayName(member)
	return (
		<div className="AvatarContainer">
			<img
				className="Avatar"
				src={getAvatar(member, 128, animate)}
				style={{ margin: 3.5, width: size, height: size }}
				alt={name}
				onMouseEnter={() => setAnimate(true)}
				onMouseLeave={() => setAnimate(false)}
			/>
			<div className="ToolTip">{name}</div>
		</div>
	)
}
