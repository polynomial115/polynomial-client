import { patchUrlMappings } from '@discord/embedded-app-sdk'
import { getAuth, getIdTokenResult, signInWithCustomToken } from 'firebase/auth'
import { discordSdk } from './discord'
import './firebase'

const auth = getAuth()

patchUrlMappings([
	{
		prefix: '/googleapis/{subdomain}',
		target: '{subdomain}.googleapis.com'
	}
])

async function setup() {
	// Wait for READY payload from the discord client
	await discordSdk.ready()

	// Pop open the OAuth permission modal and request for access to scopes listed in scope array below
	const {code} = await discordSdk.commands.authorize({
		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
		response_type: 'code',
		state: '',
		prompt: 'none',
		scope: ['identify', 'guilds', 'guilds.members.read'],
	})

	console.log(code)

	// Retrieve an access_token from your application's server
	const response = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		code,
		guild: discordSdk.guildId
	})
	})
	const { discordToken, firebaseToken } = await response.json()

	console.log({ discordToken, firebaseToken })

	// Authenticate with Discord client (using the access_token)
	await discordSdk.commands.authenticate({
		access_token: discordToken
	})

	console.log('test test')

	const user = await signInWithCustomToken(auth, firebaseToken)
	console.log(user)
	const data = await getIdTokenResult(user.user)
	console.log('tokenresult', data)
}

await setup()
