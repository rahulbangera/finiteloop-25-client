interface UserCardProps {
	rank: number;
	name: string;
	points: number;
	className?: string;
}

export default function UserCard({
	rank,
	name,
	points,
	className = "",
}: UserCardProps) {
	return (
		<div
			className={`h-12 p-5 rounded-2xl flex flex-row font-[roboto-mono] items-center justify-between text-sm ${className}`}
		>
			<span className="flex flex-row gap-1 justify-center">
				<span>{rank}.</span>
				<span>{name}</span>
			</span>
			<span>{points} pts</span>
		</div>
	);
}
