export interface SitemapUrl {
	url: string;
	lastModified?: Date;
	changeFrequency?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: number;
}

export function generateSitemapXml(urls: SitemapUrl[]): string {
	const urlElements = urls
		.map(({ url, lastModified, changeFrequency, priority }) => {
			const lastmod = lastModified
				? `<lastmod>${lastModified.toISOString()}</lastmod>`
				: "";
			const changefreq = changeFrequency
				? `<changefreq>${changeFrequency}</changefreq>`
				: "";
			const priorityTag =
				priority !== undefined ? `<priority>${priority}</priority>` : "";

			return `  <url>
    <loc>${url}</loc>${lastmod}${changefreq}${priorityTag}
  </url>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export const siteUrl = "https://finiteloop.club";

export const staticRoutes: SitemapUrl[] = [
	{
		url: `${siteUrl}/`,
		changeFrequency: "weekly",
		priority: 1.0,
	},
	{
		url: `${siteUrl}/events`,
		changeFrequency: "weekly",
		priority: 0.8,
	},
	{
		url: `${siteUrl}/team`,
		changeFrequency: "monthly",
		priority: 0.7,
	},
	{
		url: `${siteUrl}/leaderboard`,
		changeFrequency: "daily",
		priority: 0.6,
	},
	{
		url: `${siteUrl}/contact-us`,
		changeFrequency: "monthly",
		priority: 0.5,
	},
	{
		url: `${siteUrl}/profile`,
		changeFrequency: "monthly",
		priority: 0.4,
	},
	{
		url: `${siteUrl}/auth/login`,
		changeFrequency: "monthly",
		priority: 0.3,
	},
	{
		url: `${siteUrl}/auth/signup`,
		changeFrequency: "monthly",
		priority: 0.3,
	},
	{
		url: `${siteUrl}/auth/join-flc`,
		changeFrequency: "monthly",
		priority: 0.4,
	},
	{
		url: `${siteUrl}/auth/forgot`,
		changeFrequency: "yearly",
		priority: 0.1,
	},
	{
		url: `${siteUrl}/privacy-policy`,
		changeFrequency: "yearly",
		priority: 0.2,
	},
	{
		url: `${siteUrl}/terms`,
		changeFrequency: "yearly",
		priority: 0.2,
	},
	{
		url: `${siteUrl}/refund`,
		changeFrequency: "yearly",
		priority: 0.2,
	},
	{
		url: `${siteUrl}/shipping`,
		changeFrequency: "yearly",
		priority: 0.2,
	},
];
