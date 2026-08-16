import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl =
  import.meta.env.VITE_SUPABASE_URL

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

function cleanSupabaseUrl(value) {
  if (!value) {
    throw new Error(
      'Missing VITE_SUPABASE_URL. Add your Supabase Project URL to Vercel Environment Variables.',
    )
  }

  const url = value.trim().replace(/\/+$/, '')

  let parsed

  try {
    parsed = new URL(url)
  } catch {
    throw new Error(
      'VITE_SUPABASE_URL is not a valid URL. It should look like https://xxxxxxxx.supabase.co',
    )
  }

  if (
    parsed.protocol !== 'https:' ||
    !parsed.hostname.endsWith('.supabase.co')
  ) {
    throw new Error(
      'VITE_SUPABASE_URL must be your Supabase Project URL, for example https://xxxxxxxx.supabase.co',
    )
  }

  return url
}

if (!supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add your Supabase publishable key to Vercel Environment Variables.',
  )
}

const supabaseUrl =
  cleanSupabaseUrl(rawSupabaseUrl)

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey.trim(),
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
)

/* -------------------------------------------------------------------------- */
/* AUTH                                                                       */
/* -------------------------------------------------------------------------- */

export async function signUp(
  email,
  password,
  onboarding,
) {
  const {
    language,
    examDate,
    selectedGoals,
  } = onboarding

  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,

    options: {
      data: {
        language,
        exam_date: examDate,
        goals: selectedGoals,
        onboarding_complete: true,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function signIn(
  email,
  password,
) {
  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getSession() {
  const {
    data,
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export async function getCurrentUser() {
  const {
    data,
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return data.user
}

/* -------------------------------------------------------------------------- */
/* PROFILE                                                                    */
/* -------------------------------------------------------------------------- */

export async function getProfile(userId) {
  if (!userId) {
    return null
  }

  const {
    data,
    error,
  } = await supabase
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
      'Missing authenticated user ID.',
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        language,
        exam_date: examDate || null,
        goals: selectedGoals || [],
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