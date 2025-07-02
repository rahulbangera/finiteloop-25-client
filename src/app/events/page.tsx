import { Suspense } from "react";
import EventsPage from "./EventsPage";

export default function EventsWrapper() {
	return (
		<Suspense
			fallback={
				<div className="text-center mt-20 text-xl">Loading events...</div>
			}
		>
			<EventsPage />
		</Suspense>
	);
}
