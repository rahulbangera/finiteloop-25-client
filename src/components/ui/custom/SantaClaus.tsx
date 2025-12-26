/** biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: <> */
/** biome-ignore-all lint/a11y/useSemanticElements: <> */
"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import EasterEggModal from "./EasterEggModal";

export default function SantaClaus() {
	const [alreadyClaimed, setAlreadyClaimed] = React.useState(false);
	const [flcPoints, setFlcPoints] = React.useState(0);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [showModal, setShowModal] = React.useState(false);
	const [clicked, setClicked] = React.useState(false);
	const [isWaving, setIsWaving] = useState(false);
	const { data: session } = useSession();

	const handleClick = async () => {
		if (clicked) return;
		setIsWaving(true);
		await handleClaim();
		setClicked(() => true);
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
				body: JSON.stringify({ easterEggId: 3 }),
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
			}, 1000);
		});
	};

	if (clicked === true) {
		return (
			<EasterEggModal
				isOpen={showModal}
				onClose={handleCloseModal}
				alreadyClaimed={alreadyClaimed}
				flcPoints={flcPoints}
				errorMessage={errorMessage}
			/>
		);
	}

	return (
		<>
			<div className="flex items-center justify-center">
				<div className="text-center">
					<svg
						width="300"
						height="400"
						viewBox="0 0 300 400"
						className="pointer-events-none"
					>
						<title>Santa Claus - Click to wave</title>

						{/* Invisible clickable area that matches Santa's shape */}
						<g
							className="cursor-pointer pointer-events-auto outline-none focus:outline-none"
							onClick={handleClick}
							role="button"
							tabIndex={0}
						>
							{/* Clickable overlay matching Santa's outline */}
							<ellipse cx="150" cy="280" rx="80" ry="100" fill="transparent" />
							<circle cx="150" cy="150" r="60" fill="transparent" />
							<polygon points="100,110 200,110 150,40" fill="transparent" />
							<ellipse cx="120" cy="370" rx="25" ry="20" fill="transparent" />
							<ellipse cx="180" cy="370" rx="25" ry="20" fill="transparent" />

							{/* Visual elements */}
							{/* Body - red coat */}
							<ellipse cx="150" cy="280" rx="80" ry="100" fill="#DC2626" />

							{/* Belt */}
							<rect x="70" y="270" width="160" height="20" fill="#1F2937" />
							<rect
								x="140"
								y="265"
								width="20"
								height="30"
								fill="#FCD34D"
								rx="3"
							/>

							{/* Arms */}
							<g
								style={{
									transform: isWaving ? "rotate(180deg)" : "rotate(0deg)",
									transformOrigin: "80px 210px",
									transition: "transform 0.6s ease-in-out",
								}}
							>
								<ellipse cx="80" cy="240" rx="25" ry="60" fill="#DC2626" />
								<circle cx="80" cy="290" r="18" fill="#FFE4C4" />
							</g>

							<g
								style={{
									transform: isWaving ? "rotate(-180deg)" : "rotate(0deg)",
									transformOrigin: "220px 210px",
									transition: "transform 0.6s ease-in-out",
								}}
							>
								<ellipse cx="220" cy="240" rx="25" ry="60" fill="#DC2626" />
								<circle cx="220" cy="290" r="18" fill="#FFE4C4" />
							</g>

							{/* Head */}
							<circle cx="150" cy="150" r="60" fill="#FFE4C4" />

							{/* Hat */}
							<polygon points="100,110 200,110 150,40" fill="#DC2626" />
							<ellipse cx="150" cy="110" rx="55" ry="10" fill="#FFFFFF" />
							<circle cx="150" cy="40" r="12" fill="#FFFFFF" />

							{/* Eyes */}
							<circle cx="130" cy="140" r="5" fill="#1F2937" />
							<circle cx="170" cy="140" r="5" fill="#1F2937" />

							{/* Rosy cheeks */}
							<circle cx="115" cy="155" r="12" fill="#EF4444" opacity="0.4" />
							<circle cx="185" cy="155" r="12" fill="#EF4444" opacity="0.4" />

							{/* Nose */}
							<circle cx="150" cy="155" r="8" fill="#EF4444" />

							{/* Mustache */}
							<ellipse cx="125" cy="165" rx="20" ry="8" fill="#FFFFFF" />
							<ellipse cx="175" cy="165" rx="20" ry="8" fill="#FFFFFF" />

							{/* Beard */}
							<path
								d="M 110 170 Q 150 210 190 170 Q 190 200 150 210 Q 110 200 110 170"
								fill="#FFFFFF"
							/>

							{/* Coat trim */}
							<rect x="70" y="190" width="160" height="15" fill="#FFFFFF" />

							{/* Buttons */}
							<circle cx="150" cy="230" r="6" fill="#1F2937" />
							<circle cx="150" cy="255" r="6" fill="#1F2937" />

							{/* Boots */}
							<ellipse cx="120" cy="370" rx="25" ry="20" fill="#1F2937" />
							<ellipse cx="180" cy="370" rx="25" ry="20" fill="#1F2937" />
						</g>
					</svg>
				</div>
			</div>
			{/* <EasterEggModal isOpen={showModal} onClose={handleCloseModal} /> */}
		</>
	);
}
