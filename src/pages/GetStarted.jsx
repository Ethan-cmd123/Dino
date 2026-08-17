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
  const [step, setStep] =
    useState(1)

  const [language, setLanguage] =
    useState('')

  const [examDate, setExamDate] =
    useState('')

  const [
    selectedGoals,
    setSelectedGoals,
  ] = useState([])

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

    setSelectedGoals(
      (current) => {
        if (
          current.includes(goal)
        ) {
          return current.filter(
            (item) =>
              item !== goal,
          )
        }

        return [
          ...current,
          goal,
        ]
      },
    )
  }

  function nextStep() {
    clearMessages()

    if (
      step === 1 &&
      !language
    ) {
      setError(
        'Choose your Language B first.',
      )
      return
    }

    if (
      step === 2 &&
      !examDate
    ) {
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

    setStep(
      (current) =>
        Math.min(
          current + 1,
          4,
        ),
    )
  }

  function previousStep() {
    clearMessages()

    setStep(
      (current) =>
        Math.max(
          current - 1,
          1,
        ),
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

    if (
      password !==
      confirmPassword
    ) {
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

    if (
      selectedGoals.length === 0
    ) {
      setError(
        'Choose at least one goal.',
      )
      return
    }

    setLoading(true)

    try {
      const data =
        await signUp(
          cleanEmail,
          password,
          {
            language,
            examDate,
            selectedGoals,
          },
        )

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

        navigate(
          '/dashboard',
        )

        return
      }

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
      <style>
        {`
          .dino-signup-page {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
          }

          .dino-signup-card {
            width: 100%;
            box-sizing: border-box;
            padding: 36px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 22px;
            background: rgba(255,255,255,.78);
            backdrop-filter: blur(18px);
            box-shadow: 0 22px 60px rgba(0,0,0,.055);
          }

          .dino-signup-header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          .dino-signup-brand {
            color: #8a8a8a;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 600;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: .03em;
          }

          .dino-signup-step {
            color: #8a8a8a;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 600;
            line-height: 1;
          }

          .dino-signup-progress {
            width: 100%;
            height: 2px;
            margin-bottom: 30px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(0,0,0,.07);
          }

          .dino-signup-progress-active {
            height: 100%;
            border-radius: inherit;
            background: #0a0a0a;
            transition: width .2s ease;
          }

          .dino-signup-content {
            width: 100%;
            min-height: 0 !important;
          }

          .dino-signup-step-content {
            width: 100%;
            max-width: 520px;
            margin: 0 auto;
          }

          .dino-signup-eyebrow {
            display: block;
            margin-bottom: 9px;
            color: #8a8a8a;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 600;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: .03em;
          }

          .dino-signup-title {
            margin: 0;
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: clamp(42px, 7vw, 58px);
            font-weight: 600;
            line-height: .92;
            letter-spacing: -.085em;
          }

          .dino-signup-title span {
            font-style: italic;
          }

          .dino-signup-description {
            max-width: 400px;
            margin: 13px 0 28px;
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.55;
          }

          .dino-signup-fields {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 28px;
          }

          .dino-signup-field {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .dino-signup-label {
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 600;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: .025em;
          }

          .dino-signup-input {
            width: 100%;
            height: 54px;
            box-sizing: border-box;
            padding: 0 16px;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 14px;
            outline: none;
            background: rgba(255,255,255,.96);
            color: #000000;
            -webkit-text-fill-color: #000000;
            font-family: Inter, sans-serif;
            font-size: 13px;
            font-weight: 500;
            line-height: 1;
            letter-spacing: -.015em;
            transition:
              border-color .16s ease,
              box-shadow .16s ease,
              background .16s ease;
          }

          .dino-signup-input::placeholder {
            color: #a0a0a0;
            -webkit-text-fill-color: #a0a0a0;
            font-family: Inter, sans-serif;
            font-weight: 400;
          }

          .dino-signup-input:focus {
            border-color: rgba(0,0,0,.24);
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(0,0,0,.045);
          }

          .dino-signup-input:-webkit-autofill,
          .dino-signup-input:-webkit-autofill:hover,
          .dino-signup-input:-webkit-autofill:focus {
            -webkit-text-fill-color: #000000;
            box-shadow: 0 0 0 1000px #ffffff inset;
            font-family: Inter, sans-serif;
          }

          .dino-signup-error,
          .dino-signup-notice {
            padding: 12px 14px;
            border-radius: 12px;
            font-family: Inter, sans-serif;
            font-size: 10px;
            line-height: 1.5;
          }

          .dino-signup-error {
            border: 1px solid rgba(255,100,100,.15);
            background: rgba(255,100,100,.06);
            color: #8c4747;
          }

          .dino-signup-notice {
            border: 1px solid rgba(80,160,100,.15);
            background: rgba(80,160,100,.06);
            color: #51735a;
          }

          .dino-signup-footer {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin-top: 22px;
            padding-top: 17px;
            border-top: 1px solid rgba(0,0,0,.07);
          }

          .dino-signup-back,
          .dino-signup-next {
            height: 54px;
            box-sizing: border-box;
            border-radius: 14px;
            font-family: Inter, sans-serif;
            cursor: pointer;
            transition:
              transform .16s ease,
              opacity .16s ease,
              background .16s ease,
              color .16s ease;
          }

          .dino-signup-back {
            flex: 0 0 110px;
            border: 1px solid rgba(0,0,0,.09);
            background: rgba(255,255,255,.72);
            color: #777;
            font-size: 10px;
            font-weight: 500;
          }

          .dino-signup-next {
            flex: 1;
            border: 0;
            background: #0a0a0a;
            color: #ffffff;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: -.01em;
          }

          .dino-signup-back:hover:not(:disabled) {
            color: #0a0a0a;
            background: #ffffff;
          }

          .dino-signup-next:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .dino-signup-back:active:not(:disabled),
          .dino-signup-next:active:not(:disabled) {
            transform: translateY(0);
          }

          .dino-signup-back:disabled,
          .dino-signup-next:disabled {
            opacity: .45;
            cursor: not-allowed;
          }

          .dino-signup-bypass {
            width: 100%;
            margin-top: 22px;
            padding-top: 17px;
            border: 0;
            border-top: 1px solid rgba(0,0,0,.07);
            background: transparent;
            color: #888;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 400;
            cursor: pointer;
          }

          .dino-signup-bypass span {
            color: #0a0a0a;
            font-weight: 600;
          }

          .dino-signup-bypass:hover {
            color: #666;
          }

          .dino-choice-grid,
          .dino-goal-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 28px;
          }

          .dino-choice-card,
          .dino-goal-card {
            min-height: 54px;
            box-sizing: border-box;
            padding: 0 15px;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 14px;
            background: rgba(255,255,255,.72);
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 500;
            text-align: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            transition:
              border-color .16s ease,
              background .16s ease,
              box-shadow .16s ease,
              transform .16s ease;
          }

          .dino-choice-card:hover,
          .dino-goal-card:hover {
            transform: translateY(-1px);
            background: #ffffff;
          }

          .dino-choice-card.selected,
          .dino-goal-card.selected {
            border-color: rgba(0,0,0,.24);
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(0,0,0,.045);
          }

          .dino-choice-circle,
          .dino-goal-check {
            width: 20px;
            height: 20px;
            flex: 0 0 20px;
            box-sizing: border-box;
            border: 1px solid rgba(0,0,0,.12);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background: #0a0a0a;
            font-size: 10px;
            line-height: 1;
          }

          .dino-date-wrapper {
            margin-top: 28px;
          }

          .dino-exam-date {
            width: 100%;
            height: 54px;
            box-sizing: border-box;
            padding: 0 16px;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 14px;
            outline: none;
            background: rgba(255,255,255,.96);
            color: #000000;
            font-family: Inter, sans-serif;
            font-size: 13px;
            font-weight: 500;
          }

          .dino-exam-date:focus {
            border-color: rgba(0,0,0,.24);
            box-shadow: 0 0 0 3px rgba(0,0,0,.045);
          }

          .dino-date-hint {
            margin-top: 10px;
            color: #999;
            font-family: Inter, sans-serif;
            font-size: 10px;
            line-height: 1.5;
          }

          @media (max-width: 600px) {
            .dino-signup-card {
              padding: 25px;
            }

            .dino-choice-grid,
            .dino-goal-grid {
              grid-template-columns: 1fr;
            }

            .dino-signup-footer {
              gap: 10px;
            }

            .dino-signup-back {
              flex-basis: 92px;
            }
          }
        `}
      </style>

      <div className="onboarding-wrapper">
        <div className="dino-signup-page">
          <div className="dino-signup-card">
            <div className="dino-signup-header">
              <div className="dino-signup-brand">
                Dino
              </div>

              <div className="dino-signup-step">
                {step} / 4
              </div>
            </div>

            <div className="dino-signup-progress">
              <div
                className="dino-signup-progress-active"
                style={{
                  width: `${(step / 4) * 100}%`,
                }}
              />
            </div>

            <div className="dino-signup-content">
              {step === 1 && (
                <div className="dino-signup-step-content">
                  <span className="dino-signup-eyebrow">
                    First things first
                  </span>

                  <h1 className="dino-signup-title">
                    What is your
                    <span>
                      {' '}
                      Language B?
                    </span>
                  </h1>

                  <p className="dino-signup-description">
                    Choose the language
                    you're studying
                    for IB.
                  </p>

                  <div className="dino-choice-grid">
                    {languages.map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          className={`dino-choice-card ${
                            language === item
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() => {
                            setLanguage(item)
                            clearMessages()
                          }}
                        >
                          <span>
                            {item}
                          </span>

                          <span className="dino-choice-circle">
                            {language === item
                              ? '✓'
                              : ''}
                          </span>
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    className="dino-signup-bypass"
                    onClick={() =>
                      navigate('/login')
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
                <div className="dino-signup-step-content">
                  <span className="dino-signup-eyebrow">
                    Timeline
                  </span>

                  <h1 className="dino-signup-title">
                    When is your
                    <span>
                      {' '}
                      IB exam?
                    </span>
                  </h1>

                  <p className="dino-signup-description">
                    We'll use this to
                    shape your study
                    timeline.
                  </p>

                  <div className="dino-date-wrapper">
                    <input
                      type="date"
                      value={examDate}
                      onChange={(event) => {
                        setExamDate(
                          event.target.value,
                        )
                        clearMessages()
                      }}
                      className="dino-exam-date"
                      min={
                        new Date()
                          .toISOString()
                          .split('T')[0]
                      }
                    />
                  </div>

                  <div className="dino-date-hint">
                    Pick the date of
                    your Language B
                    examination.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="dino-signup-step-content">
                  <span className="dino-signup-eyebrow">
                    Your goals
                  </span>

                  <h1 className="dino-signup-title">
                    What do you want
                    <span>
                      {' '}
                      to improve?
                    </span>
                  </h1>

                  <p className="dino-signup-description">
                    Choose everything
                    you're interested
                    in.
                  </p>

                  <div className="dino-goal-grid">
                    {goals.map(
                      (goal) => (
                        <button
                          key={goal}
                          type="button"
                          className={`dino-goal-card ${
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
                          <span>
                            {goal}
                          </span>

                          <span className="dino-goal-check">
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
                <div className="dino-signup-step-content">
                  <span className="dino-signup-eyebrow">
                    Almost there
                  </span>

                  <h1 className="dino-signup-title">
                    Create your
                    <span>
                      {' '}
                      Dino account.
                    </span>
                  </h1>

                  <p className="dino-signup-description">
                    Your Language B,
                    exam date and goals
                    will be saved to
                    your account.
                  </p>

                  <div className="dino-signup-fields">
                    <div className="dino-signup-field">
                      <label
                        htmlFor="dino-email"
                        className="dino-signup-label"
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
                            event.target.value,
                          )
                          clearMessages()
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="dino-signup-input"
                      />
                    </div>

                    <div className="dino-signup-field">
                      <label
                        htmlFor="dino-password"
                        className="dino-signup-label"
                      >
                        Password
                      </label>

                      <input
                        id="dino-password"
                        type="password"
                        value={password}
                        onChange={(
                          event,
                        ) => {
                          setPassword(
                            event.target.value,
                          )
                          clearMessages()
                        }}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        className="dino-signup-input"
                      />
                    </div>

                    <div className="dino-signup-field">
                      <label
                        htmlFor="dino-confirm-password"
                        className="dino-signup-label"
                      >
                        Confirm password
                      </label>

                      <input
                        id="dino-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(
                          event,
                        ) => {
                          setConfirmPassword(
                            event.target.value,
                          )
                          clearMessages()
                        }}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        className="dino-signup-input"
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
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="dino-signup-error">
                      {error}
                    </div>
                  )}

                  {notice && (
                    <div className="dino-signup-notice">
                      {notice}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="dino-signup-footer">
              <button
                type="button"
                className="dino-signup-back"
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
                  className="dino-signup-next"
                  onClick={nextStep}
                  disabled={loading}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="dino-signup-next"
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
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default GetStarted