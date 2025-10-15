import Script from "next/script";

interface JsonLdProps {
	data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
	const jsonString = JSON.stringify(data);

	return (
		<Script
			id="json-ld"
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
			dangerouslySetInnerHTML={{ __html: jsonString }}
		/>
	);
}

export const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Finite Loop Club",
	url: "https://www.finiteloop.club",
	logo: "https://www.finiteloop.club/FLC.jpg",
	description:
		"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.",
	sameAs: [
		"https://www.instagram.com/finiteloop.club/",
		"https://www.facebook.com/FiniteLoopClub.Nmamit/",
		"https://www.linkedin.com/showcase/finite-loop-club",
		"https://github.com/finiteloopclub?tab=repositories",
	],
	contactPoint: {
		"@type": "ContactPoint",
		contactType: "General",
		url: "https://www.finiteloop.club/contact-us",
	},
};

export const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Finite Loop Club",
	url: "https://www.finiteloop.club",
	description:
		"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.",
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.finiteloop.club/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
};
