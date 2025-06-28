"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Particles from "@/components/Particles";

export default function BG() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const color = resolvedTheme === "dark" ? "#ffffff" : "#000000";

	return (
		<section className="relative min-h-screen w-full overflow-hidden">
			<Particles
				className="absolute inset-0 z-30"
				quantity={100}
				color={color}
			/>

			<div className="relative z-20 flex h-screen w-full items-center justify-center bg-white dark:bg-black"></div>
		</section>
	);
}
