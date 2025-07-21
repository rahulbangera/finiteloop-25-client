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
		<button
			type="button"
			className={`h-12 flex flex-row justify-between items-center px-4 w-full cursor-pointer hover:bg-opacity-80 transition-all duration-200 bg-transparent border-none text-left ${
				highlight ? "bg-yellow-200 dark:bg-yellow-800 font-bold" : ""
			} ${className}`}
			onClick={() => {
				window.location.assign(`/profile/${userId}`);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					window.location.assign(`/profile/${userId}`);
				}
			}}
		>
			<span>{rank}</span>
			<span>{name}</span>
			<span>{points}</span>
		</button>
	);
}
