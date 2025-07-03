const page = () => {
	return (
		<div className="min-h-screen relative">
			<div
				className="hidden md:block absolute top-0 right-0 w-2/5 lg:w-1/3 xl:w-2/5 h-screen pointer-events-none z-0 bg-[url('/desktop_rocket_light.webp')] dark:bg-[url('/desktop_rocket_dark.png')] bg-contain bg-no-repeat"
				style={{
					backgroundPosition: "center right",
				}}
			/>

			<div
				className="md:hidden fixed top-24 -right-8 w-4/5 h-4/5 pointer-events-none z-0"
				style={{
					backgroundImage: "url('/mobile_rocket1.png')",
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "top right",
				}}
			/>

			<div className="h-screen flex items-center justify-center md:justify-start relative z-10">
				<div className="w-full md:w-3/5 lg:w-2/3 xl:w-3/5 px-4 pr-8 pl-8 sm:px-8 sm:pr-16 sm:pl-10 md:px-12 lg:px-16 text-left">
					<div className="space-y-4 lg:space-y-6">
						<h1 className="lilita-font text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-flc-yellow leading-tight tracking-wide">
							<span className="md:hidden">
								Finite
								<br />
								Loop
								<br />
								Club
							</span>
							<span className="hidden md:inline">
								Finite Loop
								<br />
								Club
							</span>
						</h1>
					</div>

					<div className="mt-4 sm:mt-6 lg:mt-8">
						<p className="comic-font text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed font-medium max-w-2xl">
							<span className="md:hidden">
								NMAMIT's premier
								<br />
								coding community.
								<br />
								Realizing ideas, inspiring
								<br />
								the next
							</span>
							<span className="hidden md:inline">
								NMAMIT's premier coding community.
								<br />
								Realizing Ideas, Inspiring the next.
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
