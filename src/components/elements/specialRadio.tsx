import React from "react";

const backgroundStyles = [
	"bg-gradient-to-br from-[#f472b6] to-[#ec4899] shadow-[0_0_18px_rgba(244,114,182,0.4),0_0_10px_rgba(236,72,153,0.25)_inset]",
	"bg-gradient-to-br from-[#fde68a] to-[#fbbf24] shadow-[0_0_18px_rgba(253,230,138,0.4),0_0_10px_rgba(251,191,36,0.25)_inset]",
];

interface RadioProps {
	plans: { id: string; label: string }[];
	selected: number;
	setSelected: (index: number) => void;
}

const Radio: React.FC<RadioProps> = ({ plans, selected, setSelected }) => {
	const itemWidth = 100 / plans.length;

	return (
		<div className="relative grid grid-cols-2 bg-white/35 dark:bg-white/10 rounded-xl backdrop-blur-md shadow-[inset_1px_1px_4px_rgba(255,255,255,0.2),inset_-1px_-1px_6px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden w-full sm:w-fit">
			{/* Mobile Glider */}
			<div
				className={`absolute top-0 left-0 z-10 block md:hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-xl ${
					backgroundStyles[selected] || backgroundStyles[0]
				}`}
				style={{
					width: "50%", // 3 items per row
					height: "50%", // 2 rows total
					transform: `translateX(${(selected % 3) * 100}%) translateY(${Math.floor(selected / 3) * 100}%)`,
				}}
			/>

			{/* Desktop Glider */}
			<div
				className={`absolute top-0 left-0 z-10 hidden md:block h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-xl ${
					backgroundStyles[selected] || backgroundStyles[0]
				}`}
				style={{
					width: `${itemWidth}%`,
					transform: `translateX(${selected * 100}%)`,
				}}
			/>

			{plans.map((plan, idx) => (
				<React.Fragment key={plan.id}>
					<input
						type="radio"
						name="plan"
						id={plan.id}
						className="hidden"
						checked={selected === idx}
						onChange={() => setSelected(idx)}
					/>
					<label
						htmlFor={plan.id}
						className={`flex-1 flex items-center justify-center w-full sm:min-w-[100px] md:min-w-[130px] text-[15px] md:text-[17px] lg:text-[19px] py-4 md:py-5 px-5 cursor-pointer font-semibold tracking-[0.3px] relative z-20 rounded-xl transition-colors ${
							selected === idx
								? `text-black dark:text-white`
								: "text-[#191919] dark:text-[#e5e5e5] dark:hover:text-white"
						}`}
					>
						{plan.label}
					</label>
				</React.Fragment>
			))}
		</div>
	);
};

export default Radio;
