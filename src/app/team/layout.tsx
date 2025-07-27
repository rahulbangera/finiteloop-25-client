import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Team",
	description:
		"Meet the passionate team members of Finite Loop Club. Get to know the talented individuals who drive innovation and foster the tech community at NMAMIT.",
	openGraph: {
		title: "Team | Finite Loop Club",
		description:
			"Meet the passionate team members of Finite Loop Club. Get to know the talented individuals who drive innovation and foster the tech community at NMAMIT.",
		url: "/team",
	},
	twitter: {
		title: "Team | Finite Loop Club",
		description:
			"Meet the passionate team members of Finite Loop Club. Get to know the talented individuals who drive innovation and foster the tech community at NMAMIT.",
	},
	alternates: {
		canonical: "/team",
	},
};

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
