import { Project } from '../types'
import { PieChart } from './task/PieChart'
import { TableComponent } from './task/TableComponent'
import { taskStatuses } from '../types'
import '../styles/dashboardStyle.css'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'

interface DashboardProps {
	project: Project
}

export const Dashboard = ({ project }: DashboardProps) => {
	const { tasks } = project

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	if (!tasks.length)
		return (
			<div className="no-tasks">
				<FontAwesomeIcon icon={faFolderOpen} size="10x" />
				<h2>This project is empty. Add some tasks to get started!</h2>
			</div>
		)

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
