import PartySocket from 'partysocket'
import { discordSdk } from './discord'

console.log(location)

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
export const conn = new PartySocket({
	host: location.origin + '/api',
	room: discordSdk.instanceId
})

console.log('party')
