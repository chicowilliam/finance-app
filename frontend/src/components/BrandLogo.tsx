import type { CSSProperties } from 'react'
import logoClaro from '../assets/gemini-claro-svg.svg'
import logoEscuro from '../assets/gemini-escuro-svg.svg'
import { useTheme } from '../hooks/useTheme'

interface BrandLogoProps {
	height?: number
	style?: CSSProperties
	alt?: string
}

export default function BrandLogo({
	height = 28,
	style,
	alt = 'Finance App',
}: BrandLogoProps) {
	const { theme } = useTheme()
	const src = theme === 'dark' ? logoEscuro : logoClaro

	return (
		<img
			src={src}
			alt={alt}
			height={height}
			style={{ width: 'auto', display: 'block', ...style }}
		/>
	)
}