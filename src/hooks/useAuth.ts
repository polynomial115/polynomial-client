import { createContext, useContext } from 'react'
import { AuthData } from '../providers/auth'
export const AuthContext = createContext<AuthData>(null!)

export function useAuth() {
	return useContext(AuthContext)
}
