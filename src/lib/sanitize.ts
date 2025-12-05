// src/lib/sanitize.ts
import validator from "validator";
import xss from "xss";

export type SanitizedAuthInput = {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    username?: string;
    [key: string]: string | undefined;
};

export function sanitizeString(input?: unknown): string | undefined {
    if (typeof input !== "string") return undefined;

    let s = input.trim();
    s = xss(s);
    s = validator.escape(s);
    return s;
}

export function sanitizeAuthInput(body: any): SanitizedAuthInput {
    const out: SanitizedAuthInput = {};

    // ⭐ NAME
    if (body?.name && typeof body.name === "string") {
        out.name = sanitizeString(body.name);
    }

    // ⭐ EMAIL
    if (body?.email && typeof body.email === "string") {
        const email = body.email.trim();
        if (validator.isEmail(email)) {
            out.email = validator.normalizeEmail(email) || email.toLowerCase();
        }
    }

    // ⭐ PASSWORD
    if (body?.password && typeof body.password === "string") {
        let pwd = body.password.trim();
        pwd = xss(pwd);
        out.password = pwd;
    }

    // ⭐ ROLE (admin / user)
    if (body?.role && typeof body.role === "string") {
        out.role = sanitizeString(body.role);
    }

    // OPTIONAL: username (if you use)
    if (body?.username && typeof body.username === "string") {
        out.username = sanitizeString(body.username);
    }

    return out;
}

