import { type NextRequest, NextResponse } from "next/server";

const AOC_LEADERBOARD_URL =
	"https://adventofcode.com/2025/leaderboard/private/view/3645225.json";
const DEFAULT_TTL_MS = 15 * 60 * 1000;

type CachedEntry = {
	data: unknown;
	timestamp: number;
};

let cache: CachedEntry | null = null;

const getCacheTtl = () => {
	const envValue = process.env.AOC_CACHE_TTL_MS;
	if (!envValue) return DEFAULT_TTL_MS;
	const parsed = Number(envValue);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MS;
};

export async function GET(_request: NextRequest) {
	const sessionCookie = process.env.AOC_SESSION_COOKIE;
	if (!sessionCookie) {
		return NextResponse.json(
			{
				success: false,
				message: "Missing AOC session cookie on the server",
			},
			{ status: 500 },
		);
	}

	const ttl = getCacheTtl();
	const now = Date.now();
	if (cache && now - cache.timestamp < ttl) {
		return NextResponse.json(
			{
				success: true,
				data: cache.data,
				cached: true,
				ageMs: now - cache.timestamp,
			},
			{
				headers: {
					"Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
					"X-AoC-Cache": "HIT",
				},
			},
		);
	}

	try {
		const res = await fetch(AOC_LEADERBOARD_URL, {
			method: "GET",
			headers: {
				Cookie: `session=${sessionCookie}`,
				"User-Agent": "client-25/1.0 (+https://www.finiteloop.club)",
			},
		});

		if (!res.ok) {
			return NextResponse.json(
				{
					success: false,
					message: `AOC request failed with status ${res.status}`,
				},
				{ status: res.status },
			);
		}

		const data = await res.json();
		cache = { data, timestamp: now };
		return NextResponse.json(
			{ success: true, data, cached: false },
			{
				headers: {
					"Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
					"X-AoC-Cache": "MISS",
				},
			},
		);
	} catch (error) {
		console.error("Failed to fetch AoC leaderboard", error);
		return NextResponse.json(
			{
				success: false,
				message: "Unable to reach Advent of Code",
			},
			{ status: 500 },
		);
	}
}
