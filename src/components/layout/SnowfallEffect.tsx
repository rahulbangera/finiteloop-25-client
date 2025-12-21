"use client";

import Snowfall from "react-snowfall";

export default function SnowfallEffect() {
	return (
		<>
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					zIndex: 1,
					pointerEvents: "none",
				}}
			>
				<Snowfall snowflakeCount={20} />
			</div>

			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					zIndex: 9999,
					pointerEvents: "none",
				}}
			>
				<Snowfall snowflakeCount={20} />
			</div>
		</>
	);
}
