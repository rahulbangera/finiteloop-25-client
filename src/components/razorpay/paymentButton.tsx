import Script from "next/script";
import { forwardRef } from "react";

import { Button, type ButtonProps } from "../ui/button";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
type PaymentType = "EVENT" | "MEMBERSHIP";

const PaymentButton = forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		description: string;
		onSuccess: (paymentId: string) => void;
		onFailure: () => void;
	} & (
			| {
					paymentType: "EVENT";
					amountInINR: number;
					teamId: string;
			  }
			| {
					paymentType: "MEMBERSHIP";
					amountInINR?: never;
					teamId?: never;
			  }
		)
>(
	(
		{
			description,
			paymentType,
			amountInINR,
			teamId,
			onFailure,
			onSuccess,
			...props
		},
		ref,
	) => {
		const session = useSession();

		if (!session || !session.data?.user) {
			return (
				<Button
					ref={ref}
					{...props}
					disabled
					className="bg-gray-500 text-white cursor-not-allowed"
				>
					Please login to make a payment
				</Button>
			);
		}

		return (
			<>
				<Script src="https://checkout.razorpay.com/v1/checkout.js" />

				<Button
					ref={ref}
					className="z-20"
					onClick={async () => {
						console.log("Payment button clicked");
						const order = await fetch(`${API_URL}/api/razorpay/create-order`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(
								paymentType === "MEMBERSHIP"
									? { paymentType: paymentType, sessionUserId: 100 } // TODO [RAHUL] : ADD USER ID TO SESSION
									: {
											paymentType: paymentType,
											amountInINR: amountInINR,
											teamId: teamId,
											sessionUserId: 100, // TODO [RAHUL] : ADD USER ID TO SESSION
										},
							),
						});
						const orderData = await order.json();
						if (!orderData || !orderData.orderId) {
							console.error("Failed to create order", orderData);
							onFailure();
							return;
						}

						console.log("Order created successfully", orderData);

						// TODO [RAHUL] : SHOW SOME LOADING INDICATOR WITH ORDER CREATION INDICATION

						const paymentObj = new window.Razorpay({
							key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY_ID || "",
							order_id: orderData.orderId,
							amount: orderData.orderAmount,
							currency: orderData.orderCurrency,
							name: "FiniteLoop Club",
							description: description,
							image:
								"https://vl59x2gjdl.ufs.sh/f/p1uQPjI1vqk0iimoIO8hMqK8NUVTCw59vED26JxRc7z4kGea",
							notes: {
								address: "NMAM Institute of Technology, Nitte, Karnataka",
							},
							theme: {
								color: "#3399cc",
							},
							prefill: {
								name: session.data.user?.name || "",
								email: session.data.user?.email || "",
								contact: "2121212122", // TODO [RAHUL] : ADD USER PHONE NUMBER TO SESSION
							},
							handler: async (response) => {
								console.log("Payment response received", response);
								try {
									const payment = await fetch(
										`${API_URL}/api/razorpay/save-payment`,
										{
											method: "POST",
											headers: {
												"Content-Type": "application/json",
											},
											body: JSON.stringify(
												paymentType === "MEMBERSHIP"
													? {
															paymentType: paymentType,
															paymentName: description,
															razorpayOrderId: response.razorpay_order_id,
															razorpayPaymentId: response.razorpay_payment_id,
															razorpaySignature: response.razorpay_signature,
															sessionUserId: 100, // TODO [RAHUL] : ADD USER ID TO SESSION
														}
													: {
															paymentType: paymentType,
															amountInINR: amountInINR,
															teamId: teamId,
															paymentName: description,
															razorpayOrderId: response.razorpay_order_id,
															razorpayPaymentId: response.razorpay_payment_id,
															razorpaySignature: response.razorpay_signature,
															sessionUserId: 100, // TODO [RAHUL] : ADD USER ID TO SESSION
														},
											),
										},
									);
									const paymentData = await payment.json();
									if (
										!paymentData ||
										!paymentData.paymentDbId ||
										paymentData.razorpayPaymentId
									) {
										console.error("Failed to save payment", paymentData);
										throw new Error("Payment save failed");
									}
									console.log("Payment saved successfully", paymentData);
									onSuccess(paymentData.paymentDbId);
								} catch (error) {
									console.error("Error saving payment", error);
									onFailure(); // TODO [RAHUL] : HANDLE ERROR PROPERLY AND SHOW TOAST TO USER
									return;
								}
							},
						});
						paymentObj.open();
					}}
					{...props}
				>
					Pay Now
				</Button>
			</>
		);
	},
);

PaymentButton.displayName = "Pay Now";
export default PaymentButton;
