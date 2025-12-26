import Image from "next/image";
import Icicles from "@/components/ui/custom/winter/Icicles";
import { cn } from "@/lib/utils";

interface CardProps {
	image?: string;
	children: React.ReactNode;
	className?: string;
}

const WINTER = true;
export default function Card({ image, children, className }: CardProps) {
	return (
		<div
			className={cn(
				`h-full min-w-[100%] md:min-w-[22rem] mx-auto rounded-3xl p-1.5 shadow-[0_15px_30px_-5px_rgba(151,65,252,0.2)] bg-[linear-gradient(144deg,#FBCFF4,#E4CCF8,#C4E2F7,#FEF9FF)] dark:bg-[linear-gradient(144deg,#7F439D,#33107C,#060329)] transition-transform hover:-translate-y-1 duration-200 ${WINTER ? "relative group overflow-hidden" : ""}`,
				className,
			)}
		>
			{WINTER ? <Icicles /> : null}
			<div className="h-full w-full rounded-2xl bg-white/35 dark:bg-white/15 flex flex-col overflow-hidden">
				{image ? (
					<div className="shrink-0 w-full p-1" style={{ aspectRatio: "4/5" }}>
						<Image
							loading="lazy"
							width={1080}
							height={1350}
							src={image}
							alt="Card"
							className="w-full h-full rounded-2xl object-cover"
						/>
					</div>
				) : null}
				<div className="flex-1 p-3 flex flex-col justify-center min-h-0">
					{children}
				</div>
			</div>
		</div>
	);
}
