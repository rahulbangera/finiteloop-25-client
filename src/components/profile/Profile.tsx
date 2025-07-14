"use client";
import { useSession } from "next-auth/react";
import PaymentButton from "../razorpay/paymentButton";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-6xl font-bold">
			Hello {session?.user?.name || "Guest"}!
			<PaymentButton
				className="flex cursor-pointer"
				paymentType="MEMBERSHIP"
				description="Club Membership"
				onSuccess={async (paymentId) => {
					// toast.success("Payment successful");
					alert("Payment successful");
					console.log("Payment ID:", paymentId);
				}}
				onFailure={() => {
					alert("Payment failed");
					// toast.error("Payment failed")
				}}
				type="submit"
			/>
		</div>
	);
}
