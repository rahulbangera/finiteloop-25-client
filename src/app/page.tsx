const page = () => {
	return (
		<div className="min-h-screen relative">
			<div
				className="hidden md:block absolute top-0 right-0 w-3/5 lg:w-1/2 xl:w-3/5 h-screen pointer-events-none z-0 bg-[url('/desktop_rocket_light.webp')] dark:bg-[url('/desktop_rocket_dark.png')] bg-contain bg-no-repeat"
				style={{
					backgroundPosition: "right top",
				}}
			/>

			<div
				className="md:hidden absolute top-1/2 right-0 w-4/5 h-4/5 pointer-events-none z-0 transform -translate-y-1/2"
				style={{
					backgroundImage: "url('/mobile_rocket2.png')",
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
				}}
			/>

			<div className="h-screen flex items-center justify-center md:justify-start relative z-10">
				<div className="w-full px-8 pr-4 pl-8 text-left md:w-3/5 md:px-16 md:pr-6 md:pl-16 lg:w-2/3 lg:px-20 xl:w-3/5">
					<div className="space-y-4 lg:space-y-6">
						<h1 className="lilita-font font-bold text-flc-yellow leading-tight tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
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
						<p className="comic-font font-medium leading-relaxed max-w-2xl text-base sm:text-lg md:text-2xl lg:text-3xl">
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
