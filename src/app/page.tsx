import React from "react";

const page = () => {
	return (
		<div className="min-h-screen pt-20 px-4 lg:px-8 relative">
			{/* Desktop Rocket Background Image */}
			<div
				className="hidden lg:block absolute top-0 right-0 w-1/3 h-screen pointer-events-none z-0"
				style={{
					backgroundImage: "url('/desktop_rocket.png')",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "top right",
				}}
			/>

			{/* Main Content */}
			<div className="max-w-5xl ml-auto mr-auto lg:ml-4 lg:mr-auto relative z-10">
				<div className="pt-16 lg:pt-24 space-y-8">
					{/* Main Heading with Lilita One Font */}
					<div className="space-y-4">
						<h1 className="lilita-font text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold text-flc-yellow leading-tight tracking-wide ml-4 lg:ml-8">
							Finite Loop
							<br />
							Club
						</h1>
					</div>

					{/* Description with Comic Neue Font */}
					<div className="space-y-6">
						<p className="comic-font text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-lg leading-relaxed font-medium">
							NMAMIT's premier coding community.
							<br />
							Realizing Ideas, Inspiring the next.
						</p>
					</div>

					{/* Additional spacing for mobile */}
					<div className="pb-8 lg:pb-16"></div>
				</div>
			</div>
		</div>
	);
};

export default page;
