/** Simulated network latency for the mock server — every mutating call awaits this so the UI's
 * loading states are exercised even though there's no real backend. */
export function delay(minMs = 400, maxMs = 900): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
