"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";
import UserCard from "@/components/elements/UserCard";
import SkatingPenguin from "@/components/ui/custom/winter/HidingPenguin";

const podiumStyle = {
	1: "order-2 z-10", // First place - center
	2: "order-1 z-5 mt-8", // Second place - left, lower than 1st
	3: "order-3 z-5 mt-12", // Third place - right, lowest
};

const podiumBorder = {
	1: "border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)]", // Gold with glow
	2: "border-[#C0C0C0] shadow-[0_0_15px_rgba(192,192,192,0.4)]", // Silver with glow
	3: "border-[#CD7F32] shadow-[0_0_15px_rgba(205,127,50,0.4)]", // Bronze with glow
};

const podiumRankBg = {
	1: "bg-gradient-to-r from-[#FFD700] to-[#FFA500] border-yellow-300", // Gold gradient
	2: "bg-gradient-to-r from-[#C0C0C0] to-[#A8A8A8] border-gray-300", // Silver gradient
	3: "bg-gradient-to-r from-[#CD7F32] to-[#B8860B] border-orange-400", // Bronze gradient
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

				const rankedData = data.map((user) => ({
					rank: user.rank,
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
			<div className="flex md:hidden p-2 flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
				<div className="text-center mb-16">
					<h1 className="lilita-font text-5xl font-bold text-flc-yellow relative mt-32 select-none">
						LEADERBOARD
					</h1>
				</div>

				<div className="flex flex-row justify-center items-end gap-3 mb-8 px-2 h-48">
					{sortedTopThree.map((user) => (
						<button
							key={user.userId}
							type="button"
							className={`flex flex-col items-center justify-end transition-all duration-300 cursor-pointer hover:scale-105 bg-transparent border-none p-0 ${podiumStyle[user.rank as 1 | 2 | 3]} w-[90px]`}
							onClick={() => {
								window.location.assign(`/profile/${user.userId}`);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									window.location.assign(`/profile/${user.userId}`);
								}
							}}
						>
							<div className="relative mb-3">
								{user.avatar && user.avatar !== "/testing/avatar_1.jpg" ? (
									<Image
										src={user.avatar}
										alt={user.name}
										className={`rounded-full border-4 shadow-xl transition-all duration-300 ${podiumBorder[user.rank as 1 | 2 | 3]} object-cover`}
										width={user.rank === 1 ? 85 : 70}
										height={user.rank === 1 ? 85 : 70}
										style={{
											width: user.rank === 1 ? 85 : 70,
											height: user.rank === 1 ? 85 : 70,
										}}
									/>
								) : (
									<div
										className={`rounded-full border-4 shadow-xl transition-all duration-300 ${podiumBorder[user.rank as 1 | 2 | 3]} flex items-center justify-center font-bold text-white`}
										style={{
											width: user.rank === 1 ? 85 : 70,
											height: user.rank === 1 ? 85 : 70,
											backgroundColor: `hsl(${(user.name.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`,
											fontSize: user.rank === 1 ? "34px" : "28px",
										}}
									>
										{user.name.charAt(0).toUpperCase()}
									</div>
								)}
								<span
									className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${podiumRankBg[user.rank as 1 | 2 | 3]} text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2`}
								>
									{user.rank}
								</span>
							</div>
							<div className="text-center w-full">
								<p
									className={`font-sans font-bold text-center leading-tight mb-1 ${
										user.rank === 1 ? "text-lg" : "text-base"
									} ${
										user.userId === currentUser?.userId
											? "text-[#FCA410]"
											: "text-black dark:text-white"
									}`}
								>
									{user.name.length > 8
										? `${user.name.substring(0, 8)}...`
										: user.name}
								</p>
								<p
									className={`text-gray-600 dark:text-gray-300 font-sans font-medium ${user.rank === 1 ? "text-sm" : "text-xs"}`}
								>
									{user.totalActivityPoints} pts
								</p>
							</div>
							<div
								className={`w-full mt-2 rounded-t-lg ${
									user.rank === 1
										? "bg-gradient-to-b from-[#FFD700]/30 to-[#FFA500]/20 h-12"
										: user.rank === 2
											? "bg-gradient-to-b from-[#C0C0C0]/30 to-[#A8A8A8]/20 h-8"
											: "bg-gradient-to-b from-[#CD7F32]/30 to-[#B8860B]/20 h-6"
								}`}
							/>
						</button>
					))}
				</div>

				<div className="flex flex-col backdrop-blur-sm bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 h-96 max-h-[400px] w-[90%] mt-2 rounded-2xl shadow-lg mb-8">
					<div className="flex flex-row gap-4 h-14 p-5 rounded-2xl justify-between font-mono items-center text-lg bg-gradient-to-r to-white/25 from-[#FCA410]/30 dark:to-white/10 dark:text-white font-bold">
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

				<div className="flex flex-col gap-4 w-[92%] mb-8 relative border-2 border-[#FCA410] rounded-3xl p-5 shadow-xl bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm dark:text-white">
					<div className="flex flex-row gap-4 items-center">
						<div className="rounded-xl overflow-hidden shadow-xl border-2 border-[#FCA410] w-20 h-20 flex-shrink-0">
							{currentUser?.avatar &&
							currentUser.avatar !== "/testing/avatar_1.jpg" ? (
								<Image
									src={currentUser.avatar}
									alt={currentUser?.name ?? "User"}
									width={80}
									height={80}
									className="object-cover w-full h-full"
									style={{
										width: 80,
										height: 80,
									}}
								/>
							) : (
								<div
									className="w-full h-full flex items-center justify-center font-bold text-white text-2xl"
									style={{
										backgroundColor: `hsl(${((currentUser?.name?.charCodeAt(0) ?? 65) * 137.5) % 360}, 70%, 50%)`,
									}}
								>
									{currentUser?.name?.charAt(0).toUpperCase() ?? "U"}
								</div>
							)}
						</div>
						<div className="flex flex-col flex-1 min-w-0">
							<p className="text-xs dark:text-gray-300 font-bold tracking-wide">
								NAME
							</p>
							<p className="text-xl font-extrabold text-[#FCA410] drop-shadow truncate">
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
						<div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2">
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
							<p className="text-lg font-bold text-[#FCA410] rounded-xl px-4 py-2">
								Login to view stats
							</p>
						</div>
					)}
					<div
						className="absolute inset-0 pointer-events-none rounded-3xl"
						style={{
							filter: !session ? "blur(8px)" : "none",
							WebkitBackdropFilter: !session ? "blur(8px)" : "none",
							backdropFilter: !session ? "blur(8px)" : "none",
							zIndex: !session ? 5 : -1,
						}}
					/>
				</div>
			</div>

			<div className="hidden md:flex pt-20 m-8 mb-15 flex-col items-center justify-center overflow-x-hidden">
				<div className="text-center mb-16">
					<h1 className="lilita-font text-6xl md:text-7xl lg:text-8xl font-bold text-flc-yellow relative mt-8 select-none">
						LEADERBOARD
					</h1>
				</div>

				<div className="flex flex-row justify-center items-end gap-8 mb-12 px-4 h-96">
					{sortedTopThree.map((user) => (
						<button
							key={user.userId}
							type="button"
							className={`flex flex-col items-center justify-end transition-all duration-500 cursor-pointer hover:scale-105 bg-transparent border-none p-0 ${podiumStyle[user.rank as 1 | 2 | 3]} relative`}
							onClick={() => {
								window.location.assign(`/profile/${user.userId}`);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									window.location.assign(`/profile/${user.userId}`);
								}
							}}
						>
							{/* Content positioned above the podium base */}
							<div className="flex flex-col items-center mb-3">
								<div className="relative mb-6">
									{user.avatar && user.avatar !== "/testing/avatar_1.jpg" ? (
										<Image
											src={user.avatar}
											alt={user.name}
											className={`rounded-full border-8 shadow-2xl transition-all duration-500 ${podiumBorder[user.rank as 1 | 2 | 3]} object-cover`}
											width={user.rank === 1 ? 200 : 160}
											height={user.rank === 1 ? 200 : 160}
											style={{
												width: user.rank === 1 ? 200 : 160,
												height: user.rank === 1 ? 200 : 160,
											}}
										/>
									) : (
										<div
											className={`rounded-full border-8 shadow-2xl transition-all duration-500 ${podiumBorder[user.rank as 1 | 2 | 3]} flex items-center justify-center font-bold text-white`}
											style={{
												width: user.rank === 1 ? 200 : 160,
												height: user.rank === 1 ? 200 : 160,
												backgroundColor: `hsl(${(user.name.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`,
												fontSize: user.rank === 1 ? "80px" : "64px",
											}}
										>
											{user.name.charAt(0).toUpperCase()}
										</div>
									)}
									<span
										className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${podiumRankBg[user.rank as 1 | 2 | 3]} text-white font-bold rounded-full flex items-center justify-center shadow-xl border-4 border-white ${user.rank === 1 ? "text-xl w-14 h-14" : "text-lg w-12 h-12"}`}
									>
										{user.rank}
									</span>
								</div>
								<div className="text-center">
									<p
										className={`font-sans font-bold text-center transition-all duration-300 ${
											user.rank === 1 ? "text-3xl" : "text-2xl"
										} ${
											user.userId === currentUser?.userId
												? "text-[#FCA410]"
												: "text-black dark:text-white"
										}`}
									>
										{user.name.length > 15
											? `${user.name.substring(0, 15)}...`
											: user.name}
									</p>
									<p
										className={`text-gray-600 dark:text-gray-300 font-sans font-semibold mt-2 ${user.rank === 1 ? "text-xl" : "text-lg"}`}
									>
										{user.totalActivityPoints} pts
									</p>
								</div>
							</div>
							{/* Podium Base */}
							<div
								className={`w-full rounded-t-xl ${
									user.rank === 1
										? "bg-gradient-to-b from-[#FFD700]/30 to-[#FFA500]/20 h-20"
										: user.rank === 2
											? "bg-gradient-to-b from-[#C0C0C0]/30 to-[#A8A8A8]/20 h-16"
											: "bg-gradient-to-b from-[#CD7F32]/30 to-[#B8860B]/20 h-12"
								} min-w-[180px]`}
							/>
						</button>
					))}
				</div>

				<div className="flex flex-row gap-8 justify-center w-full max-w-7xl mx-auto px-4">
					<div className="flex flex-col backdrop-blur-sm bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 h-125 w-1/2 mt-2 rounded-2xl shadow-lg">
						<div className="flex flex-row gap-4 h-16 p-6 rounded-2xl justify-between font-mono items-center text-2xl bg-gradient-to-r to-white/25 from-[#FCA410]/30 dark:to-white/10 dark:text-white font-bold">
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
										className="h-16 p-6 pl-8 pr-8 rounded-2xl justify-between font-mono items-center text-xl dark:text-white hover:bg-[#FCA410]/10 transition-all duration-200"
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
									className="h-16 p-6 pl-8 pr-8 rounded-2xl justify-between font-mono items-center text-xl dark:text-white hover:bg-[#FCA410]/10 transition-all duration-200"
								/>
							</>
						)}
					</div>

					<div
						className={`flex flex-col gap-6 w-1/2 relative border-2 border-[#FCA410] rounded-3xl p-6 shadow-xl bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm dark:text-white`}
					>
						<div className="flex flex-row gap-6 h-48">
							<div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FCA410] flex-shrink-0">
								{currentUser?.avatar &&
								currentUser.avatar !== "/testing/avatar_1.jpg" ? (
									<Image
										src={currentUser.avatar}
										alt={currentUser?.name ?? "User"}
										className="object-cover"
										width={192}
										height={192}
										style={{
											width: 192,
											height: 192,
										}}
									/>
								) : (
									<div
										className="w-48 h-48 flex items-center justify-center font-bold text-white text-6xl"
										style={{
											backgroundColor: `hsl(${((currentUser?.name?.charCodeAt(0) ?? 65) * 137.5) % 360}, 70%, 50%)`,
										}}
									>
										{currentUser?.name?.charAt(0).toUpperCase() ?? "U"}
									</div>
								)}
							</div>
							<div className="flex flex-col gap-4 flex-1">
								<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-xl rounded-2xl h-1/2 dark:text-white flex flex-col justify-center items-center border-2 border-[#FCA410]">
									<p className="absolute top-2 left-4 text-sm dark:text-gray-300 font-bold tracking-wide">
										RANK
									</p>
									<div className="flex h-full justify-center items-center">
										<p className="text-6xl font-extrabold text-[#FCA410] drop-shadow">
											{currentUser?.rank ?? "-"}
										</p>
									</div>
								</div>
								<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-xl rounded-2xl h-1/2 dark:text-white flex flex-col justify-center items-center border-2 border-[#FCA410]">
									<p className="absolute top-2 left-4 text-sm dark:text-gray-300 font-bold tracking-wide">
										POINTS
									</p>
									<div className="flex h-full justify-center items-center">
										<p className="text-6xl font-extrabold text-[#FCA410] drop-shadow">
											{currentUser?.totalActivityPoints ?? "-"}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="relative bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 backdrop-blur-sm shadow-xl rounded-2xl h-20 dark:text-white border-2 border-[#FCA410]">
							<p className="absolute top-2 left-4 text-sm dark:text-gray-300 font-bold tracking-wide">
								NAME
							</p>
							<div className="flex h-full justify-center items-center px-4">
								<p className="text-4xl font-extrabold text-[#FCA410] drop-shadow text-center truncate">
									{currentUser?.name ?? "N/A"}
								</p>
							</div>
						</div>
						{!session && (
							<div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4">
								<svg width="48" height="48" viewBox="0 0 24 24" fill="none">
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
							className="absolute inset-0 pointer-events-none rounded-3xl"
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

			<div className="fixed bottom-0 right-4 md:right-10 z-20">
				<SkatingPenguin />
			</div>
		</main>
	);
}
