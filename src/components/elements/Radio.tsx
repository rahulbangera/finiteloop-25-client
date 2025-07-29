import React from "react";

const backgroundStyles = [
	// 1st one - bright purple
	"bg-gradient-to-br from-[#a259ff] to-[#c084fc] shadow-[0_0_18px_rgba(162,89,255,0.4),0_0_10px_rgba(192,132,252,0.25)_inset]",
	// 2nd one - bright orange
	"bg-gradient-to-br from-[#ffb347] to-[#ff7f50] shadow-[0_0_18px_rgba(255,179,71,0.4),0_0_10px_rgba(255,127,80,0.25)_inset]",
	// 3rd one - bright blue
	"bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] shadow-[0_0_18px_rgba(59,130,246,0.4),0_0_10px_rgba(96,165,250,0.25)_inset]",
	// 4th one - bright green
	"bg-gradient-to-br from-[#34d399] to-[#10b981] shadow-[0_0_18px_rgba(52,211,153,0.4),0_0_10px_rgba(16,185,129,0.25)_inset]",
	// 5th one - bright pink
	"bg-gradient-to-br from-[#f472b6] to-[#ec4899] shadow-[0_0_18px_rgba(244,114,182,0.4),0_0_10px_rgba(236,72,153,0.25)_inset]",
	// 6th one - bright yellow
	"bg-gradient-to-br from-[#fde68a] to-[#fbbf24] shadow-[0_0_18px_rgba(253,230,138,0.4),0_0_10px_rgba(251,191,36,0.25)_inset]",
];

// const gliderStyles = [
// 	"translate-x-0 bg-gradient-to-br from-[#a259ff] to-[#c084fc] shadow-[0_0_18px_rgba(162,89,255,0.4),0_0_10px_rgba(192,132,252,0.25)_inset]",
// 	"translate-x-full bg-gradient-to-br from-[#ffb347] to-[#ff7f50] shadow-[0_0_18px_rgba(255,179,71,0.4),0_0_10px_rgba(255,127,80,0.25)_inset]",
// 	"translate-x-[200%] bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] shadow-[0_0_18px_rgba(59,130,246,0.4),0_0_10px_rgba(96,165,250,0.25)_inset]",
// 	"translate-x-[300%] bg-gradient-to-br from-[#34d399] to-[#10b981] shadow-[0_0_18px_rgba(52,211,153,0.4),0_0_10px_rgba(16,185,129,0.25)_inset]",
// 	"translate-x-[400%] bg-gradient-to-br from-[#f472b6] to-[#ec4899] shadow-[0_0_18px_rgba(244,114,182,0.4),0_0_10px_rgba(236,72,153,0.25)_inset]",
// 	"translate-x-[500%] bg-gradient-to-br from-[#fde68a] to-[#fbbf24] shadow-[0_0_18px_rgba(253,230,138,0.4),0_0_10px_rgba(251,191,36,0.25)_inset]",
// ];

interface RadioProps {
	plans: { id: string; label: string }[];
	selected: number;
	setSelected: (index: number) => void;
}

const Radio: React.FC<RadioProps> = ({ plans, selected, setSelected }) => {
	// const itemWidth = 100 / plans.length;
	console.log(selected);

	return (
		<div
			className="relative flex bg-white/35 dark:bg-white/10 rounded-xl backdrop-blur-md shadow-[inset_1px_1px_4px_rgba(255,255,255,0.2),inset_-1px_-1px_6px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden min-w-fit"
			style={{ minWidth: "max-content" }}
		>
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
						className={`flex-1 flex items-center justify-center min-w-[100px] md:min-w-[130px] w-full text-[15px] md:text-[17px] lg:text-[19px] py-4 md:py-5 px-5 cursor-pointer font-semibold tracking-[0.3px] relative z-20 rounded-xl ${
							selected === idx
								? `text-black dark:text-white ${backgroundStyles[idx] || backgroundStyles[0]}`
								: "text-[#191919] dark:text-[#e5e5e5] dark:hover:text-white"
						}`}
					>
						{plan.label}
					</label>
				</React.Fragment>
			))}
			{/* 
			<div
				className={`absolute top-0 bottom-0 left-0 rounded-xl z-10 transition-all duration-500 ${gliderStyles[selected] || gliderStyles[0]}`}
				style={{
					width: `${itemWidth}%`,
					transform: `translateX(${selected * itemWidth}%)`,
					willChange: "transform",
				}}
			/>
			*/}
		</div>
	);
};

export default Radio;
