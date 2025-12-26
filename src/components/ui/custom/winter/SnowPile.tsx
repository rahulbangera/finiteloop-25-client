/** biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: <> */
/** biome-ignore-all lint/a11y/useSemanticElements: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
"use client";
import { useState } from "react";

export default function DecoySnowPile() {
	const [poofed, setPoofed] = useState(false);

	const handleClick = () => {
		if (poofed) return;
		setPoofed(true);
		setTimeout(() => setPoofed(false), 2000);
	};

	return (
		<div
			className="relative cursor-pointer group inline-block"
			onClick={handleClick}
			role="button"
			tabIndex={0}
		>
			<svg
				width="80"
				height="40"
				viewBox="0 0 100 50"
				className="overflow-visible"
			>
				<title>A pile of snow</title>
				{!poofed ? (
					<g className="transition-all duration-300 group-hover:scale-105">
						<path
							d="M10 50 Q30 20 50 40 Q70 10 90 50 Z"
							fill="#F0F8FF"
							stroke="#E6E6FA"
							strokeWidth="1"
						/>
						<path d="M30 50 Q45 35 60 50 Z" fill="#FFFFFF" />
						<circle cx="40" cy="45" r="1" fill="#ADD8E6" opacity="0.5" />
						<circle cx="60" cy="35" r="1.5" fill="#ADD8E6" opacity="0.5" />
						<circle cx="20" cy="48" r="1" fill="#ADD8E6" opacity="0.5" />
					</g>
				) : (
					<g>
						{/* Puff cloud/scatter effect */}
						<circle cx="50" cy="40" r="10" fill="white" opacity="0.8">
							<animate
								attributeName="r"
								values="10;20;0"
								dur="0.5s"
								fill="freeze"
							/>
							<animate
								attributeName="opacity"
								values="0.8;0"
								dur="0.5s"
								fill="freeze"
							/>
						</circle>
						<circle cx="30" cy="45" r="8" fill="white" opacity="0.7">
							<animate
								attributeName="r"
								values="8;15;0"
								dur="0.4s"
								begin="0.1s"
								fill="freeze"
							/>
							<animate
								attributeName="opacity"
								values="0.7;0"
								dur="0.4s"
								begin="0.1s"
								fill="freeze"
							/>
						</circle>
						<circle cx="70" cy="45" r="8" fill="white" opacity="0.7">
							<animate
								attributeName="r"
								values="8;15;0"
								dur="0.4s"
								begin="0.1s"
								fill="freeze"
							/>
							<animate
								attributeName="opacity"
								values="0.7;0"
								dur="0.4s"
								begin="0.1s"
								fill="freeze"
							/>
						</circle>
					</g>
				)}
			</svg>
		</div>
	);
}
