"use client";

import { useEffect, useState } from "react";

interface MovingBannerProps {
	text: string;
	isVisible: boolean;
}

const MovingBanner: React.FC<MovingBannerProps> = ({ text, isVisible }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || !isVisible || !text.trim()) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm overflow-hidden">
			<div className="relative h-10 flex items-center">
				<div className="animate-marquee whitespace-nowrap flex items-center h-full">
					<span className="mx-16 text-sm md:text-base font-medium tracking-wide text-black dark:text-white comic-font">
						{text}
					</span>
				</div>

				<div className="animate-marquee2 whitespace-nowrap flex items-center h-full">
					<span className="mx-16 text-sm md:text-base font-medium tracking-wide text-black dark:text-white comic-font">
						{text}
					</span>
				</div>

				<div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white/95 to-transparent dark:from-black/95 dark:to-transparent pointer-events-none" />
				<div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white/95 to-transparent dark:from-black/95 dark:to-transparent pointer-events-none" />

				<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flc-yellow" />
			</div>
		</div>
	);
};

export default MovingBanner;
