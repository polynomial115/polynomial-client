import {FormEvent, Fragment, useEffect, useState} from "react";
import {discordSdk} from "./discord";
import Select from 'react-select';
import {styles} from './styles';
import {selectStyles} from "./select-styles";
import {db} from "./firebase";
import {addDoc, collection} from 'firebase/firestore';
import { APIGuildMember } from "discord-api-types/v10";

interface ChoiceButtonProperties {
    value: number
    label: string
    color: string
}

enum TaskStatus {
    ToDo = 0,
    Backlog = 1,
    InProgress = 2,
    Completed = 3
}

const taskStatuses: Array<ChoiceButtonProperties> = [
    {value: TaskStatus.ToDo, label: 'To Do', color: 'crimson'},
    {value: TaskStatus.Backlog, label: 'Backlog', color: 'orange'},
    {value: TaskStatus.InProgress, label: 'In Progress', color: 'lightblue'},
    {value: TaskStatus.Completed, label: 'Completed', color: 'lightgreen'}
];

enum Priority {
    Urgent = 3,
    High = 2,
    Normal = 1,
    Low = 0,
}


const priorities: Array<ChoiceButtonProperties> = [
    {value: Priority.Low, label: 'Low', color: 'lightgreen'},
    {value: Priority.Normal, label: 'Normal', color: 'yellow'},
    {value: Priority.High, label: 'High', color: 'orange'},
    {value: Priority.Urgent, label: 'Urgent', color: 'crimson'},
];

interface ChoiceButtonProps {
    choices: Array<ChoiceButtonProperties>
    setValueCallback: (value: number) => void
}

const ChoiceButtons: React.FC<ChoiceButtonProps> = (props) => {
    const [whichButtonClicked, setWhichButtonClicked] = useState<number>()
    return (
        <div>
            {props.choices.map((p) => (
                <Fragment key={p.value}>
                    <button type="button" onClick={() => {
                        props.setValueCallback(p.value);
                        setWhichButtonClicked(p.value);
                    }}
                            style={{
                                fontWeight: 'bolder', marginTop: 5, marginBottom: 5, marginLeft: 0, marginRight: 0,
                                borderRadius: 0, paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24,
                                color: (p.value === whichButtonClicked) ? 'black' : p.color,
                                backgroundColor: (p.value === whichButtonClicked) ? p.color : ''
                            }}>
                        {p.label}
                    </button>
                </Fragment>
            ))}
        </div>
    );
}

interface FormData {
    status: TaskStatus
    priority: Priority
    assignees: string[]
    taskName: string
}

export function CreateTask() {
    const [formData, setFormData] = useState<FormData>({
        status: TaskStatus.ToDo,
        priority: Priority.Normal,
        assignees: [],
        taskName: "",
    });
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);

    useEffect(() => {
        // setLoading(true);
        fetch(`/api/members/${discordSdk.guildId}`)
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                // setLoading(false);
            })
            .catch(error => {
                console.error("Failed to load users:", error);
                setError('Could not load user data.');
                // setLoading(false);
            });
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!formData.taskName.trim()) {
            setError("Please enter a task name.");
            return;
        }

        const taskData = {...formData, assignees: formData.assignees};
        // delete taskData.whichButtonClicked; // Remove UI-only state property

        try {
            await addDoc(collection(db, "tasks"), taskData);
            setError("Created task successfully.");
        } catch (error) {
            console.error("Error adding document:", error);
            setError("Failed to create task.");
        }
    };

    const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => setFormData(prev => ({...prev, [name]: value}));

    return (
        <div style={{padding: '20px'}}>
            <h2>Create Task</h2>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="task-name">Task name:</label>
                <input
                    id="task-name"
                    style={styles.textBox}
                    type="text"
                    value={formData.taskName}
                    onChange={(e) => handleInputChange('taskName', e.target.value)}
                    required
                />
                <br/>
                <Select
                    isMulti={true}
                    name="assignees"
                    options={users.map((m: APIGuildMember) => ({value: m.user!.username, label: m.user!.username}))}
                    placeholder="Select assignees..."
                    onChange={(selected) => handleInputChange('assignees', selected.map(e => e.value as string))}
                    styles={selectStyles}
                />
                <h3 style={{marginBottom: 5}}>Set Priority</h3>
                <ChoiceButtons
                    choices={priorities}
                    setValueCallback={(value: Priority) => handleInputChange('priority', value)}
                />
                {/* <br/> */}

                <h3 style={{marginBottom: 5}}>Set Status</h3>
                <ChoiceButtons
                    choices={taskStatuses}
                    setValueCallback={(value: TaskStatus) => handleInputChange('status', value)}
                />
                <text>Priority: {priorities[formData.priority].label}</text>
                <br/>
                <text>Status: {taskStatuses[formData.status].label}</text>
                <br/>
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
}