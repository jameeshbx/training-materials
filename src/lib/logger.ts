const isProd = process.env.NODE_ENV === "production"

export const logger = {
    info: (data: any, message?: string) => {
        if (message) {
            // Handle object logging safely without JSON.stringify to avoid circular references
            console.log("[INFO]", typeof data === "string" ? data : JSON.stringify(data, null, 2), message)
        } else {
            console.log("[INFO]", data)
        }
    },

    warn: (data: any, message?: string) => {
        if (message) {
            console.warn("[WARN]", typeof data === "string" ? data : JSON.stringify(data, null, 2), message)
        } else {
            console.warn("[WARN]", data)
        }
    },

    error: (data: any, message?: string) => {
        if (message) {
            console.error("[ERROR]", typeof data === "string" ? data : JSON.stringify(data, null, 2), message)
        } else {
            console.error("[ERROR]", data)
        }
    },

    debug: (data: any, message?: string) => {
        if (message) {
            console.debug("[DEBUG]", typeof data === "string" ? data : JSON.stringify(data, null, 2), message)
        } else {
            console.debug("[DEBUG]", data)
        }
    },
}