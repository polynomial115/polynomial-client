import { useEffect, useState } from 'react'
import { discordSdk } from '../services/discord.ts'
import { type EventPayloadData, Events } from '@discord/embedded-app-sdk'

type EventData = EventPayloadData<Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE>

export function useParticipants() {
	const [participants, setParticipants] = useState<EventData['participants']>([])

	useEffect(() => {
		const updateParticipants = (e: EventData) => setParticipants(e.participants)

		discordSdk.commands.getInstanceConnectedParticipants().then(updateParticipants)

		discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants)
		return () => {
			discordSdk.unsubscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants)
		}
	}, [])

	return participants
}
