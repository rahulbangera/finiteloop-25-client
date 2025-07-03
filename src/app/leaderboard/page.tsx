"use client";

export default function Leaderboard() {
	return (
		<main>
			{/* Mobile View */}
			<div className="block md:hidden min-h-screen pt-20 p-2 bg-black flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
				<h1 className="text-3xl select-none text-center">LeaderBoard</h1>
			</div>
			{/* Tablet View */}
			<div className="hidden md:block lg:hidden min-h-screen pt-20 p-8 bg-transparent flex-col items-center justify-center overflow-x-hidden overflow-y-auto"></div>
			{/* Laptop/Desktop View */}
			<div className="hidden lg:block min-h-screen pt-20 p-8 bg-transparent flex-col items-center justify-center overflow-x-hidden overflow-y-auto"></div>
		</main>
	);
}
