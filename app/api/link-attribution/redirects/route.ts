// @input  -- POST { code, destination_url } from local link-attribution HTML tools
// @output -- JSON registration result for clean www.aistorygenerator.work/<code> short links
// @pos    -- Public attribution API, writes owned short-link mappings through service-role Supabase
import { NextResponse } from "next/server";
import { registerShortLink } from "@/lib/link-attribution/short-links";

export const dynamic = "force-dynamic";

const ALLOWED_CORS_ORIGINS = new Set([
  "null",
  "https://aistorygenerator.work",
  "https://www.aistorygenerator.work",
]);

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  const allowOrigin =
    origin && ALLOWED_CORS_ORIGINS.has(origin)
      ? origin
      : "https://www.aistorygenerator.work";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function json(
  request: Request,
  body: unknown,
  status: number,
): NextResponse<unknown> {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(request),
  });
}

function errorJson(
  request: Request,
  code: string,
  message: string,
  status: number,
): NextResponse<unknown> {
  return json(request, { error: { code, message } }, status);
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorJson(
      request,
      "INVALID_JSON",
      "Request body must be valid JSON.",
      400,
    );
  }

  const input = body as { code?: unknown; destination_url?: unknown };

  try {
    const result = await registerShortLink(input.code, input.destination_url);
    if (!result.ok) {
      return errorJson(request, result.code, result.message, result.status);
    }

    return json(
      request,
      {
        data: {
          code: result.code,
          destination_url: result.destinationUrl,
          reused: result.reused,
          short_url: `https://aistorygenerator.work/${result.code}`,
        },
      },
      result.reused ? 200 : 201,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Short-link registration failed.";
    return errorJson(request, "REGISTRATION_FAILED", message, 500);
  }
}
