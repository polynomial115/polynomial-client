import { useEffect, useState } from "react";
import type { APIRole, APIGuildMember } from 'discord-api-types/v10'
import { discordSdk } from "./discord";
import Select from 'react-select';
import { styles } from './App.tsx'

enum TaskStatus {
    ToDo = 'To Do',
    Backlog = 'Backlog',
    InProgress = 'In Progress',
    Completed = 'Completed'
}

enum Priority{
    Urgent = 5,
    High = 4,
    Normal = 3,
    Low = 2,
    Others = 1
}

export function CreateTask() {
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo)
    const [priority, setPriority] = useState<Priority>(Priority.Normal)
    const [assignees, setAssignees] = useState<APIGuildMember[]>([])
    const [users, setUsers] = useState<APIGuildMember[]>([])

    useEffect(() => {
		fetch(`/api/members/${discordSdk.guildId}`).then(r => r.json()).then(setUsers)
	}, [])
    
    return <div style={{height: 400}}>
        <h2>Create Task</h2>
        <form>Task name: <input style={styles.textBox} type="text"></input></form>
        <br></br>
        <Select 
            isMulti
            name="roles"
            options={users.map(u => ({value: u.user!.username, label: u.user!.username}))}
            placeholder="Select assignees..."
        />
        <h3>ahahahah :3</h3>
    </div>
}



