// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { httpIntegration } from '@sentry/node'

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',

  dsn: 'https://8fbf426c1a02079f75cf29cde3b3d41c@o270937.ingest.us.sentry.io/4507342038106112',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  sendDefaultPii: true, // enable sending default IP

  beforeSend(event, hint) {
    const req = (hint.originalException as any)?.req
    if (req?.body) {
      // Be cautious with sensitive data
      const sanitizedBody = sanitizeRequestBody(req.body)
      event.extra = event.extra || {}
      event.extra.requestBody = sanitizedBody
    }
    return event
  },

  integrations: [
    httpIntegration(),
    // Add any Next.js specific integrations here
  ],
  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
})

// Helper function to sanitize request body
function sanitizeRequestBody(body: any) {
  // Implement your sanitization logic here
  const sanitized = { ...body }
  delete sanitized.password
  delete sanitized.token
  // Truncate large fields if necessary
  return sanitized
}
