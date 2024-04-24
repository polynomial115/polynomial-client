import { useState } from 'react'

export interface Choice {
	value: number
	label: string
	color: string
}

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
					onClick={() => {
						setValueCallback(p.value)
						setWhichButtonClicked(p.value)
					}}
					style={{
						fontWeight: 'bolder',
						marginTop: 5,
						marginBottom: 5,
						marginLeft: 0,
						marginRight: 0,
						borderRadius: 0,
						paddingTop: 12,
						paddingBottom: 12,
						paddingLeft: 24,
						paddingRight: 24,
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
