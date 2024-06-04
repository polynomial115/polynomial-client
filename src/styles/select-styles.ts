import chroma from 'chroma-js'
import type { StylesConfig } from 'react-select'

// Implements dark theme and role colors for react select
// https://react-select.com/home#custom-styles

export const selectStyles: StylesConfig<{ value: unknown; label: string; color?: string }> = {
	control: provided => ({
		...provided,
		background: '#202225',
		padding: 4,
		color: 'white',
		margin: '10px 0px'
	}),
	menu: provided => ({
		...provided,
		background: '#1a1a1a',
		color: 'white'
	}),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
		const color = chroma(data.color ?? 'black')
		return {
			...styles,
			backgroundColor: isDisabled ? undefined : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : undefined,
			color: isDisabled ? '#ccc' : isSelected ? (chroma.contrast(color, 'white') > 2 ? 'white' : 'black') : data.color,
			cursor: isDisabled ? 'not-allowed' : 'default',

			':active': {
				...styles[':active'],
				backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.3).css()) : undefined
			}
		}
	},
	multiValue: (styles, { data }) => {
		const color = chroma(data.color ?? 'black')
		return {
			...styles,
			margin: 4,
			padding: 6,
			fontSize: 18,
			backgroundColor: color.alpha(0.1).css()
		}
	},
	multiValueLabel: (styles, { data }) => ({
		...styles,
		color: data.color
	}),
	multiValueRemove: (styles, { data }) => ({
		...styles,
		color: data.color,
		':hover': {
			backgroundColor: data.color,
			color: 'white'
		}
	}),
	singleValue: styles => ({
		...styles,
		color: 'white'
	})
}
