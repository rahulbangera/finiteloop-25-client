"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	console.log("Current theme:", theme);
	return (
		<button
			type="button"
			aria-label="Toggle dark mode"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="rounded px-4 py-2 text-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
		>
			{theme === "dark" ? "☀️ Light" : "🌙 Dark"}
		</button>
	);
}
