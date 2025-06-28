import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
	return (
		<div className="h-screen w-full flex items-center justify-center">
			<div className="text-2xl font-bold text-amber-500 dark:text-green-700">
				Welcome to the Next.js App with Theme Toggle!
			</div>

			<ThemeToggle />
		</div>
	);
}
