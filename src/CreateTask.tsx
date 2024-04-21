import { Fragment, ReactElement, useEffect, useState } from "react";
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

enum Priority {
    Urgent = 3,
    High = 2,
    Normal = 1,
    Low = 0,
}

// interface PriorityObj {
//     value: Priority,
//     label: string,
//     color: string,
// }

const priorities = [
    {value: Priority.Low, label: 'Low', color: 'lightgreen'},
    {value: Priority.Normal, label: 'Normal', color: 'yellow'}, 
    {value: Priority.High, label: 'High',  color: 'orange'},
    {value: Priority.Urgent, label: 'Urgent', color: 'crimson'},
]

export function CreateTask() {
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo)
    const [priority, setPriority] = useState<Priority>(Priority.Normal)
    const [assignees, setAssignees] = useState<string[]>([])
    const [users, setUsers] = useState<APIGuildMember[]>([])
    const [whichButtonClicked, setWhichButtonClicked] = useState<Priority>()

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
        {/* <Select
            isMulti = {false}
            name="task priority"
            options={priorities}
            placeholder="Select task priority..."
            onChange={(selected) => setPriority(selected!.value as Priority)}
            styles={selectStyles}
        /> */}
        <h3>Set Priority</h3>
        <div>
            {priorities.map(p => (
                <Fragment key={p.value}>
                    <button onClick={() => {
                        setPriority(p.value)
                        setWhichButtonClicked(p.value)
                    }}
                    style={{marginTop: 5, marginBottom: 5, marginLeft: 0, marginRight: 0, borderRadius: 0, paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24, color: (p.value === whichButtonClicked) ?  'black' : p.color, backgroundColor: (p.value === whichButtonClicked) ? p.color : ''}}>{p.label}</button>
                </Fragment>
            ))}
        </div>  
        <br></br>
        <Select
            isMulti = {false}
            name="task status"
            options={taskStatuses}
            placeholder="Select task status..."
            onChange={(selected) => setStatus(selected!.value as TaskStatus)}
            styles={selectStyles}
        />
        <h3>{priorities[priority].label}</h3>
        <button>Create Task</button>
    </div>
}