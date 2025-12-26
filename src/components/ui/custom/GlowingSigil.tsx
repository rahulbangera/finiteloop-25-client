//Easter Egg ID: 4
//Glowing Sigil
//Appears in home page with 40% probability

"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import EasterEggModal from "./winter/EasterEggModal";

const SIGIL_CONFIG = {
	easterEggId: 4,
	appearanceProbability: 0.4,
	size: 40,
	edgePadding: 100,
	enabled: true,
} as const;

interface SigilPosition {
	x: number;
	y: number;
}

//Generate random position within viewport
const getRandomPosition = (): SigilPosition => {
	const { size, edgePadding } = SIGIL_CONFIG;

	const viewportWidth =
		typeof window !== "undefined" ? window.innerWidth : 1200;
	const viewportHeight =
		typeof window !== "undefined" ? window.innerHeight : 800;

	//Avoid generating at the edges
	const minX = edgePadding;
	const maxX = viewportWidth - edgePadding - size;
	const minY = edgePadding + 80; // Account for navbar
	const maxY = viewportHeight - edgePadding - size;

	return {
		x: Math.floor(Math.random() * (maxX - minX)) + minX,
		y: Math.floor(Math.random() * (maxY - minY)) + minY,
	};
};

const shouldAppear = (): boolean => {
	return Math.random() < SIGIL_CONFIG.appearanceProbability;
};

const GlowingSigil: React.FC = () => {
	const { data: session } = useSession();

	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState<SigilPosition | null>(null);
	const [isClicked, setIsClicked] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [alreadyClaimed, setAlreadyClaimed] = useState(false);
	const [flcPoints, setFlcPoints] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [isHovered, setIsHovered] = useState(false);

	const PARTICLE_COUNT = 8;
	const particleIds = useMemo(
		() => Array.from({ length: PARTICLE_COUNT }, () => crypto.randomUUID()),
		[],
	);

	useEffect(() => {
		if (!SIGIL_CONFIG.enabled) return;

		if (shouldAppear()) {
			setPosition(getRandomPosition());
			setIsVisible(true);
		}
	}, []);

	useEffect(() => {
		console.log("Easter Egg Modal Error Message:", errorMessage);
	}, [errorMessage]);

	const handleClaim = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/easteregg/giveflceasterpoints`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({
						easterEggId: SIGIL_CONFIG.easterEggId,
					}),
				},
			);

			const data = await res.json();

			if (res.status === 200) {
				setFlcPoints(data.totalFLCPoints);
				setShowModal(true);
			} else if (res.status === 209) {
				setFlcPoints(data.totalFLCPoints);
				setAlreadyClaimed(true);
				setShowModal(true);
			} else if (res.status === 401) {
				setErrorMessage("You need to be logged in to claim the reward.");
				setShowModal(true);
			} else if (res.status === 404) {
				console.error(
					"Easter Egg ID not found in database. Please ensure easterEggId:",
					SIGIL_CONFIG.easterEggId,
					"exists.",
				);
				setErrorMessage("This Easter Egg is not available yet.");
				setShowModal(true);
			}
		} catch (error) {
			console.error("Failed to claim Easter Egg:", error);
			setErrorMessage("Something went wrong. Please try again.");
			setShowModal(true);
		}
	}, [session?.user?.accessToken]);

	const handleClick = useCallback(() => {
		if (isClicked) return;

		setIsClicked(true);
		setTimeout(() => {
			handleClaim();
		}, 300);
	}, [isClicked, handleClaim]);

	const handleCloseModal = () => {
		setShowModal(false);
		setIsVisible(false);
	};

	if (!isVisible || !position) return null;

	return (
		<>
			{!isClicked && (
				<button
					type="button"
					className="fixed z-9998 cursor-pointer bg-transparent border-none p-0"
					style={{
						left: position.x,
						top: position.y,
						width: SIGIL_CONFIG.size,
						height: SIGIL_CONFIG.size,
					}}
					onClick={handleClick}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					aria-label="Hidden Easter Egg - Click to discover"
				>
					<div
						className={`absolute inset-0 rounded-full transition-all duration-300 ${
							isHovered ? "scale-150" : "scale-100"
						}`}
						style={{
							background:
								"radial-gradient(circle, rgba(127,67,157,0.4) 0%, rgba(127,67,157,0) 70%)",
							animation: "sigilPulse 2s ease-in-out infinite",
						}}
					/>

					<div
						className={`absolute inset-1 rounded-full transition-all duration-300 ${
							isHovered ? "scale-125" : "scale-100"
						}`}
						style={{
							background:
								"radial-gradient(circle, rgba(251,207,244,0.5) 0%, rgba(127,67,157,0.2) 60%, transparent 100%)",
							animation: "sigilPulse 2s ease-in-out infinite 0.5s",
						}}
					/>

					<div
						className={`absolute inset-2 rounded-full flex items-center justify-center transition-all duration-300 ${
							isHovered ? "scale-110" : "scale-100"
						}`}
						style={{
							background:
								"radial-gradient(circle, rgba(251,207,244,0.9) 0%, rgba(127,67,157,0.8) 100%)",
							boxShadow: isHovered
								? "0 0 20px rgba(251,207,244,0.8), 0 0 40px rgba(127,67,157,0.6)"
								: "0 0 10px rgba(251,207,244,0.5), 0 0 20px rgba(127,67,157,0.3)",
						}}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							className={`transition-transform duration-300 ${
								isHovered ? "rotate-45" : "rotate-0"
							}`}
						>
							<title>Mystical Sigil</title>
							<path
								d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
								fill="white"
								fillOpacity="0.9"
							/>
							<circle cx="12" cy="10" r="2" fill="white" fillOpacity="0.7" />
						</svg>
					</div>
				</button>
			)}

			{isClicked && position && (
				<div
					className="fixed z-9998 pointer-events-none"
					style={{
						left: position.x,
						top: position.y,
						width: SIGIL_CONFIG.size,
						height: SIGIL_CONFIG.size,
					}}
				>
					{particleIds.map((id, i) => (
						<div
							key={id}
							className="absolute rounded-full"
							style={{
								width: 8,
								height: 8,
								left: "50%",
								top: "50%",
								background: "linear-gradient(135deg, #FBCFF4, #7F439D)",
								animation: `sigilBurst${i + 1} 0.6s ease-out forwards`,
							}}
						/>
					))}
				</div>
			)}

			<EasterEggModal
				isOpen={showModal}
				onClose={handleCloseModal}
				alreadyClaimed={alreadyClaimed}
				flcPoints={flcPoints}
				errorMessage={errorMessage}
				title={
					alreadyClaimed ? "Sigil Already Discovered!" : "Mystical Sigil Found!"
				}
				subtitle={
					errorMessage
						? undefined
						: alreadyClaimed
							? "You've already discovered this mystical sigil. Keep exploring for more hidden treasures!"
							: "You've found a hidden mystical sigil! The ancient magic grants you FLC Points!"
				}
			/>

			<style jsx>{`
        @keyframes sigilPulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes sigilBurst1 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(-30px, -30px) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst2 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(0, -40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst3 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(30px, -30px) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst4 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(40px, 0) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst5 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(30px, 30px) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst6 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(0, 40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst7 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(-30px, 30px) scale(0);
            opacity: 0;
          }
        }
        @keyframes sigilBurst8 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(-40px, 0) scale(0);
            opacity: 0;
          }
        }
      `}</style>
		</>
	);
};

export default GlowingSigil;
