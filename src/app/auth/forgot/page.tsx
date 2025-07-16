import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ForgotForm from "@/components/auth/ForgotForm";
import { authOptions } from "@/lib/auth";
import { toast } from "react-toastify";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		setTimeout(() => {
			toast.error(
				"You are already logged in. Log out to access the forgot password page.",
			);
		}, 3000);

		redirect("/profile");
	}

	return <ForgotForm />;
}
