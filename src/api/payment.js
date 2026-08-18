/**
 * Frontend Stripe Checkout helper.
 *
 * IMPORTANT:
 * The Stripe secret key is never used here. It stays on the Vercel
 * serverless function at /api/payment.
 */

export async function createCheckoutSession() {
  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // The server prefers APP_URL, but this lets local development work too.
      origin: window.location.origin,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Unable to create Stripe Checkout Session.')
  }

  if (!data.url) {
    throw new Error('Stripe did not return a Checkout URL.')
  }

  return data
}

export async function getCheckoutSession(sessionId) {
  if (!sessionId) {
    throw new Error('Missing Stripe Checkout Session ID.')
  }

  const response = await fetch(
    `/api/payment?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Unable to verify Stripe Checkout Session.')
  }

  return data.session
}