import { Task } from '../types'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase.ts'
import { useState } from 'react'
interface Props {
	projectId: string
	tasks: Task[]
	delTask: Task
}

export function DeleteTask({ projectId, tasks, delTask }: Props) {
	const projectDoc = doc(db, 'projects', projectId)
	const [deleted, setDeleted] = useState(false)
	const [ok, setok] = useState(false)
	// const []
	const handleYes = async () => {
		await updateDoc(projectDoc, { tasks: tasks.filter(t => t.id != delTask.id) })
		setDeleted(true)
	}
	// if deleted
	const handleNo = () => {
		setok(true)
	}
	if (deleted) {
		return <div>Successful</div>
	}
	if (ok) {
		return <div>ok</div>
	}
	return (
		<div>
			<h2>Are you sure you want to delete {delTask.name}?</h2> <br />
			<button onClick={() => handleYes()}> Yes </button>
			<button onClick={() => handleNo()}> No </button>
		</div>
	)
}
