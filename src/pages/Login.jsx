import { useEffect, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'
import {
  getCurrentUser,
  signIn,
} from '../api/credentials'

function Login({ navigate }) {
  const [email, setEmail] =
    useState('')
  const [password, setPassword] =
    useState('')
  const [loading, setLoading] =
    useState(false)
  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const user =
          await getCurrentUser()

        if (
          active &&
          user
        ) {
          navigate('/dashboard')
        }
      } catch (error) {
        console.error(
          'Login session check failed:',
          error,
        )
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [navigate])

  function clearError() {
    setError('')
  }

  async function handleLogin(event) {
    event.preventDefault()
    clearError()

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

    if (!password) {
      setError(
        'Enter your password.',
      )
      return
    }

    setLoading(true)

    try {
      await signIn(
        cleanEmail,
        password,
      )

      navigate('/dashboard')
    } catch (error) {
      console.error(
        'Login failed:',
        error,
      )

      setError(
        error?.message ||
          'Could not log you in.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedBackground className="onboarding-page">
      <style>
        {`
          .dino-login-page {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
          }

          .dino-login-card {
            width: 100%;
            box-sizing: border-box;
            padding: 36px;
            border: 1px solid rgba(255,255,255,.55);
            border-radius: 24px;
            background:
              linear-gradient(
                145deg,
                rgba(255,255,255,.58),
                rgba(255,255,255,.24)
              );
            backdrop-filter: blur(24px) saturate(140%);
            -webkit-backdrop-filter: blur(24px) saturate(140%);
            box-shadow:
              0 24px 70px rgba(0,0,0,.08),
              inset 0 1px 0 rgba(255,255,255,.7),
              inset 0 0 0 1px rgba(255,255,255,.16);
          }

          .dino-login-kicker {
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

          .dino-login-title {
            margin: 0;
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: clamp(42px, 7vw, 58px);
            font-weight: 600;
            line-height: .92;
            letter-spacing: -.085em;
          }

          .dino-login-title span {
            font-style: italic;
          }

          .dino-login-description {
            max-width: 400px;
            margin: 13px 0 28px;
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.55;
          }

          .dino-login-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .dino-login-field {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .dino-login-label {
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 600;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: .025em;
          }

          .dino-login-input {
            width: 100%;
            height: 54px;
            box-sizing: border-box;
            padding: 0 16px;
            border: 1px solid rgba(255,255,255,.6);
            border-radius: 14px;
            outline: none;
            background: rgba(255,255,255,.38);
            color: #000000;
            -webkit-text-fill-color: #000000;
            font-family: Inter, sans-serif;
            font-size: 13px;
            font-weight: 500;
            line-height: 1;
            letter-spacing: -.015em;
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.65),
              0 4px 16px rgba(0,0,0,.025);
            transition:
              border-color .16s ease,
              box-shadow .16s ease,
              background .16s ease;
          }

          .dino-login-input::placeholder {
            color: #a0a0a0;
            -webkit-text-fill-color: #a0a0a0;
            font-family: Inter, sans-serif;
            font-weight: 400;
          }

          .dino-login-input:focus {
            border-color: rgba(0,0,0,.18);
            background: rgba(255,255,255,.62);
            box-shadow:
              0 0 0 3px rgba(255,255,255,.28),
              inset 0 1px 0 rgba(255,255,255,.75);
          }

          .dino-login-input:-webkit-autofill,
          .dino-login-input:-webkit-autofill:hover,
          .dino-login-input:-webkit-autofill:focus {
            -webkit-text-fill-color: #000000;
            box-shadow:
              0 0 0 1000px rgba(255,255,255,.55) inset,
              inset 0 1px 0 rgba(255,255,255,.7);
            font-family: Inter, sans-serif;
          }

          .dino-login-error {
            padding: 12px 14px;
            border: 1px solid rgba(255,100,100,.15);
            border-radius: 12px;
            background: rgba(255,100,100,.06);
            color: #8c4747;
            font-family: Inter, sans-serif;
            font-size: 10px;
            line-height: 1.5;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          .dino-login-submit {
            width: 100%;
            height: 54px;
            margin-top: 2px;
            border: 0;
            border-radius: 14px;
            background: rgba(10,10,10,.88);
            color: #ffffff;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: -.01em;
            cursor: pointer;
            box-shadow:
              0 10px 24px rgba(0,0,0,.08),
              inset 0 1px 0 rgba(255,255,255,.12);
            transition:
              transform .16s ease,
              opacity .16s ease,
              background .16s ease;
          }

          .dino-login-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            background: rgba(10,10,10,.94);
          }

          .dino-login-submit:active:not(:disabled) {
            transform: translateY(0);
          }

          .dino-login-submit:disabled {
            opacity: .45;
            cursor: not-allowed;
          }

          .dino-create-account {
            width: 100%;
            margin-top: 22px;
            padding-top: 17px;
            border: 0;
            border-top: 1px solid rgba(255,255,255,.45);
            background: transparent;
            color: #888;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 400;
            cursor: pointer;
          }

          .dino-create-account span {
            color: #0a0a0a;
            font-weight: 600;
          }

          .dino-create-account:hover {
            color: #666;
          }

          .dino-back-home {
            width: 100%;
            margin-top: 13px;
            border: 0;
            background: transparent;
            color: #aaa;
            font-family: Inter, sans-serif;
            font-size: 9px;
            cursor: pointer;
          }

          .dino-back-home:hover {
            color: #777;
          }

          @media (max-width: 600px) {
            .dino-login-card {
              padding: 25px;
            }
          }
        `}
      </style>

      <div className="onboarding-wrapper">
        <div className="onboarding-header">
        </div>

        <div
          className="onboarding-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight:
              'calc(100vh - 180px)',
          }}
        >
          <div className="dino-login-page">
            <div className="dino-login-card">
              <span className="dino-login-kicker">
                Welcome back
              </span>

              <h1 className="dino-login-title">
                Log back
                <span> in.</span>
              </h1>

              <p className="dino-login-description">
                Sign in to continue to
                your Dino Language B
                workspace.
              </p>

              <form
                className="dino-login-form"
                onSubmit={
                  handleLogin
                }
              >
                <div className="dino-login-field">
                  <label
                    className="dino-login-label"
                    htmlFor="dino-login-email"
                  >
                    Email
                  </label>

                  <input
                    id="dino-login-email"
                    className="dino-login-input"
                    type="email"
                    value={email}
                    onChange={(
                      event,
                    ) => {
                      setEmail(
                        event.target.value,
                      )
                      clearError()
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <div className="dino-login-field">
                  <label
                    className="dino-login-label"
                    htmlFor="dino-login-password"
                  >
                    Password
                  </label>

                  <input
                    id="dino-login-password"
                    className="dino-login-input"
                    type="password"
                    value={password}
                    onChange={(
                      event,
                    ) => {
                      setPassword(
                        event.target.value,
                      )
                      clearError()
                    }}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div className="dino-login-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="dino-login-submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Logging in…'
                    : 'Log in'}
                </button>
              </form>

              <button
                type="button"
                className="dino-create-account"
                onClick={() =>
                  navigate(
                    '/get-started.jsx',
                  )
                }
              >
                Don't have an account?
                <span>
                  {' '}
                  Create one
                </span>
              </button>

              <button
                type="button"
                className="dino-back-home"
                onClick={() =>
                  navigate('/')
                }
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default Login