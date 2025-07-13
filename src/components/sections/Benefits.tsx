"use client";
import {
	BookOpen,
	Code2,
	Download,
	Gift,
	Rocket,
	Search,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import Image from "next/image";
import { Meteors } from "@/components/elements/Meteors";

const Benefits = () => {
	const benefits = [
		{
			icon: <Code2 className="w-5 h-5" />,
			title: "Internships",
			description: "Connect with industry leaders",
			hasLogo: true,
			logoSrc: "/internship.png",
		},
		{
			icon: <Rocket className="w-5 h-5" />,
			title: "Real-Time Projects",
			description: "Work on cutting-edge solutions",
			hasLogo: true,
			logoSrc: "/real-time.png",
		},
		{
			icon: <Users className="w-5 h-5" />,
			title: "Dev Meetups",
			description: "Network with professionals",
			hasLogo: true,
			logoSrc: "/dev-meetups.png",
		},
		{
			icon: <Search className="w-5 h-5" />,
			title: "Digital Hunt",
			description: "Exciting treasure hunts",
			hasLogo: true,
			logoSrc: "/digital-hunt.png",
		},
		{
			icon: <Gift className="w-5 h-5" />,
			title: "Tech Advent",
			description: "Daily tech challenges",
			hasLogo: true,
			logoSrc: "/tech_a.png",
		},
		{
			icon: <Zap className="w-5 h-5" />,
			title: "Hackloop & HackXpo",
			description: "Intensive hackathons",
			hasLogo: true,
			logoSrc: "/Hackloop.png",
		},
		{
			icon: <BookOpen className="w-5 h-5" />,
			title: "Workshops",
			description: "Learn from experts",
			hasLogo: true,
			logoSrc: "/Workshop.png",
		},
		{
			icon: <Trophy className="w-5 h-5" />,
			title: "Coding Contests",
			description: "Compete and win prizes",
			hasLogo: true,
			logoSrc: "/Coding.png",
		},
	];

	return (
		<section className="py-20 relative overflow-hidden">
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

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
					{benefits.map((benefit) => (
						<div key={benefit.title} className="group relative">
							<div className="absolute inset-0 bg-gradient-to-br from-flc-yellow/20 to-flc-yellow/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
							<div
								className={`relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl hover:shadow-flc-yellow/10 hover:-translate-y-2 overflow-hidden ${
									benefit.hasLogo
										? "bg-white/90 dark:bg-black/50 border-flc-yellow/20 dark:border-flc-yellow/30 hover:border-flc-yellow/50"
										: "bg-white/80 dark:bg-black/40 border-gray-200/20 dark:border-white/10 hover:border-flc-yellow/30"
								}`}
							>
								<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
									<Meteors number={8} />
								</div>

								<div
									className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden relative z-10 ${
										benefit.hasLogo
											? "bg-white border-2 border-flc-yellow/20"
											: "bg-gradient-to-br from-flc-yellow to-flc-yellow/80 text-white"
									}`}
								>
									{benefit.hasLogo && benefit.logoSrc ? (
										<div className="w-full h-full flex items-center justify-center p-2">
											<Image
												src={benefit.logoSrc}
												alt={`${benefit.title} Logo`}
												width={48}
												height={48}
												className="w-full h-full object-contain"
											/>
										</div>
									) : (
										benefit.icon
									)}
								</div>

								<h3 className="comic-font text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-flc-yellow transition-colors duration-300 text-center relative z-10">
									{benefit.title}
								</h3>
								<p className="comic-font text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center relative z-10">
									{benefit.description}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-flc-yellow/5 via-flc-yellow/10 to-flc-yellow/5 rounded-3xl blur-2xl"></div>
					<div className="relative bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-3xl border border-gray-200/30 dark:border-white/20 p-8 md:p-12 overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-flc-yellow/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-flc-yellow/5 rounded-full blur-3xl"></div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
							<div className="space-y-6">
								<div className="flex items-center gap-6">
									<div className="relative group flex-shrink-0">
										<div className="absolute inset-0 bg-flc-yellow/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
										<div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl p-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
											<Image
												src="/Hackfest.png"
												alt="Hackfest Logo"
												width={64}
												height={64}
												className="w-full h-full object-contain"
											/>
										</div>
									</div>
									<h3 className="lilita-font text-2xl md:text-3xl font-bold text-flc-yellow">
										What is Hackfest?
									</h3>
								</div>
								<p className="comic-font text-gray-700 dark:text-gray-300 leading-relaxed text-base">
									<span className="text-flc-yellow font-bold">
										NMAM Institute of Technology
									</span>{" "}
									presents a{" "}
									<span className="text-flc-yellow font-semibold">
										three-day National Tech Fest
									</span>{" "}
									featuring a{" "}
									<span className="text-flc-yellow font-semibold">
										36-hour hackathon
									</span>
									, tech conferences, and networking. Our vision is to bring
									together{" "}
									<span className="text-flc-yellow font-semibold">
										60 teams
									</span>{" "}
									from leading Indian engineering colleges, fostering{" "}
									<span className="text-flc-yellow font-semibold">
										innovation
									</span>
									.
								</p>
							</div>

							<div className="flex flex-col items-center space-y-6">
								<div className="relative group">
									<div className="absolute inset-0 bg-flc-yellow/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
									<Image
										src="/magazine-cover.png"
										alt="Magazine Cover"
										width={180}
										height={240}
										className="relative rounded-2xl shadow-2xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 max-w-[180px] h-auto"
									/>
								</div>
								<div className="text-center max-w-sm">
									<h4 className="lilita-font text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
										Get Your Free Guide
									</h4>
									<p className="comic-font text-gray-600 dark:text-gray-400 mb-4 text-sm">
										Download our exclusive tech guide and stay ahead of the
										curve
									</p>
									<a
										href="/inFiniteInsider.pdf"
										target="_blank"
										rel="noopener noreferrer"
										className="comic-font inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-flc-yellow to-flc-yellow/90 hover:from-flc-yellow/90 hover:to-flc-yellow rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-flc-yellow/25 hover:scale-105 group"
									>
										<Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
										Download Now
									</a>
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
