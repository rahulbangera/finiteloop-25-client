import Image from "next/image";
import Link from "next/link";
import {
	AiOutlineFacebook,
	AiOutlineGithub,
	AiOutlineInstagram,
	AiOutlineLinkedin,
	AiOutlineMail,
	AiOutlinePhone,
} from "react-icons/ai";
export const social = [
	{
		link: "https://www.instagram.com/finiteloop_club_nmamit/",
		icon: <AiOutlineInstagram className="h-8 w-8" />,
		name: "Instagram",
	},
	{
		link: "https://github.com/Finite-Loop-Club-NMAMIT",
		icon: <AiOutlineGithub className="h-8 w-8" />,
		name: "Github",
	},
	{
		link: "https://www.facebook.com/FiniteLoopClub.Nmamit/",
		icon: <AiOutlineFacebook className="h-8 w-8" />,
		name: "Facebook",
	},
	{
		link: "https://www.linkedin.com/company/finite-loop-club/",
		icon: <AiOutlineLinkedin className="h-8 w-8" />,
		name: "LinkedIn",
	},
	{
		link: "mailto:finiteloopclub@nmamit.in",
		icon: <AiOutlineMail className="h-8 w-8" />,
		name: "E-mail",
	},
	{
		link: "tel:8197903771",
		icon: <AiOutlinePhone className="h-8 w-8" />,
		name: "Call Us",
	},
];

export const footLinks = [
	{ name: "Privacy", link: "/privacy-policy" },
	{ name: "Terms and Conditions", link: "/terms" },
	{ name: "Refund & Cancellation", link: "/refund" },
	{ name: "Contact us", link: "/contact-us" },
	{ name: "Shipping", link: "/shipping" },
	{ name: "About", link: "/about" },
];

export default function Footer() {
	return (
		<div className="w-screen bg-gradient-to-t from-black/20 to-transparent text-white">
			{/* Desktop Layout */}
			<div className="hidden lg:block">
				<div className="w-full max-w-9xl mx-auto">
					<div className="p-8 md:p-8">
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-col items-center lg:items-start text-center lg:text-left">
								<div className="flex flex-col sm:flex-row gap-4 items-center">
									<div className="relative w-32 h-32 bg-white/35 dark:bg-white/15 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-xl border border-white/60 dark:border-white/50 hover:bg-white/45 dark:hover:bg-white/35 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
										<Image
											src="/FLC.jpg"
											alt="Finite Loop Club Logo"
											fill
											style={{ objectFit: "contain" }}
										/>
									</div>
									<div className="h-32 w-fit p-4 bg-black/30 dark:bg-white/10 rounded-2xl">
										<h2 className="text-4xl font-extrabold font-serif text-white tracking-tight leading-tight">
											Finite Loop Club
										</h2>
										<br />
										<p>All rights reserved</p>
									</div>
								</div>
							</div>

							<div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-right w-7/12 gap-8">
								<div className="flex flex-col w-full lg:w-1/2 h-full">
									<div className="flex justify-center lg:justify-between gap-5 mb-8">
										{social.map((link) => (
											<Link
												key={link.name}
												href={link.link}
												className="bg-black/30 dark:bg-white/10 hover:bg-black/60  dark:hover:bg-white/20 hover:black-white rounded-2xl h-16 flex justify-center items-center w-16 text-white shadow-md border border-black/10"
												title={link.name}
												target="_blank"
												rel="noopener noreferrer"
											>
												{link.icon}
											</Link>
										))}
									</div>
									<div className="grid grid-cols-2 gap-x-4 gap-y-2 justify-center items-center">
										<div className="bg-black/30 hover:bg-black/40  dark:bg-white/10  dark:hover:bg-white/20  rounded-2xl w-full h-16 flex justify-center items-center backdrop-blur-sm shadow-md border border-black/10 cursor-pointer">
											Privacy
										</div>
										<div className="bg-black/30  hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 rounded-2xl w-full h-16 flex justify-center items-center backdrop-blur-sm shadow-md border border-black/10 cursor-pointer text-center">
											Terms and Conditions
										</div>
									</div>
								</div>
								<div className="flex flex-col w-full lg:w-1/2">
									<div className="grid grid-cols-2 gap-x-4 gap-y-8 justify-center items-center">
										<div className="bg-black/30 hover:bg-black/40  dark:bg-white/10  dark:hover:bg-white/20 rounded-2xl w-full h-16 flex justify-center items-center backdrop-blur-sm shadow-md border border-black/10 cursor-pointer text-center">
											Refund and Cancellation
										</div>
										<div className="bg-black/30 hover:bg-black/40  dark:bg-white/10  dark:hover:bg-white/20 rounded-2xl w-full h-16 flex justify-center items-center backdrop-blur-sm shadow-md border border-black/10 cursor-pointer">
											Shipping
										</div>
										<div className="bg-black/30 hover:bg-black/40  dark:bg-white/10  dark:hover:bg-white/20 rounded-2xl w-full h-16 flex justify-center items-center backdrop-blur-sm shadow-md border border-black/10 cursor-pointer">
											Contact Us
										</div>
										<div className="bg-black/30 hover:bg-black/40  dark:bg-white/10  dark:hover:bg-white/20 rounded-2xl w-full h-16 flex justify-center items-center backdrop-blur-sm shadow-md border border-black/10 cursor-pointer">
											About
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/*Mobile View*/}
			<div className="lg:hidden px-4 py-8 max-w-md mx-auto from-black/20 to-transparent bg-gradient-to-t">
				<div className="flex flex-col items-center mb-8">
					<div className="relative w-12 h-12 bg-white/35 dark:bg-white/25  backdrop-blur-2xl rounded-2xl overflow-hidden shadow-xl border border-white/60 dark:border-white/50 hover:bg-white/45 dark:hover:bg-white/35 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
						<Image
							src="/FLC.jpg"
							alt="Finite Loop Club Logo"
							fill
							style={{ objectFit: "contain" }}
						/>
					</div>

					<div className="px-12 bg-black/30 dark:bg-white/10  rounded-2xl py-4 text-center border border-gray-600/30">
						<h2 className="text-2xl font-bold font-serif text-white mb-2">
							Finite Loop Club
						</h2>
						<p className="text-gray-300 text-sm">All rights reserved</p>
					</div>
				</div>

				<div className="flex justify-between mb-4">
					{social.map((link) => (
						<Link
							key={link.name}
							href={link.link}
							className="bg-black/30 hover:bg-black/60 rounded-xl h-12 w-12 flex justify-center items-center text-white border border-gray-600/30 transition-colors"
							title={link.name}
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="scale-90">{link.icon}</span>
						</Link>
					))}
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Link
							href="/privacy-policy"
							className="bg-black/30 hover:bg-black/40 rounded-2xl h-16 flex justify-center items-center text-white border border-gray-600/30 transition-colors text-sm text-center px-2"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="bg-black/30 hover:bg-black/40 rounded-2xl h-16 flex justify-center items-center text-white border border-gray-600/30 transition-colors text-sm text-center px-2"
						>
							Terms & Conditions
						</Link>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Link
							href="/refund"
							className="bg-black/30 hover:bg-black/40 rounded-2xl h-16 flex justify-center items-center text-white border border-gray-600/30 transition-colors text-sm text-center px-2"
						>
							Refund & Cancellation
						</Link>
						<Link
							href="/shipping"
							className="bg-black/30 hover:bg-black/40 rounded-2xl h-16 flex justify-center items-center text-white border border-gray-600/30 transition-colors text-sm text-center px-2"
						>
							Shipping
						</Link>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Link
							href="/contact-us"
							className="bg-black/30 hover:bg-black/40 rounded-2xl h-16 flex justify-center items-center text-white border border-gray-600/30 transition-colors text-sm text-center px-2"
						>
							Contact Us
						</Link>
						<Link
							href="/about"
							className="bg-black/30 hover:bg-black/40 rounded-2xl h-16 flex justify-center items-center text-white border border-gray-600/30 transition-colors text-sm text-center px-2"
						>
							About
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
