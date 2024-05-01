export interface Project {
	id: string
	guildId: string
	name: string
	managerRoles: string[]
	memberRoles: string[]
	managerUsers: string[]
	memberUsers: string[]
	tasks: Task[]
	timestamp: string
}

export enum TaskStatus {
	ToDo = 0,
	Backlog = 1,
	InProgress = 2,
	Completed = 3
}

export enum Priority {
	Urgent = 3,
	High = 2,
	Normal = 1,
	Low = 0
}

export interface Choice {
	value: number
	label: string
	color: string
}

export const taskStatuses: Choice[] = [
	{ value: TaskStatus.ToDo, label: 'To Do', color: 'crimson' },
	{ value: TaskStatus.Backlog, label: 'Backlog', color: 'orange' },
	{ value: TaskStatus.InProgress, label: 'In Progress', color: 'lightblue' },
	{ value: TaskStatus.Completed, label: 'Completed', color: 'lightgreen' }
]

export const priorities: Choice[] = [
	{ value: Priority.Low, label: 'Low', color: 'lightgreen' },
	{ value: Priority.Normal, label: 'Normal', color: 'yellow' },
	{ value: Priority.High, label: 'High', color: 'orange' },
	{ value: Priority.Urgent, label: 'Urgent', color: 'crimson' }
]

export interface Task {
	id: string
	assignees: string[]
	name: string
	priority: Priority
	status: TaskStatus
}

export enum FetchStatus {
	Loading,
	Failed,
	Succeeded
}
