const ALLOWED_HOSTS = new Set([
  "basemaps.cartocdn.com",
  "tiles.basemaps.cartocdn.com",
  "tiles-a.basemaps.cartocdn.com",
  "tiles-b.basemaps.cartocdn.com",
  "tiles-c.basemaps.cartocdn.com",
  "tiles-d.basemaps.cartocdn.com",
]);
const PLACEHOLDER_PATTERN = /%7B(fontstack|range|z|x|y)%7D/gi;
const PROXY_PATH = "/api/carto/proxy";
const SPRITE_PATH = "/gl/positron-gl-style/sprite";

function proxyUrl(url: string, origin: string) {
  // MapLibre requires its sprite URL to be absolute. Use the current request
  // origin rather than assuming a hostname or port.
  const requestOrigin = new URL(origin);
  if (requestOrigin.protocol !== "http:" && requestOrigin.protocol !== "https:") {
    throw new Error("CARTO proxy origin must use HTTP or HTTPS.");
  }

  // Keep MapLibre's glyph and vector tile tokens literal after query
  // encoding. MapLibre substitutes these before making each request.
  const encodedUrl = encodeURIComponent(url).replace(PLACEHOLDER_PATTERN, "{$1}");
  return `${requestOrigin.origin}/api/carto/proxy?url=${encodedUrl}`;
}

function rewriteCartoUrl(value: string, origin: string) {
  try {
    const parsed = new URL(value);
    if (!ALLOWED_HOSTS.has(parsed.hostname)) return value;

    // CARTO may echo the server key into resource URLs in its style JSON.
    // Keep credentials server-side; the proxy adds the key to each upstream
    // request after validating its host and path.
    parsed.searchParams.delete("key");
    parsed.searchParams.delete("api_key");

    // URL normalizes braces to %7B...%7D. Restore only MapLibre's documented
    // glyph placeholders so validation and substitution work on the final
    // browser-facing proxy URL.
    const normalizedUrl = parsed.toString().replace(PLACEHOLDER_PATTERN, "{$1}");
    return proxyUrl(normalizedUrl, origin);
  } catch {
    return value;
  }
}

export function rewriteCartoUrls(value: unknown, origin: string): unknown {
  if (Array.isArray(value)) return value.map((entry) => rewriteCartoUrls(entry, origin));
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? rewriteCartoUrl(value, origin) : value;
  }
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, rewriteCartoUrls(entry, origin)]));
}

/**
 * MapLibre appends the sprite scale and extension to the URL pathname. Since
 * the style's sprite base is a same-origin proxy URL, this initially produces
 * `/api/carto/proxy@2x.json?url=...`. Rewrite that request back to the single
 * proxy route and move the suffix onto CARTO's upstream sprite URL.
 */
export function rewriteCartoSpriteRequest(url: string, origin: string): string | null {
  try {
    const requestOrigin = new URL(origin);
    const requestedUrl = new URL(url, requestOrigin.origin);
    if (requestedUrl.origin !== requestOrigin.origin) return null;

    const suffixMatch = requestedUrl.pathname.match(/^\/api\/carto\/proxy(@2x)?\.(json|png)$/);
    if (!suffixMatch) return null;

    const upstreamValue = requestedUrl.searchParams.get("url");
    if (!upstreamValue) return null;
    const upstreamUrl = new URL(upstreamValue);
    if (
      upstreamUrl.protocol !== "https:" ||
      !ALLOWED_HOSTS.has(upstreamUrl.hostname) ||
      upstreamUrl.pathname !== SPRITE_PATH
    ) return null;

    // Keep any provider query parameters and append MapLibre's exact sprite
    // variant to the upstream path. The API key is added only by the server.
    upstreamUrl.pathname += `${suffixMatch[1] ?? ""}.${suffixMatch[2]}`;
    upstreamUrl.searchParams.delete("key");
    upstreamUrl.searchParams.delete("api_key");
    const encodedUrl = encodeURIComponent(upstreamUrl.toString());
    return `${requestOrigin.origin}${PROXY_PATH}?url=${encodedUrl}`;
  } catch {
    return null;
  }
}

/** CARTO sprite resources have stable formats even if upstream MIME headers vary. */
export function cartoResponseContentType(url: string, upstreamContentType: string): string {
  try {
    const pathname = new URL(url).pathname;
    if (/\/sprite(?:@2x)?\.json$/.test(pathname)) return "application/json";
    if (/\/sprite(?:@2x)?\.png$/.test(pathname)) return "image/png";
  } catch {
    // Keep the upstream header for non-URL inputs; the proxy validates URLs.
  }
  return upstreamContentType;
}
