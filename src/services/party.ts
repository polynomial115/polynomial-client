import PartySocket from 'partysocket'
import { discordSdk } from './discord.ts'

export const conn = new PartySocket({
	host: location.origin + '/api',
	room: discordSdk.instanceId
})

export enum PayloadType {
	PageUpdate,
	GetPage
}

export enum ProjectView {
	Overview,
	Board,
	TaskList
}

export interface PayloadData {
	[PayloadType.PageUpdate]: {
		project: string
		projectView: ProjectView
	}
	[PayloadType.GetPage]: undefined
}

export interface Payload<T extends PayloadType = PayloadType> {
	type: T
	data: PayloadData[T]
}

export function payloadIsType<T extends PayloadType>(payload: Payload, type: T): payload is Payload<T> {
	return payload.type === type
}

export function sendPayload<T extends PayloadType>(type: T, ...args: PayloadData[T] extends undefined ? [] : [PayloadData[T]]) {
	conn.send(JSON.stringify({ type, data: args[0] } satisfies Payload))
}
