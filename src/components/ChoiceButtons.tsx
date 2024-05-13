import { useEffect, useState } from 'react'
import { Choice } from '../types'

interface ChoiceButtonProps {
	choices: Choice[]
	selected?: number
	setValueCallback?: (value: number) => void
	defaultValue: number
}

export const ChoiceButtons = ({ choices, selected, setValueCallback }: ChoiceButtonProps) => {
	const [whichButtonClicked, setWhichButtonClicked] = useState<number>()

	useEffect(() => {
		if (selected) setWhichButtonClicked(selected)
	}, [selected])
	return (
		<div>
			{choices.map(p => (
				<button
					key={p.value}
					type="button"
					className="choice-buttons"
					onClick={() => {
						setValueCallback?.(p.value)
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
