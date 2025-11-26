export function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec} sec ago`;

  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} min ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;

  const days = Math.floor(hr / 24);
  if (days === 1) return "Yesterday";

  return `${days} days ago`;
}
