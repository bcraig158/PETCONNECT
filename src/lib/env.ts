function getEnvOrWarn(key: string, fallback: string): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[env] Missing ${key} — using fallback. Set this in your environment variables.`);
    }
    return fallback;
  }
  return value;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

export const env = {
  get siteUrl() {
    return getEnvOrWarn('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
  },
  get contactFromEmail() {
    return getEnvOrWarn('CONTACT_FROM_EMAIL', 'PetConnect <noreply@petconnect.com>');
  },
  get contactToEmail() {
    return getEnvOrWarn('CONTACT_TO_EMAIL', '');
  },
  get databaseUrl() {
    return requireEnv('DATABASE_URL');
  },
  get authSecret() {
    return requireEnv('AUTH_SECRET');
  },
  get isResendConfigured() {
    return !!process.env.RESEND_API_KEY;
  },
  get isPaymentConfigured() {
    return !!(
      process.env.PAYMENT_PROVIDER_BASE_URL &&
      process.env.PAYMENT_SECRET_KEY &&
      process.env.PAYMENT_PUBLIC_KEY
    );
  },
  get isDev() {
    return process.env.NODE_ENV === 'development';
  },
};

/**
 * Validates that required environment variables are set.
 * Called during server initialization via instrumentation.
 * In development, logs warnings for optional missing vars.
 * In production, throws if critical vars are missing.
 */
export function validateEnv(): void {
  const required: Array<{ key: string; hint: string }> = [
    { key: 'DATABASE_URL', hint: 'PostgreSQL connection string (e.g. from Supabase)' },
    { key: 'AUTH_SECRET', hint: 'Generate with: openssl rand -hex 32' },
  ];

  const optional: Array<{ key: string; hint: string }> = [
    { key: 'NEXT_PUBLIC_SITE_URL', hint: 'Your deployed site URL' },
    { key: 'RESEND_API_KEY', hint: 'For contact form emails' },
    { key: 'CONTACT_FROM_EMAIL', hint: 'Sender email for contact forms' },
    { key: 'CONTACT_TO_EMAIL', hint: 'Recipient email for site contact form' },
    { key: 'UPSTASH_REDIS_REST_URL', hint: 'For rate limiting' },
    { key: 'UPSTASH_REDIS_REST_TOKEN', hint: 'For rate limiting' },
    { key: 'BLOB_READ_WRITE_TOKEN', hint: 'For file uploads via Vercel Blob' },
  ];

  const missing: string[] = [];

  for (const { key, hint } of required) {
    if (!process.env[key]) {
      missing.push(`  ${key} — ${hint}`);
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables:\n${missing.join('\n')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    }
    console.warn(`[env] ${message}`);
  }

  if (process.env.NODE_ENV === 'development') {
    const missingOptional: string[] = [];
    for (const { key, hint } of optional) {
      if (!process.env[key]) {
        missingOptional.push(`  ${key} — ${hint}`);
      }
    }
    if (missingOptional.length > 0) {
      console.info(`[env] Optional vars not configured (some features disabled):\n${missingOptional.join('\n')}`);
    }
  }
}
