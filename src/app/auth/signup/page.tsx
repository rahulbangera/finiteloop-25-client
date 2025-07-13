import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignUpForm from "@/components/auth/SignupForm";

export default async function SignupPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/profile");
	}

	return <SignUpForm />;
}
