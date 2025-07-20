"use client";

import { toast } from "react-toastify";
import { WHATSAPP_SHARING_SETTINGS } from "../../config/whatsappConfig";

interface AppUser {
	id?: string;
	name?: string;
	usn?: string;
	branch?: string;
	year?: number | string;
	bio?: string;
	activityPoints?: number | string;
	attendance?: number | string;
	role?: string | { name: string };
	userLinks?: { linkName: string; url: string }[];
}

interface WhatsAppShareProps {
	user: AppUser | null | undefined;
	isViewingOtherProfile: boolean;
	userId?: string;
	onShareComplete?: () => void;
	enabled?: boolean;
}

export const WHATSAPP_SHARE_CONFIG = WHATSAPP_SHARING_SETTINGS;

export const WhatsAppShare = ({
	user,
	isViewingOtherProfile,
	userId,
	onShareComplete,
	enabled = WHATSAPP_SHARE_CONFIG.enabled,
}: WhatsAppShareProps) => {
	const getRoleName = (user: AppUser | null | undefined) => {
		if (!user) return "";
		return typeof user.role === "string"
			? user.role
			: (user as unknown as { role: { name: string } }).role?.name;
	};

	const getUserLinks = (user: AppUser | null | undefined) => {
		if (!user) return [];
		return (
			user.userLinks ||
			(user as unknown as { UserLink: { linkName: string; url: string }[] })
				.UserLink ||
			[]
		);
	};

	const handleWhatsAppShare = async () => {
		if (!enabled) {
			toast.error("WhatsApp sharing is currently disabled");
			return;
		}

		try {
			const currentUrl = window.location.origin + window.location.pathname;
			const shareUrl = isViewingOtherProfile
				? currentUrl
				: `${currentUrl}/${userId}`;

			const userLinks = getUserLinks(user);
			const roleName = getRoleName(user);

			let message = "";

			if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
				message += `🎓 *${user?.name || "User"}'s Profile* 🎓\n`;
			} else {
				message += `*${user?.name || "User"}'s Profile*\n`;
			}
			message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
				message += `👤 *Personal Details:*\n`;
			} else {
				message += `*Personal Details:*\n`;
			}

			if (user?.usn) message += `• *USN:* ${user.usn}\n`;
			if (user?.branch) message += `• *Branch:* ${user.branch}\n`;
			if (user?.year) message += `• *Graduation Year:* ${user.year}\n`;

			if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
				const roleIcon =
					roleName === "ADMIN" ? "🛡️" : roleName === "MEMBER" ? "⭐" : "👤";
				const roleText =
					roleName === "ADMIN"
						? "ADMIN"
						: roleName === "MEMBER"
							? "MEMBER"
							: "USER";
				message += `• *Role:* ${roleIcon} *${roleText}*\n\n`;
			} else {
				const roleText =
					roleName === "ADMIN"
						? "ADMIN"
						: roleName === "MEMBER"
							? "MEMBER"
							: "USER";
				message += `• *Role:* *${roleText}*\n\n`;
			}

			if (WHATSAPP_SHARE_CONFIG.content.includeBio && user?.bio?.trim()) {
				if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
					message += `💭 *About ${user?.name || "them"}:*\n`;
				} else {
					message += `*About ${user?.name || "them"}:*\n`;
				}
				message += `> _"${user.bio.trim()}"_\n\n`;
			}

			if (WHATSAPP_SHARE_CONFIG.content.includeStats) {
				const activityPoints =
					(user as unknown as { totalActivityPoints: number })
						?.totalActivityPoints ||
					user?.activityPoints ||
					0;
				const attendance = user?.attendance || 0;

				if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
					message += `📊 *Performance Stats:*\n`;
					message += `• *Activity Points:* ⚡ *${activityPoints}*\n`;
					message += `• *Attendance:* 📈 *${attendance}%*\n\n`;
				} else {
					message += `*Performance Stats:*\n`;
					message += `• *Activity Points:* *${activityPoints}*\n`;
					message += `• *Attendance:* *${attendance}%*\n\n`;
				}
			}

			if (WHATSAPP_SHARE_CONFIG.content.includeLinks && userLinks.length > 0) {
				if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
					message += `🔗 *Connect with ${user?.name || "them"}:*\n`;
					userLinks.forEach((link: { linkName: string; url: string }) => {
						const platformEmoji =
							{
								instagram: "📷",
								linkedin: "💼",
								github: "⚡",
								portfolio: "🌐",
								leetcode: "🧩",
							}[link.linkName.toLowerCase()] || "🔗";

						const platformName =
							{
								instagram: "Instagram",
								linkedin: "LinkedIn",
								github: "GitHub",
								portfolio: "Portfolio",
								leetcode: "LeetCode",
							}[link.linkName.toLowerCase()] || link.linkName;

						message += `• ${platformEmoji} *${platformName}:* ${link.url}\n`;
					});
				} else {
					message += `*Connect with ${user?.name || "them"}:*\n`;
					userLinks.forEach((link: { linkName: string; url: string }) => {
						const platformName =
							{
								instagram: "Instagram",
								linkedin: "LinkedIn",
								github: "GitHub",
								portfolio: "Portfolio",
								leetcode: "LeetCode",
							}[link.linkName.toLowerCase()] || link.linkName;

						message += `• *${platformName}:* ${link.url}\n`;
					});
				}
				message += `\n`;
			}

			message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
			if (WHATSAPP_SHARE_CONFIG.content.includeEmojis) {
				message += `🌟 *View Complete Profile:*\n${shareUrl}\n\n`;
				message += `💫 _${WHATSAPP_SHARE_CONFIG.messages.communityInvitation}_\n`;
				message += `🚀 _${WHATSAPP_SHARE_CONFIG.messages.opportunitiesText}_`;
			} else {
				message += `*View Complete Profile:*\n${shareUrl}\n\n`;
				message += `_${WHATSAPP_SHARE_CONFIG.messages.communityInvitation}_\n`;
				message += `_${WHATSAPP_SHARE_CONFIG.messages.opportunitiesText}_`;
			}

			const encodedMessage = encodeURIComponent(message);
			const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

			window.open(whatsappUrl, "_blank");

			if (onShareComplete) {
				onShareComplete();
			}

			toast.success("Opening WhatsApp...");
		} catch (err) {
			console.error("Failed to share on WhatsApp:", err);
			toast.error("Failed to share on WhatsApp");
		}
	};

	if (!enabled) {
		return null;
	}

	return { handleWhatsAppShare };
};

export const useWhatsAppShare = (props: WhatsAppShareProps) => {
	const shareHandler = WhatsAppShare(props);
	return shareHandler
		? { handleWhatsAppShare: shareHandler.handleWhatsAppShare }
		: { handleWhatsAppShare: async () => {} };
};
