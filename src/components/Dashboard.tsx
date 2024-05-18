import { Task } from '../types'
import { PieChart } from './task/PieChart.tsx'
// import { TableComponent } from './task/TableComponent.tsx'
import { taskStatuses } from '../types'
import '../styles/dashboardStyle.css'

interface DashboardProps {
	tasks: Task[]
}

export const Dashboard = ({ tasks }: DashboardProps) => {
	window.scrollTo(0, 0)
	return (
		<div className="dashboard-container">
			<div className="pie-chart-container">
				<PieChart label="Tasks" property="status" tasks={tasks} data={taskStatuses} />
			</div>
			<div className="task-list-container">
				<p> There is supposed to be a table here but noone answered my questiuon</p>
			</div>
		</div>
	)
}
