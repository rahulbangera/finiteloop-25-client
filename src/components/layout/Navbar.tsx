"use client";
import Image from "next/image";
import { Sun, Moon, LogIn, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();
	const { data: session } = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsProfileDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const handleSignOut = () => {
		signOut();
	};

	const toggleProfileDropdown = () => {
		setIsProfileDropdownOpen(!isProfileDropdownOpen);
	};

	if (!mounted) {
		return null;
	}

	return (
		<>
			<div className="hidden md:flex fixed top-0 left-0 right-0 w-full h-20 flex-row items-center px-8 justify-between z-50 text-gray-800 dark:text-white">
				<div className="flex flex-row gap-4 items-center">
					<Link href="/">
						<div className="relative w-12 h-12 bg-white/40 dark:bg-white/25 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-xl hover:bg-white/50 dark:hover:bg-white/35 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
							<Image
								src="/FLC.jpg"
								alt="Finite Loop Club Logo"
								fill
								style={{ objectFit: "contain" }}
							/>
						</div>
					</Link>
					{pathname !== "/" && (
						<div className="flex flex-col">
							<h1 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
								Finite Loop Club
							</h1>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">
								NMAMIT
							</p>
						</div>
					)}
				</div>

				<div className="flex flex-row justify-center items-center">
					<div className="flex flex-row gap-3 items-center px-4">
						<Link href="/team">
							<button
								type="button"
								className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl px-6 py-3 justify-center items-center flex shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								<span className="relative font-semibold text-gray-800 dark:text-white tracking-wide">
									Team
								</span>
							</button>
						</Link>
						<Link href="/events">
							<button
								type="button"
								className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl px-6 py-3 justify-center items-center flex shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								<span className="relative font-semibold text-gray-800 dark:text-white tracking-wide">
									Events
								</span>
							</button>
						</Link>
						<Link href="/leaderboard">
							<button
								type="button"
								className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl px-6 py-3 justify-center items-center flex shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								<span className="relative font-semibold text-gray-800 dark:text-white tracking-wide">
									Leaderboard
								</span>
							</button>
						</Link>
					</div>

					<div className="flex flex-row gap-4 items-center ml-6">
						<button
							type="button"
							onClick={toggleTheme}
							className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl w-12 h-12 flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							{theme === "dark" ? (
								<Sun
									size={22}
									className="relative text-yellow-500 drop-shadow-lg"
								/>
							) : (
								<Moon
									size={22}
									className="relative text-blue-600 drop-shadow-lg"
								/>
							)}
						</button>

						{session ? (
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={toggleProfileDropdown}
									className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl px-4 py-3 flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<User
										size={20}
										className="relative text-gray-800 dark:text-white mr-2 drop-shadow-sm"
									/>
									<span className="relative font-semibold text-gray-800 dark:text-white tracking-wide">
										{session.user?.name || "Profile"}
									</span>
									<div
										className={`ml-2 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
									>
										<svg
											className="w-4 h-4 text-gray-800 dark:text-white"
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
								</button>

								{/* Dropdown Menu */}
								{isProfileDropdownOpen && (
									<div className="absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden z-50">
										<Link href="/profile">
											<button
												type="button"
												onClick={() => setIsProfileDropdownOpen(false)}
												className="w-full px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-white/10 transition-colors duration-200 flex items-center text-gray-800 dark:text-white"
											>
												<User size={18} className="mr-3" />
												<span className="font-medium">Profile</span>
											</button>
										</Link>
										<div className="border-t border-white/20 dark:border-white/10">
											<button
												type="button"
												onClick={() => {
													handleSignOut();
													setIsProfileDropdownOpen(false);
												}}
												className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 flex items-center text-red-600 dark:text-red-400"
											>
												<LogOut size={18} className="mr-3" />
												<span className="font-medium">Logout</span>
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<Link href="/auth/login">
								<button
									type="button"
									className="relative bg-gradient-to-r from-purple-600/90 to-blue-600/90 dark:from-indigo-600/90 dark:to-purple-700/90 hover:from-purple-700/95 hover:to-blue-700/95 dark:hover:from-indigo-700/95 dark:hover:to-purple-800/95 backdrop-blur-2xl rounded-2xl px-6 py-3 flex justify-center items-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] text-white font-semibold hover:shadow-xl group overflow-hidden tracking-wide"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<LogIn size={20} className="relative mr-2 drop-shadow-sm" />
									<span className="relative">Login</span>
								</button>
							</Link>
						)}
					</div>
				</div>
			</div>

			<div className="md:hidden fixed top-0 left-0 right-0 w-full h-20 flex flex-row items-center px-4 justify-between z-50 text-gray-800 dark:text-white">
				<div className="flex flex-row gap-3 items-center">
					<Link href="/">
						<div className="relative w-12 h-12 bg-white/35 dark:bg-white/25 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-xl hover:bg-white/45 dark:hover:bg-white/35 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
							<Image
								src="/FLC.jpg"
								alt="Finite Loop Club Logo"
								fill
								style={{ objectFit: "contain" }}
							/>
						</div>
					</Link>
					{pathname !== "/" && (
						<div className="flex flex-col">
							<h1 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
								Finite Loop Club
							</h1>
							<p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
								NMAMIT
							</p>
						</div>
					)}
				</div>

				<div className="flex flex-row gap-3 items-center">
					<button
						type="button"
						onClick={toggleTheme}
						className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl w-12 h-12 flex justify-center items-center shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						{theme === "dark" ? (
							<Sun
								size={18}
								className="relative text-yellow-500 drop-shadow-lg"
							/>
						) : (
							<Moon
								size={18}
								className="relative text-blue-600 drop-shadow-lg"
							/>
						)}
					</button>

					<button
						type="button"
						onClick={toggleMenu}
						className="relative bg-white/35 dark:bg-white/25 hover:bg-white/45 dark:hover:bg-white/35 backdrop-blur-2xl rounded-2xl w-12 h-12 flex justify-center items-center shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						{isMenuOpen ? (
							<AiOutlineClose
								size={18}
								className="relative text-gray-800 dark:text-white drop-shadow-sm"
							/>
						) : (
							<AiOutlineMenu
								size={18}
								className="relative text-gray-800 dark:text-white drop-shadow-sm"
							/>
						)}
					</button>
				</div>
			</div>

			{isMenuOpen && (
				<>
					<button
						type="button"
						className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
						onClick={toggleMenu}
						aria-label="Close menu"
					/>

					<div className="md:hidden fixed top-24 right-0 left-0 z-50 mx-5">
						<div className="bg-white/30 dark:bg-black/40 backdrop-blur-3xl rounded-3xl shadow-2xl p-6">
							<div>
								<Link href="/team">
									<button
										type="button"
										onClick={toggleMenu}
										className="relative bg-white/40 dark:bg-white/30 hover:bg-white/50 dark:hover:bg-white/40 backdrop-blur-2xl rounded-2xl h-14 w-full flex justify-center items-center font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.01] hover:shadow-xl group overflow-hidden text-gray-800 dark:text-white tracking-wide mb-6"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<span className="relative text-base">Team</span>
									</button>
								</Link>
								<Link href="/events">
									<button
										type="button"
										onClick={toggleMenu}
										className="relative bg-white/40 dark:bg-white/30 hover:bg-white/50 dark:hover:bg-white/40 backdrop-blur-2xl rounded-2xl h-14 w-full flex justify-center items-center font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.01] hover:shadow-xl group overflow-hidden text-gray-800 dark:text-white tracking-wide mb-6"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<span className="relative text-base">Events</span>
									</button>
								</Link>
								<Link href="/leaderboard">
									<button
										type="button"
										onClick={toggleMenu}
										className="relative bg-white/40 dark:bg-white/30 hover:bg-white/50 dark:hover:bg-white/40 backdrop-blur-2xl rounded-2xl h-14 w-full flex justify-center items-center font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.01] hover:shadow-xl group overflow-hidden text-gray-800 dark:text-white tracking-wide mb-6"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<span className="relative text-base">Leaderboard</span>
									</button>
								</Link>
							</div>

							<div className="mt-6 pt-6 border-t border-white/60 dark:border-white/50">
								{session ? (
									<div className="space-y-4">
										<Link href="/profile">
											<button
												type="button"
												onClick={toggleMenu}
												className="relative bg-white/40 dark:bg-white/30 hover:bg-white/50 dark:hover:bg-white/40 backdrop-blur-2xl rounded-2xl h-14 w-full flex justify-center items-center font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.01] hover:shadow-xl group overflow-hidden text-gray-800 dark:text-white tracking-wide"
											>
												<div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
												<User
													size={20}
													className="relative mr-2 drop-shadow-sm"
												/>
												<span className="relative text-base">
													{session.user?.name || "Profile"}
												</span>
											</button>
										</Link>
										<button
											type="button"
											onClick={() => {
												handleSignOut();
												toggleMenu();
											}}
											className="relative bg-red-500/90 dark:bg-red-600/90 hover:bg-red-600 dark:hover:bg-red-700 backdrop-blur-2xl rounded-2xl h-14 w-full flex justify-center items-center font-semibold transition-all duration-300 text-white shadow-xl hover:scale-[1.01] hover:shadow-2xl group overflow-hidden tracking-wide"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<LogOut
												size={20}
												className="relative mr-2 drop-shadow-sm"
											/>
											<span className="relative text-base">Logout</span>
										</button>
									</div>
								) : (
									<Link href="/auth/login">
										<button
											type="button"
											onClick={toggleMenu}
											className="relative bg-gradient-to-r from-purple-600/95 to-blue-600/95 dark:from-indigo-600/95 dark:to-purple-700/95 hover:from-purple-700 hover:to-blue-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 backdrop-blur-2xl rounded-2xl h-14 w-full flex justify-center items-center font-semibold transition-all duration-300 text-white shadow-xl hover:scale-[1.01] hover:shadow-2xl group overflow-hidden tracking-wide"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<LogIn
												size={20}
												className="relative mr-2 drop-shadow-sm"
											/>
											<span className="relative text-base">Login</span>
										</button>
									</Link>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
