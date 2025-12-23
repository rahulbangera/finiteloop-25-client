"use client";
import { Download, Trophy } from "lucide-react";
import Image from "next/image";

const Benefits = () => {
	return (
		<section className="md:py-20 relative overflow-hidden -mt-20 md:mt-0 mb-10">
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-10 left-10 w-32 h-32 bg-flc-yellow/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-10 right-10 w-40 h-40 bg-flc-yellow/5 rounded-full blur-3xl"></div>
			</div>

			<div className="max-w-7xl mx-auto px-6">
				<div className="text-center mb-20">
					<div className="inline-block relative">
						<h2 className="lilita-font text-5xl md:text-7xl font-bold text-flc-yellow mb-6 relative z-10">
							Benefits
						</h2>
						<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-flc-yellow rounded-full"></div>
					</div>
					<p className="comic-font text-xl text-gray-700 dark:text-gray-300 mt-8 max-w-2xl mx-auto">
						Unlock your potential with exclusive opportunities and experiences
					</p>
				</div>

				<div className="mb-20">
					<div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
						<div className="md:col-span-4 lg:col-span-5 group">
							<div className="h-full min-h-[400px] relative overflow-hidden rounded-3xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-8 shadow-2xl hover:shadow-2xl hover:shadow-flc-yellow/10 hover:border-flc-yellow/50 transition-all duration-300">
								<div className="absolute top-0 right-0 w-32 h-32 bg-flc-yellow/5 rounded-full blur-3xl"></div>
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-flc-yellow/3 rounded-full blur-2xl"></div>

								<div className="relative z-10 h-full flex flex-col justify-between">
									<div>
										<div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
											<Image
												src="/internship.png"
												alt="Internships Logo"
												width={64}
												height={64}
												className="object-contain"
											/>
										</div>
										<h3 className="lilita-font text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
											Internships
										</h3>
										<p className="comic-font text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
											Connect with industry leaders and get hands-on experience
											at top tech companies
										</p>
									</div>
									<div className="flex items-center text-flc-yellow mt-6">
										<div className="w-8 h-0.5 bg-flc-yellow mr-3"></div>
										<span className="comic-font text-sm uppercase tracking-wide font-semibold">
											Premium Access
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-4 lg:col-span-4 group">
							<div className="h-full min-h-[400px] relative overflow-hidden rounded-3xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-2xl hover:shadow-2xl hover:shadow-flc-yellow/10 hover:border-flc-yellow/50 transition-all duration-300">
								<div className="absolute -top-10 -right-10 w-32 h-32 bg-flc-yellow/5 rounded-full blur-2xl"></div>
								<div className="absolute -bottom-5 -left-5 w-24 h-24 bg-flc-yellow/3 rounded-full blur-xl"></div>

								<div className="relative z-10 h-full flex flex-col justify-between text-center">
									<div>
										<div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
											<Image
												src="/digital-hunt.png"
												alt="Digital Hunt Logo"
												width={52}
												height={52}
												className="object-contain"
											/>
										</div>
										<h3 className="lilita-font text-2xl md:text-3xl font-bold mb-3 leading-tight text-gray-900 dark:text-white">
											Digital Hunt
										</h3>
										<p className="comic-font text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed px-2">
											Exciting treasure hunts with cutting-edge challenges and
											real-world problem solving
										</p>
									</div>
									<div className="text-center">
										<div className="inline-flex items-center bg-flc-yellow/10 border border-flc-yellow/20 rounded-full px-4 py-2">
											<div className="w-2 h-2 bg-flc-yellow rounded-full mr-2 animate-pulse"></div>
											<span className="comic-font text-xs uppercase tracking-wide font-semibold text-flc-yellow">
												Most Popular
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-8 lg:col-span-3 group">
							<div className="h-full min-h-[400px] relative overflow-hidden rounded-3xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-lg hover:shadow-xl hover:border-flc-yellow/50 transition-all duration-300">
								<div className="relative z-10 h-full flex flex-col justify-center text-center space-y-6">
									<div className="w-24 h-24 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border-2 border-cyan-200/50 dark:border-cyan-700/50 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
										<Image
											src="/real-time.png"
											alt="Real-Time Projects Logo"
											width={56}
											height={56}
											className="object-contain"
										/>
									</div>
									<div>
										<h3 className="lilita-font text-2xl md:text-3xl font-bold mb-3 leading-tight text-gray-900 dark:text-white">
											Real-Time Projects
										</h3>
										<p className="comic-font text-gray-600 dark:text-gray-400 text-base leading-relaxed">
											Work on cutting-edge solutions with industry partners and
											gain practical experience
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-4 lg:col-span-4 group">
							<div className="h-full min-h-[180px] relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-lg hover:shadow-xl hover:border-flc-yellow/50 transition-all duration-300">
								<div className="flex items-center gap-4 h-full">
									<div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200/50 dark:border-green-700/50 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
										<Image
											src="/dev-meetups.png"
											alt="Dev Meetups Logo"
											width={38}
											height={38}
											className="object-contain"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="comic-font text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
											Dev Meetups
										</h3>
										<p className="comic-font text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
											Network with tech professionals and industry leaders
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-4 lg:col-span-4 group">
							<div className="h-full min-h-[180px] relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-lg hover:shadow-xl hover:border-flc-yellow/50 transition-all duration-300">
								<div className="flex items-center gap-4 h-full">
									<div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-200/50 dark:border-orange-700/50 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
										<Image
											src="/tech_a.png"
											alt="Tech Advent Logo"
											width={38}
											height={38}
											className="object-contain"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="comic-font text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
											Tech Advent
										</h3>
										<p className="comic-font text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
											Daily tech challenges and continuous learning
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-8 lg:col-span-4 group">
							<div className="h-full min-h-[180px] relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-lg hover:shadow-xl hover:border-flc-yellow/50 transition-all duration-300">
								<div className="flex items-center gap-4 h-full">
									<div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-200/50 dark:border-emerald-700/50 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
										<Image
											src="/Workshop.png"
											alt="Workshop Logo"
											width={38}
											height={38}
											className="object-contain"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="comic-font text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
											Workshops
										</h3>
										<p className="comic-font text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
											Learn from industry experts and experienced mentors
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-8 lg:col-span-12 group">
							<div className="h-full min-h-[200px] relative overflow-hidden rounded-3xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-8 shadow-2xl hover:shadow-2xl hover:shadow-flc-yellow/10 hover:border-flc-yellow/50 transition-all duration-300">
								<div className="absolute top-0 right-0 w-40 h-20 bg-flc-yellow/5 blur-2xl"></div>
								<div className="absolute bottom-0 left-0 w-32 h-16 bg-flc-yellow/3 blur-xl"></div>

								<div className="relative z-10 flex items-center justify-between h-full">
									<div className="flex items-center gap-8 flex-1">
										<div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 border-2 border-slate-200/50 dark:border-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
											<Image
												src="/Coding.png"
												alt="Coding Contests Logo"
												width={60}
												height={60}
												className="object-contain"
											/>
										</div>
										<div className="flex-1">
											<h3 className="lilita-font text-3xl md:text-4xl font-bold mb-3 leading-tight text-gray-900 dark:text-white">
												Coding Contests
											</h3>
											<p className="comic-font text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
												Compete and win prizes in exciting programming
												challenges and algorithmic competitions
											</p>
										</div>
									</div>
									<div className="hidden lg:flex items-center text-flc-yellow bg-flc-yellow/10 border border-flc-yellow/20 rounded-2xl px-6 py-4">
										<Trophy className="w-7 h-7 mr-3" />
										<span className="comic-font text-base font-bold">
											Win Big Prizes
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-4 lg:col-span-6 group">
							<div className="h-full min-h-[180px] relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-lg hover:shadow-xl hover:border-flc-yellow/50 transition-all duration-300">
								<div className="flex items-center gap-4 h-full">
									<div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-200/50 dark:border-indigo-700/50 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
										<Image
											src="/Hackloop.png"
											alt="Hackloop Logo"
											width={38}
											height={38}
											className="object-contain"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="comic-font text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
											Hackloop & HackXpo
										</h3>
										<p className="comic-font text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
											Intensive hackathons and competitive programming events
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="md:col-span-4 lg:col-span-6 group">
							<div className="h-full min-h-[180px] relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-xl border border-flc-yellow/20 dark:border-flc-yellow/30 p-6 shadow-lg hover:shadow-xl hover:border-flc-yellow/50 transition-all duration-300">
								<div className="flex items-center gap-4 h-full">
									<div className="w-16 h-16 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 border-2 border-violet-200/50 dark:border-violet-700/50 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
										<svg
											className="w-9 h-9 text-violet-600 dark:text-violet-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="comic-font text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
											Open Source Projects
										</h3>
										<p className="comic-font text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
											Collaborate on real-world projects with global developers
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-flc-yellow/5 via-flc-yellow/10 to-flc-yellow/5 rounded-3xl blur-2xl"></div>
					<div className="relative bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-3xl border border-gray-200/30 dark:border-white/20 p-8 md:p-12 lg:p-16 overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-flc-yellow/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-flc-yellow/5 rounded-full blur-3xl"></div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-start relative z-10">
							<div className="space-y-8">
								<div className="flex items-start gap-6 pb-6 border-b border-flc-yellow/20">
									<div className="relative group flex-shrink-0">
										<div className="absolute inset-0 bg-flc-yellow/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
										<div className="relative w-20 h-20 md:w-28 md:h-28 bg-white rounded-3xl flex items-center justify-center shadow-xl p-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-flc-yellow/20">
											<Image
												src="/Hackfest.png"
												alt="Hackfest Logo"
												width={80}
												height={80}
												className="w-full h-full object-contain"
											/>
										</div>
									</div>
									<div className="space-y-3">
										<h3 className="lilita-font text-3xl md:text-4xl lg:text-5xl font-bold text-flc-yellow leading-tight">
											What is Hackfest?
										</h3>
										<div className="w-16 h-1 bg-flc-yellow rounded-full"></div>
									</div>
								</div>

								<div className="space-y-6">
									<p className="comic-font text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
										<span className="text-flc-yellow font-bold text-xl">
											NMAM Institute of Technology
										</span>{" "}
										proudly presents{" "}
										<span className="text-flc-yellow font-bold italic">
											Hackfest
										</span>{" "}
										— an extraordinary{" "}
										<span className="text-flc-yellow font-semibold bg-flc-yellow/10 px-2 py-1 rounded-lg">
											three-day National Tech Festival
										</span>{" "}
										that combines the thrill of an intensive{" "}
										<span className="text-flc-yellow font-semibold bg-flc-yellow/10 px-2 py-1 rounded-lg">
											36-hour hackathon
										</span>{" "}
										with cutting-edge tech conferences and unparalleled
										networking experiences.
									</p>
									<p className="comic-font text-gray-600 dark:text-gray-400 leading-relaxed text-base">
										Our mission is to unite{" "}
										<span className="text-flc-yellow font-bold text-lg">
											60 elite teams
										</span>{" "}
										from India's most prestigious engineering institutions,
										transforming ideas into reality and fostering a dynamic
										ecosystem of{" "}
										<span className="text-flc-yellow font-semibold">
											breakthrough innovation, meaningful collaboration, and
											technological excellence
										</span>
										.
									</p>
									<div className="flex flex-wrap gap-3 pt-2">
										<div className="flex items-center gap-2 bg-flc-yellow/10 px-3 py-1.5 rounded-full border border-flc-yellow/20">
											<div className="w-2 h-2 bg-flc-yellow rounded-full"></div>
											<span className="comic-font text-sm font-medium text-gray-700 dark:text-gray-300">
												Innovation Hub
											</span>
										</div>
										<div className="flex items-center gap-2 bg-flc-yellow/10 px-3 py-1.5 rounded-full border border-flc-yellow/20">
											<div className="w-2 h-2 bg-flc-yellow rounded-full"></div>
											<span className="comic-font text-sm font-medium text-gray-700 dark:text-gray-300">
												National Platform
											</span>
										</div>
										<div className="flex items-center gap-2 bg-flc-yellow/10 px-3 py-1.5 rounded-full border border-flc-yellow/20">
											<div className="w-2 h-2 bg-flc-yellow rounded-full"></div>
											<span className="comic-font text-sm font-medium text-gray-700 dark:text-gray-300">
												Elite Competition
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col items-center justify-center space-y-8 xl:pl-8">
								<div className="relative group">
									<div className="absolute -inset-4 bg-gradient-to-br from-flc-yellow/20 via-flc-yellow/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
									<div className="relative">
										<Image
											src="/magazine-cover.png"
											alt="Magazine Cover"
											width={220}
											height={290}
											className="relative rounded-2xl shadow-2xl group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 max-w-[220px] h-auto border-4 border-white/50 dark:border-black/20"
										/>
									</div>
								</div>

								<div className="text-center max-w-sm space-y-6">
									<div className="space-y-4">
										<h4 className="lilita-font text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
											Get Your Own Copy
										</h4>
										<div className="w-12 h-1 bg-flc-yellow rounded-full mx-auto"></div>
									</div>

									<p className="comic-font text-gray-600 dark:text-gray-400 text-base leading-relaxed">
										Dive into our{" "}
										<span className="text-flc-yellow font-semibold">
											official club magazine
										</span>{" "}
										featuring interesting tech insights and much more!
									</p>

									<div className="pt-2">
										<a
											href="/infinite.pdf"
											target="_blank"
											rel="noopener noreferrer"
											className="comic-font inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-flc-yellow to-flc-yellow/90 hover:from-flc-yellow/90 hover:to-flc-yellow rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-flc-yellow/30 hover:scale-105 group min-w-[180px]"
										>
											<Download className="w-5 h-5 mr-3 group-hover:animate-bounce" />
											Download Now
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Benefits;
