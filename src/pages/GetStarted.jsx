import { useEffect, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'
import {
  getCurrentUser,
  getProfile,
  saveOnboarding,
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

function GetStarted({ navigate }) {
  const [step, setStep] = useState(1)

  const [language, setLanguage] =
    useState('')

  const [examDate, setExamDate] =
    useState('')

  const [selectedGoals, setSelectedGoals] =
    useState([])

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [notice, setNotice] =
    useState('')

  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const user =
          await getCurrentUser()

        if (!user) {
          return
        }

        const profile =
          await getProfile(user.id)

        if (
          profile?.onboarding_complete
        ) {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error(
          'Session check failed:',
          err,
        )
      }
    }

    checkExistingUser()
  }, [navigate])

  const clearMessages = () => {
    setError('')
    setNotice('')
  }

  const toggleGoal = (goal) => {
    clearMessages()

    setSelectedGoals((current) =>
      current.includes(goal)
        ? current.filter(
            (item) => item !== goal,
          )
        : [...current, goal],
    )
  }

  const nextStep = () => {
    clearMessages()

    if (step === 1 && !language) {
      setError(
        'Choose your Language B.',
      )
      return
    }

    if (step === 2 && !examDate) {
      setError(
        'Choose your exam date.',
      )
      return
    }

    if (
      step === 3 &&
      selectedGoals.length === 0
    ) {
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
    clearMessages()

    setStep((current) =>
      Math.max(current - 1, 1),
    )
  }

  const finish = async () => {
    clearMessages()

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

    if (
      !language ||
      !examDate ||
      selectedGoals.length === 0
    ) {
      setError(
        'Your onboarding information is incomplete.',
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
       * With email confirmation disabled,
       * Supabase returns a session immediately.
       */
      if (data.session && data.user) {
        try {
          await saveOnboarding(
            data.user.id,
            {
              language,
              examDate,
              selectedGoals,
            },
          )
        } catch (profileError) {
          console.error(
            'Profile save failed:',
            profileError,
          )

          throw new Error(
            'Your account was created, but your onboarding profile could not be saved.',
          )
        }

        navigate('/dashboard')
        return
      }

      /*
       * Email confirmation is enabled.
       */
      setNotice(
        'Account created. Check your email to confirm your account, then log in.',
      )
    } catch (err) {
      console.error(
        'Signup failed:',
        err,
      )

      const message =
        err?.message ||
        'Something went wrong while creating your account.'

      if (
        message.toLowerCase().includes(
          'invalid path',
        )
      ) {
        setError(
          'Supabase is not configured correctly. Check VITE_SUPABASE_URL in Vercel and redeploy the project.',
        )
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
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
                Choose the language you're
                studying for IB.
              </p>

              <div className="choice-grid">
                {languages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`choice-card ${
                      language === item
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setLanguage(item)
                    }
                  >
                    <span>{item}</span>

                    <span className="choice-circle">
                      {language === item
                        ? '✓'
                        : ''}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="login-bypass"
                onClick={() =>
                  navigate('/login')
                }
              >
                Already have an account?
                <span> Log in</span>
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
                We'll use this to shape
                your study timeline.
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
                Pick the date of your
                Language B examination.
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
                Choose everything you're
                interested in.
              </p>

              <div className="goal-grid">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={`goal-card ${
                      selectedGoals.includes(
                        goal,
                      )
                        ? 'selected'
                        : ''
                    }`}
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
            <div className="onboarding-step signup-step">
              <span className="page-eyebrow">
                Last step
              </span>

              <h1 className="onboarding-title">
                Create your
                <span> Dino account.</span>
              </h1>

              <p className="onboarding-description">
                Your study preferences will
                be saved to your account.
              </p>

              <div className="signup-form">
                <label className="signup-field">
                  <span>Email</span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value,
                      )
                      clearMessages()
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className="signup-field">
                  <span>Password</span>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value,
                      )
                      clearMessages()
                    }}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                </label>

                <label className="signup-field">
                  <span>Confirm password</span>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(
                        event.target.value,
                      )
                      clearMessages()
                    }}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter'
                      ) {
                        finish()
                      }
                    }}
                  />
                </label>
              </div>

              <div className="signup-meta">
                <span>
                  {language}
                </span>

                <span>
                  {selectedGoals.length}{' '}
                  {selectedGoals.length ===
                  1
                    ? 'goal'
                    : 'goals'}
                </span>
              </div>

              {error && (
                <div className="form-message error">
                  {error}
                </div>
              )}

              {notice && (
                <div className="form-message success">
                  {notice}
                </div>
              )}
            </div>
          )}
        </div>

        {step !== 4 && error && (
          <div className="form-message error">
            {error}
          </div>
        )}

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
                ? 'Creating account…'
                : 'Create account'}
            </button>
          )}
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default GetStarted