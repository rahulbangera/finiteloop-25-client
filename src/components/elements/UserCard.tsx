interface UserCardProps {
	rank: number;
	name: string;
	points: number;
	className?: string;
	userId: string | number;
	highlightUserId?: string | number;
}

export default function UserCard({
	rank,
	name,
	points,
	className,
	userId,
	highlightUserId,
}: UserCardProps) {
	const highlight = userId === highlightUserId;

	return (
		<div
			className={`h-12 flex flex-row justify-between items-center px-4 ${
				highlight ? "bg-yellow-200 dark:bg-yellow-800 font-bold" : ""
			} ${className}`}
		>
			<span>{rank}</span>
			<span>{name}</span>
			<span>{points}</span>
		</div>
	);
}
