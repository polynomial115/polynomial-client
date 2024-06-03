import { ReactNode, useState } from 'react'
import { Choice } from '../types'
import { useEffect } from 'react'

interface ChoiceButtonChoice extends Omit<Choice, 'label'> {
	label: ReactNode
}

interface ChoiceButtonProps {
	choices: ChoiceButtonChoice[]
	defaultValue?: number
	style?: React.CSSProperties
	className?: string
	setValueCallback?: (value: number) => void
}

export const ChoiceButtons = ({ choices, defaultValue, style, className, setValueCallback }: ChoiceButtonProps) => {
	const [whichButtonClicked, setWhichButtonClicked] = useState(defaultValue ?? undefined)
	useEffect(() => setWhichButtonClicked(defaultValue), [defaultValue]) // update state when defaultValue changes

	return (
		<div className={className} style={style}>
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
