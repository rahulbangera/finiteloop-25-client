/** biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: <> */
/** biome-ignore-all lint/a11y/useSemanticElements: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EasterEggModal from "./EasterEggModal";

export default function GiftBox() {
	const [alreadyClaimed, setAlreadyClaimed] = useState(false);
	const [flcPoints, setFlcPoints] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [clicked, setClicked] = useState(false);
	const [isOpening, setIsOpening] = useState(false);
	const [showCoins, setShowCoins] = useState(false);
	const { data: session } = useSession();

	const handleClick = async () => {
		if (clicked) return;
		setIsOpening(true);

		setTimeout(() => {
			setShowCoins(true);
		}, 400);

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
				body: JSON.stringify({ easterEggId: 7 }),
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

	if (clicked) {
		return (
			<EasterEggModal
				isOpen={showModal}
				onClose={handleCloseModal}
				alreadyClaimed={alreadyClaimed}
				flcPoints={flcPoints}
				errorMessage={errorMessage}
				title="🎁 Gift Unwrapped!"
				subtitle={
					alreadyClaimed
						? undefined
						: "You found a hidden gift and earned FLC Points!"
				}
			/>
		);
	}

	return (
		<div className="relative">
			<svg
				width="120"
				height="140"
				viewBox="0 0 120 140"
				className="cursor-pointer transition-transform hover:scale-110 outline-none"
				onClick={handleClick}
				role="button"
				tabIndex={0}
			>
				<title>Gift Box - Click to open</title>

				<style>
					{`
						.gift-lid {
							transform-origin: 60px 50px;
							transition: transform 0.4s ease-out;
						}
						.gift-lid.opening {
							transform: rotate(-120deg) translateY(-20px);
						}
						.coin {
							opacity: 0;
							transform: translateY(0);
						}
						.coin.show {
							animation: coinBurst 0.8s ease-out forwards;
						}
						@keyframes coinBurst {
							0% { opacity: 1; transform: translateY(0) scale(0.5); }
							50% { opacity: 1; transform: translateY(-40px) scale(1); }
							100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
						}
						.ribbon {
							transition: transform 0.3s ease-out;
						}
						.ribbon.opening {
							transform: translateY(-30px) rotate(15deg);
						}
					`}
				</style>

				{/* Shadow */}
				<ellipse cx="60" cy="135" rx="45" ry="8" fill="rgba(0,0,0,0.2)" />

				{/* Box bottom */}
				<rect x="15" y="55" width="90" height="75" rx="5" fill="#DC2626" />
				<rect
					x="15"
					y="55"
					width="90"
					height="75"
					rx="5"
					fill="url(#boxGradient)"
				/>

				{/* Vertical ribbon on box */}
				<rect x="52" y="55" width="16" height="75" fill="#FCD34D" />
				<rect
					x="52"
					y="55"
					width="16"
					height="75"
					fill="url(#ribbonGradient)"
				/>

				{/* Box lid */}
				<g className={`gift-lid ${isOpening ? "opening" : ""}`}>
					<rect x="10" y="35" width="100" height="25" rx="5" fill="#B91C1C" />
					<rect
						x="10"
						y="35"
						width="100"
						height="25"
						rx="5"
						fill="url(#lidGradient)"
					/>

					{/* Horizontal ribbon on lid */}
					<rect x="10" y="43" width="100" height="12" fill="#FCD34D" />
					<rect
						x="10"
						y="43"
						width="100"
						height="12"
						fill="url(#ribbonGradient)"
					/>

					{/* Bow */}
					<g className={`ribbon ${isOpening ? "opening" : ""}`}>
						{/* Left loop */}
						<ellipse cx="42" cy="30" rx="18" ry="14" fill="#FCD34D" />
						<ellipse cx="42" cy="30" rx="12" ry="9" fill="#B91C1C" />

						{/* Right loop */}
						<ellipse cx="78" cy="30" rx="18" ry="14" fill="#FCD34D" />
						<ellipse cx="78" cy="30" rx="12" ry="9" fill="#B91C1C" />

						{/* Center knot */}
						<circle cx="60" cy="35" r="10" fill="#FCD34D" />
						<circle cx="60" cy="35" r="6" fill="#D97706" />

						{/* Ribbon tails */}
						<path d="M55 42 L45 55 L50 55 L60 45 Z" fill="#FCD34D" />
						<path d="M65 42 L75 55 L70 55 L60 45 Z" fill="#FCD34D" />
					</g>
				</g>

				{/* Coins bursting out */}
				{showCoins && (
					<>
						<circle
							className="coin show"
							cx="45"
							cy="50"
							r="8"
							fill="#FCD34D"
							style={{ animationDelay: "0s" }}
						/>
						<circle
							className="coin show"
							cx="60"
							cy="45"
							r="10"
							fill="#FCD34D"
							style={{ animationDelay: "0.1s" }}
						/>
						<circle
							className="coin show"
							cx="75"
							cy="50"
							r="7"
							fill="#FCD34D"
							style={{ animationDelay: "0.2s" }}
						/>
						<circle
							className="coin show"
							cx="50"
							cy="55"
							r="6"
							fill="#EAB308"
							style={{ animationDelay: "0.15s" }}
						/>
						<circle
							className="coin show"
							cx="70"
							cy="55"
							r="6"
							fill="#EAB308"
							style={{ animationDelay: "0.25s" }}
						/>
					</>
				)}

				{/* Gradients */}
				<defs>
					<linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
						<stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.3" />
					</linearGradient>
					<linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
						<stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.3" />
					</linearGradient>
					<linearGradient
						id="ribbonGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#FDE68A" stopOpacity="0.5" />
						<stop offset="100%" stopColor="#B45309" stopOpacity="0.3" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
}
