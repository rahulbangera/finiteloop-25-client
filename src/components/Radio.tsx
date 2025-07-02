import React from "react";

const gliderStyles = [
	// 1st one - bright purple
	"translate-x-0 bg-gradient-to-br from-[#a259ff] to-[#c084fc] shadow-[0_0_18px_rgba(162,89,255,0.4),0_0_10px_rgba(192,132,252,0.25)_inset]",
	// 2nd one - bright orange
	"translate-x-full bg-gradient-to-br from-[#ffb347] to-[#ff7f50] shadow-[0_0_18px_rgba(255,179,71,0.4),0_0_10px_rgba(255,127,80,0.25)_inset]",
	// 3rd one - bright blue
	"translate-x-[200%] bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] shadow-[0_0_18px_rgba(59,130,246,0.4),0_0_10px_rgba(96,165,250,0.25)_inset]",
];

interface RadioProps {
	plans: { id: string; label: string }[];
	selected: number;
	setSelected: (index: number) => void;
}

const Radio: React.FC<RadioProps> = ({ plans, selected, setSelected }) => {
	return (
		<div className="relative flex bg-white/35 dark:bg-white/10 rounded-xl backdrop-blur-md shadow-[inset_1px_1px_4px_rgba(255,255,255,0.2),inset_-1px_-1px_6px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden w-fit">
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
						className={`flex-1 flex items-center justify-center min-w-[100px] w-full text-[14px] md:text-[16px] lg:text-[18px] py-4 px-6 cursor-pointer font-semibold tracking-[0.3px] relative z-20 transition-colors duration-300 ${
							selected === idx
								? "text-black dark:text-white"
								: "text-[#191919] dark:text-[#e5e5e5] dark:hover:text-white"
						}`}
					>
						{plan.label}
					</label>
				</React.Fragment>
			))}
			<div
				className={`absolute top-0 bottom-0 left-0 w-1/3 rounded-xl z-10 transition-all duration-500 ${gliderStyles[selected]}`}
				style={{ willChange: "transform" }}
			/>
		</div>
	);
};

export default Radio;
