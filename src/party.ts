import PartySocket from 'partysocket'
import { discordSdk } from './services/discord.ts'

console.log(location)

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
export const conn = new PartySocket({
	host: location.origin + '/api',
	room: discordSdk.instanceId
})

console.log('party')

export enum PayloadType {
	PageUpdate,
	GetPage
}

export interface PayloadData {
	[PayloadType.PageUpdate]: {
		project: string
	}
	[PayloadType.GetPage]: null
}

export function sendPayload<T extends PayloadType>(type: T, ...args: PayloadData[T] extends null ? [] : [PayloadData[T]]) {
	conn.send(JSON.stringify({ type, data: args[0] }))
}
