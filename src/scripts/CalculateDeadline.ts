import { Deadline } from '../types'

const day = 86400000 // day in ms

interface Props {
	deadlineType: Deadline
}

export default function calculateDeadline({ deadlineType }: Props) {
	const currentTime = Date.now()
	const finalTime = deadlineType === Deadline.Never ? 0 : currentTime + deadlineType * day
	// switch (deadlineType) {
	// 	case Deadline.Never: {
	// 		finalTime = 0
	// 		break
	// 	}
	// 	case Deadline.OneDay: {
	// 		finalTime = currentTime + day
	// 		break
	// 	}
	// 	case Deadline.TwoDays: {
	// 		finalTime = currentTime + day * 2
	// 		break
	// 	}
	// 	case Deadline.FourDays: {
	// 		finalTime = currentTime + day * 4
	// 		break
	// 	}
	// 	case Deadline.OneWeek: {
	// 		finalTime = currentTime + day * 7
	// 		break
	// 	}
	// 	case Deadline.TwoWeeks: {
	// 		finalTime = currentTime + day * 14
	// 		break
	// 	}
	// 	case Deadline.OneMonth: {
	// 		finalTime = currentTime + day * 28
	// 		break
	// 	}
	// }
	return finalTime
}

export const DeadlineToString = (deadline: number): string => {
	if (deadline === 0) {
		return 'Never'
	}
	return new Date(deadline).toUTCString()
}
