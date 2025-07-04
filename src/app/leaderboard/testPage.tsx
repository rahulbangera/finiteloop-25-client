export default function Podium() {
	const players = [
		{
			name: "Saketh Kumar",
			points: 40,
			avatar: "/fox.png",
			rank: 2,
		},
		{
			name: "Saketh Kumar",
			points: 45,
			avatar: "/avatar.png",
			rank: 1,
		},
		{
			name: "Saketh Kumar",
			points: 38,
			avatar: "/panda.png",
			rank: 3,
		},
	];

	const podiumStyle = {
		1: "order-2 -mt-8 z-10", // Center and raised
		2: "order-1 mt-4",
		3: "order-3 mt-6",
	};

	return (
		<div className="flex justify-center items-end gap-4 mt-10">
			{players
				.sort((a, b) => a.rank - b.rank)
				.map((player) => (
					<div
						key={player.rank}
						className={`flex flex-col items-center ${podiumStyle[player.rank as 1 | 2 | 3]}`}
					>
						<div className="relative">
							<img
								src={player.avatar}
								alt={player.name}
								className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
							/>
							<span className="absolute bottom-0 right-1 translate-y-1/2 bg-gray-800 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
								{player.rank}
							</span>
						</div>
						<p className="text-white mt-2 font-semibold text-center">
							{player.name}
						</p>
						<p className="text-gray-300 text-sm">{player.points} pts</p>
					</div>
				))}
		</div>
	);
}
