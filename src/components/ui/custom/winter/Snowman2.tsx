/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <needed for snowman> */
"use client";
import React from "react";

const Snowman = () => {
	const [clickParticles, setClickParticles] = React.useState<
		{ id: number; anim: number }[]
	>([]);

	const handleClick = () => {
		const newParticles = Array.from({ length: 4 }).map(() => ({
			id: Date.now() + Math.random(),
			anim: Math.floor(Math.random() * 6) + 1,
		}));

		setClickParticles((prev) => [...prev, ...newParticles]);

		setTimeout(() => {
			setClickParticles((prev) =>
				prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
			);
		}, 800);
	};

	return (
		<div className="relative h-24 w-32 scale-150 origin-bottom">
			<div className="absolute -left-1 translate-y-[300%] bottom-0 w-4 h-4 bg-white rounded-full shadow-md border border-gray-100" />
			<div className="absolute left-2 translate-y-[400%] bottom-0 w-3 h-3 bg-white rounded-full shadow-md border border-gray-100" />
			<div className="absolute left-4 translate-y-[500%] bottom-0 w-2.5 h-2.5 bg-white rounded-full shadow-md border border-gray-100" />
			<div className="absolute right-1 translate-y-[260%] bottom-0 w-5 h-5 bg-white rounded-full shadow-md border border-gray-100" />
			<div className="absolute -right-2 translate-y-[360%] bottom-0 w-3.5 h-3.5 bg-white rounded-full shadow-md border border-gray-100" />
			<div className="absolute right-0 translate-y-[500%] bottom-0 w-2 h-2 bg-white rounded-full shadow-md border border-gray-100" />

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
			<div
				onClick={handleClick}
				className={`relative h-24 w-20 mx-auto cursor-pointer origin-bottom`}
			>
				<div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
					<div className="w-10 h-8 bg-amber-900 rounded-sm relative">
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-amber-700" />
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
	);
};

export default Snowman;
