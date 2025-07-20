"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Galaxy from "@/components/elements/Galaxy";

export default function BG() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const isLight = resolvedTheme === "light";

	return (
		<section className="relative min-h-screen w-full overflow-hidden">
			{/* Base gradient background */}
			<div className="absolute z-10 flex h-screen w-full items-center justify-center bg-[radial-gradient(at_top_right,_#FBCFF4,_#E4CCF8,_#C4E2F7,_#FEF9FF)] dark:bg-[radial-gradient(at_top_right,_#7F439D,_#33107C,_#060329)]"></div>

			{/* Galaxy effect overlay - premium quality */}
			<div className="absolute z-20 h-screen w-full opacity-25">
				<Galaxy
					density={0.5}
					starSpeed={0.1}
					speed={0.4}
					glowIntensity={isLight ? 0.08 : 0.18}
					saturation={isLight ? 0.4 : 0.6}
					hueShift={isLight ? 200 : 280}
					twinkleIntensity={0.3}
					rotationSpeed={0.005}
					mouseInteraction={true}
					mouseRepulsion={true}
					repulsionStrength={0.5}
					transparent={true}
					focal={[0.5, 0.4]}
					className="pointer-events-none"
				/>
			</div>

			{/* Additional subtle particle layer for depth */}
			<div className="absolute z-15 h-screen w-full opacity-15">
				<Galaxy
					density={0.8}
					starSpeed={0.03}
					speed={0.2}
					glowIntensity={isLight ? 0.04 : 0.1}
					saturation={isLight ? 0.2 : 0.4}
					hueShift={isLight ? 240 : 320}
					twinkleIntensity={0.2}
					rotationSpeed={-0.002}
					mouseInteraction={false}
					mouseRepulsion={false}
					transparent={true}
					focal={[0.6, 0.6]}
					className="pointer-events-none"
				/>
			</div>
		</section>
	);
}
