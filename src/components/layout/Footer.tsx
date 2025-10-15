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
		link: "https://www.instagram.com/finiteloop.club/",
		icon: <AiOutlineInstagram className="h-7 w-7 hover:-translate-y-1" />,
		name: "Instagram",
	},
	{
		link: "https://github.com/Finite-Loop-Club-NMAMIT",
		icon: <AiOutlineGithub className="h-7 w-7 hover:-translate-y-1" />,
		name: "Github",
	},
	{
		link: "https://www.facebook.com/FiniteLoopClub.Nmamit/",
		icon: <AiOutlineFacebook className="h-7 w-7 hover:-translate-y-1" />,
		name: "Facebook",
	},
	{
		link: "https://www.linkedin.com/company/finite-loop-club/",
		icon: <AiOutlineLinkedin className="h-7 w-7 hover:-translate-y-1" />,
		name: "LinkedIn",
	},
	{
		link: "mailto:finiteloopclub@nmamit.in",
		icon: <AiOutlineMail className="h-7 w-7 hover:-translate-y-1" />,
		name: "E-mail",
	},
	{
		link: "tel:8861337830",
		icon: <AiOutlinePhone className="h-7 w-7 hover:-translate-y-1" />,
		name: "Call Us",
	},
];

export const links = [
	{ name: "Home", link: "/" },
	{ name: "Events", link: "/events" },
	{ name: "Leaderboard", link: "/leaderboard" },
	{ name: "Team", link: "/team" },
];

export const footLinks = [
	{ name: "Privacy", link: "/privacy-policy" },
	{ name: "Terms and Conditions", link: "/terms" },
	{ name: "Refund & Cancellation", link: "/refund" },
	{ name: "Contact us", link: "/contact-us" },
	{ name: "Shipping", link: "/shipping" },
];

export default function Footer() {
	return (
		<footer className="relative">
			<div className="line-break"></div>
			<div className="absolute inset-0 z-0 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 overflow-hidden bg-white/90 dark:bg-black/50 border-flc-yellow/20 dark:border-flc-yellow/30" />
			<div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 text-black dark:text-white">
				<div className="grid grid-cols-1 md:grid-cols-2">
					<div className="flex flex-col items-center md:items-start">
						<div className="relative size-28">
							<Image
								src="/FLC.jpg"
								alt="flc_logo"
								className="rounded-4xl"
								fill
							/>
						</div>
						<p className="mb-3 mt-3 flex items-center font-sub-heading text-lg md:text-xl">
							Finite Loop Club
						</p>
						<div className="mb-4">
							<p className="text-center md:text-left">
								NMAM Institute of Technology
							</p>
							<p className="text-center md:text-left">Nitte, SH1, Karkala</p>
							<p className="text-center md:text-left">Karnataka, 574110, IN</p>
						</div>
					</div>

					<div className="flex flex-col justify-end md:items-end ">
						<ul className="mb-6 flex flex-wrap justify-center gap-4 md:gap-6">
							{links.map((link) => (
								<li key={link.name}>
									<Link href={link.link}>{link.name}</Link>
								</li>
							))}
						</ul>

						<ul className="mb-6 flex justify-center gap-4 md:gap-6">
							{social.map((link) => (
								<li key={link.name}>
									<Link href={link.link}>{link.icon}</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<hr className="border-gray-700" />
				<div className="flex flex-col items-center gap-4 pt-4">
					<ul className="flex flex-wrap justify-center gap-4 text-sm md:gap-6">
						{footLinks.map((link) => (
							<li key={link.name}>
								<Link
									href={link.link}
									className="transition hover:text-gray-600 dark:hover:text-gray-200/75"
								>
									{link.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}
