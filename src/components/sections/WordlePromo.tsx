import Link from "next/link";

interface WordlePromoProps {
	title?: string;
	description?: string;
	href?: string;
}

export default function WordlePromo({
	title = "Daily Wordle Challenge",
	description = "Put your vocabulary to the test with our daily Wordle challenge. Guess the hidden word, improve your streak, and sharpen your logical thinking - one puzzle at a time.",
	href = "/wordle",
}: WordlePromoProps) {
	return (
		<section className="relative overflow-hidden py-8 md:py-20 mt-0 md:-mt-20 mb-0">
			<div className="max-w-7xl mx-auto px-6">
				<div className="relative">
					{/* Glow background */}
					<div className="absolute inset-0 bg-gradient-to-r from-flc-yellow/5 via-flc-yellow/10 to-flc-yellow/5 rounded-3xl blur-2xl" />

					{/* Card */}
					<div className="relative bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-3xl border border-gray-200/30 dark:border-white/20 p-6 md:p-8 lg:p-10 overflow-hidden">
						{/* Decorative blobs */}
						<div className="absolute top-0 right-0 w-24 h-24 bg-flc-yellow/10 rounded-full blur-3xl" />
						<div className="absolute bottom-0 left-0 w-20 h-20 bg-flc-yellow/5 rounded-full blur-3xl" />

						<div className="relative z-10 flex flex-col items-center text-center space-y-6">
							{/* Title */}
							<div className="space-y-3">
								<h3 className="lilita-font text-3xl md:text-4xl font-bold text-flc-yellow">
									{title}
								</h3>
								<div className="w-16 h-1 bg-flc-yellow rounded-full mx-auto" />
							</div>

							{/* Description */}
							<p className="comic-font text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
								{description}
							</p>

							{/* Rules */}
							<div className="w-full max-w-lg rounded-2xl bg-flc-yellow/5 border border-flc-yellow/20 p-4 md:p-5">
								<ul className="comic-font text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2 text-left">
									<li>• One new word every day</li>
									<li>• 5 attempts to guess the correct word</li>
									<li>• Letter hints after each guess</li>
									<li>
										• Earn{" "}
										<span className="text-flc-yellow font-bold">
											FLC points
										</span>{" "}
										for every successful game
									</li>
								</ul>
							</div>

							{/* CTA */}
							<Link
								href={href}
								className="
							lilita-font inline-flex items-center justify-center
							px-8 py-4 text-base font-bold
							text-white
							bg-gradient-to-r from-flc-yellow to-flc-yellow/90
							hover:from-flc-yellow/90 hover:to-flc-yellow
							rounded-2xl
							transition-all duration-300
							shadow-xl hover:shadow-2xl hover:shadow-flc-yellow/30
							hover:scale-105
							min-w-[200px]
						"
							>
								Play Today’s Wordle
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
