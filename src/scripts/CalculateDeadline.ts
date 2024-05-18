import { Deadline } from '../types'

const deadlineToDays = {
	[Deadline.OneDay]: 1,
	[Deadline.TwoDays]: 2,
	[Deadline.FourDays]: 4,
	[Deadline.OneWeek]: 7,
	[Deadline.TwoWeeks]: 14,
	[Deadline.OneMonth]: 30
}

interface Props {
	deadlineType: Deadline
}

const calculateDeadline = ({ deadlineType }: Props): Date | null => {
	if (deadlineType === Deadline.Never) {
		return null
	}

	const days = deadlineToDays[deadlineType]
	if (days === undefined) {
		console.warn('Invalid deadline value')
		return null
	}

	const currentDate = new Date()
	currentDate.setDate(currentDate.getDate() + days)
	return currentDate
}

export default calculateDeadline
