import { defineConfig } from "@playwright/test";
import path from "path";

export default defineConfig({
    testDir: "./tests",
    timeout: 30000,

    use: {
        baseURL: "http://localhost:3000",
        headless: false,
    },

    projects: [
        // 1️⃣ Setup project — creates auth.json
        {
            name: "setup",
            testMatch: /auth\.setup\.ts/,
            use: {
                storageState: undefined, // setup should not load state
            },
        },

        // 2️⃣ Tests — load auth.json automatically
        {
            name: "chromium",
            dependencies: ["setup"],
            use: {
                storageState: path.join(__dirname, "tests", "auth.json"),
            },
            testMatch: /.spec.ts/,
        },
    ],
});
