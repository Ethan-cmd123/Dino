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

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [notice, setNotice] =
    useState('')

  useEffect(() => {
    async function checkSession() {
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
      } catch (error) {
        console.error(
          'Session check failed:',
          error,
        )
      }
    }

    checkSession()
  }, [navigate])

  function clearMessages() {
    setError('')
    setNotice('')
  }

  function toggleGoal(goal) {
    clearMessages()

    setSelectedGoals((current) => {
      if (current.includes(goal)) {
        return current.filter(
          (item) => item !== goal,
        )
      }

      return [...current, goal]
    })
  }

  function nextStep() {
    clearMessages()

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

    if (
      step === 3 &&
      selectedGoals.length === 0
    ) {
      setError(
        'Choose at least one goal first.',
      )
      return
    }

    setStep((current) =>
      Math.min(current + 1, 4),
    )
  }

  function previousStep() {
    clearMessages()

    setStep((current) =>
      Math.max(current - 1, 1),
    )
  }

  async function finish() {
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
        'Password must be at least 6 characters.',
      )
      return
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.',
      )
      return
    }

    if (!language) {
      setError(
        'Choose your Language B.',
      )
      return
    }

    if (!examDate) {
      setError(
        'Choose your exam date.',
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
        cleanEmail,
        password,
        {
          language,
          examDate,
          selectedGoals,
        },
      )

      /*
       * Email confirmation OFF:
       * Supabase immediately gives us
       * a session.
       */
      if (
        data?.session &&
        data?.user
      ) {
        await saveOnboarding(
          data.user.id,
          {
            language,
            examDate,
            selectedGoals,
          },
        )

        navigate('/dashboard')
        return
      }

      /*
       * Email confirmation ON:
       * account exists but session is
       * not active yet.
       */
      setNotice(
        'Account created. Check your email to confirm your account, then log in.',
      )
    } catch (error) {
      console.error(
        'Signup failed:',
        error,
      )

      setError(
        error?.message ||
          'Could not create your account.',
      )
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
              width: `${
                (step / 4) * 100
              }%`,
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
                <span>
                  {' '}
                  Language B?
                </span>
              </h1>

              <p className="onboarding-description">
                Choose the language you're
                studying for IB.
              </p>

              <div className="choice-grid">
                {languages.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      className={`choice-card ${
                        language ===
                        item
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setLanguage(
                          item,
                        )
                      }
                    >
                      <span>
                        {item}
                      </span>

                      <span className="choice-circle">
                        {language ===
                        item
                          ? '✓'
                          : ''}
                      </span>
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                className="login-bypass"
                onClick={() =>
                  navigate(
                    '/login',
                  )
                }
              >
                Already have an
                account?
                <span>
                  {' '}
                  Log in
                </span>
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
                <span>
                  {' '}
                  IB exam?
                </span>
              </h1>

              <p className="onboarding-description">
                We'll use this to
                shape your study
                timeline.
              </p>

              <div className="date-wrapper">
                <input
                  type="date"
                  value={examDate}
                  onChange={(event) => {
                    setExamDate(
                      event.target
                        .value,
                    )
                    clearMessages()
                  }}
                  className="exam-date"
                  min={
                    new Date()
                      .toISOString()
                      .split(
                        'T',
                      )[0]
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
                <span>
                  {' '}
                  to improve?
                </span>
              </h1>

              <p className="onboarding-description">
                Choose everything
                you're interested
                in.
              </p>

              <div className="goal-grid">
                {goals.map(
                  (goal) => (
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
                        toggleGoal(
                          goal,
                        )
                      }
                    >
                      <span>
                        {goal}
                      </span>

                      <span className="goal-check">
                        {selectedGoals.includes(
                          goal,
                        )
                          ? '✓'
                          : '+'}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div
              className="onboarding-step"
              style={{
                width: '100%',
                maxWidth:
                  '520px',
                margin:
                  '0 auto',
              }}
            >
              <span className="page-eyebrow">
                Almost there
              </span>

              <h1 className="onboarding-title">
                Create your
                <span>
                  {' '}
                  Dino account.
                </span>
              </h1>

              <p className="onboarding-description">
                Your Language B,
                exam date and goals
                will be saved to
                your account.
              </p>

              <div
                style={{
                  width:
                    '100%',
                  display:
                    'flex',
                  flexDirection:
                    'column',
                  gap: '16px',
                  marginTop:
                    '30px',
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap: '8px',
                  }}
                >
                  <label
                    htmlFor="dino-email"
                    style={{
                      fontSize:
                        '12px',
                      fontWeight:
                        600,
                      color:
                        'rgba(255,255,255,0.60)',
                    }}
                  >
                    Email
                  </label>

                  <input
                    id="dino-email"
                    type="email"
                    value={email}
                    onChange={(
                      event,
                    ) => {
                      setEmail(
                        event
                          .target
                          .value,
                      )
                      clearMessages()
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={{
                      width:
                        '100%',
                      height:
                        '54px',
                      padding:
                        '0 16px',
                      boxSizing:
                        'border-box',
                      color:
                        '#ffffff',
                      background:
                        'rgba(255,255,255,0.055)',
                      border:
                        '1px solid rgba(255,255,255,0.14)',
                      borderRadius:
                        '14px',
                      outline:
                        'none',
                      fontFamily:
                        'inherit',
                      fontSize:
                        '14px',
                      fontWeight:
                        500,
                      WebkitTextFillColor:
                        '#ffffff',
                      opacity: 1,
                    }}
                  />
                </div>

                <div
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap: '8px',
                  }}
                >
                  <label
                    htmlFor="dino-password"
                    style={{
                      fontSize:
                        '12px',
                      fontWeight:
                        600,
                      color:
                        'rgba(255,255,255,0.60)',
                    }}
                  >
                    Password
                  </label>

                  <input
                    id="dino-password"
                    type="password"
                    value={
                      password
                    }
                    onChange={(
                      event,
                    ) => {
                      setPassword(
                        event
                          .target
                          .value,
                      )
                      clearMessages()
                    }}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    style={{
                      width:
                        '100%',
                      height:
                        '54px',
                      padding:
                        '0 16px',
                      boxSizing:
                        'border-box',
                      color:
                        '#ffffff',
                      background:
                        'rgba(255,255,255,0.055)',
                      border:
                        '1px solid rgba(255,255,255,0.14)',
                      borderRadius:
                        '14px',
                      outline:
                        'none',
                      fontFamily:
                        'inherit',
                      fontSize:
                        '14px',
                      fontWeight:
                        500,
                      WebkitTextFillColor:
                        '#ffffff',
                      opacity: 1,
                    }}
                  />
                </div>

                <div
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap: '8px',
                  }}
                >
                  <label
                    htmlFor="dino-confirm-password"
                    style={{
                      fontSize:
                        '12px',
                      fontWeight:
                        600,
                      color:
                        'rgba(255,255,255,0.60)',
                    }}
                  >
                    Confirm password
                  </label>

                  <input
                    id="dino-confirm-password"
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event,
                    ) => {
                      setConfirmPassword(
                        event
                          .target
                          .value,
                      )
                      clearMessages()
                    }}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                        'Enter'
                      ) {
                        finish()
                      }
                    }}
                    style={{
                      width:
                        '100%',
                      height:
                        '54px',
                      padding:
                        '0 16px',
                      boxSizing:
                        'border-box',
                      color:
                        '#ffffff',
                      background:
                        'rgba(255,255,255,0.055)',
                      border:
                        '1px solid rgba(255,255,255,0.14)',
                      borderRadius:
                        '14px',
                      outline:
                        'none',
                      fontFamily:
                        'inherit',
                      fontSize:
                        '14px',
                      fontWeight:
                        500,
                      WebkitTextFillColor:
                        '#ffffff',
                      opacity: 1,
                    }}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginTop:
                      '18px',
                    padding:
                      '12px 14px',
                    border:
                      '1px solid rgba(255,100,100,0.18)',
                    borderRadius:
                      '12px',
                    background:
                      'rgba(255,100,100,0.07)',
                    color:
                      'rgba(255,190,190,0.95)',
                    fontSize:
                      '12px',
                    lineHeight:
                      1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {notice && (
                <div
                  style={{
                    marginTop:
                      '18px',
                    padding:
                      '12px 14px',
                    border:
                      '1px solid rgba(140,255,185,0.16)',
                    borderRadius:
                      '12px',
                    background:
                      'rgba(140,255,185,0.06)',
                    color:
                      'rgba(190,255,215,0.95)',
                    fontSize:
                      '12px',
                    lineHeight:
                      1.5,
                  }}
                >
                  {notice}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          <button
            type="button"
            className="back-button"
            onClick={previousStep}
            disabled={
              step === 1 ||
              loading
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