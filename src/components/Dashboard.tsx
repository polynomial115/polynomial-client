import { Task } from '../types'
import { PieChart } from './PieChart'
import { useEffect } from 'react'
import { taskStatuses } from '../types'

interface DashboardProps {
	tasks: Task[]
}

export const Dashboard = ({ tasks }: DashboardProps) => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return <PieChart label={'Tasks'} property={'status'} tasks={tasks} data={taskStatuses} />
}
