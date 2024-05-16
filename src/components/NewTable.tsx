import React, { useState } from 'react'
import DataTable from 'react-data-table-component'

import { Project } from '../types'
import { taskStatuses } from './TaskStatuses'
import { useParticipants } from '../hooks/useParticipants'

interface Props {
	project: Project
}

const columns = [
	{
		name: 'Title',
		selector: row => row.title
	},
	{
		name: 'Year',
		selector: row => row.year
	}
]

const data = [
	{
		id: 1,
		title: 'Beetlejuice',
		year: '1988'
	},
	{
		id: 2,
		title: 'Ghostbusters',
		year: '1984'
	}
]

function NewTable({ project }: Props) {
	const { tasks } = project
	// const participants = useParticipants()
	// const [details, setDetails] = useState<number[]>([])

	// const taskData = tasks.map(task => ({
	// 	id: task.id,
	// 	name: task.name,
	// 	status: taskStatuses[task.status].label,
	// 	assignees: task.assignees.join(', '),
	// 	deadline: new Date(task.deadline).toUTCString()
	// }))

	const handleChange = ({ selectedRows }) => {
		// You can set state or dispatch with something like Redux so we can use the retrieved data
		console.log('Selected Rows: ', selectedRows)
	}

	return (
		<DataTable className="ActualTable" pagination columns={columns} data={data} selectableRows onSelectedRowsChange={handleChange} theme="dark" />
	)
}

export default NewTable
