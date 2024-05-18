import { useEffect } from 'react'
import { Choice, Task } from '../../types.ts'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
	label: string
	property: keyof Task
	tasks: Task[]
	data: Choice[]
}

export function PieChart({ label, property, tasks, data }: PieChartProps) {
	console.log(label, property, tasks, data)

	useEffect(() => {
		console.log('tasks:', tasks)
		if (!tasks || tasks.length === 0) {
			console.log('Tasks array is empty or undefined')
			return
		}
		if (!(property in tasks[0])) {
			console.error(`Key ${property} not found in Task interface`)
			return
		}
	}, [tasks, property])

	return (
		<div className="pie-chart-container">
			{/* Parent container takes full width */}
			{!tasks || tasks.length === 0 ? (
				<div className="empty-tasks-message">
					<Doughnut
						data={{
							labels: ['No Tasks: Add some Tasks to see Pie Chart Visualization!', ''],
							datasets: [{ data: [1], borderWidth: 0, backgroundColor: ['#e0e0e0'] }]
						}}
						options={{ cutout: '80%', plugins: { tooltip: { enabled: false } } }}
					/>
				</div>
			) : (
				<div className="doughnut-wrapper">
					<Doughnut
						data={{
							labels: data.map((d: Choice) => d.label),
							datasets: [
								{
									label: label,
									data: data.map((d: Choice) => tasks.filter((task: Task) => (task[property] as unknown) === d.value).length),
									backgroundColor: data.map((d: Choice) => d.color),
									borderWidth: 0
								}
							]
						}}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							cutout: '45%',
							plugins: {
								legend: {
									display: true,
									position: 'left',
									align: 'center',
									labels: {
										usePointStyle: true
									}
								}
							}
						}}
					/>
				</div>
			)}
		</div>
	)
}

// import { Task, Choice } from '../types'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
// import { useEffect } from 'react'
// import { Doughnut } from 'react-chartjs-2'

// ChartJS.register(ArcElement, Tooltip, Legend)
// interface PieChartProps {
// 	label: string
// 	property: string // The object key to base chart off (eg 'priority')
// 	tasks: Task[]
// 	data: Choice[]
// }

// export function PieChart({ label, property, tasks, data }: PieChartProps) {
// 	console.log(label, property, tasks, data)
// 	useEffect(() => {
// 		console.log('tasks:', tasks)
// 		if (!tasks || tasks.length === 0) {
// 			console.log('Tasks array is empty or undefined')
// 			return
// 		}
// 		if (!((property as keyof Task) in tasks[0])) {
// 			console.error(`Key ${property} not found in Task interface`)
// 			return
// 		}
// 	})
// 	// console.log('Chart Data', chartData)
// 	return (
// 		<div>
// 			{!tasks || tasks.length === 0 ? (
// 				<div style={{ margin: '10px 5px', padding: '50px 10px', backgroundColor: 'black' }}>
// 					<p>No Tasks</p>
// 				</div>
// 			) : (
// 				<div style={{ justifyContent: 'center', alignItems: 'center', width: '50%', height: '50%', margin: 'auto' }}>
// 					<Doughnut
// 						data={{
// 							labels: data.map((d: Choice) => d.label),
// 							datasets: [
// 								{
// 									label: label,
// 									data: data.map((data: Choice) => {
// 										return tasks
// 											.map((task: Task) => task[property as keyof Task] as number)
// 											.filter((x: number) => x === data.value).length
// 									}),
// 									backgroundColor: data.map((d: Choice) => d.color),
// 									borderWidth: 0
// 								}
// 							]
// 						}}
// 						options={{ cutout: '45%' }}
// 					/>
// 				</div>
// 			)}
// 		</div>
// 	)
// }
