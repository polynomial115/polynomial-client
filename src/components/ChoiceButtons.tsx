import { useState } from 'react'
import { Choice } from '../types'

interface ChoiceButtonProps {
	choices: Choice[]
	defaultValue?: number
	style?: React.CSSProperties
	setValueCallback?: (value: number) => void
}

export const ChoiceButtons = ({ choices, defaultValue, style, setValueCallback }: ChoiceButtonProps) => {
	const [whichButtonClicked, setWhichButtonClicked] = useState<number | undefined>(defaultValue ?? undefined)

	return (
		<div style={style ?? undefined}>
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
						display: 'inline-block',
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
