"use client";

export default function WordlePage() {
	return (
		<main className="min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
			<div className="text-center max-w-md">
				<h1 className="lilita-font text-6xl md:text-7xl lg:text-8xl font-bold text-flc-yellow mb-4">
					WORDLE
				</h1>

				<p className="comic-font text-xl md:text-2xl text-black dark:text-white mb-6">
					Event Ended
				</p>

				<p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
					Thank you for participating in our Wordle challenge! We hope you had a
					great time guessing the words.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/leaderboard"
						className="px-8 py-3 rounded-xl font-bold bg-flc-yellow hover:bg-yellow-500 text-black transition-all duration-200"
					>
						View Leaderboard
					</a>

					<a
						href="/"
						className="px-8 py-3 rounded-xl font-medium border-2 border-gray-300 dark:border-neutral-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200"
					>
						Return Home
					</a>
				</div>
			</div>
		</main>
	);
}

/*

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EasterEggModal from "@/components/ui/custom/winter/EasterEggModal";
import { WordleBoard } from "@/components/wordle/WordleBoard";
import { WordleKeyboard } from "@/components/wordle/WordleKeyboard";
import type { WordleTodayResponse } from "@/lib/wordle";
import { AlertCircle, Gamepad2, Loader2, RefreshCcw } from "lucide-react";

export default function WordlePage() {
	const { data: session, status } = useSession();
	const [game, setGame] = useState<WordleTodayResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showWinModal, setShowWinModal] = useState(false);
	const [awardedPoints, setAwardedPoints] = useState<number>(0);

	// UI-only state: whether user clicked "start"
	const [started, setStarted] = useState(false);

	const winModalKey = game ? `wordle-win-modal-shown-${game.gameId}` : null;
	useEffect(() => {
		if (!game || !winModalKey) return;

		if (game.status !== "WON") return;

		const alreadyShown = localStorage.getItem(winModalKey);

		if (!alreadyShown) {
			setShowWinModal(true);
			localStorage.setItem(winModalKey, "true");
		}
	}, [game, winModalKey]);

	useEffect(() => {
		if (status === "loading") return;

		if (status === "unauthenticated") {
			setLoading(false);
			setError("You must be logged in to play Wordle.");
			return;
		}

		const token = session?.accessToken;

		if (!token) {
			throw new Error("Missing access token");
		}

		async function loadGame() {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/wordle/today`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				const json = await res.json();

				if (!res.ok || !json.success) {
					throw new Error(json.error ?? "Failed to load game");
				}

				setGame(json.data);

				// Auto-start if user already made a guess today
				if (json.data.guesses.length > 0) {
					setStarted(true);
				}
			} catch (err) {
				console.error(err);
				setError("Failed to load Wordle game.");
			} finally {
				setLoading(false);
			}
		}

		loadGame();
	}, [status, session]);

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<div className="relative mx-auto rounded-3xl p-1.5 shadow-[0_15px_30px_-5px_rgba(151,65,252,0.2)] bg-[linear-gradient(144deg,#FBCFF4,#E4CCF8,#C4E2F7,#FEF9FF)] dark:bg-[linear-gradient(144deg,#7F439D,#33107C,#060329)]">
					<div className="h-full w-full rounded-2xl bg-white/35 dark:bg-white/15 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
						<Loader2 className="h-12 w-12 animate-spin text-flc-yellow mb-4" />
						<p className="lilita-font text-2xl text-gray-800 dark:text-white tracking-wide">
							Loading Wordle...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<div className="relative mx-auto rounded-3xl p-1.5 shadow-[0_15px_30px_-5px_rgba(151,65,252,0.2)] bg-[linear-gradient(144deg,#FBCFF4,#E4CCF8,#C4E2F7,#FEF9FF)] dark:bg-[linear-gradient(144deg,#7F439D,#33107C,#060329)] max-w-md w-full">
					<div className="h-full w-full rounded-2xl bg-white/35 dark:bg-white/15 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center text-gray-800 dark:text-white">
						<div className="bg-white/50 dark:bg-black/20 p-4 rounded-full mb-4 shadow-sm">
							<AlertCircle className="h-10 w-10 text-red-500" />
						</div>
						<h3 className="lilita-font text-3xl mb-2 text-red-500">
							Game Error
						</h3>
						<p className="comic-font text-lg mb-6 opacity-90">
							{error || "Something went wrong while loading the game."}
						</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="group relative px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
						>
							<span className="flex items-center gap-2">
								<RefreshCcw className="h-4 w-4" />
								Try Again
							</span>
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!game) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<div className="relative mx-auto rounded-3xl p-1.5 shadow-[0_15px_30px_-5px_rgba(151,65,252,0.2)] bg-[linear-gradient(144deg,#FBCFF4,#E4CCF8,#C4E2F7,#FEF9FF)] dark:bg-[linear-gradient(144deg,#7F439D,#33107C,#060329)] max-w-md w-full">
					<div className="h-full w-full rounded-2xl bg-white/35 dark:bg-white/15 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center text-gray-800 dark:text-white">
						<div className="bg-white/50 dark:bg-black/20 p-5 rounded-full mb-6 shadow-sm border border-white/20">
							<Gamepad2 className="h-14 w-14 text-flc-yellow" />
						</div>

						<h2 className="lilita-font text-4xl mb-3 tracking-wide">
							No Active Game
						</h2>

						<p className="comic-font text-xl mb-8 leading-relaxed opacity-90">
							There are currently no active Wordle challenges. Check back soon!
						</p>

						<a
							href="/"
							className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold bg-flc-yellow hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
						>
							Return Home
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<main
			className="
				min-h-screen mb-16 p-4 md:p-6
				flex flex-col items-center
				transition-colors duration-300
			"
		>
			<h1
				className="
					lilita-font
					text-6xl md:text-7xl lg:text-8xl
					font-extrabold text-flc-yellow
					mb-6 mt-32 md:mt-20
					text-center
				"
			>
				WORDLE
			</h1>

			<p className="text-base sm:text-lg mb-10 text-center text-purple-900 dark:text-purple-100">
				Guess the word in 5 tries. New word every day.
			</p>

			{!started && (
				<button
					type="button"
					onClick={() => setStarted(true)}
					className="
						h-40 w-[90%] max-w-md
						rounded-2xl border
						bg-white/90 dark:bg-black/50
						border-flc-yellow/30 dark:border-flc-yellow/40
						backdrop-blur-xl
						shadow-lg
						hover:scale-[1.03] transition-all
						flex flex-col items-center justify-center gap-3
					"
				>
					<span className="text-3xl font-bold lilita-font text-purple-900 dark:text-purple-100">
						Click to Start
					</span>

					<span className="text-sm text-purple-600 dark:text-purple-300">
						Today's Wordle
					</span>
				</button>
			)}

			{started && (
				<div className="flex flex-col items-center gap-6 w-full max-w-md">
					<WordleBoard
						wordLength={game.wordLength}
						guesses={game.guesses}
						maxAttempts={game.maxAttempts}
					/>

					<WordleKeyboard
						gameId={game.gameId}
						disabled={game.status !== "IN_PROGRESS"}
						onGuess={(newGuess) => {
							setGame((prev) => {
								if (!prev) return prev;

								return {
									...prev,
									guesses: [
										...prev.guesses,
										{
											guess: newGuess.guess,
											result: newGuess.result,
										},
									],
									attemptsUsed: prev.attemptsUsed + 1,
									status: newGuess.status,
								};
							});

							if (newGuess.status === "WON") {
								setAwardedPoints(newGuess.pointsAwarded ?? 0);
							}
						}}
					/>

					{game.status === "WON" && (
						<div
							className="
							text-center text-lg font-semibold
							text-green-600 dark:text-green-400
						"
						>
							You Guessed it Right! Congratulations!
						</div>
					)}

					{game.status === "LOST" && (
						<div
							className="
							text-center text-lg font-semibold
							text-red-600 dark:text-red-400
						"
						>
							Game over. Better luck tomorrow!
						</div>
					)}
				</div>
			)}
			<EasterEggModal
				isOpen={showWinModal}
				onClose={() => setShowWinModal(false)}
				alreadyClaimed={false}
				flcPoints={awardedPoints}
				title="🎉 You Guessed Right!"
				subtitle={`Congratulations! You've earned ${awardedPoints} FLC Points for winning today's Wordle!`}
			/>
		</main>
	);
}
*/
