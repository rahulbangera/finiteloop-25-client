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
					zIndex: -1,
					pointerEvents: "none",
				}}
			>
				<Snowfall snowflakeCount={40} />
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
				<Snowfall snowflakeCount={30} />
			</div>
			<div className="snowflakes" aria-hidden="true">
				{Array.from({ length: 10 }, (_, i) => i).map((id) => (
					<div key={`snowflake-background-${id}`} className="snowflake">
						<div className="inner">❅</div>
					</div>
				))}
			</div>
			<div className="snowflakes" aria-hidden="true">
				{Array.from({ length: 20 }, (_, i) => i).map((id) => (
					<div
						key={`snowflake-foreground-${id}`}
						className="snowflake"
						style={{ zIndex: -1 }}
					>
						<div className="inner">❅</div>
					</div>
				))}
			</div>
		</>
	);
}
