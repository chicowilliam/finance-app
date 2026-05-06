import type { CSSProperties } from 'react'
import logo from '../assets/novo-svg (1).svg'

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
	return (
		<img
			src={logo}
			alt={alt}
			height={height}
			style={{ width: 'auto', display: 'block', ...style }}
		/>
	)
}