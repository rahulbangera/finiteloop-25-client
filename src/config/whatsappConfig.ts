export const WHATSAPP_SHARING_SETTINGS = {
	enabled: true,

	content: {
		includeEmojis: true,
		includeStats: true,
		includeBio: true,
		includeLinks: true,
	},

	messages: {
		communityInvitation:
			"Join our amazing student community and connect with talented peers!",
		opportunitiesText: "Discover opportunities, events, and much more!",
	},
};

export const enableWhatsAppSharing = () => {
	WHATSAPP_SHARING_SETTINGS.enabled = true;
};

export const disableWhatsAppSharing = () => {
	WHATSAPP_SHARING_SETTINGS.enabled = false;
};
