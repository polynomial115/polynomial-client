import { Task } from '../types'
import { PieChart } from './PieChart'
import { TaskList } from './TaskList'
import { taskStatuses } from '../types'
import '../styles/dashboardStyle.css'

interface DashboardProps {
	tasks: Task[]
}

export const Dashboard = ({ tasks }: DashboardProps) => {
	return (
		<div className="dashboard-container">
			<div className="pie-chart-container">
				<PieChart label="Tasks" property="status" tasks={tasks} data={taskStatuses} />
			</div>
			<div className="task-list-container">
				<TaskList tasks={tasks} displayCount={5} />
			</div>
		</div>
	)
}
