export const formatDate = (iso: string | undefined | null): string => {
  if (!iso) return "-";
  const date = new Date(iso);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatSeparatorDate = (dateString: string) => {
  if (!dateString) return "";

  const normalizedDate =
    dateString.endsWith("Z") || dateString.includes("+")
      ? dateString
      : `${dateString.replace(" ", "T")}Z`;

  const date = new Date(normalizedDate);
  const now = new Date();

  const isToday = date.toLocaleDateString() === now.toLocaleDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.toLocaleDateString() === yesterday.toLocaleDateString();

  const time = date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) return `Dzisiaj, ${time}`;
  if (isYesterday) return `Wczoraj, ${time}`;

  return `${date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}, ${time}`;
};

export const shouldShowSeparator = (current: any, previous: any) => {
  if (!previous) return true;

  const curr = new Date(current.created_at).getTime();
  const prev = new Date(previous.created_at).getTime();

  return Math.abs(curr - prev) > 60000;
};
