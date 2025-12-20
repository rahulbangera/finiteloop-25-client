import type { Metadata } from "next";
import "../globals.css";
import Background from "@/components/layout/Background";
import { Providers } from "@/components/layout/Providers";
import Toaster from "@/components/ui/Toaster";

export const metadata: Metadata = {
	title: "Magazine | Finite Loop Club",
	description:
		"Read the inFinite Insider magazine from Finite Loop Club NMAMIT",
};

export default function MagazineLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen flex flex-col relative overflow-hidden">
			<div className="fixed inset-0 -z-10 pointer-events-none">
				<Background />
			</div>
			<Providers>
				<Toaster />
				{children}
			</Providers>
		</div>
	);
}
