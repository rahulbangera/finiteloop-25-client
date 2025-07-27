import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Leaderboard",
	description:
		"Check out the leaderboard to see top performers in competitive programming and various tech challenges at Finite Loop Club.",
	openGraph: {
		title: "Leaderboard | Finite Loop Club",
		description:
			"Check out the leaderboard to see top performers in competitive programming and various tech challenges at Finite Loop Club.",
		url: "/leaderboard",
	},
	alternates: {
		canonical: "/leaderboard",
	},
};

export default function LeaderboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
