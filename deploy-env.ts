import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const tempDir = '.vercel_env_temp'; // Temporary directory to store variable files

// Ensure the directory exists
execSync(`mkdir -p ${tempDir}`);

// List of environment variables to set
const envVarKeys = [
  'POSTGRES_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'AUTH_SECRET',
  'BASE_URL',
  'POSTHOG_API_KEY',
  'POSTHOG_HOST',
];

// Process each environment variable
envVarKeys.forEach((key) => {
  const val = process.env[key];

  if (key && val) {
    const tempFilePath = path.join(tempDir, key);
    writeFileSync(tempFilePath, val);

    console.log(`Checking if ${key} exists...`);
    try {
      const existingVars = execSync(`vercel env ls production`, {
        encoding: 'utf-8',
      });
      if (existingVars.includes(key)) {
        console.log(`Removing existing ${key}...`);
        execSync(`vercel env rm ${key} production -y`, { stdio: 'inherit' });
      } else {
        console.log(`${key} does not exist, skipping removal.`);
      }
    } catch (error) {
      console.log(`Skipping removal of ${key}, possibly no existing value.`);
    }

    console.log(`Setting ${key}...`);
    execSync(`vercel env add ${key} production < ${tempFilePath}`, {
      stdio: 'inherit',
    });

    execSync(`rm -f ${tempFilePath}`); // Clean up temp file
  } else {
    console.log(`Warning: Environment variable ${key} is not set or empty`);
  }
});

// Remove temp directory
execSync(`rm -rf ${tempDir}`);
