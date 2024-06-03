export interface Project {
	id: string // Should be unique for every project
	guildId: string
	name: string
	managerRoles: string[]
	memberRoles: string[]
	managerUsers: string[]
	memberUsers: string[]
	tasks: Task[]
	notificationsChannel?: string | null
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
	FourDays = 3,
	OneWeek = 4,
	TwoWeeks = 5,
	OneMonth = 6
}

export interface Choice {
	value: number
	label: string
	color: string
}

export const taskStatuses = [
	{ value: TaskStatus.Backlog, label: 'Backlog', color: 'orange' },
	{ value: TaskStatus.ToDo, label: 'To Do', color: 'crimson' },
	{ value: TaskStatus.InProgress, label: 'In Progress', color: 'lightblue' },
	{ value: TaskStatus.Completed, label: 'Completed', color: 'lightgreen' }
] satisfies Choice[]

export const priorities = [
	{ value: Priority.Low, label: '🔵 Low', color: 'lightblue' },
	{ value: Priority.Normal, label: '🟢 Normal', color: 'lightgreen' },
	{ value: Priority.High, label: '🟡 High', color: 'yellow' },
	{ value: Priority.Urgent, label: '🔴 Urgent', color: 'red' }
] satisfies Choice[]

export const deadlines = [
	{ value: Deadline.Never, label: 'Never', color: 'white' },
	{ value: Deadline.OneDay, label: 'in one day', color: 'white' },
	{ value: Deadline.TwoDays, label: 'in two days', color: 'white' },
	{ value: Deadline.FourDays, label: 'in four days', color: 'white' },
	{ value: Deadline.OneWeek, label: 'in one week', color: 'white' },
	{ value: Deadline.TwoWeeks, label: 'in two weeks', color: 'white' },
	{ value: Deadline.OneMonth, label: 'in one month', color: 'white' }
] satisfies Choice[]

function getChoice<T extends number>(choices: Choice[]) {
	return (value: T) => choices.find(c => c.value === value)!
}

export const getStatus = getChoice<TaskStatus>(taskStatuses)
export const getPriority = getChoice<Priority>(priorities)
export const getDeadline = getChoice<Deadline>(deadlines)

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
