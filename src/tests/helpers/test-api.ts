import { NextRequest } from "next/server";

export function createNextRequest(url: string, options: any = {}) {
  let body: any = null;

  if (options.body) {
    body = new Blob([JSON.stringify(options.body)], {
      type: "application/json",
    });
  }

  return new NextRequest(url, {
    method: options.method || "GET",
    headers: new Headers(options.headers || {}),
    body,
  });
}

export async function callRoute(route: any, req: NextRequest) {
  const res = await route(req);
  const json = await res.json();
  return { status: res.status, json };
}
