import { Project } from '../types'
import { PieChart } from './task/PieChart'
import { TableComponent } from './task/TableComponent'
import { taskStatuses } from '../types'
import '../styles/dashboardStyle.css'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'

interface DashboardProps {
	project: Project
}

export const Dashboard = ({ project }: DashboardProps) => {
	useScrollToTop()

	if (!project.tasks.length)
		return (
			<div className="no-tasks">
				<FontAwesomeIcon icon={faFolderOpen} size="10x" />
				<h2>This project is empty. Add some tasks to get started!</h2>
			</div>
		)

	return (
		<div className="dashboard-container">
			<div className="pie-chart-container">
				<PieChart label="Tasks" property="status" tasks={project.tasks} data={taskStatuses} />
			</div>
			<div className="task-list-container">
				<h2>Top Tasks</h2>
				<TableComponent project={project} mini={true} />
			</div>
		</div>
	)
}
