import Benefits from "@/components/sections/Benefits";

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
				className="md:hidden absolute top-[7%] right-0 w-[40rem] h-[40rem] pointer-events-none z-0 transform -translate-y-1/2 bg-contain bg-no-repeat"
				style={{
					backgroundImage: "url('/mobile_rocket1.png')",
					backgroundPosition: "center right",
				}}
			/>

			<div className="h-screen flex items-start md:items-center justify-center md:justify-start relative z-10 mt-36 md:mt-0">
				<div className="w-full md:w-3/5 lg:w-2/3 xl:w-3/5 px-8 pr-4 pl-8 sm:px-10 sm:pr-6 sm:pl-10 md:px-16 lg:px-20 text-left">
					<div className="space-y-4 lg:space-y-6">
						<h1 className="lilita-font text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-flc-yellow leading-tight tracking-wide">
							<span className="md:hidden">
								Finite Loop <br /> Club
							</span>
							<span className="hidden md:inline">
								Finite Loop
								<br />
								Club
							</span>
						</h1>
					</div>

					<div className="mt-4 sm:mt-6 lg:mt-8">
						<p className="comic-font text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed font-medium max-w-2xl text-black dark:text-white">
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

			<Benefits />
		</div>
	);
};

export default page;
