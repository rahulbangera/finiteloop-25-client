// app/leaderboard/page.tsx
export default function LeaderboardPage() {
	const data = [
		{ name: "Alice", points: 120 },
		{ name: "Bob", points: 100 },
		{ name: "Charlie", points: 90 },
	];

	return (
		<div className="min-h-screen pt-20 bg-gray-100 dark:bg-gray-900 p-8 text-black dark:text-white">
			<h1 className="text-4xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

			<div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
				<table className="w-full text-left">
					<thead className="bg-gray-200 dark:bg-gray-700">
						<tr>
							<th className="px-6 py-3">#</th>
							<th className="px-6 py-3">Name</th>
							<th className="px-6 py-3">Points</th>
						</tr>
					</thead>
					<tbody>
						{data.map((user, index) => (
							<tr
								key={user.name}
								className="border-t border-gray-300 dark:border-gray-600"
							>
								<td className="px-6 py-4">{index + 1}</td>
								<td className="px-6 py-4">{user.name}</td>
								<td className="px-6 py-4">{user.points}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
