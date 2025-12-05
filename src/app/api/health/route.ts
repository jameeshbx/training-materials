import { logger } from "@/lib/logger";

export async function GET() {
  logger.info("Health API called");

  return Response.json({
    status: "ok",
    time: new Date().toISOString(),
  });
}
