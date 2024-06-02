import { Task, Project } from '../types'
import { PieChart } from './task/PieChart'
import { TableComponent } from './task/TableComponent'
import { taskStatuses } from '../types'
import '../styles/dashboardStyle.css'

interface DashboardProps {
	tasks: Task[]
	project: Project
}

export const Dashboard = ({ tasks, project }: DashboardProps) => {
	window.scrollTo(0, 0)

	return (
		<div className="dashboard-container">
			<div className="pie-chart-container">
				<PieChart label="Tasks" property="status" tasks={tasks} data={taskStatuses} />
			</div>
			<div className="task-list-container">
				<TableComponent project={project} />
			</div>
		</div>
	)
}
