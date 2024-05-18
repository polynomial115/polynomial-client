import { ReactNode, useState } from 'react'
import { Choice } from '../types'

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
	const [whichButtonClicked, setWhichButtonClicked] = useState<number | undefined>(defaultValue ?? undefined)

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
