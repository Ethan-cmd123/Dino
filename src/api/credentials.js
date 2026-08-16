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

  // Strip accidental API paths.
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