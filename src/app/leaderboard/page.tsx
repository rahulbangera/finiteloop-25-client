"use client";

import Image from "next/image";
import UserCard from "@/components/elements/UserCard";

// biome-ignore format: keeping inline layout for readability
const users = [
  { name: "Saketh Kumar", points: 45, avatar: "/testing/avatar_1.jpg", rank: 1 },
  { name: "Saketh Kumar", points: 40, avatar: "/testing/avatar_2.jpg", rank: 2 },
  { name: "Saketh Kumar", points: 38, avatar: "/testing/avatar_3.jpg", rank: 3 },
  { name: "John Doe", points: 35, avatar: "/testing/avatar_1.jpg", rank: 4 },
  { name: "Alice Smith", points: 33, avatar: "/testing/avatar_2.jpg", rank: 5 },
  { name: "Bob Johnson", points: 31, avatar: "/testing/avatar_3.jpg", rank: 6 },
  { name: "Charlie Brown", points: 29, avatar: "/testing/avatar_1.jpg", rank: 7 },
  { name: "Diana Prince", points: 27, avatar: "/testing/avatar_2.jpg", rank: 8 },
  { name: "Edward Nigma", points: 26, avatar: "/testing/avatar_3.jpg", rank: 9 },
  { name: "Fiona Gallagher", points: 24, avatar: "/testing/avatar_1.jpg", rank: 10 },
  { name: "George Costanza", points: 23, avatar: "/testing/avatar_2.jpg", rank: 11 },
  { name: "Hannah Baker", points: 22, avatar: "/testing/avatar_3.jpg", rank: 12 },
  { name: "Ivan Drago", points: 21, avatar: "/testing/avatar_1.jpg", rank: 13 },
  { name: "Jill Valentine", points: 20, avatar: "/testing/avatar_2.jpg", rank: 14 },
  { name: "Karl Urban", points: 19, avatar: "/testing/avatar_3.jpg", rank: 15 },
  { name: "Laura Palmer", points: 18, avatar: "/testing/avatar_1.jpg", rank: 16 },
  { name: "Michael Scott", points: 17, avatar: "/testing/avatar_2.jpg", rank: 17 },
  { name: "Nancy Wheeler", points: 16, avatar: "/testing/avatar_3.jpg", rank: 18 },
  { name: "Oscar Martinez", points: 15, avatar: "/testing/avatar_1.jpg", rank: 19 },
  { name: "Pam Beesly", points: 14, avatar: "/testing/avatar_2.jpg", rank: 20 },
  { name: "Quinn Fabray", points: 13, avatar: "/testing/avatar_3.jpg", rank: 21 },
  { name: "Ron Swanson", points: 12, avatar: "/testing/avatar_1.jpg", rank: 22 },
  { name: "Steve Rogers", points: 11, avatar: "/testing/avatar_2.jpg", rank: 23 },
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
			<div className="block md:hidden  mt-20 p-2 bg-transparent flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
				<p className="text-center text-2xl p-2 text-[#FCA410]">LeaderBoard</p>
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
								<p className="dark:text-white mt-3 font-semibold text-center">
									{user.name}
								</p>
								<p className="text-gray-300 text-sm">{user.points} pts</p>
							</div>
						))}
				</div>
				<UserCard
					rank={5}
					name={"You"}
					points={34}
					className="border-1 p-5 border-black dark:border-amber-50 dark:text-[#FCA410] font-bold m-2 backdrop-blur-sm justify-between rounded-2xl items-center"
				></UserCard>
				<div className="flex flex-col backdrop-blur-sm dark:bg-white/20 h-125 m-2 border-black dark:border-none border-1 rounded-3xl overflow-y-auto">
					{restUsers.map((user) => (
						<UserCard
							key={user.rank}
							name={user.name}
							rank={user.rank}
							points={user.points}
							className="m-1 p-3 justify-between rounded-2xl font-[roboto-mono] text-black dark:text-white"
						/>
					))}
				</div>
			</div>

			{/* Desktop/Tablet View */}
			<div className="hidden md:block lg:block  pt-20 p-8  flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
				<p className="text-center text-4xl font-extrabold p-2 font-mono text-[#FCA410]">
					LeaderBoard
				</p>

				<div className="bg-transparent flex flex-row justify-center items-center gap-3">
					{topThreeUsers
						.sort((a, b) => a.rank - b.rank)
						.map((user) => (
							<div
								key={user.rank}
								className={`flex flex-col items-center  ${podiumStyle[user.rank as 1 | 2 | 3]}`}
							>
								<div className="relative">
									<Image
										src={user.avatar}
										alt={user.name}
										className="rounded-full "
										width={175}
										height={175}
									></Image>

									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gray-800 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
										{user.rank}
									</span>
								</div>
								<p className="dark:text-white mt-3 font-semibold text-center">
									{user.name}
								</p>
								<p className="dark:text-gray-300 text-sm">{user.points} pts</p>
							</div>
						))}
				</div>
				<div className="flex flex-row gap-10 ml-15 mr-15 justify-end">
					<div className="flex flex-col backdrop-blur-sm  bg-white/20 h-125 w-1/2 mt-2 rounded-2xl">
						<div
							className={
								"flex flex-row gap-4 h-12 p-5 rounded-2xl justify-between font-mono items-center text-2xl bg-white/30"
							}
						>
							<span>{"Rank"}</span>
							<span>{"Name"}</span>
							<span>{"Points"}</span>
						</div>
						<div className=" overflow-y-auto">
							{restUsers.map((user) => (
								<UserCard
									key={user.rank}
									name={user.name}
									rank={user.rank}
									points={user.points}
									className="h-12 p-5 pl-8 pr-8 rounded-2xl justify-between font-mono items-center text-xl"
								/>
							))}
						</div>
					</div>
					<div className="flex flex-col m-5  gap-5 w-1/2">
						<div className="flex flex-row gap-5">
							<div className="rounded-lg overflow-hidden shadow-xl ">
								<Image
									src={"/testing/avatar_1.jpg"}
									alt={"Saketh Kumar"}
									className=""
									width={200}
									height={200}
								></Image>
							</div>
							<div className="relative bg-white/20 backdrop-blur-sm shadow-xl rounded-3xl w-1/2 h-100% bg- dark:text-white">
								<p className="absolute top-2 left-3 text-sm dark:text-gray-300">
									RANK
								</p>
								<div className="flex h-full justify-center items-center">
									<p className="text-8xl font-medium">5</p>
								</div>
							</div>
							<div className="relative  bg-white/20 backdrop-blur-sm shadow-xl rounded-3xl w-1/2 h-100% bg- dark:text-white">
								<p className="absolute top-2 left-3 text-sm dark:text-gray-300">
									POINTS
								</p>
								<div className="flex h-full justify-center items-center">
									<p className="text-8xl font-medium">33</p>
								</div>
							</div>
						</div>
						<div className="relative  bg-white/20 backdrop-blur-sm shadow-xl rounded-3xl w-full h-full bg- dark:text-white">
							<p className="absolute top-2 left-3 text-sm dark:text-gray-300">
								NAME
							</p>
							<div className="flex h-full justify-center items-center wrap-break text-center">
								<p className="text-8xl font-medium ">Alice Smith</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
