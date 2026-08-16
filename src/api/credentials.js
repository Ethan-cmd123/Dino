import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

function normalizeSupabaseUrl(value) {
  if (!value) {
    throw new Error(
      'Missing VITE_SUPABASE_URL. Add the Supabase Project URL to Vercel.',
    )
  }

  let url = String(value).trim()

  url = url.replace(/\s+/g, '')
  url = url.replace(/\/+$/, '')

  url = url.replace(
    /\/(auth|rest|storage|realtime)\/v1$/i,
    '',
  )

  let parsed

  try {
    parsed = new URL(url)
  } catch {
    throw new Error(
      'VITE_SUPABASE_URL is invalid. Use your Supabase Project URL, such as https://xxxxxxxx.supabase.co',
    )
  }

  if (
    parsed.hostname === 'supabase.com' ||
    parsed.hostname === 'app.supabase.com'
  ) {
    throw new Error(
      'VITE_SUPABASE_URL is the Supabase dashboard URL. Use the Project URL from Supabase → Connect.',
    )
  }

  if (!parsed.protocol.startsWith('http')) {
    throw new Error(
      'VITE_SUPABASE_URL must start with https://',
    )
  }

  return parsed.origin
}

function getPublishableKey(value) {
  if (!value || !String(value).trim()) {
    throw new Error(
      'Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add the Supabase publishable key to Vercel.',
    )
  }

  return String(value).trim()
}

const supabaseUrl = normalizeSupabaseUrl(
  SUPABASE_URL,
)

const supabasePublishableKey =
  getPublishableKey(
    SUPABASE_PUBLISHABLE_KEY,
  )

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
)

/* -------------------------------------------------------------------------- */
/* SIGN UP                                                                    */
/* -------------------------------------------------------------------------- */

export async function signUp(
  email,
  password,
  onboarding = {},
) {
  const cleanEmail = String(email)
    .trim()
    .toLowerCase()

  const {
    language = '',
    examDate = '',
    selectedGoals = [],
  } = onboarding

  const { data, error } =
    await supabase.auth.signUp({
      email: cleanEmail,
      password,

      options: {
        data: {
          language,
          exam_date: examDate,
          goals: Array.isArray(
            selectedGoals,
          )
            ? selectedGoals
            : [],
          onboarding_complete: true,
        },
      },
    })

  if (error) {
    console.error(
      'Supabase signup error:',
      error,
    )

    throw error
  }

  if (data?.user?.id) {
    const { error: pointsError } =
      await supabase
        .from('user_dino_points')
        .upsert(
          {
            user_id: data.user.id,
            credits: 10,
            last_refill_at:
              new Date().toISOString(),
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          },
        )

    if (pointsError) {
      console.error(
        'Dino points signup seed failed:',
        pointsError,
      )
    }
  }

  return data
}

/* -------------------------------------------------------------------------- */
/* LOGIN                                                                      */
/* -------------------------------------------------------------------------- */

export async function signIn(
  email,
  password,
) {
  const cleanEmail = String(email)
    .trim()
    .toLowerCase()

  const { data, error } =
    await supabase.auth.signInWithPassword(
      {
        email: cleanEmail,
        password,
      },
    )

  if (error) {
    throw error
  }

  return data
}

/* -------------------------------------------------------------------------- */
/* LOGOUT                                                                     */
/* -------------------------------------------------------------------------- */

export async function signOut() {
  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

/* -------------------------------------------------------------------------- */
/* CURRENT USER                                                               */
/* -------------------------------------------------------------------------- */

export async function getCurrentUser() {
  const { data, error } =
    await supabase.auth.getUser()

  if (error) {
    return null
  }

  return data.user
}

/* -------------------------------------------------------------------------- */
/* SESSION                                                                    */
/* -------------------------------------------------------------------------- */

export async function getSession() {
  const { data, error } =
    await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

/* -------------------------------------------------------------------------- */
/* PROFILE                                                                    */
/* -------------------------------------------------------------------------- */

export async function getProfile(
  userId,
) {
  if (!userId) {
    return null
  }

  const { data, error } =
    await supabase
      .from('profiles')
      .select(
        `
          id,
          language,
          exam_date,
          goals,
          onboarding_complete,
          created_at,
          updated_at
        `,
      )
      .eq('id', userId)
      .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

/* -------------------------------------------------------------------------- */
/* SAVE ONBOARDING                                                            */
/* -------------------------------------------------------------------------- */

export async function saveOnboarding(
  userId,
  {
    language,
    examDate,
    selectedGoals,
  },
) {
  if (!userId) {
    throw new Error(
      'Cannot save onboarding without a user ID.',
    )
  }

  const { data, error } =
    await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          language: language || null,
          exam_date: examDate || null,
          goals: Array.isArray(
            selectedGoals,
          )
            ? selectedGoals
            : [],
          onboarding_complete: true,
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: 'id',
        },
      )
      .select()
      .single()

  if (error) {
    throw error
  }

  return data
}

/* -------------------------------------------------------------------------- */
/* COURSE PROGRESS                                                            */
/* -------------------------------------------------------------------------- */

export async function getCourseProgress(
  userId,
) {
  if (!userId) {
    return []
  }

  const { data, error } =
    await supabase
      .from('course_progress')
      .select(
        'topic_id, completed',
      )
      .eq('user_id', userId)
      .eq('completed', true)

  if (error) {
    throw error
  }

  return (
    data?.map(
      (item) => item.topic_id,
    ) || []
  )
}

/* -------------------------------------------------------------------------- */
/* DINO POINTS                                                                */
/* -------------------------------------------------------------------------- */

export async function syncUserCredits(
  userId,
) {
  if (!userId) {
    return 0
  }

  const now = new Date()

  const { data, error } =
    await supabase
      .from('user_dino_points')
      .select(
        'credits, last_refill_at',
      )
      .eq('user_id', userId)
      .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    const initial = {
      user_id: userId,
      credits: 0,
      last_refill_at:
        now.toISOString(),
      updated_at:
        now.toISOString(),
    }

    const { data: created, error: createError } =
      await supabase
        .from('user_dino_points')
        .upsert(initial, {
          onConflict: 'user_id',
        })
        .select()
        .single()

    if (createError) {
      throw createError
    }

    return Number(
      created?.credits || 0,
    )
  }

  let credits = Number(
    data.credits || 0,
  )
  let lastRefillAt = data.last_refill_at
    ? new Date(
        data.last_refill_at,
      )
    : now

  while (
    now.getTime() -
      lastRefillAt.getTime() >=
    24 * 60 * 60 * 1000
  ) {
    credits += 5
    lastRefillAt = new Date(
      lastRefillAt.getTime() +
        24 * 60 * 60 * 1000,
    )
  }

  const didUpdate =
    credits !== Number(
      data.credits || 0,
    ) ||
    lastRefillAt.toISOString() !==
      new Date(
        data.last_refill_at ||
          now.toISOString(),
      ).toISOString()

  if (didUpdate) {
    const { data: updated, error: updateError } =
      await supabase
        .from('user_dino_points')
        .upsert(
          {
            user_id: userId,
            credits,
            last_refill_at:
              lastRefillAt.toISOString(),
            updated_at:
              now.toISOString(),
          },
          {
            onConflict: 'user_id',
          },
        )
        .select()
        .single()

    if (updateError) {
      throw updateError
    }

    return Number(
      updated?.credits || credits,
    )
  }

  return credits
}

export async function spendUserCredits(
  userId,
  amount = 1,
) {
  if (!userId) {
    return 0
  }

  const currentCredits =
    await syncUserCredits(userId)

  if (currentCredits < amount) {
    throw new Error(
      `You need ${amount} Dino point${
        amount === 1 ? '' : 's'
      } to generate this.`,
    )
  }

  const nextCredits =
    currentCredits - amount

  const { data, error } =
    await supabase
      .from('user_dino_points')
      .update({
        credits: nextCredits,
        updated_at:
          new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

  if (error) {
    throw error
  }

  return Number(
    data?.credits || nextCredits,
  )
}

export async function setCourseTopicCompleted(
  userId,
  topicId,
  completed,
) {
  if (!userId) {
    throw new Error(
      'Cannot save course progress without a user ID.',
    )
  }

  if (!topicId) {
    throw new Error(
      'Cannot save course progress without a topic ID.',
    )
  }

  if (completed) {
    const { data, error } =
      await supabase
        .from('course_progress')
        .upsert(
          {
            user_id: userId,
            topic_id: topicId,
            completed: true,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              'user_id,topic_id',
          },
        )
        .select()
        .single()

    if (error) {
      throw error
    }

    return data
  }

  const { error } =
    await supabase
      .from('course_progress')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId)

  if (error) {
    throw error
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* AUTH STATE                                                                 */
/* -------------------------------------------------------------------------- */

export function onAuthStateChange(
  callback,
) {
  return supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session)
    },
  )
}