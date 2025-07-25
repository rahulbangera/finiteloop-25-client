"use client";

import Image from "next/image";
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserLink {
	id: string;
	platform: string;
	url: string;
	userId: string;
}

interface TeamMember {
	id: number;
	name: string;
	image: string | null;
	userLink: UserLink[];
	year: string;
	position: string;
	type: string;
	priority: number;
}

interface APIResponse {
	success: boolean;
	data: TeamMember[];
	error?: string;
}

export default function Team() {
	const router = useRouter();
	const [selectedYearIndex, setSelectedYearIndex] = useState(5);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const yearOptions = [
		{ id: "2020", label: "2020" },
		{ id: "2021", label: "2021" },
		{ id: "2022", label: "2022" },
		{ id: "2023", label: "2023" },
		{ id: "2024", label: "2024" },
		{ id: "2025", label: "2025" },
		{ id: "faculty", label: "Faculty" },
	];

	useEffect(() => {
		const fetchTeamMembers = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/core/getAll`,
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result: APIResponse = await response.json();

				if (result.success && result.data) {
					setTeamMembers(result.data);
				} else {
					throw new Error(result.error || "Failed to fetch team members");
				}
			} catch (err) {
				console.error("Error fetching team members:", err);
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchTeamMembers();
	}, []);

	const selectedYear = yearOptions[selectedYearIndex].label;

	const filteredMembers = teamMembers.filter(
		(member) => member.year === selectedYear,
	);

	const getSocialLink = (
		userLinks: UserLink[],
		platform: string,
	): string | undefined => {
		const link = userLinks.find(
			(link) => link.platform.toLowerCase() === platform.toLowerCase(),
		);
		return link?.url;
	};

	if (loading) {
		return (
			<main className="min-h-screen py-20 px-4 relative flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						Loading team members...
					</p>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen py-20 px-4 relative flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">⚠️ Error Loading Team</div>
					<p className="text-gray-600 dark:text-gray-400">{error}</p>
					<button
						type="button"
						onClick={() => router.refresh()}
						className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen py-20 px-4 relative">
			<div className="max-w-7xl mx-auto relative z-10">
				<div className="text-center mb-16">
					<h1 className="lilita-font text-6xl md:text-7xl lg:text-8xl font-bold text-flc-yellow relative mt-8 select-none">
						MEET THE TEAM
					</h1>
					<p className="comic-font text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mt-6 max-w-2xl mx-auto font-medium">
						Dynamic and Agile
					</p>

					<div className="md:hidden mt-8 max-w-sm mx-auto space-y-3">
						<div className="relative">
							<select
								value={selectedYearIndex}
								onChange={(e) => setSelectedYearIndex(Number(e.target.value))}
								className="w-full px-6 py-4 pr-12 rounded-2xl text-sm font-bold bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 text-white border border-purple-400/50 shadow-[0_0_20px_rgba(139,92,246,0.4)] backdrop-blur-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300"
							>
								{yearOptions.slice(0, -1).map((year, index) => (
									<option
										key={year.id}
										value={index}
										className="bg-slate-800 text-white"
									>
										{year.label}
									</option>
								))}
							</select>
							<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>

						<button
							type="button"
							onClick={() => setSelectedYearIndex(yearOptions.length - 1)}
							className={`w-full group relative px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 backdrop-blur-xl border overflow-hidden ${
								selectedYearIndex === yearOptions.length - 1
									? "bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105"
									: "bg-white/20 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:border-amber-300/50 dark:hover:border-amber-400/30 hover:scale-105"
							}`}
						>
							<span className="relative z-10 tracking-wide">Faculty</span>
						</button>
					</div>

					<div className="hidden md:flex justify-center gap-4 mt-8 max-w-4xl mx-auto">
						<div className="relative">
							<select
								value={selectedYearIndex}
								onChange={(e) => setSelectedYearIndex(Number(e.target.value))}
								className="px-8 py-4 pr-12 rounded-2xl text-sm font-bold bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 text-white border border-purple-400/50 shadow-[0_0_20px_rgba(139,92,246,0.4)] backdrop-blur-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 min-w-[200px] transition-all duration-300"
							>
								{yearOptions.slice(0, -1).map((year, index) => (
									<option
										key={year.id}
										value={index}
										className="bg-slate-800 text-white"
									>
										{year.label}
									</option>
								))}
							</select>
							<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>

						<button
							type="button"
							onClick={() => setSelectedYearIndex(yearOptions.length - 1)}
							className={`group relative px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-500 backdrop-blur-xl border overflow-hidden ${
								selectedYearIndex === yearOptions.length - 1
									? "bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4),0_0_40px_rgba(251,146,60,0.2)] scale-105"
									: "bg-white/20 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:border-amber-300/50 dark:hover:border-amber-400/30 hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
							}`}
						>
							<div
								className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
									selectedYearIndex === yearOptions.length - 1
										? "bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-red-500/20 opacity-100"
										: "bg-gradient-to-br from-amber-300/10 via-orange-300/10 to-red-300/10 opacity-0 group-hover:opacity-100"
								}`}
							></div>

							{selectedYearIndex === yearOptions.length - 1 && (
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-30 animate-pulse"></div>
							)}

							{selectedYearIndex === yearOptions.length - 1 && (
								<>
									<div className="absolute top-2 right-2 w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
									<div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse delay-300"></div>
									<div className="absolute top-1/2 left-1 w-1 h-1 bg-white/70 rounded-full animate-bounce delay-500"></div>
								</>
							)}

							<span className="relative z-10 tracking-wide">Faculty</span>

							<div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-700 group-hover:translate-y-full"></div>
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
					{filteredMembers.length === 0 ? (
						<div className="col-span-full text-center text-gray-600 dark:text-gray-400 text-xl mt-10">
							No team members found for {selectedYear}
						</div>
					) : (
						filteredMembers.map((member) => (
							<div key={member.id} className="group relative">
								<div className="relative w-80 h-[18rem] bg-white/10 dark:bg-gradient-to-br dark:from-slate-900/40 dark:via-blue-900/20 dark:to-purple-900/30 backdrop-blur-xl border border-purple-200/50 dark:border-slate-700/50 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-purple-400/70 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-blue-500/20">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-300/20 via-pink-300/20 to-blue-300/20 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

									<div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-blue-400 dark:to-cyan-400 rounded-full opacity-70 animate-pulse"></div>
									<div className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-purple-400 dark:to-pink-400 rounded-full opacity-60 animate-ping"></div>

									<div className="relative z-10 flex flex-col items-center text-center p-4 h-full">
										<div className="relative mb-3 group-hover:scale-110 transition-transform duration-500">
											<div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 p-1 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500">
												<div className="w-full h-full rounded-full bg-white dark:bg-slate-900"></div>
											</div>
											<div className="relative w-32 h-32 rounded-full overflow-hidden border-3 border-purple-300/50 dark:border-slate-600/50 group-hover:border-purple-500/70 dark:group-hover:border-blue-400/70 transition-colors duration-500 shadow-2xl">
												{member.image ? (
													<Image
														src={member.image}
														alt={member.name}
														width={128}
														height={128}
														className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													/>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 dark:from-blue-400 dark:to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
														<span className="text-white text-2xl font-bold">
															{member.name
																.split(" ")
																.map((n) => n[0])
																.join("")
																.slice(0, 2)}
														</span>
													</div>
												)}
											</div>
											<div className="absolute inset-0 rounded-full border-2 border-purple-400/50 dark:border-blue-400/30 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin"></div>
										</div>

										<div className="mb-3 space-y-1">
											<h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-blue-200 transition-colors duration-300">
												{member.name}
											</h3>
											<p className="text-xs font-medium text-purple-600 dark:text-orange-400 uppercase tracking-wider">
												{member.position}
											</p>
										</div>

										<div className="flex space-x-3 mt-auto">
											{getSocialLink(member.userLink, "linkedin") && (
												<a
													href={getSocialLink(member.userLink, "linkedin")}
													target="_blank"
													rel="noopener noreferrer"
													className="w-9 h-9 bg-white/50 dark:bg-slate-800/50 border border-purple-300/50 dark:border-slate-600/50 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-100/50 dark:hover:bg-blue-500/10 hover:scale-110 transition-all duration-300"
													title="LinkedIn"
													aria-label={`${member.name}'s LinkedIn profile`}
												>
													<FaLinkedinIn size={14} />
													<span className="sr-only">LinkedIn</span>
												</a>
											)}
											{getSocialLink(member.userLink, "github") && (
												<a
													href={getSocialLink(member.userLink, "github")}
													target="_blank"
													rel="noopener noreferrer"
													className="w-9 h-9 bg-white/50 dark:bg-slate-800/50 border border-purple-300/50 dark:border-slate-600/50 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 hover:border-purple-400/50 hover:bg-purple-100/50 dark:hover:bg-purple-500/10 hover:scale-110 transition-all duration-300"
													title="GitHub"
													aria-label={`${member.name}'s GitHub profile`}
												>
													<FaGithub size={14} />
													<span className="sr-only">GitHub</span>
												</a>
											)}
											{getSocialLink(member.userLink, "instagram") && (
												<a
													href={getSocialLink(member.userLink, "instagram")}
													target="_blank"
													rel="noopener noreferrer"
													className="w-9 h-9 bg-white/50 dark:bg-slate-800/50 border border-purple-300/50 dark:border-slate-600/50 rounded-xl flex items-center justify-center text-gray-600 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-100/50 dark:hover:bg-pink-500/10 hover:scale-110 transition-all duration-300"
													title="Instagram"
													aria-label={`${member.name}'s Instagram profile`}
												>
													<FaInstagram size={14} />
													<span className="sr-only">Instagram</span>
												</a>
											)}
										</div>
									</div>
								</div>

								<div className="absolute inset-0 bg-gradient-to-r from-purple-300/10 via-pink-300/20 to-blue-300/10 dark:from-blue-600/0 dark:via-purple-600/5 dark:to-pink-600/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl scale-110"></div>
							</div>
						))
					)}
				</div>
			</div>

			<div className="absolute top-1/3 left-0 w-px h-20 bg-gradient-to-b from-transparent via-purple-400/50 dark:via-blue-400/50 to-transparent"></div>
			<div className="absolute bottom-1/4 right-0 w-px h-16 bg-gradient-to-b from-transparent via-pink-400/50 dark:via-purple-400/50 to-transparent"></div>

			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-300/10 via-pink-300/5 to-transparent dark:from-blue-600/5 dark:via-purple-600/3 dark:to-transparent rounded-full blur-3xl -z-10"></div>
		</main>
	);
}
