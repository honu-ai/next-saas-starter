#!/usr/bin/env node

import { execSync } from 'node:child_process';
import readline from 'node:readline';
import crypto from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Promisify the readline question method.
 * @param {string} query The question to ask the user.
 * @returns {Promise<string>} A promise that resolves with the user's answer.
 */
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

/**
 * Executes the Stripe CLI in a Docker container to get a webhook secret.
 * @param {string} stripeKey - The Stripe API key.
 * @param {string} hostUrl - The URL to forward webhook events to.
 * @returns {string} The Stripe webhook secret.
 */
function getStripeWebhookSecret(stripeKey, hostUrl) {
  console.log(
    'Attempting to get Stripe webhook secret. This may take a moment...',
  );
  try {
    const command = [
      'docker',
      'run',
      '--rm',
      'stripe/stripe-cli',
      `--api-key=${stripeKey}`,
      'listen',
      '--print-secret',
      '--forward-to',
      `${hostUrl}/api/stripe/webhook`,
    ].join(' ');

    const stdout = execSync(command, { encoding: 'utf-8' });
    const webhookSecret = stdout.trim();
    if (!webhookSecret.startsWith('whsec_')) {
      throw new Error(
        'Failed to retrieve a valid webhook secret. Please check your Stripe API key and Docker installation.',
      );
    }
    console.log('Successfully retrieved Stripe webhook secret.');
    return webhookSecret;
  } catch (error) {
    console.error('Failed getting a Stripe local webhook secret.');
    if (error?.stderr) console.error(`Stderr: ${error.stderr}`);
    if (error?.stdout) console.error(`Stdout: ${error.stdout}`);
    process.exit(1);
  }
}

/**
 * Requests the Stripe API key from the user.
 * @returns {Promise<string>} The Stripe API key.
 */
async function requestStripeKey() {
  const apiKey = await question('Give me your Stripe API key: ');
  if (!apiKey.startsWith('sk_')) {
    console.error(
      "This is not a valid Stripe API key. It should start with 'sk_'. Get your stripe key from: https://dashboard.stripe.com/",
    );
    process.exit(1);
  }
  return apiKey;
}

/**
 * Requests the PostHog API key from the user.
 * @returns {Promise<string>} The PostHog API key.
 */
async function requestPostHogKey() {
  const apiKey = await question('Give me your PostHog API key: ');
  if (!apiKey.startsWith('phc_')) {
    console.error(
      "This is not a valid PostHog API key. It should start with 'phc_'. Get your PostHog key from: https://app.posthog.com/project/settings",
    );
    process.exit(1);
  }
  return apiKey;
}

/**
 * Requests the host and port from the user.
 * @returns {Promise<{baseUrl: string, host: string, port: string}>} Full base URL, host, and port.
 */
async function requestHostAndPort() {
  let host = await question('Enter a hostname (default localhost): ');
  let port = await question('Enter a port (default 3000): ');

  if (host === '') {
    host = 'localhost';
  }
  if (port === '') {
    port = '3000';
  }

  return {
    baseUrl: `http://${host}:${port}`,
    host,
    port,
  };
}

/**
 * Generates a secure random string to be used as an auth secret.
 * @returns {string} A 50-character random string.
 */
function getAuthSecretKey() {
  return crypto.randomBytes(37).toString('hex').slice(0, 50).toUpperCase();
}

/**
 * Builds a PostgreSQL connection string for a given database name.
 * @param {string} databaseName
 * @returns {string} The connection string.
 */
function getPostgresConnectionString(databaseName) {
  return `postgresql://postgres:postgres@localhost:5433/${databaseName}`;
}

/**
 * Reads brandName from ./content.json and derives a Postgres-safe database name.
 * - Lowercase
 * - Replace non-alphanumeric with underscores
 * - Collapse multiple underscores
 * - Trim leading/trailing underscores
 * - Ensure starts with a letter by prefixing 'app_' if needed
 * @returns {{ brandName: string, databaseName: string }}
 */
function getBrandAndDatabaseName() {
  try {
    const raw = readFileSync('./content.json', 'utf-8');
    const json = JSON.parse(raw);
    const brandName =
      typeof json?.metadata?.brandName === 'string' &&
      json.metadata.brandName.trim().length > 0
        ? json.metadata.brandName.trim()
        : 'saas_starter';
    let db = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    db = db.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    if (!/^[a-z]/.test(db)) {
      db = `app_${db}`;
    }
    if (db.length === 0) {
      db = 'saas_starter';
    }
    return { brandName, databaseName: db };
  } catch (error) {
    console.warn(
      'Failed to read brandName from content.json. Falling back to saas_starter.',
    );
    return { brandName: 'saas_starter', databaseName: 'saas_starter' };
  }
}

/**
 * Writes the provided environment variables to a .env file.
 * @param {Record<string, string>} dotenvVariables Key-value pairs of env vars.
 */
function writeDotenv(dotenvVariables) {
  try {
    const content = Object.entries(dotenvVariables)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    writeFileSync('./.env', content + '\n');
    console.log('Variables were written to ./.env');
  } catch (error) {
    console.error('Failed to write .env file:', error);
    process.exit(1);
  }
}

/**
 * Main function to orchestrate the setup process.
 */
async function main() {
  try {
    const { databaseName } = getBrandAndDatabaseName();
    const POSTGRES_URL = getPostgresConnectionString(databaseName);
    const { baseUrl, host, port } = await requestHostAndPort();
    const STRIPE_API_KEY = await requestStripeKey();
    const STRIPE_WEBHOOK_SECRET = getStripeWebhookSecret(
      STRIPE_API_KEY,
      baseUrl,
    );
    const NEXT_PUBLIC_POSTHOG_KEY = await requestPostHogKey();
    const AUTH_SECRET = getAuthSecretKey();

    const dotenvVariables = {
      POSTGRES_DB: databaseName,
      POSTGRES_URL,
      BASE_URL: baseUrl,
      HOST: host,
      PORT: port,
      STRIPE_API_KEY,
      STRIPE_WEBHOOK_SECRET,
      AUTH_SECRET,
      NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.i.posthog.com',
    };

    writeDotenv(dotenvVariables);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  } finally {
    rl.close();
  }
}

// Run the main function
main();
