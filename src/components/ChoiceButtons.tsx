import { useEffect, useState } from 'react'
import { Choice } from '../types'

interface ChoiceButtonProps {
	choices: Choice[]
	defaultValue?: number
	setValueCallback?: (value: number) => void
}

export const ChoiceButtons = ({ choices, defaultValue, setValueCallback }: ChoiceButtonProps) => {
	const [whichButtonClicked, setWhichButtonClicked] = useState<number>()

	useEffect(() => {
		if (defaultValue) setWhichButtonClicked?.(defaultValue)
	}, [defaultValue])
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
