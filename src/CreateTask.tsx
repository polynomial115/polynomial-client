import {useEffect, useState} from "react";
import type {APIGuildMember} from 'discord-api-types/v10';
import {discordSdk} from "./discord";
import Select from 'react-select';
import {styles} from './styles';
import {selectStyles} from "./select-styles";
import {db} from "./firebase";
import {addDoc, collection} from 'firebase/firestore';

enum TaskStatus {
    ToDo = 4,
    Backlog = 3,
    InProgress = 2,
    Completed = 1
}


const taskStatuses = [
    {value: TaskStatus.ToDo, label: 'To Do'},
    {value: TaskStatus.Backlog, label: 'Backlog'},
    {value: TaskStatus.InProgress, label: 'In Progress'},
    {value: TaskStatus.Completed, label: 'Completed'}
];

enum Priority {
    Urgent = 5,
    High = 4,
    Normal = 3,
    Low = 2,
    Others = 1
}

const priorities = [
    {value: Priority.Urgent, label: 'Urgent'},
    {value: Priority.High, label: 'High'},
    {value: Priority.Normal, label: 'Normal'},
    {value: Priority.Low, label: 'Low'},
    {value: Priority.Others, label: 'Other'}
];

export function CreateTask() {
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Normal);
    const [assignees, setAssignees] = useState<string[]>([]);
    const [users, setUsers] = useState<APIGuildMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [taskName, setTaskName] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`/api/members/${discordSdk.guildId}`)
            .then(response => response.json())
            .then(data => {
                try {
                    if (Array.isArray(data)) {
                        setUsers(data);
                    } else {
                        throw new Error("Data is not an array");
                    }
                } catch (error) {
                    console.error("Error processing data:", error);
                    setError("Failed to process user data.");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to load users:", error);
                setError('Could not load user data. Continue without selecting assignees.');
                setLoading(false);
            });

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const taskData = {
            name: taskName,
            status,
            priority,
            assignees
        };
        try {
            const docRef = await addDoc(collection(db, "tasks"), taskData);
            setError("Created task successfully.");
        } catch (error) {
            console.error("Error adding document: ", error);
            setError("Failed to create task.");
        }
    };
    const isFormValid = () => taskName.trim().length > 0;

    return (
        <div style={{height: 'auto', padding: '20px'}}>
            <h2>Create Task</h2>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="task-name">Task name:</label>
                <input
                    id="task-name"
                    style={styles.textBox}
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required={true}
                    placeholder="Enter task name"
                />
                <br/>
                <Select
                    isMulti={true}
                    name="assignees"
                    options={users.map(u => ({value: u.user!.username, label: u.user!.username}))}
                    placeholder="Select assignees..."
                    onChange={(selected) => setAssignees(selected.map(e => e.value))}
                    styles={selectStyles}
                    isDisabled={!!error}
                />
                <br/>
                <Select
                    isMulti={false}
                    name="task priority"
                    options={priorities}
                    placeholder="Select task priority..."
                    onChange={(selected) => setPriority(selected!.value as Priority)}
                    styles={selectStyles}
                />
                <br/>
                <Select
                    isMulti={false}
                    name="task status"
                    options={taskStatuses}
                    placeholder="Select task status..."
                    onChange={(selected) => setStatus(selected!.value as TaskStatus)}
                    styles={selectStyles}
                />
                <button type="submit">Create Task</button>  {/* disabled={!isFormValid()} */}
            </form>
        </div>
    );
}