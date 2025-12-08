

export const revalidate = 60; // Revalidate every 60 seconds (required by task)

import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
    return <ReportsClient />;
}
