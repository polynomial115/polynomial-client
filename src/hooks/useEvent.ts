import { useEffect } from 'react'
import { conn, Payload, PayloadData, payloadIsType, PayloadType } from '../party'

export function useEvent<T extends PayloadType>(event: T, func: (data: PayloadData[T]) => void) {
	useEffect(() => {
		const callback = (message: MessageEvent<string>) => {
			const payload = JSON.parse(message.data) as Payload
			if (payloadIsType(payload, event)) {
				func(payload.data)
			}
		}
		conn.addEventListener('message', callback)
		return () => conn.removeEventListener('message', callback)
	})
}
