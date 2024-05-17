import { Choice, Task } from '../types'
import { useEffect } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { CardColumn } from './CardColumn'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import '../styles/CardView.css'

interface CardViewProps {
	projectId: string
	tasks: Task[]
	columns: Choice[]
	property: keyof Task
}

export const CardView = ({ projectId, tasks, columns, property }: CardViewProps) => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	async function handleDragEnd(event: DragEndEvent) {
		if (event.over) {
			const taskId = event.active.id
			const newValue = event.over.id
			await updateDoc(doc(db, 'projects', projectId), {
				tasks: tasks.map(task => (task.id === taskId ? { ...task, [property]: newValue } : task))
			})
		}
	}

	return (
		<DndContext onDragEnd={handleDragEnd} autoScroll={false}>
			<div className="card-view">
				{columns.map(card => (
					<CardColumn
						key={card.value}
						id={card.value}
						title={card.label}
						color={card.color}
						numCols={columns.length}
						tasks={tasks.filter(task => (task[property] as number) === card.value)}
					/>
				))}
			</div>
		</DndContext>
	)
}
