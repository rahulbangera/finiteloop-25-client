import { NextResponse } from "next/server";
import { generateSitemapXml, staticRoutes } from "@/lib/sitemap";

export async function GET() {
	try {
		const urlsWithTimestamp = staticRoutes.map((url) => ({
			...url,
			lastModified: url.lastModified || new Date(),
		}));

		const sitemap = generateSitemapXml(urlsWithTimestamp);

		return new NextResponse(sitemap, {
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	} catch (error) {
		console.error("Error generating sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
