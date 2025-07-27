import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us",
	description:
		"Get in touch with Finite Loop Club. Reach out to us for collaborations, inquiries, or to learn more about our community and events.",
	openGraph: {
		title: "Contact Us | Finite Loop Club",
		description:
			"Get in touch with Finite Loop Club. Reach out to us for collaborations, inquiries, or to learn more about our community and events.",
		url: "/contact-us",
	},
	alternates: {
		canonical: "/contact-us",
	},
};

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
