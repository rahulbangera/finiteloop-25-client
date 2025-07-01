"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Particles from "@/components/Particles";

export default function BG() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const color = resolvedTheme === "dark" ? "#ffffff" : "#F1881A";

	return (
		<section className="relative min-h-screen w-full overflow-hidden">
			<Particles
				className="absolute inset-0 z-30"
				quantity={100}
				color={color}
			/>

			<div className="fixed z-20 flex h-screen w-full items-center justify-center bg-[radial-gradient(at_top_right,_#FBCFF4,_#EFD2FA,_#FEF9FF)] dark:bg-[radial-gradient(at_top_right,_#7F439D,_#33107C,_#060329)]"></div>
		</section>
	);
}
