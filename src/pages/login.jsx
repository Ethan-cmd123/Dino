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
    async function checkSession() {
      try {
        const user =
          await getCurrentUser()

        if (user) {
          navigate('/dashboard')
        }
      } catch {
        // Ignore session check errors.
      }
    }

    checkSession()
  }, [navigate])

  async function handleLogin(event) {
    event.preventDefault()

    setError('')

    const cleanEmail =
      email.trim().toLowerCase()

    if (!cleanEmail) {
      setError(
        'Enter your email address.',
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
            max-width: 460px;
            margin: 0 auto;
          }

          .dino-login-card {
            width: 100%;
            padding: 34px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 22px;
            background: rgba(255,255,255,.80);
            backdrop-filter: blur(18px);
            box-shadow: 0 20px 60px rgba(0,0,0,.06);
          }

          .dino-login-brand {
            margin-bottom: 8px;
            color: #0a0a0a;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: -.03em;
          }

          .dino-login-title {
            margin: 0;
            color: #0a0a0a;
            font-size: 42px;
            line-height: .94;
            font-weight: 600;
            letter-spacing: -.075em;
          }

          .dino-login-title span {
            font-style: italic;
          }

          .dino-login-description {
            margin: 12px 0 27px;
            color: #777;
            font-size: 11px;
            line-height: 1.5;
          }

          .dino-login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .dino-login-field {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .dino-login-label {
            color: #777;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .dino-login-input {
            width: 100%;
            height: 52px;
            box-sizing: border-box;
            padding: 0 15px;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 13px;
            outline: none;
            background: rgba(255,255,255,.95);
            color: #000;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            transition:
              border-color .15s ease,
              box-shadow .15s ease;
          }

          .dino-login-input::placeholder {
            color: #aaa;
          }

          .dino-login-input:focus {
            border-color: rgba(0,0,0,.28);
            box-shadow: 0 0 0 3px rgba(0,0,0,.04);
          }

          .dino-login-button {
            width: 100%;
            height: 52px;
            margin-top: 4px;
            border: 0;
            border-radius: 13px;
            background: #0a0a0a;
            color: #fff;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition:
              transform .15s ease,
              opacity .15s ease;
          }

          .dino-login-button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .dino-login-button:disabled {
            opacity: .45;
            cursor: not-allowed;
          }

          .dino-login-error {
            padding: 11px 13px;
            border: 1px solid rgba(180,50,50,.13);
            border-radius: 11px;
            background: rgba(180,50,50,.05);
            color: #8c4444;
            font-size: 10px;
            line-height: 1.45;
          }

          .dino-create-account {
            width: 100%;
            margin-top: 20px;
            padding: 15px 0 0;
            border: 0;
            border-top: 1px solid rgba(0,0,0,.07);
            background: transparent;
            color: #777;
            font-family: inherit;
            font-size: 10px;
            cursor: pointer;
          }

          .dino-create-account span {
            color: #0a0a0a;
            font-weight: 700;
          }

          .dino-create-account:hover {
            color: #555;
          }

          @media (max-width: 600px) {
            .dino-login-card {
              padding: 25px;
            }

            .dino-login-title {
              font-size: 36px;
            }
          }
        `}
      </style>

      <div className="onboarding-wrapper">
        <div className="onboarding-header">
          <div className="onboarding-brand">
            Dino
          </div>
        </div>

        <div className="progress-line">
          <div
            className="progress-line-active"
            style={{
              width: '100%',
            }}
          />
        </div>

        <div
          className="onboarding-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight:
              'calc(100vh - 160px)',
          }}
        >
          <div className="dino-login-page">
            <div className="dino-login-card">
              <div className="dino-login-brand">
                Welcome back.
              </div>

              <h1 className="dino-login-title">
                Log back
                <span> in.</span>
              </h1>

              <p className="dino-login-description">
                Sign in to continue your
                Language B study workspace.
              </p>

              <form
                className="dino-login-form"
                onSubmit={handleLogin}
              >
                <div className="dino-login-field">
                  <label
                    className="dino-login-label"
                    htmlFor="login-email"
                  >
                    Email
                  </label>

                  <input
                    id="login-email"
                    className="dino-login-input"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value,
                      )
                      setError('')
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="dino-login-field">
                  <label
                    className="dino-login-label"
                    htmlFor="login-password"
                  >
                    Password
                  </label>

                  <input
                    id="login-password"
                    className="dino-login-input"
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value,
                      )
                      setError('')
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
                  className="dino-login-button"
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
                  navigate('/get-started.jsx')
                }
              >
                Don't have an account?
                <span>
                  {' '}
                  Create one
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default Login