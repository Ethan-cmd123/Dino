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
        const user = await getCurrentUser()

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

    const cleanEmail =
      email.trim().toLowerCase()

    if (!cleanEmail) {
      setError(
        'Enter your email address.',
      )
      return
    }

    if (!cleanEmail.includes('@')) {
      setError(
        'Enter a valid email address.',
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
        cleanEmail,
        password,
        {
          language,
          examDate,
          selectedGoals,
        },
      )

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
        message
          .toLowerCase()
          .includes('invalid path')
      ) {
        setError(
          'Supabase is not configured correctly. Check your VITE_SUPABASE_URL and redeploy Vercel.',
        )
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '56px',
    boxSizing: 'border-box',
    padding: '0 16px',
    margin: 0,

    appearance: 'none',
    WebkitAppearance: 'none',

    display: 'block',

    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    backgroundImage: 'none',

    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '14px',

    outline: 'none',

    color: '#ffffff',
    caretColor: '#ffffff',

    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: '500',
    lineHeight: '1.2',

    WebkitTextFillColor: '#ffffff',

    opacity: 1,

    transition:
      'border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease',
  }

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    width: '100%',
  }

  const labelTextStyle = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1',
    letterSpacing: '-0.01em',
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
                We'll use this to shape your study timeline.
              </p>

              <div className="date-wrapper">
                <input
                  type="date"
                  value={examDate}
                  onChange={(event) => {
                    setExamDate(
                      event.target.value,
                    )
                    clearMessages()
                  }}
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
            <div
              className="onboarding-step"
              style={{
                width: '100%',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              <span className="page-eyebrow">
                Last step
              </span>

              <h1 className="onboarding-title">
                Create your
                <span> Dino account.</span>
              </h1>

              <p className="onboarding-description">
                Create an account to save your
                study preferences and progress.
              </p>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  marginTop: '30px',
                }}
              >
                <label style={labelStyle}>
                  <span
                    style={labelTextStyle}
                  >
                    Email address
                  </span>

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
                    spellCheck={false}
                    style={inputStyle}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.36)'

                      event.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.08)'

                      event.currentTarget.style.boxShadow =
                        '0 0 0 4px rgba(255, 255, 255, 0.045)'
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.14)'

                      event.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.055)'

                      event.currentTarget.style.boxShadow =
                        'none'
                    }}
                  />
                </label>

                <label style={labelStyle}>
                  <span
                    style={labelTextStyle}
                  >
                    Password
                  </span>

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
                    style={inputStyle}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.36)'

                      event.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.08)'

                      event.currentTarget.style.boxShadow =
                        '0 0 0 4px rgba(255, 255, 255, 0.045)'
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.14)'

                      event.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.055)'

                      event.currentTarget.style.boxShadow =
                        'none'
                    }}
                  />
                </label>

                <label style={labelStyle}>
                  <span
                    style={labelTextStyle}
                  >
                    Confirm password
                  </span>

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
                    style={inputStyle}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter'
                      ) {
                        finish()
                      }
                    }}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.36)'

                      event.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.08)'

                      event.currentTarget.style.boxShadow =
                        '0 0 0 4px rgba(255, 255, 255, 0.045)'
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.14)'

                      event.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.055)'

                      event.currentTarget.style.boxShadow =
                        'none'
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '18px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: '28px',
                    padding: '0 11px',
                    border:
                      '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '999px',
                    background:
                      'rgba(255, 255, 255, 0.035)',
                    color:
                      'rgba(255, 255, 255, 0.56)',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing:
                      '-0.01em',
                  }}
                >
                  {language}
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: '28px',
                    padding: '0 11px',
                    border:
                      '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '999px',
                    background:
                      'rgba(255, 255, 255, 0.035)',
                    color:
                      'rgba(255, 255, 255, 0.56)',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing:
                      '-0.01em',
                  }}
                >
                  {selectedGoals.length}{' '}
                  {selectedGoals.length === 1
                    ? 'goal'
                    : 'goals'}
                </span>
              </div>

              {error && (
                <div
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding:
                      '12px 14px',
                    boxSizing: 'border-box',
                    border:
                      '1px solid rgba(255, 105, 105, 0.18)',
                    borderRadius: '12px',
                    background:
                      'rgba(255, 105, 105, 0.07)',
                    color:
                      'rgba(255, 190, 190, 0.94)',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    letterSpacing:
                      '-0.01em',
                  }}
                >
                  {error}
                </div>
              )}

              {notice && (
                <div
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding:
                      '12px 14px',
                    boxSizing: 'border-box',
                    border:
                      '1px solid rgba(140, 255, 185, 0.16)',
                    borderRadius: '12px',
                    background:
                      'rgba(140, 255, 185, 0.06)',
                    color:
                      'rgba(190, 255, 215, 0.92)',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    letterSpacing:
                      '-0.01em',
                  }}
                >
                  {notice}
                </div>
              )}
            </div>
          )}
        </div>

        {step !== 4 && error && (
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              margin: '0 auto',
              padding: '12px 14px',
              boxSizing: 'border-box',
              border:
                '1px solid rgba(255, 105, 105, 0.18)',
              borderRadius: '12px',
              background:
                'rgba(255, 105, 105, 0.07)',
              color:
                'rgba(255, 190, 190, 0.94)',
              fontSize: '12px',
              lineHeight: '1.5',
            }}
          >
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