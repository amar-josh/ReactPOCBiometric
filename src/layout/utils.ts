export const getInitials = (name?: string | null): string => {
  const parts = name?.trim().split(/[\s_-]+/);

  if (!parts?.[0]) return "-";

  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "-";

  return (first + last).toUpperCase();
};
