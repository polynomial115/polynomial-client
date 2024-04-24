import Select from 'react-select'
import { APIGuildMember } from 'discord-api-types/v10'
import { FormEvent, useEffect, useState } from 'react'

export function EditProject() {
    const [users, setUsers] = useState<APIGuildMember[]>([])

    const handleInputChange = <T extends keyof FormData>(name: T, value: FormData[T]) => setFormData(prev => ({ ...prev, [name]: value }))
    
    return(
        <div>
            <h2>Editing project</h2>

            <div>
                <Select
					isMulti={true}
					name="assignees"
					options={users.map((m: APIGuildMember) => ({
						value: m.user!.username,
						label: m.user!.username
					}))}
					placeholder="Select task..."
					// onChange={selected =>
						// handleInputChange(
						// 	'assignees',
						// 	selected.map(e => e.value as string)
						// )
					// }
					// styles={selectStyles}
				/>
                <input type="text" name="name" required></input>
                <button>Save</button>
            </div>
            
        </div>
    )
}