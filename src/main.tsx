import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { AuthProvider } from './providers/auth.tsx'
import { GuildMembersProvider } from './providers/guildMembers.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<GuildMembersProvider>
				<App />
			</GuildMembersProvider>
		</AuthProvider>
	</React.StrictMode>
)
