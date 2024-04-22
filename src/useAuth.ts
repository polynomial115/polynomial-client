import { IdTokenResult } from 'firebase/auth'
import { createContext, useContext } from 'react'
export const AuthContext = createContext<IdTokenResult>(null!)

export function useAuth() {
	return useContext(AuthContext)
}
