import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, teams, teamMembers } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { NextRequest } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import Stripe from 'stripe';
import { APIError, ErrorType, createErrorResponse } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return Response.redirect(new URL('/pricing', request.url));
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'subscription'],
      });

      if (!session.customer || typeof session.customer === 'string') {
        throw new APIError(
          'Invalid customer data from Stripe.',
          ErrorType.PROCESSING_ERROR,
          500,
        );
      }

      const customerId = session.customer.id;
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;

      if (!subscriptionId) {
        throw new APIError(
          'No subscription found for this session.',
          ErrorType.PROCESSING_ERROR,
          500,
        );
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price.product'],
      });

      const plan = subscription.items.data[0]?.price;

      if (!plan) {
        throw new APIError(
          'No plan found for this subscription.',
          ErrorType.PROCESSING_ERROR,
          500,
        );
      }

      const productId = (plan.product as Stripe.Product).id;

      if (!productId) {
        throw new APIError(
          'No product ID found for this subscription.',
          ErrorType.PROCESSING_ERROR,
          500,
        );
      }

      const userId = session.client_reference_id;
      if (!userId) {
        throw new APIError(
          "No user ID found in session's client_reference_id.",
          ErrorType.PROCESSING_ERROR,
          500,
        );
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(userId)))
        .limit(1);

      if (user.length === 0) {
        throw new APIError(
          'User not found in database.',
          ErrorType.PROCESSING_ERROR,
          404,
        );
      }

      const userTeam = await db
        .select({
          teamId: teamMembers.teamId,
        })
        .from(teamMembers)
        .where(eq(teamMembers.userId, user[0].id))
        .limit(1);

      if (userTeam.length === 0) {
        throw new APIError(
          'User is not associated with any team.',
          ErrorType.PROCESSING_ERROR,
          404,
        );
      }

      await db
        .update(teams)
        .set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripeProductId: productId,
          planName: (plan.product as Stripe.Product).name,
          subscriptionStatus: subscription.status,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, userTeam[0].teamId));

      await setSession(user[0]);
      return Response.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // If it's already an APIError, rethrow it
      if (error instanceof APIError) {
        throw error;
      }

      console.error('Error handling successful checkout:', error);
      throw new APIError(
        'Failed to process checkout session',
        ErrorType.PROCESSING_ERROR,
        500,
      );
    }
  } catch (error) {
    // For redirect errors, we should redirect to error page instead of returning JSON
    if (error instanceof APIError) {
      console.error(`${error.type} (${error.statusCode}): ${error.message}`);
      return Response.redirect(new URL('/error', request.url));
    }

    console.error('Unexpected error in checkout:', error);
    return Response.redirect(new URL('/error', request.url));
  }
}
