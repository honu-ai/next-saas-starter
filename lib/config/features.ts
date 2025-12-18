/**
 * Feature flags configuration
 * Features are automatically enabled/disabled based on environment variables
 */
export const features = {
  database: !!process.env.POSTGRES_URL,
  authentication: !!process.env.POSTGRES_URL,
  payments: !!process.env.POSTGRES_URL && !!process.env.STRIPE_API_KEY,
} as const;

export function requiresDatabase(
  feature: keyof typeof features = 'database',
): boolean {
  return features[feature];
}
