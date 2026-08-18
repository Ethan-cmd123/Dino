import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function getAppUrl(req) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '')
  }

  if (req.headers.origin) {
    return req.headers.origin.replace(/\/$/, '')
  }

  const host =
    req.headers['x-forwarded-host'] ||
    req.headers.host ||
    'localhost:5173'

  const protocol =
    req.headers['x-forwarded-proto'] ||
    (host.includes('localhost') ? 'http' : 'https')

  return `${protocol}://${host}`
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const priceId = process.env.STRIPE_GOLD_PRICE_ID
      const mode = process.env.STRIPE_GOLD_MODE || 'subscription'

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({
          error: 'Missing STRIPE_SECRET_KEY environment variable.',
        })
      }

      if (!priceId) {
        return res.status(500).json({
          error: 'Missing STRIPE_GOLD_PRICE_ID environment variable.',
        })
      }

      if (!['payment', 'subscription'].includes(mode)) {
        return res.status(500).json({
          error: 'STRIPE_GOLD_MODE must be "payment" or "subscription".',
        })
      }

      const appUrl = getAppUrl(req)

      const session = await stripe.checkout.sessions.create({
        mode,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url:
          `${appUrl}/upgrade?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/upgrade?payment=cancelled`,
        allow_promotion_codes: true,
        metadata: {
          product: 'dino_gold',
        },
      })

      return res.status(200).json({
        sessionId: session.id,
        url: session.url,
      })
    }

    if (req.method === 'GET') {
      const sessionId =
        typeof req.query?.session_id === 'string'
          ? req.query.session_id
          : null

      if (!sessionId) {
        return res.status(400).json({
          error: 'Missing session_id query parameter.',
        })
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId)

      return res.status(200).json({
        session: {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          mode: session.mode,
          customer: session.customer,
          subscription: session.subscription,
          payment_intent: session.payment_intent,
          livemode: session.livemode,
          metadata: session.metadata,
        },
      })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({
      error: 'Method not allowed.',
    })
  } catch (error) {
    console.error('[Dino Stripe API]', error)

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Stripe request failed.',
    })
  }
}