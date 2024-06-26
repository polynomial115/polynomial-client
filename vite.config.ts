import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), mkcert()],
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:1999',
				changeOrigin: true,
				secure: false,
				ws: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	}
})
