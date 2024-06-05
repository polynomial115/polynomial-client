import { useEffect, useState } from 'react'
import { discordSdk } from '../services/discord.ts'
import { type EventPayloadData, Events } from '@discord/embedded-app-sdk'

type EventData = EventPayloadData<Events.ACTIVITY_LAYOUT_MODE_UPDATE>

export enum LayoutMode {
	Unhandled = -1,
	Focused,
	PIP,
	Grid
}

export function useLayoutMode() {
	const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.Focused)

	useEffect(() => {
		const updateLayoutMode = (e: EventData) => {
			setLayoutMode(e.layout_mode)
		}

		discordSdk.subscribe(Events.ACTIVITY_LAYOUT_MODE_UPDATE, updateLayoutMode)
		return () => {
			discordSdk.unsubscribe(Events.ACTIVITY_LAYOUT_MODE_UPDATE, updateLayoutMode)
		}
	}, [])

	return layoutMode
}
