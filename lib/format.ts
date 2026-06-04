/**
 * Shared date formatting (client + server safe). Fixed locale + timezone
 * so server-rendered values are stable and unambiguous (Bangladesh time).
 */
const DATE_TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Dhaka",
});

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return DATE_TIME_FMT.format(date);
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return DATE_FMT.format(date);
}
