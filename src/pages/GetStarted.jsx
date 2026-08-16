import { useEffect, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'
import {
  getCurrentUser,
  getProfile,
  signUp,
} from '../api/credentials'

const languages = [
  'French B',
  'Spanish B',
  'Chinese B',
  'English B',
  'German B',
  'Italian B',
  'Japanese B',
]

const goals = [
  'Improve reading',
  'Improve writing',
  'Build vocabulary',
  'Improve grammar',
  'Prepare for exams',
  'Become more fluent',
]

function getCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))

  return match
    ? decodeURIComponent(
        match.split('=').slice(1).join('='),
      )
    : ''
}

function setCookie(name, value, days = 365) {
  const expires = new Date(
    Date.now() +
      days * 24 * 60 * 60 * 1000,
  ).toUTCString()

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/; SameSite=Lax`
}

function GetStarted({ navigate }) {
  const [step, setStep] = useState(1)

  const [language, setLanguage] = useState('')
  const [examDate, setExamDate] = useState('')
  const [selectedGoals, setSelectedGoals] =
    useState([])

  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] =
    useState('')

  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const user = await getCurrentUser()

        if (!user) {
          const savedLanguage =
            getCookie('dino_language')
          const savedExamDate =
            getCookie('dino_exam_date')
          const savedGoals =
            getCookie('dino_goals')

          if (savedLanguage) {
            setLanguage(savedLanguage)
          }

          if (savedExamDate) {
            setExamDate(savedExamDate)
          }

          if (savedGoals) {
            try {
              const parsedGoals =
                JSON.parse(savedGoals)

              if (Array.isArray(parsedGoals)) {
                setSelectedGoals(parsedGoals)
              }
            } catch {
              setSelectedGoals([])
            }
          }

          return
        }

        const profile = await getProfile(user.id)

        if (
          profile?.onboarding_complete
        ) {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error(
          'Failed to restore session:',
          err,
        )
      }
    }

    checkExistingUser()
  }, [navigate])

  const toggleGoal = (goal) => {
    setSelectedGoals((current) =>
      current.includes(goal)
        ? current.filter(
            (item) => item !== goal,
          )
        : [...current, goal],
    )
  }

  const nextStep = () => {
    setError('')

    if (step === 1 && !language) {
      setError(
        'Choose your Language B first.',
      )
      return
    }

    if (step === 2 && !examDate) {
      setError(
        'Choose your exam date first.',
      )
      return
    }

    if (step === 3 && selectedGoals.length === 0) {
      setError(
        'Choose at least one goal.',
      )
      return
    }

    setStep((current) =>
      Math.min(current + 1, 4),
    )
  }

  const previousStep = () => {
    setError('')
    setSuccessMessage('')

    setStep((current) =>
      Math.max(current - 1, 1),
    )
  }

  const finish = async () => {
    setError('')
    setSuccessMessage('')

    if (!email.trim()) {
      setError(
        'Enter your email address.',
      )
      return
    }

    if (password.length < 6) {
      setError(
        'Your password must be at least 6 characters.',
      )
      return
    }

    if (password !== confirmPassword) {
      setError(
        'Your passwords do not match.',
      )
      return
    }

    if (!language || !examDate) {
      setError(
        'Your onboarding information is incomplete.',
      )
      return
    }

    if (selectedGoals.length === 0) {
      setError(
        'Choose at least one goal.',
      )
      return
    }

    setLoading(true)

    try {
      const data = await signUp(
        email,
        password,
        {
          language,
          examDate,
          selectedGoals,
        },
      )

      /*
       * Save the local onboarding state as a
       * convenience for this browser.
       */
      setCookie(
        'dino_language',
        language,
      )

      setCookie(
        'dino_exam_date',
        examDate,
      )

      setCookie(
        'dino_goals',
        JSON.stringify(
          selectedGoals,
        ),
      )

      /*
       * Supabase may require email confirmation.
       * In that case data.session is null.
       */
      if (!data.session) {
        setSuccessMessage(
          'Account created. Check your email to confirm your account, then log in.',
        )

        return
      }

      navigate('/dashboard')
    } catch (err) {
      console.error(
        'Signup failed:',
        err,
      )

      setError(
        err?.message ||
          'Could not create your account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const bypassOnboarding = () => {
    navigate('/login')
  }

  return (
    <AnimatedBackground className="onboarding-page">
      <div className="onboarding-wrapper">
        <div className="onboarding-header">
          <div className="onboarding-brand">
            Dino
          </div>

          <div className="step-counter">
            {step} / 4
          </div>
        </div>

        <div className="progress-line">
          <div
            className="progress-line-active"
            style={{
              width: `${(step / 4) * 100}%`,
            }}
          />
        </div>

        <div className="onboarding-content">
          {step === 1 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                First things first
              </span>

              <h1 className="onboarding-title">
                What is your
                <span> Language B?</span>
              </h1>

              <p className="onboarding-description">
                Choose the language you're studying for IB.
              </p>

              <div className="choice-grid">
                {languages.map((item) => (
                  <button
                    type="button"
                    className={`choice-card ${
                      language === item
                        ? 'selected'
                        : ''
                    }`}
                    key={item}
                    onClick={() =>
                      setLanguage(item)
                    }
                  >
                    <span>{item}</span>

                    <span className="choice-circle">
                      {language === item &&
                        '✓'}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="login-bypass"
                onClick={bypassOnboarding}
              >
                Go away, I want to login
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                Timeline
              </span>

              <h1 className="onboarding-title">
                When is your
                <span> IB exam?</span>
              </h1>

              <p className="onboarding-description">
                We'll use this to shape your study timeline.
              </p>

              <div className="date-wrapper">
                <input
                  type="date"
                  value={examDate}
                  onChange={(event) =>
                    setExamDate(
                      event.target.value,
                    )
                  }
                  className="exam-date"
                  min={
                    new Date()
                      .toISOString()
                      .split('T')[0]
                  }
                />
              </div>

              <div className="date-hint">
                Pick the date of your Language B examination.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                Your goals
              </span>

              <h1 className="onboarding-title">
                What do you want
                <span> to improve?</span>
              </h1>

              <p className="onboarding-description">
                Choose everything you're interested in.
              </p>

              <div className="goal-grid">
                {goals.map((goal) => (
                  <button
                    type="button"
                    className={`goal-card ${
                      selectedGoals.includes(
                        goal,
                      )
                        ? 'selected'
                        : ''
                    }`}
                    key={goal}
                    onClick={() =>
                      toggleGoal(goal)
                    }
                  >
                    <span>{goal}</span>

                    <span className="goal-check">
                      {selectedGoals.includes(
                        goal,
                      )
                        ? '✓'
                        : '+'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                Almost there
              </span>

              <h1 className="onboarding-title">
                Create your
                <span> Dino account.</span>
              </h1>

              <p className="onboarding-description">
                Your onboarding data will be saved to your Dino account.
              </p>

              <div className="auth-form">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value,
                    )
                    setError('')
                  }}
                  className="auth-input"
                  placeholder="Email address"
                  autoComplete="email"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value,
                    )
                    setError('')
                  }}
                  className="auth-input"
                  placeholder="Password"
                  autoComplete="new-password"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(
                      event.target.value,
                    )
                    setError('')
                  }}
                  className="auth-input"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="auth-success">
                  {successMessage}
                </div>
              )}
            </div>
          )}

          {step !== 4 && error && (
            <div className="auth-error">
              {error}
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          <button
            type="button"
            className="back-button"
            onClick={previousStep}
            disabled={
              step === 1 || loading
            }
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              className="next-button"
              onClick={nextStep}
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="next-button"
              onClick={finish}
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create account'}
            </button>
          )}
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default GetStarted