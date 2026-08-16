import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL. Add it to your .env.local file.',
  )
}

if (!supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add it to your .env.local file.',
  )
}

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

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

export async function signUp(
  email,
  password,
  onboarding = {},
) {
  const {
    language = '',
    examDate = '',
    selectedGoals = [],
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

  /*
   * If email confirmation is disabled, Supabase gives us
   * a session immediately.
   *
   * If email confirmation is enabled, session may be null.
   * The onboarding data is still stored in auth metadata and
   * the database trigger will create the profile.
   */
  if (data.user) {
    try {
      await saveOnboarding(data.user.id, {
        language,
        examDate,
        selectedGoals,
      })
    } catch (profileError) {
      /*
       * Do not destroy a successful signup because the
       * optional profile upsert failed.
       *
       * The database trigger also creates the profile.
       */
      console.error(
        'Profile save failed:',
        profileError,
      )
    }
  }

  return data
}

export async function signIn(email, password) {
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
  const { error } = await supabase.auth.signOut()

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

/*
|--------------------------------------------------------------------------
| PROFILE / ONBOARDING
|--------------------------------------------------------------------------
*/

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
        updated_at: new Date().toISOString(),
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

/*
|--------------------------------------------------------------------------
| AUTH STATE
|--------------------------------------------------------------------------
*/

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session)
    },
  )
}