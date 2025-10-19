// pages/api/contact.ts
import { NextResponse } from 'next/server';
import PostHogClient from '@/lib/posthog';

/**
 * Validate the request origin against allowed origins
 */
function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Get base URL from environment variable
  const baseUrl = process.env.BASE_URL || '';

  // Always allow localhost in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // Check if origin header exists and matches base URL
  if (origin && origin === baseUrl) {
    return true;
  }

  // Check referer as fallback
  if (referer && referer.startsWith(baseUrl)) {
    return true;
  }

  return false;
}

/**
 * Split a full name into first and last name parts
 * Handles single names, double names, and multi-part names
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  // Trim and remove extra spaces
  const cleanName = fullName.trim().replace(/\s+/g, ' ');

  if (!cleanName) {
    return { firstName: '', lastName: '' };
  }

  const nameParts = cleanName.split(' ');

  if (nameParts.length === 1) {
    // Only a first name provided
    return { firstName: nameParts[0], lastName: '' };
  } else {
    // First name is the first part, last name is everything else
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  }
}

export async function POST(request: Request) {
  try {
    // Validate request origin
    if (!isValidOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Invalid origin' },
        { status: 403 },
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, message, phone } = body;

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 },
      );
    }

    // Track contact form submission in PostHog
    const posthogClient = PostHogClient();

    if (posthogClient) {
      // Split the name properly for better tracking
      const { firstName, lastName } = splitName(name);

      // Capture the contact form submission event
      posthogClient.capture({
        distinctId: email, // Use email as the distinct ID
        event: 'contact_form_submitted',
        properties: {
          name: name,
          firstName: firstName,
          lastName: lastName,
          email: email,
          message: message || '',
          phone: phone || '',
          timestamp: new Date().toISOString(),
        },
      });

      // Identify the user with their properties
      posthogClient.identify({
        distinctId: email,
        properties: {
          email: email,
          name: name,
          firstName: firstName,
          lastName: lastName,
          phone: phone || '',
        },
      });

      await posthogClient.shutdown();

      console.log('Contact form submission tracked in PostHog:', email);
    } else {
      console.log(
        'PostHog not configured. Contact form submission not tracked:',
        email,
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 },
    );
  }
}
