"use client";
import Image from "next/image";
import { useState } from "react";
import Radio from "@/components/Radio";

type EventYear = "2023-24" | "2024-25" | "2025-26";

type EventType = {
	type: string;
	name: string;
	image: string;
	description: string;
	date: string;
	format: string;
	venue: string;
	membersPerTeam: number;
	entryFee: string;
};

const mockEvents: Record<EventYear, EventType[]> = {
	"2023-24": [
		{
			type: "Hackathon",
			name: "CodeSprint 1.0",
			image: "/testing/overtime.png",
			description: "A solo coding competition testing DSA skills.",
			date: "2024-02-15",
			format: "Solo",
			venue: "Auditorium",
			membersPerTeam: 1,
			entryFee: "₹100",
		},
		{
			type: "Special",
			name: "TechQuiz",
			image: "/testing/overtime.png",
			description: "Quiz on latest tech and CS fundamentals.",
			date: "2024-03-10",
			format: "Team",
			venue: "Room 201",
			membersPerTeam: 2,
			entryFee: "₹50",
		},
	],
	"2024-25": [
		{
			type: "Hackathon",
			name: "Hackverse",
			image: "/testing/overtime.png",
			description: "24 hour hackathon for innovative projects.",
			date: "2025-01-20",
			format: "Team",
			venue: "Lab Block",
			membersPerTeam: 4,
			entryFee: "Free",
		},
		{
			type: "Competition",
			name: "Algo Clash",
			image: "/testing/overtime.png",
			description: "Head-to-head algorithm challenge.",
			date: "2025-02-05",
			format: "Solo",
			venue: "Online",
			membersPerTeam: 1,
			entryFee: "₹100",
		},
		{
			type: "Workshop",
			name: "DevJam",
			image: "/testing/overtime.png",
			description: "Web/app development sprint.",
			date: "2025-04-18",
			format: "Team",
			venue: "Main Hall",
			membersPerTeam: 3,
			entryFee: "₹150",
		},
		{
			type: "Special",
			name: "TechQuiz",
			image: "/testing/overtime.png",
			description: "Quiz on latest tech and CS fundamentals.",
			date: "2025-05-10",
			format: "Team",
			venue: "Room 201",
			membersPerTeam: 2,
			entryFee: "₹50",
		},
	],
	"2025-26": [],
};

const EventsPage = () => {
	const [selectedYear, setSelectedYear] = useState<EventYear>("2025-26");

	const handleToggleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
		const id = (e.target as HTMLElement).id;
		if (id === "glass-silver") setSelectedYear("2023-24");
		else if (id === "glass-gold") setSelectedYear("2024-25");
		else if (id === "glass-platinum") setSelectedYear("2025-26");
	};

	return (
		<div className="p-8 h-full w-full bg-transparent flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
			<div className="text-7xl mt-20 select-none">Events</div>
			<div className="m-8 select-none" onChange={handleToggleChange}>
				<Radio
					plans={[
						{ id: "glass-silver", label: "2023-24" },
						{ id: "glass-gold", label: "2024-25" },
						{ id: "glass-platinum", label: "2025-26" },
					]}
				/>
			</div>
			<div className="min-h-screen w-full grid justify-center items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{mockEvents[selectedYear].length === 0 ? (
					<div className="w-full text-5xl text-black dark:text-white text-center col-span-full mt-40">
						No Events for {selectedYear}
					</div>
				) : (
					mockEvents[selectedYear].map((event) => (
						<div
							key={`${event.name}-${event.date}`}
							className="w-full rounded-xl shadow-md overflow-hidden hover:-translate-y-1 transition-transform duration-200 border border-black dark:border-white"
						>
							<div className="w-full h-96 relative">
								<Image
									fill
									className="object-cover"
									src={event.image}
									alt={event.name}
								/>
							</div>
							<div className="p-3 text-center bg-white/35 dark:bg-white/15 text-black dark:text-white">
								<div className="text-lg md:text-xl lg:text-xl font-semibold uppercase">
									{event.type}
								</div>
								<div className="m-0 text-3xl md:text-3xl lg:text-4xl font-bold">
									{event.name}
								</div>
								<div className="text-lg md:text-xl">{event.date}</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default EventsPage;
