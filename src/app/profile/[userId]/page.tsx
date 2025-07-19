import Profile from "@/components/profile/Profile";
import { notFound } from "next/navigation";

interface ProfilePageProps {
	params: {
		userId: string;
	};
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
	const { userId } = params;

	const userIdNumber = parseInt(userId, 10);
	if (Number.isNaN(userIdNumber)) {
		notFound();
	}

	return <Profile userId={userIdNumber} />;
}
