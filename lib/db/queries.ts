import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import {
  activityLogs,
  teamMembers,
  teams,
  users,
  teamSubscriptionStatusEnum,
  type Team,
} from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getUserActiveSubscriptionDetails(
  userId: number,
): Promise<{
  hasActiveSubscription: boolean;
  status: (typeof teamSubscriptionStatusEnum.enumValues)[number] | null;
}> {
  const teamMemberships = await db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, userId),
    with: {
      team: {
        columns: {
          subscriptionStatus: true,
        },
      },
    },
  });

  if (!teamMemberships || teamMemberships.length === 0) {
    return { hasActiveSubscription: false, status: null };
  }

  let foundTrialingStatus:
    | (typeof teamSubscriptionStatusEnum.enumValues)[number]
    | null = null;

  for (const membership of teamMemberships) {
    if (membership.team?.subscriptionStatus === 'active') {
      return { hasActiveSubscription: true, status: 'active' };
    }
    if (membership.team?.subscriptionStatus === 'trialing') {
      foundTrialingStatus = 'trialing';
    }
  }

  if (foundTrialingStatus === 'trialing') {
    return { hasActiveSubscription: true, status: 'trialing' };
  }

  // No active or trialing subscription found
  // Return the status of the first team, or null if no teams had a status (should not happen with schema defaults)
  return {
    hasActiveSubscription: false,
    status:
      (teamMemberships[0]?.team
        ?.subscriptionStatus as (typeof teamSubscriptionStatusEnum.enumValues)[number]) ||
      null,
  };
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: Team['subscriptionStatus'];
    credits?: number | null;
    subscriptionCreatedAt?: Date | null;
  },
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function setTeamCreditsByStripeCustomerId(
  stripeCustomerId: string,
  newCredits: number,
): Promise<void> {
  await db
    .update(teams)
    .set({
      credits: newCredits,
      updatedAt: new Date(),
    })
    .where(eq(teams.stripeCustomerId, stripeCustomerId));
}
