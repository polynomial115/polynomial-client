import { Deadline } from '../types'

const day = 86400000 // day in ms

export default function calculateDeadline(deadlineType: Deadline) {
	const currentTime = Date.now()
	const finalTime = deadlineType === Deadline.Never ? 0 : currentTime + deadlineType * day
	return finalTime
}

export const DeadlineToString = (deadline: Deadline): string => {
	if (deadline === Deadline.Never) {
		return 'Never'
	}
	return new Date(calculateDeadline(deadline)).toUTCString()
}
