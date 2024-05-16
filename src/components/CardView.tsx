import { Choice, Task } from '../types'
import { useEffect } from 'react'
interface CardViewProps {
	tasks: Task[]
	cards: Choice[]
	property: string
}

export const CardView = ({ tasks, cards, property }: CardViewProps) => {
	// useEffect(() => {
	// 	console.log('tasks:', tasks)
	// 	if (!tasks || tasks.length === 0) {
	// 		console.log('Tasks array is empty or undefined')
	// 		return
	// 	}
	// 	if (!((property as keyof Task) in tasks[0])) {
	// 		console.error(`Key ${property} not found in Task interface`)
	// 		return
	// 	}
	// })
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<div style={{ display: 'flex', fontWeight: 100, flexDirection: 'row', height: '50vh' }}>
			{cards.map((card: Choice) => (
				<div
					key={card.label}
					style={{
						backgroundColor: card.color,
						borderRadius: 10,
						borderWidth: 10,
						borderColor: 'black',
						width: `${100 / cards.length}%`,
						margin: 10
					}}
				>
					<h2 style={{ margin: 12 }}>{card.label}</h2>
					{tasks
						.filter(task => (task[property as keyof Task] as number) === card.value)
						.map((task: Task) => (
							<div
								style={{
									fontWeight: 500,
									margin: 0
									// opacity: 0.5,
									// maxWidth: '75%',
									// display: 'flex',
									// justifyContent: 'center'
								}}
								key={task.id}
							>
								<p style={{ margin: 3, padding: 3 }}>{task.name}</p>
							</div>
						))}
				</div>
			))}
		</div>
	)
}
