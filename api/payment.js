import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
)

function getAppUrl(req) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(
      /\/$/,
      '',
    )
  }

  if (req.headers.origin) {
    return req.headers.origin.replace(
      /\/$/,
      '',
    )
  }

  const host =
    req.headers['x-forwarded-host'] ||
    req.headers.host ||
    'localhost:5173'

  const protocol =
    req.headers['x-forwarded-proto'] ||
    (host.includes('localhost')
      ? 'http'
      : 'https')

  return `${protocol}://${host}`
}

function getBearerToken(req) {
  const header =
    req.headers.authorization || ''

  if (!header.startsWith('Bearer ')) {
    return null
  }

  return (
    header.slice(7).trim() ||
    null
  )
}

async function getAuthenticatedUser(req) {
  const token =
    getBearerToken(req)

  if (!token) {
    throw new Error(
      'Missing authentication token.',
    )
  }

  if (!process.env.VITE_SUPABASE_URL) {
    throw new Error(
      'Missing VITE_SUPABASE_URL on the server.',
    )
  }

  if (
    !process.env
      .VITE_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error(
      'Missing VITE_SUPABASE_PUBLISHABLE_KEY on the server.',
    )
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  const {
    data,
    error,
  } = await supabase.auth.getUser(
    token,
  )

  if (
    error ||
    !data?.user?.id
  ) {
    throw new Error(
      'Invalid or expired authentication token.',
    )
  }

  return data.user
}

function getAdminSupabase() {
  if (
    !process.env
      .SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY on the server.',
    )
  }

  if (!process.env.VITE_SUPABASE_URL) {
    throw new Error(
      'Missing VITE_SUPABASE_URL on the server.',
    )
  }

  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}

function isPaidCheckout(session) {
  if (!session) {
    return false
  }

  if (session.status !== 'complete') {
    return false
  }

  if (session.mode === 'subscription') {
    return [
      'paid',
      'no_payment_required',
    ].includes(
      session.payment_status,
    )
  }

  return (
    session.payment_status === 'paid'
  )
}

async function activateGoldMembership(
  userId,
) {
  const supabase =
    getAdminSupabase()

  const now =
    new Date().toISOString()

  const { data, error } =
    await supabase
      .from('profiles')
      .update({
        gold_membership: true,
        gold_started_at: now,
        updated_at: now,
      })
      .eq('id', userId)
      .select(
        'id, gold_membership, gold_started_at, gold_expires_at',
      )
      .single()

  if (error) {
    throw error
  }

  return data
}

export default async function handler(
  req,
  res,
) {
  try {
    if (req.method === 'POST') {
      const user =
        await getAuthenticatedUser(req)

      const priceId =
        process.env
          .STRIPE_GOLD_PRICE_ID

      const mode =
        process.env.STRIPE_GOLD_MODE ||
        'subscription'

      if (
        !process.env
          .STRIPE_SECRET_KEY
      ) {
        return res.status(500).json({
          error:
            'Missing STRIPE_SECRET_KEY environment variable.',
        })
      }

      if (!priceId) {
        return res.status(500).json({
          error:
            'Missing STRIPE_GOLD_PRICE_ID environment variable.',
        })
      }

      if (
        ![
          'payment',
          'subscription',
        ].includes(mode)
      ) {
        return res.status(500).json({
          error:
            'STRIPE_GOLD_MODE must be "payment" or "subscription".',
        })
      }

      const appUrl =
        getAppUrl(req)

      const session =
        await stripe.checkout.sessions.create(
          {
            mode,
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            success_url:
              `${appUrl}/upgrade?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:
              `${appUrl}/upgrade?payment=cancelled`,
            allow_promotion_codes:
              true,
            metadata: {
              product:
                'dino_gold',
              user_id:
                user.id,
            },
          },
        )

      return res.status(200).json({
        sessionId:
          session.id,
        url: session.url,
      })
    }

    if (req.method === 'GET') {
      const user =
        await getAuthenticatedUser(req)

      const sessionId =
        typeof req.query?.session_id ===
        'string'
          ? req.query.session_id
          : null

      if (!sessionId) {
        return res.status(400).json({
          error:
            'Missing session_id query parameter.',
        })
      }

      const session =
        await stripe.checkout.sessions.retrieve(
          sessionId,
        )

      if (
        session.metadata?.user_id !==
        user.id
      ) {
        return res.status(403).json({
          error:
            'This Stripe Checkout Session does not belong to the signed-in user.',
        })
      }

      let goldMembership = null

      if (
        isPaidCheckout(session)
      ) {
        goldMembership =
          await activateGoldMembership(
            user.id,
          )
      }

      return res.status(200).json({
        session: {
          id: session.id,
          status: session.status,
          payment_status:
            session.payment_status,
          amount_total:
            session.amount_total,
          currency:
            session.currency,
          mode: session.mode,
          customer:
            session.customer,
          subscription:
            session.subscription,
          payment_intent:
            session.payment_intent,
          livemode:
            session.livemode,
          metadata:
            session.metadata,
          gold_membership:
            goldMembership,
        },
      })
    }

    res.setHeader(
      'Allow',
      ['GET', 'POST'],
    )

    return res.status(405).json({
      error:
        'Method not allowed.',
    })
  } catch (error) {
    console.error(
      '[Dino Stripe API]',
      error,
    )

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Stripe request failed.',
    })
  }
}