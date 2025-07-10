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
{
	/*interface UserCardProps {
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
			className={`h-12 rounded-2xl flex flex-row gap-4 justify-between font-[roboto-mono] items-center text-xl ml-3 mr-3 ${className}`}
		>
			<span>{rank}</span>
			<span>{name}</span>
			<span>{points} pts</span>
		</div>
	);
}
 */
}
