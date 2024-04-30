import { IdTokenResult, getAuth, getIdTokenResult, signInWithCustomToken } from 'firebase/auth'
import { discordSdk } from '../services/discord.ts'
import '../services/firebase.ts'
import { useEffect, useRef, useState } from 'react'
import { AuthContext } from '../hooks/useAuth.ts'

const firebaseAuth = getAuth()

interface LoginResponse {
	discordToken: string
	firebaseToken: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [auth, setAuth] = useState<IdTokenResult | null>(null)
	const [loadingState, setLoadingState] = useState('Loading...')
	const settingUp = useRef(false)

	useEffect(() => {
		async function setup() {
			// Wait for READY payload from the discord client
			await discordSdk.ready()

			setLoadingState('Connecting to Discord...')

			// Pop open the OAuth permission modal and request for access to scopes listed in scope array below
			const { code } = await discordSdk.commands.authorize({
				client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
				response_type: 'code',
				state: '',
				prompt: 'none',
				scope: ['identify', 'guilds', 'guilds.members.read']
			})

			setLoadingState('Logging in...')

			// Retrieve an access_token from your application's server
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code,
					guild: discordSdk.guildId
				})
			})
			const { discordToken, firebaseToken } = (await response.json().catch(() => setLoadingState('Failed to log in'))) as LoginResponse

			console.log({ discordToken, firebaseToken })

			setLoadingState('Authenticating...')

			// Authenticate with Discord client (using the access_token)
			await discordSdk.commands.authenticate({
				access_token: discordToken
			})

			setLoadingState('Connecting to Firebase...')

			const user = await signInWithCustomToken(firebaseAuth, firebaseToken)
			const data = await getIdTokenResult(user.user)
			setAuth(data)
		}
		console.log(settingUp.current)
		if (!settingUp.current) {
			settingUp.current = true
			setup()
		}
	}, [])

	if (!auth) return loadingState

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}