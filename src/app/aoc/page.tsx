"use client";
import { useState, useEffect, useMemo } from "react";

type LeaderboardMember = {
	name: string | null;
	local_score: number;
	global_score?: number;
	stars: number;
	last_star_ts?: number;
	completion_day_level: Record<string, unknown>;
	id: string;
};

type LeaderboardResponse = {
	event: string;
	owner_id: string;
	members: Record<string, LeaderboardMember>;
};

const formatTimestamp = (ts?: number) => {
	if (!ts) return "—";
	const date = new Date(ts * 1000);
	return new Intl.DateTimeFormat("en-IN", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Kolkata",
		timeZoneName: "short",
	}).format(date);
};

const dayStatuses = (member: LeaderboardMember) => {
	const days = Object.entries(member.completion_day_level || {}).map(
		([day, parts]) => {
			const dayData = parts as Record<string, { get_star_ts: number }>;
			const hasFirst = Boolean(dayData["1"]);
			const hasSecond = Boolean(dayData["2"]);
			return {
				day,
				stars: hasSecond ? 2 : hasFirst ? 1 : 0,
			};
		},
	);
	return days.sort((a, b) => Number(a.day) - Number(b.day));
};

export default function AocPage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
		null,
	);
	const [copied, setCopied] = useState(false);
	const leaderboardCode = "3645225-4f0411e8";

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(leaderboardCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy leaderboard code", err);
		}
	};

	useEffect(() => {
		let abort = false;
		async function fetchLeaderboard() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch("/api/aoc/leaderboard", {
					cache: "no-store",
				});
				if (!res.ok) {
					throw new Error(`Request failed with status ${res.status}`);
				}
				const json = await res.json();
				let data = json.data;

				if (typeof data === "string") {
					try {
						data = JSON.parse(data);
					} catch {
						throw new Error("Failed to parse leaderboard data");
					}
				}

				if (!data || typeof data !== "object" || !data.members) {
					throw new Error("Unexpected leaderboard response shape");
				}

				if (!abort) {
					setLeaderboard(data as LeaderboardResponse);
				}
			} catch (err) {
				if (!abort) {
					setError(err instanceof Error ? err.message : "Unknown error");
					setLeaderboard(null);
				}
			} finally {
				if (!abort) {
					setLoading(false);
				}
			}
		}
		fetchLeaderboard();
		return () => {
			abort = true;
		};
	}, []);

	const members = useMemo(() => {
		if (!leaderboard) return [] as LeaderboardMember[];
		return Object.values(leaderboard.members).sort((a, b) => {
			if (b.local_score === a.local_score) {
				return b.stars - a.stars;
			}
			return b.local_score - a.local_score;
		});
	}, [leaderboard]);

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
		<main className="min-h-screen pb-24">
			<div className="flex p-4 flex-col items-center justify-center">
				<div className="text-center mb-10 mt-16">
					<p className="text-sm uppercase tracking-widest text-gray-400">
						Event {leaderboard?.event ?? "2025"}
					</p>
					<h1 className="lilita-font text-5xl font-bold text-flc-yellow select-none">
						ADVENT OF CODE LEADERBOARD
					</h1>
					<div className="mt-4 flex flex-col sm:flex-row items-center gap-2 justify-center">
						<p className="text-gray-300">Leaderboard code:</p>
						<div className="flex items-center gap-2">
							<span className="font-mono text-sm tracking-wide px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white">
								{leaderboardCode}
							</span>
							<button
								type="button"
								onClick={copyCode}
								className="h-9 w-9 flex items-center justify-center rounded-lg border border-flc-yellow/50 text-flc-yellow hover:bg-flc-yellow/10 transition"
								title="Copy leaderboard code"
							>
								<span className="sr-only">Copy code</span>
								{copied ? (
									<span className="text-xs font-semibold">✓</span>
								) : (
									<svg
										role="img"
										aria-label="Copy to clipboard icon"
										className="h-4 w-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Copy to clipboard</title>
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{error && (
					<div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl px-6 py-4 w-full max-w-3xl mb-8">
						<p className="font-semibold">Failed to load leaderboard</p>
						<p className="text-sm">{error}</p>
					</div>
				)}

				<div className="w-full max-w-5xl space-y-4">
					<div className="hidden sm:grid text-xs uppercase tracking-wide text-gray-400 px-6 py-2 rounded-xl border border-white/5 bg-white/5 grid-cols-[70px_minmax(0,1fr)_70px_90px_minmax(0,1.6fr)]">
						<span>Rank</span>
						<span>Member</span>
						<span>Stars</span>
						<span>Score</span>
						<span>Last Star & Progress</span>
					</div>

					<div className="space-y-4">
						{members.map((member, index) => {
							const statuses = dayStatuses(member);
							return (
								<div
									key={member.id}
									className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur"
								>
									<div className="grid gap-4 sm:grid-cols-[70px_minmax(0,1fr)_70px_90px_minmax(0,1.6fr)] items-start">
										<div>
											<p className="sm:hidden text-xs uppercase tracking-wide text-gray-400">
												Rank
											</p>
											<p className="text-2xl font-bold text-flc-yellow">
												#{index + 1}
											</p>
										</div>
										<div>
											<p className="sm:hidden text-xs uppercase tracking-wide text-gray-400">
												Member
											</p>
											<p className="font-semibold text-white text-lg">
												{member.name || "Anonymous sleigh rider"}
											</p>
										</div>
										<div>
											<p className="sm:hidden text-xs uppercase tracking-wide text-gray-400">
												Stars
											</p>
											<p className="text-xl font-bold text-white">
												{member.stars}
											</p>
										</div>
										<div>
											<p className="sm:hidden text-xs uppercase tracking-wide text-gray-400">
												Score
											</p>
											<p className="text-xl font-bold text-white">
												{member.local_score}
											</p>
											{typeof member.global_score === "number" && (
												<p className="text-xs text-gray-400">
													Global: {member.global_score}
												</p>
											)}
										</div>
										<div>
											<p className="sm:hidden text-xs uppercase tracking-wide text-gray-400">
												Last Star & Progress
											</p>
											<p className="text-sm text-gray-200 mb-3">
												{formatTimestamp(member.last_star_ts)}
											</p>
											<div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
												{statuses.map((day) => (
													<span
														key={`${member.id}-${day.day}`}
														className={`px-2 py-1 rounded-full text-[0.65rem] font-semibold border text-center ${
															day.stars === 2
																? "bg-green-500/15 text-green-200 border-green-400/40"
																: day.stars === 1
																	? "bg-amber-500/15 text-amber-200 border-amber-400/40"
																	: "bg-gray-500/15 text-gray-200 border-gray-400/30"
														}`}
													>
														D{day.day}{" "}
														{day.stars === 2
															? "⭐⭐"
															: day.stars === 1
																? "⭐"
																: "—"}
													</span>
												))}
												{statuses.length === 0 && (
													<span className="text-xs text-gray-400">
														No attempts yet
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}

						{members.length === 0 && !error && (
							<div className="text-center text-gray-400 border border-white/10 rounded-2xl py-10">
								No members found. Try reloading after someone scores.
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
