"use client";
import React from "react";

import EasterEggModal from "./EasterEggModal";
import { useSession } from "next-auth/react";

const Snowman = () => {
	const [clicks, setClicks] = React.useState(0);
	const [exploded, setExploded] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);
	const { data: session } = useSession();
	const [clickParticles, setClickParticles] = React.useState<
		{ id: number; anim: number }[]
	>([]);
	const [alreadyClaimed, setAlreadyClaimed] = React.useState(false);
	const [flcPoints, setFlcPoints] = React.useState(0);
	const [errorMessage, setErrorMessage] = React.useState("");

	React.useEffect(() => {
		const claimed = localStorage.getItem("flc_snowman_claimed");
		if (claimed === "true") {
			setAlreadyClaimed(true);
		}
	}, []);

	const handleClaim = async () => {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/easteregg/giveflceasterpoints`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.user?.accessToken}`,
				},
				body: JSON.stringify({ easterEggId: 1 }),
			},
		);
		const data = await res.json();
		if (res.status === 200) {
			localStorage.setItem("flc_snowman_claimed", "true");
			setFlcPoints(data.totalFLCPoints);
			setShowModal(true);
		}
		if (res.status === 209) {
			localStorage.setItem("flc_snowman_claimed", "true");
			setFlcPoints(data.totalFLCPoints);
			setAlreadyClaimed(true);
			setShowModal(true);
		}
		if (res.status === 401) {
			setErrorMessage("You need to be logged in to claim the reward.");
			setShowModal(true);
		}
	};

	const handleClick = () => {
		if (exploded) return;

		const newParticles = Array.from({ length: 4 }).map(() => ({
			id: Date.now() + Math.random(),
			anim: Math.floor(Math.random() * 8) + 1,
		}));

		setClickParticles((prev) => [...prev, ...newParticles]);

		setTimeout(() => {
			setClickParticles((prev) =>
				prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
			);
		}, 800);

		if (clicks + 1 >= 3) {
			setTimeout(() => {
				setExploded(true);
				setTimeout(() => {
					if (!alreadyClaimed) {
						handleClaim();
					}
				}, 400);
			}, 200);
		}
		setClicks((c) => c + 1);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const ParticleStyles = () => (
		<style jsx>{`
            @keyframes explodeParticle1 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(-40px, -80px); opacity: 0; } }
            @keyframes explodeParticle2 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(-20px, -100px); opacity: 0; } }
            @keyframes explodeParticle3 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(0, -90px); opacity: 0; } }
            @keyframes explodeParticle4 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(20px, -100px); opacity: 0; } }
            @keyframes explodeParticle5 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(40px, -80px); opacity: 0; } }
            @keyframes explodeParticle6 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(60px, -90px); opacity: 0; } }
            @keyframes explodeParticle7 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(100px, -100px); opacity: 0; } }

            @keyframes tapParticle1 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(-40px, -20px); opacity: 0; } } /* Left-Up */
            @keyframes tapParticle2 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(40px, -20px); opacity: 0; } } /* Right-Up */
            @keyframes tapParticle3 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(-30px, 120px); opacity: 0; } } /* Down-Left (Fall) */
            @keyframes tapParticle4 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(30px, 120px); opacity: 0; } } /* Down-Right (Fall) */
            @keyframes tapParticle5 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(-20px, -50px); opacity: 0; } } /* Up-Left */
            @keyframes tapParticle6 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(20px, -50px); opacity: 0; } } /* Up-Right */
            @keyframes tapParticle7 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(-50px, 90px); opacity: 0; } } /* Far Left-Down (Fall) */
            @keyframes tapParticle8 { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -50%) translate(50px, 90px); opacity: 0; } } /* Far Right-Down (Fall) */
        `}</style>
	);

	if (exploded) {
		return (
			<>
				<div className="relative h-24 w-32">
					{[1, 2, 3, 4, 5].map((i) => (
						<div
							key={i}
							className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
							style={{
								animation: `explodeParticle${i} 0.8s forwards ease-out`,
								animationDelay: `${(i - 1) * 0.05}s`,
							}}
						/>
					))}
					<ParticleStyles />
				</div>
				<EasterEggModal
					isOpen={showModal}
					onClose={handleCloseModal}
					alreadyClaimed={alreadyClaimed}
					flcPoints={flcPoints}
					errorMessage={errorMessage}
				/>
			</>
		);
	}

	return (
		<>
			<div className="relative h-24 w-32">
				<div className="absolute -left-1 translate-y-[300%] bottom-0 w-4 h-4 bg-white rounded-full shadow-md border border-gray-100" />
				<div className="absolute left-2 translate-y-[400%] bottom-0 w-3 h-3 bg-white rounded-full shadow-md border border-gray-100" />
				<div className="absolute left-4 translate-y-[500%] bottom-0 w-2.5 h-2.5 bg-white rounded-full shadow-md border border-gray-100" />
				<div className="absolute right-1 translate-y-[260%] bottom-0 w-5 h-5 bg-white rounded-full shadow-md border border-gray-100" />
				<div className="absolute -right-2 translate-y-[360%] bottom-0 w-3.5 h-3.5 bg-white rounded-full shadow-md border border-gray-100" />
				<div className="absolute right-0 translate-y-[500%] bottom-0 w-2 h-2 bg-white rounded-full shadow-md border border-gray-100" />

				{/* Click Particles */}
				{clickParticles.map((p) => (
					<div
						key={p.id}
						className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full shadow-lg z-20 pointer-events-none"
						style={{
							animation: `explodeParticle${p.anim} 0.8s forwards ease-out`,
						}}
					/>
				))}

				{/** biome-ignore lint/a11y/noStaticElementInteractions: <its fine> */}
				{/** biome-ignore lint/a11y/useKeyWithClickEvents: <its fine> */}
				<div
					onClick={handleClick}
					className={`relative h-24 w-20 mx-auto cursor-pointer origin-bottom ${
						clicks === 2 ? "animate-snowman-wobble" : ""
					}`}
				>
					<div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
						<div className="w-10 h-8 bg-black rounded-sm relative">
							<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-black" />
							<div className="absolute bottom-2 left-0 w-full h-1 bg-red-500" />
						</div>
					</div>

					<div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-inner border border-gray-100 z-0">
						<div className="absolute top-3 left-2 w-1.5 h-1.5 bg-black rounded-full" />
						<div className="absolute top-3 right-2 w-1.5 h-1.5 bg-black rounded-full" />
						<div className="absolute top-4 left-1/2 -translate-x-1/2 ml-1 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-12 border-b-orange-500 rotate-90" />
						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
							<div className="w-1 h-1 bg-black rounded-full" />
							<div className="w-1 h-1 bg-black rounded-full translate-y-0.5" />
							<div className="w-1 h-1 bg-black rounded-full translate-y-0.5" />
							<div className="w-1 h-1 bg-black rounded-full" />
						</div>
					</div>

					<div className="absolute top-14 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-inner border border-gray-100 -mt-2 z-[-1]">
						<div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
						<div className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
						<div className="absolute top-4 -left-6 w-8 h-1 bg-amber-900 rotate-12 -z-10" />
						<div className="absolute top-4 -right-6 w-8 h-1 bg-amber-900 -rotate-12 -z-10" />
					</div>

					<div className="absolute top-24 left-1/2 -translate-x-1/2 w-18 h-18 bg-white rounded-full shadow-inner border border-gray-100 -mt-4 z-[-2]" />
				</div>
			</div>
			<EasterEggModal isOpen={showModal} onClose={handleCloseModal} />
			<ParticleStyles />
		</>
	);
};

export default Snowman;
