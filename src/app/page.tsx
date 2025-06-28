import React from "react";

const page = () => {
	return (
		<div className="min-h-screen pt-20 px-4 relative">
			<div
				className="hidden lg:block absolute top-0 right-0 w-1/3 h-screen pointer-events-none z-0"
				style={{
					backgroundImage: "url('/desktop_rocket.png')",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "top right",
				}}
			/>
			<div className="max-w-4xl mx-auto relative z-10">
				<p>FLC</p>
			</div>
		</div>
	);
};

export default page;
