import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Serve the worker shipped with the installed MapLibre version as JavaScript. */
export async function GET() {
  try {
    const workerPath = join(
      process.cwd(),
      "node_modules",
      "maplibre-gl",
      "dist",
      "maplibre-gl-worker.mjs",
    );
    const worker = await readFile(workerPath);

    return new Response(worker, {
      headers: {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("MapLibre worker asset is unavailable.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
