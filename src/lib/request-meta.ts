export function getRequestMeta(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || null;
  const userAgent = req.headers.get("user-agent") || null;
  return { ip, userAgent };
}
