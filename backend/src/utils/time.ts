export const computeExpiry = (ttl: string) => {
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid TTL format: ${ttl}`);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const now = Date.now();

  const multiplier =
    unit === "s" ? 1000 :
    unit === "m" ? 60_000 :
    unit === "h" ? 3_600_000 :
    86_400_000;

  return new Date(now + value * multiplier);
};
