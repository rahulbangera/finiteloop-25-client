import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Background from "@/components/Background";

export const metadata: Metadata = {
	title: "Finite Loop Club",
	description:
		"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="fixed inset-0 -z-10">
						<Background />
					</div>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
