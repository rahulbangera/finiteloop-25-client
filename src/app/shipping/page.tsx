"use client";

export default function ShippingAndDelivery() {
	return (
		<main>
			<div className="mt-20 m-15 flex flex-col">
				<div className="mb-10">
					<p className="text-5xl text-center dark:text-white text-black font-bold">
						Shipping and Delivery
					</p>
					<p className="text-md text-center dark:text-white/50 text-black/50 font-bold">
						Last updated on July 14, 2025
					</p>
				</div>
				<div className="flex flex-col gap-5 text-xl text-center dark:text-white/80 text-black/80 ">
					<p className="text-3xl underline underline-offset-4">
						Shipping Policy
					</p>
					<p>
						Shipping is not applicable for business. For any queries related to
						delivery, please contact our support team.
					</p>
					<p className="text-3xl underline underline-offset-4">
						Membership Registration
					</p>
					<div className="flex flex-col border-1 border-black dark:border-white p-2">
						<p className="text-2xl">Membership Fee</p>
						<p className="text-6xl mt-8">₹400</p>
						<p className="mt-8">
							One-time payment. Valid until you are a part of the college. All
							of the club events will be free for members.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
