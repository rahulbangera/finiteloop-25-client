import type { WordleGuess } from "@/lib/wordle";

interface Props {
	wordLength: number;
	rowIndex: number;
	guess?: WordleGuess;
}

export function WordleRow({ wordLength, rowIndex, guess }: Props) {
	return (
		<div className="flex gap-2">
			{Array.from({ length: wordLength }).map((_, colIndex) => {
				const letter = guess?.guess[colIndex]?.toUpperCase() ?? "";
				const result = guess?.result[colIndex];

				return (
					<div
						// biome-ignore lint: row position is intrinsic to Wordle board layout
						key={`tile-${rowIndex}-${colIndex}`}
						className={`
							flex h-12 w-12 items-center justify-center
							rounded-lg border text-lg font-bold
							transition-colors duration-200
							${
								result === "correct"
									? "bg-green-500 text-white border-green-600"
									: result === "present"
										? "bg-yellow-500 text-white border-yellow-600"
										: result === "absent"
											? "bg-gray-400 dark:bg-gray-700 text-white border-gray-500"
											: "bg-white dark:bg-black/40 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700"
							}
						`}
					>
						{letter}
					</div>
				);
			})}
		</div>
	);
}
