export interface Project {
	id: string // Should be unique for every project
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

export enum Deadline {
	Never = 0,
	OneDay = 1,
	TwoDays = 2,
	FourDays = 4,
	OneWeek = 7,
	TwoWeeks = 14,
	OneMonth = 28
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
	{ value: Priority.Low, label: '🔵 Low', color: 'lightgreen' },
	{ value: Priority.Normal, label: '🟢 Normal', color: 'yellow' },
	{ value: Priority.High, label: '🟡 High', color: 'orange' },
	{ value: Priority.Urgent, label: '🔴 Urgent', color: 'crimson' }
]

export const deadlines: Choice[] = [
	{ value: Deadline.Never, label: 'Never', color: 'white' },
	{ value: Deadline.OneDay, label: 'In one day', color: 'white' },
	{ value: Deadline.TwoDays, label: 'In two days', color: 'white' },
	{ value: Deadline.FourDays, label: 'In four days', color: 'white' },
	{ value: Deadline.OneWeek, label: 'In one week', color: 'white' },
	{ value: Deadline.TwoWeeks, label: 'In two weeks', color: 'white' },
	{ value: Deadline.OneMonth, label: 'In one month', color: 'white' }
]

export interface Task {
	id: string
	assignees: string[]
	name: string
	description: string
	priority: Priority
	status: TaskStatus
	deadline: Deadline
}

export enum FetchStatus {
	Loading,
	Failed,
	Succeeded
}
