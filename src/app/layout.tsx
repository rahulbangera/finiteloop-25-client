import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/layout/Background";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import Toaster from "@/components/ui/Toaster";
import { BannerProvider } from "@/contexts/BannerContext";
import SnowfallEffect from "@/components/layout/SnowfallEffect";
import SnowballThrow from "@/components/SnowballThrow";

export const metadata: Metadata = {
	title: {
		default: "Finite Loop Club",
		template: "%s | Finite Loop Club",
	},
	description:
		"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.",
	keywords: [
		"Finite Loop Club",
		"NMAMIT",
		"competitive programming",
		"coding events",
		"programming club",
		"tech community",
		"innovation",
		"software development",
	],
	authors: [{ name: "Finite Loop Club" }],
	creator: "Finite Loop Club",
	publisher: "Finite Loop Club",
	metadataBase: new URL("https://www.finiteloop.club"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.finiteloop.club",
		title: "Finite Loop Club",
		description:
			"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.",
		siteName: "Finite Loop Club",
		images: [
			{
				url: "/FLC.jpg",
				width: 1200,
				height: 630,
				alt: "Finite Loop Club",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Finite Loop Club",
		description:
			"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.",
		images: ["/FLC.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen flex flex-col">
				<Providers>
					<BannerProvider>
						<Toaster />
						<Navbar />
						<div className="fixed inset-0 -z-10 pointer-events-none">
							<Background />
						</div>
						<main className="flex-1">{children}</main>
						<Footer />
					</BannerProvider>
				</Providers>
			</body>
		</html>
	);
}
