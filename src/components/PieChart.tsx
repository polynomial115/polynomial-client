import { Task, Choice } from '../types'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)
interface PieChartProps {
	label: string
	property: string // The object key to base chart off (eg 'priority')
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
		if (!((property as keyof Task) in tasks[0])) {
			console.error(`Key ${property} not found in Task interface`)
			return
		}
	})
	// console.log('Chart Data', chartData)
	return (
		<div>
			{!tasks || tasks.length === 0 ? (
				<div style={{ margin: '10px 5px', padding: '40px 25px', backgroundColor: 'black' }}>
					<p>Add some Tasks to see Pie Chart Visualization!</p>
				</div>
			) : (
				<div style={{ justifyContent: 'center', alignItems: 'center', width: '50%', height: '50%', margin: 'auto' }}>
					<Doughnut
						data={{
							labels: data.map((d: Choice) => d.label),
							datasets: [
								{
									label: label,
									data: data.map((data: Choice) => {
										return tasks
											.map((task: Task) => task[property as keyof Task] as number)
											.filter((x: number) => x === data.value).length
									}),
									backgroundColor: data.map((d: Choice) => d.color),
									borderWidth: 0
								}
							]
						}}
						options={{
							cutout: '45%'
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
