/** biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: <> */
/** biome-ignore-all lint/a11y/useSemanticElements: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EasterEggModal from "./EasterEggModal";

interface SkatingPenguinProps {
	className?: string;
}

export default function SkatingPenguin({
	className = "",
}: SkatingPenguinProps) {
	const [alreadyClaimed, setAlreadyClaimed] = useState(false);
	const [flcPoints, setFlcPoints] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [isPeeking, setIsPeeking] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [clicked, setClicked] = useState(false);
	const [isSpinning, setIsSpinning] = useState(false);
	const { data: session } = useSession();

	const handleClick = async () => {
		if (isPeeking) {
			setIsPeeking(false);
		}

		if (clicked) return;
		setIsSpinning(true);

		setTimeout(async () => {
			await handleClaim();
			setClicked(true);
			setIsSpinning(false);
		}, 400);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleClaim = async () => {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/easteregg/giveflceasterpoints`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.user?.accessToken}`,
				},
				body: JSON.stringify({ easterEggId: 5 }),
			},
		);
		const data = await res.json();

		return new Promise<void>((resolve) => {
			setTimeout(() => {
				if (res.status === 200) {
					setFlcPoints(data.totalFLCPoints);
					setShowModal(true);
				}
				if (res.status === 209) {
					setFlcPoints(data.totalFLCPoints);
					setAlreadyClaimed(true);
					setShowModal(true);
				}
				if (res.status === 401) {
					setErrorMessage("You need to be logged in to claim the reward.");
					setShowModal(true);
				}
				resolve();
			}, 500);
		});
	};

	// ... (rest of imports/hooks)

	// In the return JSX main div className:
	/* 
       Updated the className to include dynamic translate based on isPeeking.
       When peeking, we push it down so only the top is visible.
    */

	return (
		<>
			<div
				className={`relative z-20 pointer-events-auto cursor-pointer transition-transform duration-500 ease-in-out ${className} ${isPeeking ? "translate-y-[60%]" : "translate-y-0"} ${isSpinning ? "rotate-0" : ""}`}
				onClick={handleClick}
				role="button"
				tabIndex={0}
				style={{ animationDuration: "0.5s" }}
			>
				<svg
					width="80"
					height="100"
					viewBox="0 0 100 120"
					className="overflow-visible"
				>
					<title>Peeking Penguin - Click for a prize!</title>

					{/* Shadow */}
					<ellipse cx="50" cy="115" rx="25" ry="5" fill="rgba(0,0,0,0.2)" />

					{/* Body */}
					<ellipse cx="50" cy="75" rx="30" ry="35" fill="#1F2937" />

					{/* Belly */}
					<ellipse cx="50" cy="80" rx="20" ry="28" fill="#F5F5F5" />

					{/* Head */}
					<circle cx="50" cy="35" r="25" fill="#1F2937" />

					{/* Face */}
					<ellipse cx="50" cy="40" rx="15" ry="18" fill="#F5F5F5" />

					{/* Eyes */}
					<circle cx="42" cy="32" r="5" fill="white" />
					<circle cx="58" cy="32" r="5" fill="white" />
					<circle cx="43" cy="33" r="2.5" fill="#1F2937" />
					<circle cx="59" cy="33" r="2.5" fill="#1F2937" />
					<circle cx="44" cy="32" r="1" fill="white" />
					<circle cx="60" cy="32" r="1" fill="white" />

					{/* Beak */}
					<polygon points="50,38 44,48 56,48" fill="#F59E0B" />

					{/* Rosy cheeks */}
					<circle cx="35" cy="40" r="5" fill="#FDA4AF" opacity="0.5" />
					<circle cx="65" cy="40" r="5" fill="#FDA4AF" opacity="0.5" />

					{/* Scarf */}
					<path
						d="M25 55 Q50 65 75 55"
						stroke="#DC2626"
						strokeWidth="8"
						fill="none"
					/>
					<path
						d="M25 55 Q50 68 75 55"
						stroke="#DC2626"
						strokeWidth="6"
						fill="none"
					/>
					{/* Scarf tails */}
					<rect x="70" y="55" width="8" height="25" rx="2" fill="#DC2626" />
					<rect x="78" y="60" width="6" height="20" rx="2" fill="#DC2626" />
					{/* Scarf stripes */}
					<rect x="70" y="65" width="8" height="3" fill="#22C55E" />
					<rect x="78" y="70" width="6" height="3" fill="#22C55E" />

					{/* Wings/Flippers - Waving position */}
					<ellipse
						cx="20"
						cy="60"
						rx="10"
						ry="25"
						fill="#1F2937"
						transform="rotate(-45 20 60)"
					>
						<animateTransform
							attributeName="transform"
							type="rotate"
							values="-45 20 60; -25 20 60; -45 20 60"
							dur="2s"
							repeatCount="indefinite"
						/>
					</ellipse>
					<ellipse
						cx="80"
						cy="70"
						rx="10"
						ry="25"
						fill="#1F2937"
						transform="rotate(15 80 70)"
					/>

					{/* Feet */}
					<ellipse cx="38" cy="110" rx="12" ry="6" fill="#F59E0B" />
					<ellipse cx="62" cy="110" rx="12" ry="6" fill="#F59E0B" />
				</svg>
			</div>

			<EasterEggModal
				isOpen={showModal}
				onClose={handleCloseModal}
				alreadyClaimed={alreadyClaimed}
				flcPoints={flcPoints}
				errorMessage={errorMessage}
				title="🐧 Penguin Pal!"
				subtitle={alreadyClaimed ? undefined : "You found the peeking penguin!"}
			/>
		</>
	);
}
