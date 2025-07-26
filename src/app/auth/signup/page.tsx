import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignUpForm from "@/components/auth/SignupForm";
import { authOptions } from "@/lib/auth";

export default async function SignupPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/profile");
	}

	return <SignUpForm />;
}
