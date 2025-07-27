import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blogs",
	description:
		"Explore our latest blogs, articles, and insights from the Finite Loop Club community. Stay updated with the latest trends in technology, programming, and innovation.",
	openGraph: {
		title: "Blogs | Finite Loop Club",
		description:
			"Explore our latest blogs, articles, and insights from the Finite Loop Club community. Stay updated with the latest trends in technology, programming, and innovation.",
		url: "/blogs",
	},
	alternates: {
		canonical: "/blogs",
	},
};

export default function BlogsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
