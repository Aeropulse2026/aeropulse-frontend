import { NextRequest, NextResponse } from "next/server";
import { cartoResponseContentType, rewriteCartoUrls } from "@/lib/carto/style-proxy";

const ALLOWED_HOSTS = new Set([
  "basemaps.cartocdn.com",
  "tiles.basemaps.cartocdn.com",
  "tiles-a.basemaps.cartocdn.com",
  "tiles-b.basemaps.cartocdn.com",
  "tiles-c.basemaps.cartocdn.com",
  "tiles-d.basemaps.cartocdn.com",
]);
const ALLOWED_PATHS = ["/gl/positron-gl-style/", "/fonts/", "/vector/", "/vectortiles/"];

export async function GET(request: NextRequest) {
  const key = process.env.CARTO_BASEMAP_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "CARTO_BASEMAP_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  const requested = request.nextUrl.searchParams.get("url");
  if (!requested) return NextResponse.json({ error: "Missing CARTO resource URL." }, { status: 400 });

  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(requested);
  } catch {
    return NextResponse.json({ error: "Invalid CARTO resource URL." }, { status: 400 });
  }
  if (
    upstreamUrl.protocol !== "https:" ||
    (upstreamUrl.port && upstreamUrl.port !== "443") ||
    !ALLOWED_HOSTS.has(upstreamUrl.hostname) ||
    !ALLOWED_PATHS.some((prefix) => upstreamUrl.pathname.startsWith(prefix))
  ) {
    return NextResponse.json({ error: "CARTO resource host is not allowed." }, { status: 400 });
  }

  upstreamUrl.searchParams.delete("api_key");
  upstreamUrl.searchParams.set("key", key);
  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 3600 },
    });
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined;
    const causeCode = cause && typeof cause === "object" && "code" in cause
      ? String(cause.code)
      : undefined;
    console.error("[AeroPulse CARTO proxy] upstream fetch failed", {
      host: upstreamUrl.host,
      path: upstreamUrl.pathname,
      errorName: error instanceof Error ? error.name : "UnknownError",
      causeCode,
    });
    return NextResponse.json(
      { error: "CARTO upstream fetch failed (network, DNS, TLS, or timeout)." },
      { status: 502 },
    );
  }
  if (!upstream.ok) {
    return NextResponse.json({ error: `CARTO basemap returned ${upstream.status}.` }, { status: upstream.status });
  }

  const contentType = cartoResponseContentType(
    upstreamUrl.toString(),
    upstream.headers.get("content-type") ?? "application/octet-stream",
  );
  if (contentType.includes("json")) {
    try {
      const rewritten = rewriteCartoUrls(await upstream.json(), request.nextUrl.origin);
      return NextResponse.json(rewritten, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      });
    } catch {
      return NextResponse.json({ error: "CARTO returned invalid JSON." }, { status: 502 });
    }
  }

  return new NextResponse(await upstream.arrayBuffer(), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
