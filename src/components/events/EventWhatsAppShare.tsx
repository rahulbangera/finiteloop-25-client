"use client";

import { Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { WhatsAppShare } from "../profile/WhatsAppShare";
import { FaWhatsapp } from "react-icons/fa";

interface Event {
	id: number;
	name: string;
	imgSrc: string;
	description: string | null;
	venue: string | null;
	eventType: "SOLO" | "TEAM";
	category: string;
	fromDate: string;
	toDate: string;
	deadline: string;
	maxTeams: number;
	minTeamSize: number;
	maxTeamSize: number;
	isMembersOnly: boolean;
	flcAmount: number;
	nonFlcAmount: number;
	state: string;
	isLegacy: boolean;
}

interface TeamState {
	registering: boolean;
	isConfirmed: boolean;
	isLeader: boolean;
	action: "NONE" | "CREATE" | "JOIN";
	teamName: string;
	teamId: string;
	createdTeamId: string;
	members: { id: string; name: string }[];
}

interface EventWhatsAppShareProps {
	event: Event;
	teamState: TeamState;
	registered: boolean;
	className?: string;
	variant?: "button" | "icon";
}
function normalize(html: string): string {
	if (!html) return "";
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

const EventWhatsAppShare = ({
	event,
	teamState,
	registered,
	className = "",
	variant = "button",
}: EventWhatsAppShareProps) => {
	const generateShareMessage = (isTeamInvite: boolean) => {
		const baseUrl = window.location.origin;
		let shareUrl = `${baseUrl}/events?id=${event.id}`;

		if (isTeamInvite && teamState.createdTeamId) {
			shareUrl += `&teamInvite=${teamState.createdTeamId}`;
		}

		let message = "";

		if (isTeamInvite && teamState.createdTeamId) {
			message += `🎯 *Team Invitation!* 🎯\n`;
			message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			message += `🔗 *Join our team here:*\n${shareUrl}\n\n`;

			message += `🏆 *Event:* ${event.name}\n`;
			message += `📅 *Date:* ${new Date(event.fromDate).toLocaleDateString()}\n`;
			message += `📍 *Venue:* ${event.venue || "TBA"}\n`;
			message += `👥 *Format:* ${event.eventType}\n\n`;

			if (event.eventType === "TEAM") {
				message += `🎪 *Team Details:*\n`;
				message += `• *Team Name:* ${teamState.teamName}\n`;
				message += `• *Team ID:* ${teamState.createdTeamId}\n`;
				message += `• *Team Size:* ${event.minTeamSize}-${event.maxTeamSize} members\n`;
				message += `• *Current Members:* ${teamState.members.length}/${event.maxTeamSize}\n\n`;

				message += `👥 *Current Team Members:*\n`;
				if (teamState.members.length === 0) {
					message += `• You (Team Leader)\n`;
				} else {
					teamState.members.forEach((member, index) => {
						if (index === 0 && teamState.isLeader) {
							message += `• ${member.name} (Team Leader)\n`;
						} else {
							message += `• ${member.name}\n`;
						}
					});
				}
				message += `\n`;
			}

			message += `💡 *Join our team and participate together!*\n`;
		} else {
			message += `🎉 *Check out this amazing event!* 🎉\n`;
			message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			message += `🏆 *${event.name}*\n\n`;

			if (event.description) {
				const remHtml = normalize(event.description);
				const shortDescription =
					remHtml.length > 100 ? `${remHtml.substring(0, 97)}...` : remHtml;
				message += `📝 *About:*\n${shortDescription}\n\n`;
			}

			message += `📋 *Event Details:*\n`;
			message += `• *Category:* ${event.category}\n`;
			message += `• *Date:* ${new Date(event.fromDate).toLocaleDateString()}\n`;
			message += `• *Venue:* ${event.venue || "TBA"}\n`;
			message += `• *Format:* ${event.eventType}\n`;

			if (event.eventType === "TEAM") {
				if (event.minTeamSize === event.maxTeamSize) {
					message += `• *Team Size:* ${event.minTeamSize} members\n`;
				} else {
					message += `• *Team Size:* ${event.minTeamSize}-${event.maxTeamSize} members\n`;
				}
			}

			if (event.flcAmount === 0 && event.nonFlcAmount === 0) {
				message += `• *Entry Fee:* 🆓 FREE\n`;
			} else if (event.isMembersOnly) {
				message += `• *Entry Fee:* ₹${event.flcAmount} (Members Only)\n`;
			} else {
				message += `• *Entry Fee:* ₹${event.flcAmount} (Members) | ₹${event.nonFlcAmount} (Non-Members)\n`;
			}

			const deadlineDate = new Date(event.deadline);
			const now = new Date();
			if (deadlineDate > now) {
				message += `• *Registration Deadline:* ${deadlineDate.toLocaleDateString()}\n`;
			}

			message += `\n🌟 *Don't miss out on this incredible opportunity!*\n`;
		}

		message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
		if (!isTeamInvite) {
			message += `🔗 *Register/View Event:*\n${shareUrl}\n\n`;
		}
		message += `🚀 *Join FLC Community for more amazing events!*\n`;
		message += `💫 *Connect, Learn, and Grow Together!*`;

		return message;
	};

	const handleWhatsAppShare = async () => {
		try {
			const isTeamInvite = Boolean(
				registered &&
					event.deadline > new Date().toISOString() &&
					teamState.createdTeamId &&
					event.eventType === "TEAM" &&
					teamState.isLeader,
			);

			const message = generateShareMessage(isTeamInvite);
			const encodedMessage = encodeURIComponent(message);
			const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

			window.open(whatsappUrl, "_blank");

			const shareType = isTeamInvite ? "team invitation" : "event";
			toast.success(`Opening WhatsApp to share ${shareType}...`);
		} catch (error) {
			console.error("Failed to share on WhatsApp:", error);
			toast.error("Failed to share on WhatsApp");
		}
	};

	if (variant === "icon") {
		return (
			<button
				type="button"
				onClick={handleWhatsAppShare}
				className={`p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl ${className}`}
				title="Share on WhatsApp"
			>
				<Share2 className="h-5 w-5" />
			</button>
		);
	}

	const isTeamInvite = Boolean(
		registered &&
			event.deadline > new Date().toISOString() &&
			teamState.createdTeamId &&
			event.eventType === "TEAM" &&
			teamState.isLeader,
	);

	const buttonText = isTeamInvite ? "Invite to Team" : "Share Event";
	const buttonStyle = isTeamInvite
		? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
		: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";

	return (
		<button
			type="button"
			onClick={handleWhatsAppShare}
			className={`flex items-center gap-2 px-4 py-2 ${buttonStyle} text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
		>
			<FaWhatsapp className="h-5 w-5" />
			{buttonText}
		</button>
	);
};

export default EventWhatsAppShare;
