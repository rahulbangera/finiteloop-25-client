import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardProps {
	image?: string;
	children: React.ReactNode;
	className?: string;
}

export default function Card({ image, children, className }: CardProps) {
	return (
		<div
			className={cn(
				"h-[430px] min-w-[20rem] md:min-w-[22rem] mx-auto rounded-3xl p-1.5 shadow-[0_15px_30px_-5px_rgba(151,65,252,0.2)] bg-[linear-gradient(144deg,#FBCFF4,#E4CCF8,#C4E2F7,#FEF9FF)] dark:bg-[linear-gradient(144deg,#7F439D,#33107C,#060329)] transition-transform hover:-translate-y-1 duration-200",
				className,
			)}
		>
			<div className="h-full w-full rounded-2xl bg-white/35 dark:bg-white/15 flex flex-col items-center overflow-hidden">
				{image && (
					<Image
						loading="lazy"
						width={500}
						height={330}
						src={image}
						alt="Card"
						className="mb-2 rounded-2xl h-[330px] w-full object-cover p-1"
					/>
				)}
				<div className="w-full flex-1 flex flex-col justify-between">
					{children}
				</div>
			</div>
		</div>
	);
}
