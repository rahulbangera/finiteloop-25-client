import { WordleRow } from "./WordleRow";
import type { WordleGuess } from "@/lib/wordle";

interface Props {
	wordLength: number;
	maxAttempts: number;
	guesses: WordleGuess[];
}

export function WordleBoard({ wordLength, maxAttempts, guesses }: Props) {
	return (
		<div className="grid gap-2">
			{Array.from({ length: maxAttempts }).map((_, rowIndex) => {
				const guess = guesses[rowIndex];

				return (
					<WordleRow
						// biome-ignore lint: row position is intrinsic to Wordle board layout
						key={`row-${rowIndex}`}
						rowIndex={rowIndex}
						wordLength={wordLength}
						guess={guess}
					/>
				);
			})}
		</div>
	);
}
