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
		<div className="doughnut-wrapper">
			<Doughnut
				data={{
					labels: data.map((d: Choice) => ` ${d.label}  `),
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
								color: 'white',
								font: {
									family: 'Helvetica',
									size: 15
								},
								usePointStyle: true
							},
							onClick: () => undefined
						}
					}
				}}
			/>
		</div>
	)
}
