"use client";
import UserCard from "@/components/elements/UserCard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";

const podiumStyle = {
	1: "order-2 mb-10 z-10",
	2: "order-1 mb-5",
	3: "order-3 mb-0",
};

const podiumBorder = {
	1: "border-[#FFD700]", // goldy
	2: "border-[#C0C0C0]", // silver
	3: "border-[#CD7F32]", // bronze
};

export default function Leaderboard() {
	type User = {
		rank: number;
		name: string;
		avatar: string;
		userId: number;
		totalActivityPoints?: number;
		image?: string;
	};

	const [topThreeUsers, setTopThreeUsers] = useState<User[]>([]);
	const [restUsers, setRestUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const { data: session } = useSession();

	useEffect(() => {
		async function fetchLeaderboard() {
			setLoading(true);
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/leaderboard/getAll`,
					{
						method: "POST",
					},
				);
				const json = await res.json();
				const data = json.data;
				if (!Array.isArray(data)) {
					setLoading(false);
					return;
				}

				const rankedData = data.map((user, index: number) => ({
					rank: index + 1,
					name: user.name,
					userId: user.id,
					totalActivityPoints: user.totalActivityPoints,
					avatar: user.image || "/testing/avatar_1.jpg",
				}));

				setTopThreeUsers(rankedData.slice(0, 3));
				setRestUsers(rankedData.slice(3));

				if (session?.user.id) {
					const userRes = await fetch(
						`${process.env.NEXT_PUBLIC_SERVER_URL}/api/leaderboard/getRank`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ userId: session.user.id }),
						},
					);
					const userData = await userRes.json();

					if (userData.success) {
						const user: User = {
							rank: userData.rank,
							name: userData.name,
							userId: userData.id,
							totalActivityPoints: userData.activityPoints,
							avatar: userData.image || "/testing/avatar_1.jpg",
						};
						setCurrentUser(user);
					}
				} else {
					setCurrentUser(null);
				}
			} catch (error) {
				console.error("Error fetching leaderboard data:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchLeaderboard();
	}, [session?.user.id]);

	const sortedTopThree = [...topThreeUsers].sort((a, b) => a.rank - b.rank);
	const isCurrentUserVisible = [...sortedTopThree, ...restUsers].some(
		(user) => user.userId === currentUser?.userId,
	);

	if (loading) {
		return (
			<main className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-[#FCA410] border-b-4 mx-auto mb-4"></div>
					<p className="text-3xl lilita-font font-bold text-[#FCA410]">
						Loading Leaderboard...
					</p>
				</div>
			</main>
		);
	}

	return (
		<main>
			{/* Mobile View */}
			<div className="flex md:hidden mt-20 p-2 flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
				<p className="text-center lilita-font text-4xl p-2 font-mono font-bold text-flc-yellow tracking-wide drop-shadow mb-8">
					LeaderBoard
				</p>

				{/* Podium */}
				<div className="flex flex-row justify-center items-end gap-2 mb-6">
					{sortedTopThree.map((user) => (
						<div
							key={user.userId}
							className={`flex flex-col items-center ${podiumStyle[user.rank as 1 | 2 | 3]}`}
						>
							<div className="relative">
								<Image
									src={user.avatar}
									alt={user.name}
									className={`rounded-full border-4 shadow-lg ${podiumBorder[user.rank as 1 | 2 | 3]}`}
									width={80}
									height={80}
								/>
								<span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-[#FCA410] to-yellow-400 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow">
									{user.rank}
								</span>
							</div>
							<p
								className={`mt-5 font-semibold text-center text-2xl ${
									user.userId === currentUser?.userId
										? "text-[#FCA410]"
										: "text-black dark:text-white"
								}`}
							>
								{user.name}
							</p>
							<p className="text-black dark:text-white text-xs font-mono">
								{user.totalActivityPoints} pts
							</p>
						</div>
					))}
				</div>

				{/* Table */}
				<div className="flex flex-col backdrop-blur-sm bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 h-96 max-h-[400px] w-[90%] mt-2 rounded-2xl shadow-lg mb-8">
					<div className="flex flex-row gap-4 h-14 p-5 rounded-2xl justify-between font-mono items-center text-lg bg-gradient-to-r to-white/25 from-[#FCA410]/30 dark:to-white/10 dark:text-white font-bold">
						<span>Rank</span>
						<span>Name</span>
						<span>Points</span>
					</div>
					<Scrollbar permanentTrackY={false} style={{ maxHeight: 250 }}>
						<div className="overflow-y-auto">
							{restUsers.map((user) => (
								<UserCard
									key={user.userId}
									name={user.name}
									rank={user.rank}
									userId={user.userId}
									points={user.totalActivityPoints ?? 0}
									highlightUserId={currentUser?.userId}
									className="h-12 p-3 pl-4 pr-4 rounded-2xl justify-between font-mono items-center text-base dark:text-white hover:bg-[#FCA410]/10 transition"
								/>
							))}
						</div>
					</Scrollbar>
					{currentUser && !isCurrentUserVisible && (
						<>
							<div className="h-0 border-t-2 border-dashed border-gray-300 my-2" />
							<UserCard
								name={currentUser.name}
								rank={currentUser.rank}
								userId={currentUser.userId}
								points={currentUser.totalActivityPoints ?? 0}
								highlightUserId={currentUser.userId}
								className="h-12 p-3 pl-4 pr-4 rounded-2xl justify-between font-mono items-center text-base dark:text-white hover:bg-[#FCA410]/10 transition"
							/>
						</>
					)}
				</div>

				{/* Stats Section for Mobile */}
				<div className="flex flex-col gap-4 w-[90%] mb-8 relative border-2 border-[#FCA410] rounded-3xl p-5 shadow-xl bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm dark:text-white">
					<div className="flex flex-row gap-4 items-center">
						<div className="rounded-lg overflow-hidden shadow-xl border-2 border-[#FCA410] w-20 h-20 flex-shrink-0">
							<Image
								src={currentUser?.avatar ?? "/testing/avatar_1.jpg"}
								alt={currentUser?.name ?? "User"}
								width={80}
								height={80}
								className="object-cover w-full h-full"
							/>
						</div>
						<div className="flex flex-col flex-1">
							<p className="text-xs dark:text-gray-300 font-bold tracking-wide">
								NAME
							</p>
							<p className="text-2xl font-extrabold text-[#FCA410] drop-shadow text-ellipsis overflow-hidden whitespace-nowrap">
								{currentUser?.name ?? "N/A"}
							</p>
						</div>
					</div>
					<div className="flex flex-row gap-4">
						<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-lg rounded-2xl w-1/2 h-20 dark:text-white flex flex-col justify-center items-center border-2 border-[#FCA410]">
							<p className="absolute top-2 left-3 text-xs dark:text-gray-300 font-bold tracking-wide">
								RANK
							</p>
							<div className="flex h-full justify-center items-center">
								<p className="text-3xl font-extrabold text-[#FCA410] drop-shadow">
									{currentUser?.rank ?? "-"}
								</p>
							</div>
						</div>
						<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-lg rounded-2xl w-1/2 h-20 dark:text-white flex flex-col justify-center items-center border-2 border-[#FCA410]">
							<p className="absolute top-2 left-3 text-xs dark:text-gray-300 font-bold tracking-wide">
								POINTS
							</p>
							<div className="flex h-full justify-center items-center">
								<p className="text-3xl font-extrabold text-[#FCA410] drop-shadow">
									{currentUser?.totalActivityPoints ?? "-"}
								</p>
							</div>
						</div>
					</div>
					{!session && (
						<div className="absolute inset-0 flex items-center justify-center z-10">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
								<title>Lock Icon</title>
								<path
									d="M6 9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H6zm6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
									fill="#FCA410"
								/>
								<path
									d="M12 2c-2.8 0-5 2.2-5 5v5h2V7c0-1.7 1.4-3.1 3.1-3.1S15.1 5.3 15.1 7v2h2V7c0-2.8-2.2-5-5-5z"
									fill="#FCA410"
								/>
							</svg>
							<p className="text-xl font-bold text-[#FCA410] rounded-xl px-4 py-2">
								Login to view stats
							</p>
						</div>
					)}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							filter: !session ? "blur(8px)" : "none",
							WebkitBackdropFilter: !session ? "blur(8px)" : "none",
							backdropFilter: !session ? "blur(8px)" : "none",
							zIndex: !session ? 5 : -1,
						}}
					/>
				</div>
			</div>

			{/* Desktop View */}
			<div className="hidden md:flex pt-20 m-8 mb-15 flex-col items-center justify-center overflow-x-hidden">
				<p className="lilita-font text-center text-5xl font-extrabold p-2 font-mono text-flc-yellow tracking-wide drop-shadow mb-8">
					LeaderBoard
				</p>

				{/* Podium */}
				<div className="flex flex-row justify-center items-end gap-6 mb-10">
					{sortedTopThree.map((user) => (
						<div
							key={user.userId}
							className={`flex flex-col items-center ${podiumStyle[user.rank as 1 | 2 | 3]}`}
						>
							<div className="relative">
								<Image
									src={user.avatar}
									alt={user.name}
									className={`rounded-full border-8 shadow-2xl ${podiumBorder[user.rank as 1 | 2 | 3]}`}
									width={175}
									height={175}
								/>
								<span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-[#FCA410] to-yellow-400 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-white">
									{user.rank}
								</span>
							</div>
							<p
								className={`mt-8 font-semibold text-center text-2xl ${
									user.userId === currentUser?.userId
										? "text-[#FCA410]"
										: "text-black dark:text-white"
								}`}
							>
								{user.name}
							</p>
							<p className="dark:text-gray-300 text-lg font-mono">
								{user.totalActivityPoints} pts
							</p>
						</div>
					))}
				</div>

				<div className="flex flex-row gap-10 justify-end w-full md:w-[80%]">
					{/* Table */}
					<div className="flex flex-col backdrop-blur-sm bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 h-125 w-1/2 mt-2 rounded-2xl shadow-lg">
						<div className="flex flex-row gap-4 h-14 p-5 rounded-2xl justify-between font-mono items-center text-2xl bg-gradient-to-r to-white/25 from-[#FCA410]/30 dark:to-white/10 dark:text-white font-bold">
							<span>Rank</span>
							<span>Name</span>
							<span>Points</span>
						</div>
						<Scrollbar permanentTrackY={false}>
							<div className="overflow-y-auto">
								{restUsers.map((user) => (
									<UserCard
										key={user.userId}
										name={user.name}
										rank={user.rank}
										userId={user.userId}
										points={user.totalActivityPoints ?? 0}
										highlightUserId={currentUser?.userId}
										className="h-14 p-5 pl-8 pr-8 rounded-2xl justify-between font-mono items-center text-xl dark:text-white hover:bg-[#FCA410]/10 transition"
									/>
								))}
							</div>
						</Scrollbar>
						{currentUser && !isCurrentUserVisible && (
							<>
								<div className="h-0 border-t-2 border-dashed border-gray-300 my-2" />
								<UserCard
									name={currentUser.name}
									rank={currentUser.rank}
									userId={currentUser.userId}
									points={currentUser.totalActivityPoints ?? 0}
									highlightUserId={currentUser.userId}
									className="h-14 p-5 pl-8 pr-8 rounded-2xl justify-between font-mono items-center text-xl dark:text-white hover:bg-[#FCA410]/10 transition"
								/>
							</>
						)}
					</div>

					{/* Stats Section for Desktop */}
					<div
						className={`flex flex-col m-5 gap-5 w-1/2 relative border-2 border-[#FCA410] rounded-3xl p-5 shadow-xl bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm dark:text-white`}
					>
						<div className="flex flex-row gap-5">
							<div className="rounded-lg overflow-hidden shadow-2xl border-4 border-[#FCA410]">
								<Image
									src={currentUser?.avatar ?? "/testing/avatar_1.jpg"}
									alt={currentUser?.name ?? "User"}
									className=""
									width={200}
									height={200}
								/>
							</div>
							<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-xl rounded-3xl w-1/2 h-full dark:text-white flex flex-col justify-center items-center border-2 border-[#FCA410]">
								<p className="absolute top-2 left-3 text-sm dark:text-gray-300 font-bold tracking-wide">
									RANK
								</p>
								<div className="flex h-full justify-center items-center">
									<p className="text-8xl font-extrabold text-[#FCA410] drop-shadow">
										{currentUser?.rank ?? "-"}
									</p>
								</div>
							</div>
							<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-xl rounded-3xl w-1/2 h-full dark:text-white flex flex-col justify-center items-center border-2 border-[#FCA410]">
								<p className="absolute top-2 left-3 text-sm dark:text-gray-300 font-bold tracking-wide">
									POINTS
								</p>
								<div className="flex h-full justify-center items-center">
									<p className="text-8xl font-extrabold text-[#FCA410] drop-shadow">
										{currentUser?.totalActivityPoints ?? "-"}
									</p>
								</div>
							</div>
						</div>
						<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-xl rounded-3xl w-full h-full dark:text-white border-2 border-[#FCA410]">
							<p className="absolute top-2 left-3 text-sm dark:text-gray-300 font-bold tracking-wide">
								NAME
							</p>
							<div className="flex h-full justify-center items-center wrap-break text-center">
								<p className="text-5xl font-extrabold text-[#FCA410] drop-shadow">
									{currentUser?.name ?? "N/A"}
								</p>
							</div>
						</div>
						{!session && (
							<div className="absolute inset-0 flex items-center justify-center z-10">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
									<title>Lock Icon</title>
									<path
										d="M6 9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H6zm6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
										fill="#FCA410"
									/>
									<path
										d="M12 2c-2.8 0-5 2.2-5 5v5h2V7c0-1.7 1.4-3.1 3.1-3.1S15.1 5.3 15.1 7v2h2V7c0-2.8-2.2-5-5-5z"
										fill="#FCA410"
									/>
								</svg>
								<p className="text-3xl font-bold text-[#FCA410] rounded-xl px-8 py-4">
									Login to view stats
								</p>
							</div>
						)}
						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								filter: !session ? "blur(8px)" : "none",
								WebkitBackdropFilter: !session ? "blur(8px)" : "none",
								backdropFilter: !session ? "blur(8px)" : "none",
								zIndex: !session ? 5 : -1,
							}}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
