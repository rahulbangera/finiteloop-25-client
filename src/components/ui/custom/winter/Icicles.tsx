export default function Icicles({
	className = "",
	width = "100%",
}: {
	className?: string;
	width?: string | number;
}) {
	return (
		<div
			className={`absolute top-0 left-0 w-full pointer-events-none z-1 ${className}`}
		>
			<svg
				width={width}
				height="40"
				viewBox="0 0 100 40"
				preserveAspectRatio="none"
				className="w-full opacity-80"
			>
				<title>Ice</title>
				<defs>
					<linearGradient id="iceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
						<stop offset="100%" stopColor="#dbeafe" stopOpacity="0.4" />
					</linearGradient>
					<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="2" result="blur" />
						<feComposite in="SourceGraphic" in2="blur" operator="over" />
					</filter>
				</defs>
				<path
					d="M0,0 L0,10 L5,25 L10,12 L15,35 L20,10 L25,40 L30,15 L35,22 L40,8 L45,30 L50,12 L55,25 L60,5 L65,35 L70,10 L75,28 L80,15 L85,32 L90,8 L95,20 L100,5 L100,0 Z"
					fill="url(#iceGradient)"
					filter="url(#glow)"
				/>
			</svg>
		</div>
	);
}
