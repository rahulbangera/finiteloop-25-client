"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { WordleGuess } from "@/lib/wordle";

interface Props {
	gameId: string;
	disabled: boolean;
	pointsAwarded?: number;
	onGuess: (
		guess: WordleGuess & { status: "IN_PROGRESS" | "WON" | "LOST" },
	) => void;
}

export function WordleKeyboard({ gameId, disabled, onGuess }: Props) {
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { data: session } = useSession();

	async function submitGuess() {
		if (!value || loading || disabled) return;

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/wordle/guess`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
					body: JSON.stringify({
						gameId,
						guess: value,
					}),
				},
			);

			const json = await res.json();

			if (!res.ok || !json.success) {
				throw new Error(json.error ?? "Invalid guess");
			}

			onGuess({
				guess: value,
				result: json.data.result,
				status: json.data.status,
				pointsAwarded: json.data.pointsAwarded ?? 0,
			});

			setValue("");
		} catch (err) {
			console.error(err);
			setError("Invalid guess. Try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col items-center gap-2 w-full max-w-xs">
			<div className="flex w-full gap-2">
				<input
					className="
						flex-1 rounded-xl border px-3 py-2
						text-center uppercase
						bg-white dark:bg-black/40
						text-purple-900 dark:text-purple-100
						border-purple-300 dark:border-purple-700
						focus:outline-none focus:ring-2 focus:ring-flc-yellow
						disabled:opacity-60
					"
					maxLength={5}
					value={value}
					disabled={disabled || loading}
					onChange={(e) => setValue(e.target.value.toLowerCase())}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							submitGuess();
						}
					}}
					placeholder="Enter guess"
				/>

				<button
					type="button"
					onClick={submitGuess}
					disabled={disabled || loading}
					className="
						rounded-xl px-4 py-2 font-semibold
						bg-purple-200 dark:bg-indigo-700
						text-purple-900 dark:text-purple-100
						hover:bg-purple-300 dark:hover:bg-indigo-600
						transition
						disabled:opacity-60 disabled:cursor-not-allowed
					"
				>
					{loading ? "…" : "Enter"}
				</button>
			</div>

			{error && (
				<div className="text-xs text-red-500 dark:text-red-400">{error}</div>
			)}
		</div>
	);
}
