"use client";

import Radio from "@/components/elements/specialRadio";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

type MagazineYear = "2024-25" | "2025-26";

const MagazineViewer = dynamic(
	() => import("@/components/magazine/MagazineViewer"),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-purple-500 border-b-4"></div>
			</div>
		),
	},
);

export default function MagazinePage() {
	const yearlyMagazine = {
		"2024-25": "/inFiniteInsider.pdf",
		"2025-26": "/infinite.pdf",
	};

	const radioContainerRef = useRef<HTMLDivElement>(null);

	const [selectedYearData, setSelectedYearData] = useState<{
		year: MagazineYear;
		index: number;
	}>({ year: "2025-26", index: 1 });

	const handleToggleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
		const id = (e.target as HTMLElement).id;
		if (id === "glass-gold") setSelectedYearData({ year: "2024-25", index: 0 });
		else if (id === "glass-platinum")
			setSelectedYearData({ year: "2025-26", index: 1 });
	};

	return (
		<main className="min-h-screen mb-8 md:mb-16 p-2 sm:p-4 md:p-6 bg-[radial-gradient(at_top_right,#FBCFF4,#E4CCF8,#C4E2F7,#FEF9FF)] dark:bg-[radial-gradient(at_top_right,#7F439D,#33107C,#060329)]">
			<h1 className="lilita-font text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-flc-yellow mb-2 mt-20 sm:mt-24 md:mt-20 text-center">
				MAGAZINE
			</h1>
			<p className="text-sm sm:text-base md:text-lg text-purple-900 dark:text-purple-100 mb-4 sm:mb-6 md:mb-12 text-center px-4">
				Explore the {selectedYearData.year.split("-")[0]} edition of inFinite
				Insider!
			</p>

			<div
				ref={radioContainerRef}
				className="mb-4 sm:mb-6 md:mb-8 px-2 select-none w-full flex justify-center overflow-x-auto scrollbar-hide rounded-2xl"
				onChange={handleToggleChange}
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				<Radio
					plans={[
						{ id: "glass-gold", label: "2024-25" },
						{ id: "glass-platinum", label: "2025-26" },
					]}
					selected={selectedYearData.index}
					setSelected={(index: any) => {
						const year = index === 0 ? "2024-25" : "2025-26";
						setSelectedYearData({ year, index });
					}}
				/>
			</div>

			<div className="w-full max-w-7xl mx-auto px-1 sm:px-2 md:px-4 flex justify-center">
				<MagazineViewer
					pdfUrl={yearlyMagazine[selectedYearData.year]}
					year={selectedYearData.year}
				/>
			</div>
		</main>
	);
}
