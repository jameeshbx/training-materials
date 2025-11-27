"use client";

import ActivityFeed from "./ActivityFeed";

export default function ActivityFeedWrapper({ teamId }: { teamId: string }) {
    return <ActivityFeed teamId={teamId} />;
}
