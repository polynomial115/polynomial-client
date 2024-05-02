import { useState } from 'react'
import { Choice } from '../types'

interface ChoiceButtonProps {
	choices: Choice[]
	setValueCallback: (value: number) => void
}

export const ChoiceButtons = ({ choices, setValueCallback }: ChoiceButtonProps) => {
	const [whichButtonClicked, setWhichButtonClicked] = useState<number>()
	return (
		<div>
			{choices.map(p => (
				<button
					key={p.value}
					type="button"
					className="choice-button"
					onClick={() => {
						setValueCallback(p.value)
						setWhichButtonClicked(p.value)
					}}
					style={{
						color: p.value === whichButtonClicked ? 'black' : p.color,
						backgroundColor: p.value === whichButtonClicked ? p.color : ''
					}}
				>
					{p.label}
				</button>
			))}
		</div>
	)
}
