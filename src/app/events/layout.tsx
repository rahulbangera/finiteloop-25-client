import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Events",
	description:
		"Discover upcoming events, workshops, hackathons, and competitions organized by Finite Loop Club. Join our community and participate in exciting tech events.",
	openGraph: {
		title: "Events | Finite Loop Club",
		description:
			"Discover upcoming events, workshops, hackathons, and competitions organized by Finite Loop Club. Join our community and participate in exciting tech events.",
		url: "/events",
	},
	alternates: {
		canonical: "/events",
	},
};

export default function EventsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
