import { Choice, Project, Task } from '../../types.ts'
import { useEffect } from 'react'
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { CardColumn } from '../CardColumn.tsx'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'
import '../../styles/CardView.css'

interface CardViewProps {
	project: Project
	columns: Choice[]
	property: keyof Task
}

export const CardView = ({ project, columns, property }: CardViewProps) => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	async function handleDragEnd(event: DragEndEvent) {
		if (event.over) {
			const taskId = event.active.id
			const newValue = event.over.id
			await updateDoc(doc(db, 'projects', project.id), {
				tasks: project.tasks.map(task => (task.id === taskId ? { ...task, [property]: newValue } : task))
			})
		}
	}

	const pointerSensor = useSensor(PointerSensor, {
		activationConstraint: {
			distance: 0.01
		}
	})
	const mouseSensor = useSensor(MouseSensor)
	const touchSensor = useSensor(TouchSensor)
	const keyboardSensor = useSensor(KeyboardSensor)

	const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor, pointerSensor)

	return (
		<DndContext onDragEnd={handleDragEnd} autoScroll={false} sensors={sensors}>
			<div className="card-view">
				{columns.map(card => (
					<CardColumn
						key={card.value}
						id={card.value}
						title={card.label}
						color={card.color}
						numCols={columns.length}
						tasks={project.tasks.filter(task => (task[property] as number) === card.value)}
						project={project}
					/>
				))}
			</div>
		</DndContext>
	)
}
