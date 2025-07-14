"use client";

export default function RefundAndCancellation() {
	return (
		<main>
			<div className="mt-20 m-15 flex flex-col">
				<div className="mb-10">
					<p className="text-5xl text-center dark:text-white text-black font-bold">
						Refund and Cancellation
					</p>
					<p className="text-md text-center dark:text-white/50 text-black/50 font-bold">
						Last updated on July 14, 2025
					</p>
				</div>
				<div className="flex flex-col gap-5 text-xl text-center dark:text-white/80 text-black/80 font-bold">
					<div className="flex flex-col gap-5 text-left">
						<p>
							FINITE LOOP CLUB believes in helping its customers as far as
							possible, and has therefore a liberal cancellation policy. Under
							this policy:
						</p>
						<ul className="flex flex-col list-disc list-inside pl-5 gap-5">
							<li>
								Cancellations will be considered only if the request is made
								immediately after placing the order. However, the cancellation
								request may not be entertained if the orders have been
								communicated to the vendors/merchants and they have initiated
								the process of shipping them.
							</li>
							<li>
								FINITE LOOP CLUB does not accept cancellation requests for
								perishable items like flowers, eatables, etc. However,
								refund/replacement can be made if the customer establishes that
								the quality of the product delivered is not good.
							</li>
							<li>
								In case of receipt of damaged or defective items, please report
								the same to our Customer Service team. The request will,
								however, be entertained once the merchant has checked and
								determined the same at his own end. This should be reported
								within 7 days of receipt of the products.
							</li>
							<li>
								If you feel that the product received is not as shown on the
								site or as per your expectations, you must bring it to the
								notice of our customer service within 7 days of receiving the
								product. The Customer Service Team, after looking into your
								complaint, will take an appropriate decision.
							</li>
							<li>
								In case of complaints regarding products that come with a
								warranty from manufacturers, please refer the issue to them.
							</li>
							<li>
								In case of any Refunds approved by FINITE LOOP CLUB, it'll take
								1-2 days for the refund to be processed to the end customer.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</main>
	);
}
