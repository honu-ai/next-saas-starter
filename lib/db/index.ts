/**
 * Database queries proxy
 * Automatically uses real or mock queries based on ENABLE_DATABASE setting
 */
import { features } from '@/lib/config/features';
import * as realQueries from './queries';
import * as mockQueries from './queries-mock';

// Select the appropriate implementation
const queries = features.database ? realQueries : mockQueries;

// Re-export all query functions
export const getUser = queries.getUser;
export const getUserActiveSubscriptionDetails =
  queries.getUserActiveSubscriptionDetails;
export const getUserByStripeCustomerId = queries.getUserByStripeCustomerId;
export const updateUserSubscription = queries.updateUserSubscription;
export const setUserCreditsByStripeCustomerId =
  queries.setUserCreditsByStripeCustomerId;
export const getActivityLogs = queries.getActivityLogs;
