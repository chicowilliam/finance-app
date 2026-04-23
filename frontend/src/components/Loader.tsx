import { motion, useReducedMotion } from 'motion/react'

type LoaderVariant = 'dashboard' | 'table' | 'alerts'

interface LoaderProps {
	variant?: LoaderVariant
}

function SkeletonLine({ className = '' }: { className?: string }) {
	return <div className={`skeleton-line ${className}`.trim()} />
}

export default function Loader({ variant = 'dashboard' }: LoaderProps) {
	const shouldReduceMotion = useReducedMotion()

	const pulse = shouldReduceMotion
		? undefined
		: {
				opacity: [0.7, 1, 0.7],
			}

	const pulseTransition = shouldReduceMotion
		? undefined
		: {
				duration: 1.35,
				repeat: Infinity,
				ease: 'easeInOut' as const,
			}

	if (variant === 'table') {
		return (
			<motion.div className="skeleton-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<SkeletonLine className="w-40 mb-16" />

				<div className="skeleton-chip-row mb-16">
					<SkeletonLine className="skeleton-chip" />
					<SkeletonLine className="skeleton-chip" />
					<SkeletonLine className="skeleton-chip" />
					<SkeletonLine className="skeleton-chip" />
				</div>

				<div className="skeleton-table">
					{Array.from({ length: 6 }).map((_, idx) => (
						<motion.div
							key={idx}
							className="skeleton-table-row"
							animate={pulse}
							transition={pulseTransition}
						>
							<SkeletonLine className="w-28" />
							<SkeletonLine className="w-18" />
							<SkeletonLine className="w-16" />
							<SkeletonLine className="w-14" />
							<SkeletonLine className="w-12" />
						</motion.div>
					))}
				</div>
			</motion.div>
		)
	}

	if (variant === 'alerts') {
		return (
			<motion.div className="skeleton-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<SkeletonLine className="w-40 mb-16" />

				{Array.from({ length: 2 }).map((_, sectionIdx) => (
					<section key={sectionIdx} className="mb-16">
						<SkeletonLine className="w-28 mb-12" />
						<div className="skeleton-grid">
							{Array.from({ length: 3 }).map((_, cardIdx) => (
								<motion.div
									key={cardIdx}
									className="skeleton-card"
									animate={pulse}
									transition={pulseTransition}
								>
									<SkeletonLine className="w-32" />
									<SkeletonLine className="w-20" />
									<SkeletonLine className="w-24" />
								</motion.div>
							))}
						</div>
					</section>
				))}
			</motion.div>
		)
	}

	return (
		<motion.div className="skeleton-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<SkeletonLine className="w-40 mb-16" />

			<div className="skeleton-grid mb-16">
				{Array.from({ length: 4 }).map((_, idx) => (
					<motion.div
						key={idx}
						className="skeleton-card"
						animate={pulse}
						transition={pulseTransition}
					>
						<SkeletonLine className="w-20" />
						<SkeletonLine className="w-28" />
						<SkeletonLine className="w-16" />
					</motion.div>
				))}
			</div>

			<section className="skeleton-section">
				<SkeletonLine className="w-36 mb-12" />
				<div className="skeleton-list">
					{Array.from({ length: 4 }).map((_, idx) => (
						<motion.div
							key={idx}
							className="skeleton-list-item"
							animate={pulse}
							transition={pulseTransition}
						>
							<SkeletonLine className="w-32" />
							<SkeletonLine className="w-14" />
							<SkeletonLine className="w-18" />
						</motion.div>
					))}
				</div>
			</section>
		</motion.div>
	)
}
