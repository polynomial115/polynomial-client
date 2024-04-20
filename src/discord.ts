import { DiscordSDK, patchUrlMappings } from '@discord/embedded-app-sdk'

export const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)

if (!location.href.includes('localhost')) {
	patchUrlMappings([
		{
			prefix: '/googleapis/{subdomain}',
			target: '{subdomain}.googleapis.com'
		}
	])
}
