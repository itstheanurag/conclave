export function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString();
}

export function maskKey(k?: string | null) {
  if (!k) return "••••••••••";
  return k.length > 8 ? `${k.slice(0, 4)}••••${k.slice(-4)}` : "••••••";
}
