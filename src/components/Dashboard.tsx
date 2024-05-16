import { Task } from '../types'
import { PieChart } from './PieChart'
import { taskStatuses } from '../types'

interface DashboardProps {
	tasks: Task[]
}

export const Dashboard = ({ tasks }: DashboardProps) => {
	return <PieChart label={'Tasks'} property={'status'} tasks={tasks} data={taskStatuses} />
}
