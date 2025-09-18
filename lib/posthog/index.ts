import { PostHog } from 'posthog-node';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth/session';
import { randomUUID } from 'crypto';

export default function PostHogClient() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!posthogKey || !posthogHost) {
    return null;
  }

  const posthogClient = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
    {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    },
  );
  return posthogClient;
}

export async function getBootstrapData() {
  const phProjectAPIKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  // Return default bootstrap data if PostHog is not configured
  if (!phProjectAPIKey || !phHost) {
    return {
      distinctID: randomUUID(),
      featureFlags: {},
    };
  }

  let distinct_id = '';
  const phCookieName = `ph_${phProjectAPIKey}_posthog`;
  const cookieStore = await cookies();
  const phCookie = cookieStore.get(phCookieName);

  if (phCookie) {
    const phCookieParsed = JSON.parse(phCookie.value);
    distinct_id = phCookieParsed.distinct_id;
  }

  if (!distinct_id) {
    // Try to get the user ID from the session
    const session = await getSession();
    if (session && session.user && session.user.id) {
      distinct_id = String(session.user.id);
    } else {
      // Generate a random UUID as fallback
      distinct_id = randomUUID();
    }
  }

  const client = new PostHog(phProjectAPIKey, {
    host: phHost,
  });
  const flags = await client.getAllFlags(distinct_id);
  const bootstrap = {
    distinctID: distinct_id,
    featureFlags: flags,
  };

  return bootstrap;
}
