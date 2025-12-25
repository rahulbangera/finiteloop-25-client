export type LetterResult = "correct" | "present" | "absent";

export interface WordleGuess {
	guess: string;
	result: LetterResult[];
	pointsAwarded?: number;
}

export interface WordleTodayResponse {
	gameId: string;
	attemptsUsed: number;
	maxAttempts: number;
	status: "IN_PROGRESS" | "WON" | "LOST";
	wordLength: number;
	pointsAwarded?: number;
	guesses: WordleGuess[];
}
