// import pino from "pino";

// export const logger = pino({
//   transport: {
//     target: "pino-pretty",
//   },
// });

// Temporary simple logger to avoid CI build failures
export const logger = {
  info: (...args: any[]) => console.log("[INFO]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args),
};

