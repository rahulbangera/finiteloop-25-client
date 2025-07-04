"use client";

import Image from "next/image";
import UserCard from "@/components/elements/userCard";

// biome-ignore format: keeping inline layout for readability
const users = [
  { name: "Saketh Kumar", points: 45, avatar: "/testing/avatar_1.png", rank: 1 },
  { name: "Saketh Kumar", points: 40, avatar: "/testing/avatar_2.png", rank: 2 },
  { name: "Saketh Kumar", points: 38, avatar: "/testing/avatar_3.png", rank: 3 },
  { name: "John Doe", points: 35, avatar: "/testing/avatar_1.png", rank: 4 },
  { name: "Alice Smith", points: 33, avatar: "/testing/avatar_2.png", rank: 5 },
  { name: "Bob Johnson", points: 31, avatar: "/testing/avatar_3.png", rank: 6 },
  { name: "Charlie Brown", points: 29, avatar: "/testing/avatar_1.png", rank: 7 },
  { name: "Diana Prince", points: 27, avatar: "/testing/avatar_2.png", rank: 8 },
  { name: "Edward Nigma", points: 26, avatar: "/testing/avatar_3.png", rank: 9 },
  { name: "Fiona Gallagher", points: 24, avatar: "/testing/avatar_1.png", rank: 10 },
  { name: "George Costanza", points: 23, avatar: "/testing/avatar_2.png", rank: 11 },
  { name: "Hannah Baker", points: 22, avatar: "/testing/avatar_3.png", rank: 12 },
  { name: "Ivan Drago", points: 21, avatar: "/testing/avatar_1.png", rank: 13 },
  { name: "Jill Valentine", points: 20, avatar: "/testing/avatar_2.png", rank: 14 },
  { name: "Karl Urban", points: 19, avatar: "/testing/avatar_3.png", rank: 15 },
  { name: "Laura Palmer", points: 18, avatar: "/testing/avatar_1.png", rank: 16 },
  { name: "Michael Scott", points: 17, avatar: "/testing/avatar_2.png", rank: 17 },
  { name: "Nancy Wheeler", points: 16, avatar: "/testing/avatar_3.png", rank: 18 },
  { name: "Oscar Martinez", points: 15, avatar: "/testing/avatar_1.png", rank: 19 },
  { name: "Pam Beesly", points: 14, avatar: "/testing/avatar_2.png", rank: 20 },
  { name: "Quinn Fabray", points: 13, avatar: "/testing/avatar_3.png", rank: 21 },
  { name: "Ron Swanson", points: 12, avatar: "/testing/avatar_1.png", rank: 22 },
  { name: "Steve Rogers", points: 11, avatar: "/testing/avatar_2.png", rank: 23 },
];
const topThreeUsers = users.filter((user) => user.rank <= 3);
const restUsers = users.filter((user) => user.rank > 3);

const podiumStyle = {
	1: "order-2 mt-0 z-10",
	2: "order-1 mt-15",
	3: "order-3 mt-20",
};
export default function Leaderboard() {
	return (
		<main>
			{/* Mobile View */}
			<div className="block md:hidden min-h-screen mt-20 p-2 bg-transparent flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
				<h1 className="text-center text-2xl p-2 font-[roboto-mono] text-[#FCA410]">
					LeaderBoard
				</h1>
				<div className="bg-transparent flex flex-row justify-center items-center gap-1">
					{topThreeUsers
						.sort((a, b) => a.rank - b.rank)
						.map((user) => (
							<div
								key={user.rank}
								className={`flex flex-col items-center ${podiumStyle[user.rank as 1 | 2 | 3]}`}
							>
								<div className="relative">
									<Image
										src={user.avatar}
										alt={user.name}
										className="rounded-full "
										width={60}
										height={60}
									></Image>

									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gray-800 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
										{user.rank}
									</span>
								</div>
								<p className="text-white mt-3 font-semibold text-center">
									{user.name}
								</p>
								<p className="text-gray-300 text-sm">{user.points} pts</p>
							</div>
						))}
				</div>
				<UserCard
					rank={5}
					name={"Saketh Kumar"}
					points={34}
					className="border-1 border-amber-50 text-[#FCA410] m-2"
				></UserCard>
				<div className="flex flex-col bg-[#0B102A] h-125 mt-2 rounded-3xl overflow-y-auto">
					{restUsers.map((user) => (
						<UserCard
							key={user.rank}
							name={user.name}
							rank={user.rank}
							points={user.points}
							className="m-2"
						/>
					))}
				</div>
			</div>

			{/* Tablet View */}
			<div className="hidden md:block lg:hidden min-h-screen pt-20 p-8 bg-transparent flex-col items-center justify-center overflow-x-hidden overflow-y-auto"></div>
			{/* Laptop/Desktop View */}
			<div className="hidden lg:block min-h-screen pt-20 p-8 bg-transparent flex-col items-center justify-center overflow-x-hidden overflow-y-auto"></div>
		</main>
	);
}
