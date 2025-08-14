// utils/formatRelativeOrDate.ts
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatRelativeOrDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 60) {
    // Less than an hour ago
    return `${diffMinutes} min${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (isToday(date)) {
    // Today, but more than 60 minutes ago, show time like "10:45 AM"
    return format(date, "p");
  } else if (isYesterday(date)) {
    // Yesterday
    return "Yesterday";
  } else {
    // Else show date like "3rd July"
    return format(date, "do MMMM");
  }
}
