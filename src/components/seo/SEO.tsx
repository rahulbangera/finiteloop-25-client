import Head from "next/head";

interface SEOProps {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	type?: "website" | "article";
	publishedTime?: string;
	modifiedTime?: string;
	noindex?: boolean;
}

const defaultTitle = "Finite Loop Club";
const defaultDescription =
	"Finite loop club encourages students of NMAMIT to realize their idea through competitive programming participation, hands-on experience on real-time projects and by conducting many more coding events that will inspire the next generation of innovators.";
const defaultImage = "https://www.finiteloop.club/FLC.jpg";
const siteUrl = "https://www.finiteloop.club";

export default function SEO({
	title,
	description = defaultDescription,
	url,
	image = defaultImage,
	type = "website",
	publishedTime,
	modifiedTime,
	noindex = false,
}: SEOProps) {
	const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
	const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

	return (
		<Head>
			<title>{fullTitle}</title>
			<meta name="description" content={description} />

			{noindex && <meta name="robots" content="noindex,nofollow" />}

			{/* Open Graph */}
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={fullUrl} />
			<meta property="og:image" content={image} />
			<meta property="og:type" content={type} />
			<meta property="og:site_name" content="Finite Loop Club" />

			{publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
			{modifiedTime && (
				<meta property="article:modified_time" content={modifiedTime} />
			)}

			<link rel="canonical" href={fullUrl} />
		</Head>
	);
}
