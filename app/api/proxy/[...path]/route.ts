import { type NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

function buildBackendURL(path: string[], req: NextRequest): string {
  const joined = path.join("/");
  const search = req.nextUrl.search;
  return `${BACKEND}/${joined}${search}`;
}

async function proxy(req: NextRequest, path: string[]) {
  const url = buildBackendURL(path, req);

  const headers = new Headers();
  req.headers.forEach((val, key) => {
    if (!["host", "connection"].includes(key)) {
      headers.set(key, val);
    }
  });

  const isSSE = req.headers.get("accept") === "text/event-stream";

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
    // @ts-expect-error — Node fetch needs this for SSE
    duplex: "half",
  });

  if (isSSE && upstream.body) {
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: upstream.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const resHeaders = new Headers();
  upstream.headers.forEach((val, key) => {
    if (!["transfer-encoding", "connection"].includes(key)) {
      resHeaders.set(key, val);
    }
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}
