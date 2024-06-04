import { useState } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal)

interface Props {
	project: {
		id: string
		name: string
	}
}

function DeleteProject({ project }: Props) {
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async () => {
		// Confirm deletion dialog
		const result = await ReactSwal.fire({
			title: 'Are you sure?',
			text: `You are about to delete the project "${project.name}". This action cannot be undone.`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Delete',
			cancelButtonText: 'Cancel'
		})

		if (result.isConfirmed) {
			setIsDeleting(true)
			try {
				// Delete the project from Firestore
				await deleteDoc(doc(db, 'projects', project.id))

				// Automatically close the modal on success
				ReactSwal.fire({
					title: 'Deleted!',
					text: `The project "${project.name}" has been successfully deleted.`,
					icon: 'success',
					timer: 2000,
					showConfirmButton: false
				}).then(() => ReactSwal.clickConfirm())
			} catch (error) {
				console.error('Error deleting project:', error)
				ReactSwal.fire('Error', 'Failed to delete the project. Please try again.', 'error')
			} finally {
				setIsDeleting(false)
			}
		}
	}

	return (
		<div>
			<button className="delete-project-button" onClick={handleDelete} disabled={isDeleting}>
				Confirm Delete
			</button>
		</div>
	)
}

export default DeleteProject
