/** biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: <> */
/** biome-ignore-all lint/a11y/useSemanticElements: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import EasterEggModal from "./EasterEggModal";

export default function PolarBear() {
	const [alreadyClaimed, setAlreadyClaimed] = useState(false);
	const [flcPoints, setFlcPoints] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [clicked, setClicked] = useState(false);
	const [isRoaring, setIsRoaring] = useState(false);
	const { data: session } = useSession();

	const handleClick = async () => {
		if (clicked) return;
		setIsRoaring(true);

		setTimeout(() => {
			setIsRoaring(false);
		}, 1000);

		await handleClaim();
		setClicked(true);
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
				body: JSON.stringify({ easterEggId: 6 }),
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
			}, 800);
		});
	};

	return (
		<div className="relative">
			<svg
				width="110"
				height="120"
				viewBox="0 0 110 120"
				className="cursor-pointer transition-transform hover:scale-105 outline-none"
				onClick={handleClick}
				role="button"
				tabIndex={0}
			>
				<title>Polar Bear - Click to hear a roar!</title>

				{/* Shadow */}
				<ellipse cx="55" cy="115" rx="35" ry="5" fill="rgba(0,0,0,0.2)" />

				{/* Body */}
				<path
					d="M25,110 Q15,110 20,80 Q15,50 35,30 Q55,10 75,30 Q95,50 90,80 Q95,110 85,110 Z"
					fill="#FFFFFF"
					stroke="#E2E8F0"
					strokeWidth="1"
				/>

				{/* Ears */}
				<circle
					cx="35"
					cy="35"
					r="6"
					fill="#FFFFFF"
					stroke="#E2E8F0"
					strokeWidth="1"
				/>
				<circle
					cx="75"
					cy="35"
					r="6"
					fill="#FFFFFF"
					stroke="#E2E8F0"
					strokeWidth="1"
				/>
				<circle cx="35" cy="35" r="3" fill="#E2E8F0" />
				<circle cx="75" cy="35" r="3" fill="#E2E8F0" />

				{/* Face */}
				<ellipse cx="55" cy="50" rx="22" ry="18" fill="#F8FAFC" />

				{/* Eyes */}
				<circle cx="48" cy="45" r="3" fill="#1E293B" />
				<circle cx="62" cy="45" r="3" fill="#1E293B" />

				{/* Nose */}
				<ellipse cx="55" cy="55" rx="5" ry="4" fill="#1E293B" />

				{/* Mouth (Roar Animation) */}
				<path
					d={isRoaring ? "M50,65 Q55,75 60,65 Z" : "M50,65 Q55,70 60,65"}
					fill={isRoaring ? "#1E293B" : "none"}
					stroke="#1E293B"
					strokeWidth="2"
					strokeLinecap="round"
				/>

				{/* Scarf (Blue) */}
				<path
					d="M35,75 Q55,85 75,75"
					stroke="#3B82F6"
					strokeWidth="8"
					fill="none"
				/>
				<rect x="65" y="75" width="8" height="20" fill="#3B82F6" rx="2" />

				{/* Arms */}
				<path
					d="M25,80 Q15,95 25,105"
					strokeWidth="10"
					strokeLinecap="round"
					fill="none"
					stroke="#E2E8F0"
				/>
				<path
					d="M85,80 Q95,95 85,105"
					strokeWidth="10"
					strokeLinecap="round"
					fill="none"
					stroke="#E2E8F0"
				/>
			</svg>
			<EasterEggModal
				isOpen={showModal}
				onClose={handleCloseModal}
				alreadyClaimed={alreadyClaimed}
				flcPoints={flcPoints}
				errorMessage={errorMessage}
				title="🐻‍❄️ Polar Bear Friend!"
				subtitle={alreadyClaimed ? undefined : "You befriended the Polar Bear!"}
			/>
		</div>
	);
}
