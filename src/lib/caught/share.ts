export async function shareText(title: string, text: string, url?: string) {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  if (nav?.share) {
    try {
      await nav.share({ title, text, url });
      return "shared" as const;
    } catch {
      return "cancelled" as const;
    }
  }
  try {
    await nav?.clipboard?.writeText(`${text}${url ? `\n${url}` : ""}`);
    return "copied" as const;
  } catch {
    return "failed" as const;
  }
}
