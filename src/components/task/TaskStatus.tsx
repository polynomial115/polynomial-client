import { Choice, TaskStatus } from '../../types.ts'

export const taskStatus: Choice[] = [
	{ value: TaskStatus.ToDo, label: 'To Do', color: 'crimson' },
	{ value: TaskStatus.Backlog, label: 'Backlog', color: 'orange' },
	{ value: TaskStatus.InProgress, label: 'In Progress', color: 'lightblue' },
	{ value: TaskStatus.Completed, label: 'Completed', color: 'lightgreen' }
]