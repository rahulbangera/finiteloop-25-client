import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Profile from "@/components/profile/Profile";

interface ProfilePageProps {
	params: Promise<{
		userId: string;
	}>;
}

async function fetchUserForMetadata(userId: string) {
	try {
		if (!process.env.NEXT_PUBLIC_SERVER_URL) {
			return null;
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/searchbyId`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
				cache: "force-cache",
				signal: controller.signal,
			},
		);

		clearTimeout(timeoutId);

		if (!res.ok) return null;

		const data = await res.json();
		if (data.success && data.id) {
			return {
				name: data.name || `User ${userId}`,
				image: data.image,
				bio: data.bio,
			};
		}
	} catch (error) {
		console.error("Error fetching user for metadata:", error);
	}

	return null;
}

function generateProfileImageUrl(
	user: { name: string; image?: string } | null,
) {
	if (user?.image) {
		return user.image;
	}

	const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

	const svgAvatar = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
		<rect width="400" height="400" fill="linear-gradient(135deg, #f97316 0%, #facc15 100%)"/>
		<text x="200" y="240" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
	</svg>`;

	const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgAvatar).toString("base64")}`;
	return dataUrl;
}

export async function generateMetadata({
	params,
}: ProfilePageProps): Promise<Metadata> {
	const { userId } = await params;

	const userIdNumber = parseInt(userId, 10);
	if (Number.isNaN(userIdNumber)) {
		notFound();
	}

	const user = await fetchUserForMetadata(userId);
	const userName = user?.name || `User ${userId}`;
	const userDescription =
		user?.bio ||
		`View the profile of ${userName} on Finite Loop Club. See their achievements, contributions, and activity within our tech community.`;
	const profileImage = generateProfileImageUrl(user);

	return {
		title: `${userName}'s Profile`,
		description: userDescription,
		openGraph: {
			title: `${userName}'s Profile | Finite Loop Club`,
			description: userDescription,
			url: `/profile/${userId}`,
			images: [
				{
					url: profileImage,
					width: 400,
					height: 400,
					alt: `${userName}'s profile picture`,
				},
			],
			type: "profile",
		},
		twitter: {
			card: "summary",
			title: `${userName}'s Profile | Finite Loop Club`,
			description: userDescription,
			images: [profileImage],
		},
		alternates: {
			canonical: `/profile/${userId}`,
		},
	};
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
	const { userId } = await params;

	const userIdNumber = parseInt(userId, 10);
	if (Number.isNaN(userIdNumber)) {
		notFound();
	}

	return <Profile userId={userIdNumber} />;
}
