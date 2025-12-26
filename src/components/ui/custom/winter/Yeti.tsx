/** biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: <> */
/** biome-ignore-all lint/a11y/useSemanticElements: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
"use client";
import { useState } from "react";

export default function Yeti() {
	const [isWaving, setIsWaving] = useState(false);

	const handleClick = async () => {
		if (isWaving) return;
		setIsWaving(true);

		setTimeout(() => {
			setIsWaving(false);
		}, 400);
	};

	return (
		<div className="relative">
			<svg
				width="120"
				height="120"
				viewBox="0 0 120 120"
				className="cursor-pointer transition-transform hover:scale-105 outline-none z-50"
				onClick={handleClick}
				role="button"
				tabIndex={0}
			>
				<title>Yeti - Click to say hello!</title>

				{/* Shadow */}
				<ellipse cx="50" cy="115" rx="30" ry="5" fill="rgba(0,0,0,0.2)" />

				{/* Body Fur Base */}
				<path
					d="M20,110 Q10,110 15,90 Q10,60 30,40 Q50,20 70,40 Q90,60 85,90 Q90,110 80,110 Z"
					fill="#F8FAFC"
				/>

				{/* Face Area */}
				<ellipse cx="50" cy="55" rx="18" ry="14" fill="#E2E8F0" />

				{/* Eyes */}
				<circle cx="44" cy="52" r="3" fill="#1E293B" />
				<circle cx="56" cy="52" r="3" fill="#1E293B" />

				{/* Mouth */}
				<path
					d="M46,60 Q50,65 54,60"
					stroke="#1E293B"
					strokeWidth="2"
					strokeLinecap="round"
					fill="none"
				/>

				{/* Arm Left (Static) */}
				<path
					d="M20,65 Q10,80 25,90"
					stroke="#F8FAFC"
					strokeWidth="12"
					strokeLinecap="round"
					fill="none"
				/>

				{/* Arm Right (Waving) */}
				<g className={isWaving ? "animate-wave origin-bottom-left" : ""}>
					<path
						d="M80,65 Q90,50 95,35"
						stroke="#F8FAFC"
						strokeWidth="12"
						strokeLinecap="round"
						fill="none"
					/>
				</g>

				<style>
					{`
                        @keyframes wave {
                            0%, 100% { transform: rotate(0deg); }
                            25% { transform: rotate(-10deg); }
                            75% { transform: rotate(10deg); }
                        }
                        .animate-wave {
                            animation: wave 0.5s ease-in-out infinite;
                            transform-origin: 80px 65px;
                        }
                    `}
				</style>
			</svg>
		</div>
	);
}
