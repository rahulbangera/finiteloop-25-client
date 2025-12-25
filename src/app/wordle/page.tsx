"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { WordleBoard } from "@/components/wordle/WordleBoard";
import { WordleKeyboard } from "@/components/wordle/WordleKeyboard";
import type { WordleTodayResponse } from "@/lib/wordle";

export default function WordlePage() {
	const { data: session, status } = useSession();

	const [game, setGame] = useState<WordleTodayResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// UI-only state: whether user clicked "start"
	const [started, setStarted] = useState(false);

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
		return <div className="p-6">Loading...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	if (!game) {
		return <div className="p-6">No game available</div>;
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

			{/* Launcher */}
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
						Today’s Wordle
					</span>
				</button>
			)}

			{/* Game */}
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
		</main>
	);
}
