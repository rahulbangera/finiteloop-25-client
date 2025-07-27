import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Profile from "@/components/profile/Profile";

interface ProfilePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export async function generateMetadata({
	params,
}: ProfilePageProps): Promise<Metadata> {
	const { userId } = await params;

	const userIdNumber = parseInt(userId, 10);
	if (Number.isNaN(userIdNumber)) {
		notFound();
	}

	return {
		title: `User Profile - ${userId}`,
		description: `View the profile of user ${userId} on Finite Loop Club. See their achievements, contributions, and activity within our tech community.`,
		openGraph: {
			title: `User Profile - ${userId} | Finite Loop Club`,
			description: `View the profile of user ${userId} on Finite Loop Club. See their achievements, contributions, and activity within our tech community.`,
			url: `/profile/${userId}`,
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
