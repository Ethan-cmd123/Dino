import { createClient } from '@supabase/supabase-js'

/*
|--------------------------------------------------------------------------
| Supabase configuration
|--------------------------------------------------------------------------
|
| Vercel:
|
| VITE_SUPABASE_URL
| VITE_SUPABASE_PUBLISHABLE_KEY
|
| NEVER use SUPABASE_SERVICE_ROLE_KEY in this browser file.
|
|--------------------------------------------------------------------------
*/

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL

const rawPublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

function getSupabaseUrl() {
  if (!rawUrl) {
    throw new Error(
      'VITE_SUPABASE_URL is missing. Add your Supabase Project URL to Vercel and redeploy.',
    )
  }

  let value = String(rawUrl).trim()

  /*
   * Remove accidental whitespace.
   */
  value = value.replace(/\s+/g, '')

  /*
   * Remove trailing slashes.
   */
  value = value.replace(/\/+$/, '')

  /*
   * People sometimes accidentally paste:
   *
   * /auth/v1
   * /rest/v1
   * /storage/v1
   *
   * into the Project URL.
   *
   * The Supabase client adds these paths itself.
   */
  value = value.replace(
    /\/(auth|rest|storage)\/v1$/i,
    '',
  )

  /*
   * Parse the URL.
   */
  let parsed

  try {
    parsed = new URL(value)
  } catch {
    throw new Error(
      'VITE_SUPABASE_URL is not a valid URL. It must look like https://xxxxxxxx.supabase.co',
    )
  }

  /*
   * This should be the Supabase project host,
   * not the Supabase dashboard.
   */
  if (
    parsed.protocol !== 'https:' &&
    parsed.protocol !== 'http:'
  ) {
    throw new Error(
      'VITE_SUPABASE_URL must start with https://',
    )
  }

  /*
   * Prevent accidentally using the Dashboard URL.
   */
  if (
    parsed.hostname === 'supabase.com' ||
    parsed.hostname === 'app.supabase.com'
  ) {
    throw new Error(
      'VITE_SUPABASE_URL is the Supabase Dashboard URL. Use your Project URL from Supabase → Connect instead.',
    )
  }

  /*
   * If you're using the normal Supabase hosted project URL,
   * this should look like:
   *
   * https://abcdefghijklmnop.supabase.co
   */
  return parsed.origin
}

function getPublishableKey() {
  if (!rawPublishableKey) {
    throw new Error(
      'VITE_SUPABASE_PUBLISHABLE_KEY is missing. Add the Supabase Publishable key to Vercel and redeploy.',
    )
  }

  const key =
    String(rawPublishableKey).trim()

  if (!key) {
    throw new Error(
      'VITE_SUPABASE_PUBLISHABLE_KEY is empty.',
    )
  }

  /*
   * Current Supabase publishable keys begin with
   * sb_publishable_.
   *
   * Legacy anon keys are also accepted by Supabase,
   * so don't hard-fail old projects.
   */
  if (
    !key.startsWith('sb_publishable_') &&
    !key.startsWith('eyJ')
  ) {
    console.warn(
      'The Supabase browser key does not look like a current sb_publishable_ key. Verify it in Supabase → Connect → Publishable key.',
    )
  }

  return key
}

const supabaseUrl = getSupabaseUrl()
const supabasePublishableKey =
  getPublishableKey()

/*
|--------------------------------------------------------------------------
| Single Supabase client
|--------------------------------------------------------------------------
*/

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
| Debug information
|--------------------------------------------------------------------------
|
| This logs only safe information.
| Never log the publishable key itself.
|
*/

if (import.meta.env.DEV) {
  console.log(
    '[Supabase]',
    'URL:',
    supabaseUrl,
  )

  console.log(
    '[Supabase]',
    'Publishable key:',
    supabasePublishableKey
      ? 'loaded'
      : 'missing',
  )
}

/*
|--------------------------------------------------------------------------
| SIGN UP
|--------------------------------------------------------------------------
*/

export async function signUp(
  email,
  password,
  onboarding = {},
) {
  const cleanEmail =
    String(email)
      .trim()
      .toLowerCase()

  if (!cleanEmail) {
    throw new Error(
      'Email address is required.',
    )
  }

  if (!password) {
    throw new Error(
      'Password is required.',
    )
  }

  if (password.length < 6) {
    throw new Error(
      'Password must be at least 6 characters.',
    )
  }

  const language =
    onboarding.language || ''

  const examDate =
    onboarding.examDate || ''

  const selectedGoals =
    Array.isArray(
      onboarding.selectedGoals,
    )
      ? onboarding.selectedGoals
      : []

  try {
    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: cleanEmail,
      password,

      options: {
        data: {
          language,
          exam_date: examDate,
          goals: selectedGoals,
          onboarding_complete:
            true,
        },
      },
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error(
      '[Supabase signup]',
      error,
    )

    /*
     * Turn the very vague Supabase error into
     * something actually useful.
     */
    if (
      String(error?.message)
        .toLowerCase()
        .includes(
          'invalid path specified in request url',
        )
    ) {
      throw new Error(
        'Supabase URL is incorrect. In Vercel, VITE_SUPABASE_URL must be your Project URL, like https://xxxxxxxx.supabase.co. Do not include /auth/v1, /rest/v1, or the Supabase Dashboard URL.',
      )
    }

    if (
      String(error?.message)
        .toLowerCase()
        .includes('api key')
    ) {
      throw new Error(
        'Supabase publishable key is missing or invalid. Check VITE_SUPABASE_PUBLISHABLE_KEY in Vercel and redeploy.',
      )
    }

    throw error
  }
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export async function signIn(
  email,
  password,
) {
  const cleanEmail =
    String(email)
      .trim()
      .toLowerCase()

  const {
    data,
    error,
  } =
    await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

  if (error) {
    throw error
  }

  return data
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export async function signOut() {
  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

/*
|--------------------------------------------------------------------------
| SESSION
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/

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
| PROFILE
|--------------------------------------------------------------------------
*/

export async function getProfile(
  userId,
) {
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
| SAVE ONBOARDING
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
      'Missing authenticated user.',
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
        language:
          language || null,
        exam_date:
          examDate || null,
        goals:
          Array.isArray(
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

/*
|--------------------------------------------------------------------------
| AUTH STATE LISTENER
|--------------------------------------------------------------------------
*/

export function onAuthStateChange(
  callback,
) {
  return supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session)
    },
  )
}