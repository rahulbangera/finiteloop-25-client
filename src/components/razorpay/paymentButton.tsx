import Script from "next/script";
import { useSession } from "next-auth/react";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "../ui/button";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const PaymentButton = forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		onStart?: () => void;
		preTasks?: () => Promise<void>;
		description: string;
		extraClassName?: string;
		onSuccess: (paymentId: string) => void;
		onFailure: (error?: string) => void;
		onEnd?: () => void;
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
			onStart,
			description,
			preTasks,
			extraClassName,
			paymentType,
			amountInINR,
			teamId,
			onFailure,
			onSuccess,
			onEnd,
			...props
		},
		ref,
	) => {
		const session = useSession();
		session.data?.user.role;

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
					className={`z-20 flex-1 font-bold text-md ${extraClassName}`}
					onClick={async () => {
						console.log("Payment button clicked");
						if (preTasks) {
							await preTasks();
						}
						console.log("Pre-tasks completed");
						if (onStart) {
							onStart();
						}

						const order = await fetch(`${API_URL}/api/razorpay/create-order`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${session?.data?.accessToken}`,
							},
							body: JSON.stringify(
								paymentType === "MEMBERSHIP"
									? {
											paymentType: paymentType,
											sessionUserId: session.data.user.id,
										} // TODO [RAHUL] : ADD USER ID TO SESSION
									: {
											paymentType: paymentType,
											amountInINR: amountInINR,
											teamId: teamId,
											sessionUserId: session.data.user.id, // TODO [RAHUL] : ADD USER ID TO SESSION
										},
							),
						});
						const orderData = await order.json();
						if (!orderData || !orderData.orderId) {
							console.error("Failed to create order", orderData);
							if (orderData.error) {
								onFailure(orderData.error);
							} else {
								onFailure();
							}
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
								paymentType: paymentType,
								paymentName: description,
								teamId: teamId,
								sessionUserId: session.data.user.id,
							},
							theme: {
								color: "#3399cc",
							},
							prefill: {
								name: session.data.user?.name || "",
								email: session.data.user?.email || "",
								contact: session.data.user.phone || "", // TODO [RAHUL] : ADD USER PHONE NUMBER TO SESSION
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
												Authorization: `Bearer ${session?.data?.accessToken}`,
											},
											body: JSON.stringify(
												paymentType === "MEMBERSHIP"
													? {
															paymentType: paymentType,
															paymentName: description,
															amount: orderData.orderAmount,
															razorpayOrderId: response.razorpay_order_id,
															razorpayPaymentId: response.razorpay_payment_id,
															razorpaySignature: response.razorpay_signature,
															sessionUserId: session.data.user.id, // TODO [RAHUL] : ADD USER ID TO SESSION
														}
													: {
															paymentType: paymentType,
															amountInINR: amountInINR,
															teamId: teamId,
															amount: orderData.orderAmount,
															paymentName: description,
															razorpayOrderId: response.razorpay_order_id,
															razorpayPaymentId: response.razorpay_payment_id,
															razorpaySignature: response.razorpay_signature,
															sessionUserId: session.data.user.id, // TODO [RAHUL] : ADD USER ID TO SESSION
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
						if (onEnd) {
							onEnd();
						}
					}}
					{...props}
				/>
			</>
		);
	},
);

PaymentButton.displayName = "Pay Now";
export default PaymentButton;
