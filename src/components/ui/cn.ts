// Penggabung className minimal (pola shadcn, tanpa dependensi berat).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
