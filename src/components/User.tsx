import { useState } from 'react'
import { getAvatar, getDisplayName } from '../scripts/memberDisplay'
import type { GuildMember } from '../hooks/useGuildMembers'

interface DiscordAvatarProps {
	member: GuildMember | undefined
	size?: number
	toolTipLeft?: boolean
}

export function DiscordAvatar({ member, size, toolTipLeft }: DiscordAvatarProps) {
	const [animate, setAnimate] = useState(false)
	if (!member) return null
	if (!size) size = 35 // Default avatar size
	const name = getDisplayName(member)
	return (
		<div className="avatar-container">
			<img
				className="avatar"
				src={getAvatar(member, 128, animate)}
				style={{ width: size, height: size }}
				alt={name}
				onMouseEnter={() => setAnimate(true)}
				onMouseLeave={() => setAnimate(false)}
			/>
			<div className={`tooltip${toolTipLeft ? ' tooltip-left' : ''}`}>{name}</div>
		</div>
	)
}
