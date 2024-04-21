import {Fragment, useEffect, useState} from "react";
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
    Urgent = 3,
    High = 2,
    Normal = 1,
    Low = 0,
}

const priorities = [
    {value: Priority.Low, label: 'Low', color: 'lightgreen'},
    {value: Priority.Normal, label: 'Normal', color: 'yellow'},
    {value: Priority.High, label: 'High', color: 'orange'},
    {value: Priority.Urgent, label: 'Urgent', color: 'crimson'},
];

function PriorityButtons({priorities, setPriority, whichButtonClicked, setWhichButtonClicked}) {
    return (
        <div>
            {priorities.map(p => (
                <Fragment key={p.value}>
                    <button type="button" onClick={() => {
                        setPriority(p.value);
                        setWhichButtonClicked(p.value);
                    }}
                            style={{
                                marginTop: 5, marginBottom: 5, marginLeft: 0, marginRight: 0,
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

export function CreateTask() {
    const [formData, setFormData] = useState({
        status: TaskStatus.ToDo,
        priority: Priority.Normal,
        assignees: [],
        taskName: "",
        whichButtonClicked: null
    });
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/members/${discordSdk.guildId}`)
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to load users:", error);
                setError('Could not load user data.');
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.taskName.trim()) {
            setError("Please enter a task name.");
            return;
        }

        const taskData = {...formData, assignees: formData.assignees};
        delete taskData.whichButtonClicked; // Remove UI-only state property

        try {
            const docRef = await addDoc(collection(db, "tasks"), taskData);
            setError("Created task successfully.");
        } catch (error) {
            console.error("Error adding document:", error);
            setError("Failed to create task.");
        }
    };

    const handleInputChange = (name, value) => setFormData(prev => ({...prev, [name]: value}));

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
                    options={users.map(u => ({value: u.user!.username, label: u.user!.username}))}
                    placeholder="Select assignees..."
                    onChange={(selected) => handleInputChange('assignees', selected.map(e => e.value))}
                    styles={selectStyles}
                />
                <h3>Set Priority</h3>
                <PriorityButtons
                    priorities={priorities}
                    setPriority={(value) => handleInputChange('priority', value)}
                    whichButtonClicked={formData.whichButtonClicked}
                    setWhichButtonClicked={(value) => handleInputChange('whichButtonClicked', value)}
                />
                <br/>
                <Select
                    isMulti={false}
                    name="task status"
                    options={taskStatuses}
                    placeholder="Select task status..."
                    onChange={(selected) => handleInputChange('status', selected.value)}
                    styles={selectStyles}
                />
                <button type="submit" style={styles.button}>Create Task</button>
            </form>
        </div>
    );
}