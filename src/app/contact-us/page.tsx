"use client";

export default function ContactUs() {
	return (
		<main>
			<div className="mt-20 m-15 flex flex-col">
				<div className="mb-10">
					<p className="text-5xl text-center dark:text-white text-black font-bold">
						Contact Us
					</p>
					<p className="text-md text-center dark:text-white/50 text-black/50 font-bold">
						Last updated on July 14, 2025
					</p>
				</div>
				<div className="flex flex-col gap-5 text-xl text-center dark:text-white/80 text-black/80 ">
					<div className="flex flex-col gap-4 text-left">
						<p className="text-2xl">
							You may contact us using the information below:
						</p>
						<span>
							<span className="inline font-extrabold">
								Merchant Legal entity name:
							</span>
							<span className="select-all ml-5">
								INSPIRANTE TECHNOLOGIES PRIVATE LIMITED
							</span>
						</span>
						<span>
							<span className="inline font-extrabold">Registered Address:</span>
							<span className="select-all ml-5">
								2-1-22, Bombay House, Kalsanka, Kunjibettu PO, Udupi, KARNATAKA
								- 576102
							</span>
						</span>
						<span>
							<span className="inline font-extrabold">
								Operational Address:
							</span>
							<span className="select-all ml-5">
								2-1-22, Bombay House, Kalsanka, Kunjibettu PO, Udupi, KARNATAKA
								- 576102
							</span>
						</span>
						<span>
							<span className="inline font-extrabold">Telephone No:</span>
							<span className="select-all ml-5">+91 8050338576</span>
						</span>
						<span>
							<span className="inline font-extrabold">Email ID:</span>
							<span className="ml-5 text-blue-400">
								<a href="mailto:finiteloopclub@nmamit.in">
									finiteloopclub@nmamit.in
								</a>
							</span>
						</span>
					</div>
				</div>
			</div>
		</main>
	);
}
