import { useEffect, useState } from "react";
import type { APIGuildMember } from 'discord-api-types/v10'
import { discordSdk } from "./discord";
import Select from 'react-select';
import { styles } from './styles'
import { selectStyles } from "./select-styles";

enum TaskStatus {
    ToDo = 4,
    Backlog = 3,
    InProgress = 2,
    Completed = 1
}

const taskStatuses = [
    { value: TaskStatus.ToDo, label: 'To Do' },
    { value: TaskStatus.Backlog, label: 'Backlog' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Completed, label: 'Completed' }
]

enum Priority{
    Urgent = 5,
    High = 4,
    Normal = 3,
    Low = 2,
    Others = 1
}

const priorities = [
    { value: Priority.Urgent , label: 'Urgent'},
    { value: Priority.High , label: 'High'},
    { value: Priority.Normal , label: 'Normal'},
    { value: Priority.Low , label: 'Low'},
    { value: Priority.Others , label: 'Other'}
]

export function CreateTask() {
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo)
    const [priority, setPriority] = useState<Priority>(Priority.Normal)
    const [assignees, setAssignees] = useState<string[]>([])
    const [users, setUsers] = useState<APIGuildMember[]>([])

    useEffect(() => {
		fetch(`/api/members/${discordSdk.guildId}`).then(r => r.json()).then(setUsers)
	}, [])
    
    return <div style={{height: 400}}>
        <h2>Create Task</h2>
        <form>Task name: <input style={styles.textBox} type="text"></input></form>
        <br></br>
        <Select
            isMulti = {true}
            name="assignees"
            options={users.map(u => ({value: u.user!.username, label: u.user!.username}))}
            placeholder="Select assignees..."
            onChange={(selected) => setAssignees(selected.map(e => e.value as string))}
            styles={selectStyles}
        />
        <br></br>
        <Select
            isMulti = {false}
            name="task priority"
            options={priorities}
            placeholder="Select task priority..."
            onChange={(selected) => setPriority(selected!.value as Priority)}
            styles={selectStyles}
        />
        <br></br>
        <Select
            isMulti = {false}
            name="task status"
            options={taskStatuses}
            placeholder="Select task status..."
            onChange={(selected) => setStatus(selected!.value as TaskStatus)}
            styles={selectStyles}
        />
        <h3>A A :3</h3>
    </div>
}



