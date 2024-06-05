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

const calculateDeadline = ({ deadlineType }: Props): number | null => {
	if (deadlineType === Deadline.Never) {
		return null
	}

	const days = deadlineToDays[deadlineType]

	const currentDate = Date.now()
	const finalDate = currentDate + days * 86400000
	return finalDate
}

export default calculateDeadline
