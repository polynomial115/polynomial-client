import { Task } from '../../types.ts'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase.ts'
import Swal from 'sweetalert2'

interface Props {
	projectId: string
	tasks: Task[]
	delTask: Task
}

export function DeleteTask({ projectId, tasks, delTask }: Props) {
	const projectDoc = doc(db, 'projects', projectId)

	const handleYes = async () => {
		await updateDoc(projectDoc, { tasks: tasks.filter(t => t.id !== delTask.id) })
		Swal.fire({
			title: `Deleted Task ${delTask.name}`,
			background: '#202225',
			color: 'white',
			icon: 'success',
			timer: 2000,
			showConfirmButton: false
		})
	}

	return (
		<div>
			<h2>Are you sure you want to delete {delTask.name}?</h2> <br />
			<button onClick={() => handleYes()}> Yes </button>
			<button onClick={() => Swal.close()}> No </button>
		</div>
	)
}
