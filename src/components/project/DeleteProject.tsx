import { useState } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swal = withReactContent(Swal)

interface Props {
	project: {
		id: string
		name: string
	}
	closeProject: () => void
}

function DeleteProject({ project, closeProject }: Props) {
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			// Delete the project from Firestore
			await deleteDoc(doc(db, 'projects', project.id))
			closeProject()
			// Notify success and close modal
			swal.fire({
				title: 'Deleted!',
				background: '#202225',
				color: 'white',
				text: `The project "${project.name}" has been successfully deleted.`,
				icon: 'success',
				timer: 2000,
				showConfirmButton: false
			})
		} catch (error) {
			console.error('Error deleting project:', error)
			swal.fire('Error', 'Failed to delete the project. Please try again.', 'error')
			setIsDeleting(false)
		}
	}

	return (
		<div>
			<p>Are you sure you want to delete the project {project.name}? This action cannot be undone.</p>
			<button className="delete-project-button" onClick={handleDelete} disabled={isDeleting}>
				Delete Project
			</button>
			<button className="cancel-button" onClick={() => Swal.close()}>
				Cancel
			</button>
		</div>
	)
}

export default DeleteProject
