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
		<div className={`h-12 flex flex-row ${className}`}>
			<span>{rank}</span>
			<span>{name}</span>
			<span>{points}</span>
		</div>
	);
}
