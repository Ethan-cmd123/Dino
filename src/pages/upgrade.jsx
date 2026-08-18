import { useEffect, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'
import {
  createCheckoutSession,
  getCheckoutSession,
} from '../api/payment'

function Upgrade({ navigate }) {
  const [isProcessingPayment, setIsProcessingPayment] =
    useState(false)

  const [paymentError, setPaymentError] =
    useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get('payment')
    const sessionId = params.get('session_id')

    if (paymentStatus !== 'success' || !sessionId) {
      return
    }

    let cancelled = false

    const verifyPayment = async () => {
      try {
        const session = await getCheckoutSession(sessionId)

        if (cancelled) {
          return
        }

        console.log('[Dino Stripe] Checkout completed', {
          sessionId: session?.id,
          status: session?.status,
          paymentStatus: session?.payment_status,
          amountTotal: session?.amount_total,
          currency: session?.currency,
          mode: session?.mode,
          customer: session?.customer,
          subscription: session?.subscription,
          paymentIntent: session?.payment_intent,
          livemode: session?.livemode,
          metadata: session?.metadata,
          rawSession: session,
        })

        navigate('/dashboard')
      } catch (error) {
        console.error(
          '[Dino Stripe] Failed to verify checkout session',
          error,
        )

        if (!cancelled) {
          setPaymentError(
            error instanceof Error
              ? error.message
              : 'Unable to verify the payment.',
          )
        }
      }
    }

    verifyPayment()

    return () => {
      cancelled = true
    }
  }, [navigate])

  const handleUpgrade = async () => {
    if (isProcessingPayment) {
      return
    }

    setPaymentError('')
    setIsProcessingPayment(true)

    try {
      const { url, sessionId } =
        await createCheckoutSession()

      console.log(
        '[Dino Stripe] Checkout Session created',
        {
          sessionId,
          url,
        },
      )

      window.location.href = url
    } catch (error) {
      console.error(
        '[Dino Stripe] Checkout failed',
        error,
      )

      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Unable to open Stripe Checkout.',
      )

      setIsProcessingPayment(false)
    }
  }

  return (
    <AnimatedBackground className="onboarding-page">
      <style>
        {`
          .dino-upgrade-page {
            width: 100%;
            max-width: 720px;
            margin: 0 auto;
          }

          .dino-upgrade-card {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding: 42px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.07);
            overflow: hidden;
          }

          .dino-upgrade-card::before {
            content: "";
            position: absolute;
            top: -110px;
            right: -110px;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background:
              radial-gradient(
                circle,
                rgba(255, 214, 89, 0.28) 0%,
                rgba(255, 214, 89, 0.11) 38%,
                transparent 72%
              );
            pointer-events: none;
          }

          .dino-upgrade-card::after {
            content: "";
            position: absolute;
            left: -120px;
            bottom: -130px;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background:
              radial-gradient(
                circle,
                rgba(230, 182, 50, 0.12) 0%,
                transparent 72%
              );
            pointer-events: none;
          }

          .dino-upgrade-content {
            position: relative;
            z-index: 2;
          }

          .dino-upgrade-kicker {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 12px;
            padding: 6px 10px;
            border: 1px solid rgba(218, 169, 39, 0.24);
            border-radius: 999px;
            background: rgba(255, 244, 176, 0.42);
            color: #8f681d;
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 800;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: 0.07em;
          }

          .dino-upgrade-kicker::before {
            content: "✦";
            font-size: 10px;
          }

          .dino-upgrade-title {
            margin: 0;
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: clamp(44px, 7vw, 66px);
            font-weight: 600;
            line-height: 0.91;
            letter-spacing: -0.085em;
          }

          .dino-upgrade-title span {
            font-style: italic;
            background:
              linear-gradient(
                135deg,
                #fff3a6 0%,
                #f5d35b 24%,
                #c89220 48%,
                #f2cf57 72%,
                #fff0a1 100%
              );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(
              0 2px 10px rgba(213, 165, 39, 0.13)
            );
          }

          .dino-upgrade-description {
            max-width: 560px;
            margin: 16px 0 28px;
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.6;
          }

          .dino-gold-plan {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding: 22px;
            border: 1px solid rgba(255, 215, 90, 0.62);
            border-radius: 18px;
            background:
              linear-gradient(
                135deg,
                rgba(255, 248, 207, 0.88) 0%,
                rgba(251, 229, 139, 0.78) 30%,
                rgba(232, 193, 71, 0.76) 52%,
                rgba(251, 230, 144, 0.8) 75%,
                rgba(255, 248, 207, 0.88) 100%
              );
            box-shadow:
              0 0 0 1px rgba(255, 215, 90, 0.12),
              0 10px 28px rgba(218, 168, 37, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.82);
            overflow: hidden;
          }

          .dino-gold-plan-top {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 20px;
          }

          .dino-gold-plan-title {
            margin: 0;
            color: #4f3300;
            font-family: Inter, sans-serif;
            font-size: 22px;
            font-weight: 800;
            line-height: 1;
            letter-spacing: -0.045em;
          }

          .dino-gold-plan-subtitle {
            margin-top: 7px;
            color: rgba(79, 51, 0, 0.67);
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 500;
            line-height: 1.45;
          }

          .dino-gold-plan-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 72px;
            height: 28px;
            padding: 0 11px;
            box-sizing: border-box;
            border: 1px solid rgba(124, 83, 4, 0.17);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.38);
            color: #694600;
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .dino-credit-hero {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: flex-end;
            gap: 10px;
            margin-bottom: 8px;
          }

          .dino-credit-amount {
            color: #4d3100;
            font-family: Inter, sans-serif;
            font-size: clamp(48px, 8vw, 66px);
            font-weight: 800;
            line-height: 0.85;
            letter-spacing: -0.095em;
          }

          .dino-credit-unit {
            padding-bottom: 5px;
            color: rgba(79, 51, 0, 0.7);
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 700;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .dino-credit-frequency {
            position: relative;
            z-index: 2;
            color: rgba(79, 51, 0, 0.68);
            font-family: Inter, sans-serif;
            font-size: 9px;
            line-height: 1.45;
          }

          .dino-comparison {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
          }

          .dino-comparison-box {
            box-sizing: border-box;
            padding: 13px 14px;
            border: 1px solid rgba(0, 0, 0, 0.07);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.45);
          }

          .dino-comparison-label {
            margin-bottom: 6px;
            color: rgba(79, 51, 0, 0.52);
            font-family: Inter, sans-serif;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.035em;
          }

          .dino-comparison-number {
            color: #4f3300;
            font-family: Inter, sans-serif;
            font-size: 23px;
            font-weight: 800;
            line-height: 1;
            letter-spacing: -0.055em;
          }

          .dino-comparison-note {
            margin-top: 5px;
            color: rgba(79, 51, 0, 0.56);
            font-family: Inter, sans-serif;
            font-size: 8px;
            line-height: 1.35;
          }

          .dino-benefits {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
            margin: 18px 0 20px;
          }

          .dino-benefit {
            display: flex;
            align-items: center;
            gap: 9px;
            min-width: 0;
            color: #575757;
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 500;
            line-height: 1.4;
          }

          .dino-benefit-icon {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 6px;
            background: rgba(238, 195, 74, 0.14);
            color: #b08019;
            font-size: 8px;
            font-weight: 800;
          }

          .dino-main-button {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 54px;
            border: 1px solid rgba(255, 215, 90, 0.65);
            border-radius: 12px;
            background:
              linear-gradient(
                135deg,
                #fff4b0 0%,
                #f7d65a 25%,
                #d9a928 50%,
                #f6d96a 75%,
                #fff1a3 100%
              );
            color: #5a3b00;
            font-family: Inter, sans-serif;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: -0.2px;
            cursor: pointer;
            box-shadow:
              0 0 0 1px rgba(255, 215, 90, 0.15),
              0 6px 18px rgba(218, 168, 37, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.75);
            overflow: hidden;
            transition:
              transform 0.18s ease,
              box-shadow 0.18s ease,
              filter 0.18s ease;
          }

          .dino-main-button::before {
            content: "";
            position: absolute;
            top: -40%;
            left: -90%;
            width: 55%;
            height: 180%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.78),
              transparent
            );
            transform: rotate(20deg);
            animation: dino-gold-shine 2.8s ease-in-out infinite;
            pointer-events: none;
          }

          .dino-main-button::after {
            content: "✦";
            position: absolute;
            top: 7px;
            right: 11px;
            font-size: 9px;
            color: rgba(255, 255, 255, 0.9);
            animation: dino-gold-sparkle 1.5s ease-in-out infinite;
            pointer-events: none;
          }

          .dino-main-button:hover {
            transform: translateY(-1px);
            filter: brightness(1.06);
            box-shadow:
              0 0 0 1px rgba(255, 215, 90, 0.25),
              0 9px 24px rgba(218, 168, 37, 0.4),
              0 0 18px rgba(255, 215, 90, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
          }

          .dino-main-button:active {
            transform: translateY(0);
          }

          .dino-main-button:disabled {
            cursor: not-allowed;
            opacity: 0.72;
          }

          .dino-payment-note {
            margin-top: 10px;
            color: #aaa;
            font-family: Inter, sans-serif;
            font-size: 8px;
            line-height: 1.45;
            text-align: center;
          }

          .dino-payment-error {
            margin-top: 9px;
            padding: 10px 12px;
            border: 1px solid rgba(180, 50, 50, 0.14);
            border-radius: 10px;
            background: rgba(180, 50, 50, 0.05);
            color: #9a4d4d;
            font-family: Inter, sans-serif;
            font-size: 8px;
            line-height: 1.45;
            text-align: center;
          }

          .dino-back-button {
            display: block;
            width: 100%;
            margin-top: 17px;
            border: 0;
            background: transparent;
            color: #aaa;
            font-family: Inter, sans-serif;
            font-size: 9px;
            cursor: pointer;
            transition: color 0.16s ease;
          }

          .dino-back-button:hover {
            color: #777;
          }

          @keyframes dino-gold-shine {
            0% {
              left: -90%;
            }

            45%,
            100% {
              left: 140%;
            }
          }

          @keyframes dino-gold-sparkle {
            0%,
            100% {
              opacity: 0.35;
              transform: scale(0.85) rotate(0deg);
            }

            50% {
              opacity: 1;
              transform: scale(1.15) rotate(20deg);
            }
          }

          @media (max-width: 700px) {
            .dino-upgrade-card {
              padding: 27px;
            }

            .dino-benefits {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 500px) {
            .dino-upgrade-card {
              padding: 22px;
              border-radius: 20px;
            }

            .dino-gold-plan {
              padding: 18px;
            }

            .dino-gold-plan-top {
              align-items: flex-start;
            }

            .dino-comparison {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="onboarding-wrapper">
        <div className="onboarding-header"></div>

        <div
          className="onboarding-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 180px)',
          }}
        >
          <div className="dino-upgrade-page">
            <div className="dino-upgrade-card">
              <div className="dino-upgrade-content">

                <div className="dino-upgrade-kicker">
                  Dino Gold
                </div>

                <h1 className="dino-upgrade-title">
                  Go <span>gold.</span>
                </h1>

                <p className="dino-upgrade-description">
                  Unlock 50 Dino Points every 24 hours,
                  giving you 10× more daily credits than
                  the standard 5-credit allowance.
                </p>

                <div className="dino-gold-plan">
                  <div className="dino-gold-plan-top">
                    <div>
                      <h2 className="dino-gold-plan-title">
                        Gold
                      </h2>

                      <div className="dino-gold-plan-subtitle">
                        More credits. More generation.
                        Less waiting for humanity's favourite
                        education app to run out of tokens.
                      </div>
                    </div>

                    <div className="dino-gold-plan-badge">
                      10× more
                    </div>
                  </div>

                  <div className="dino-credit-hero">
                    <div className="dino-credit-amount">
                      50
                    </div>

                    <div className="dino-credit-unit">
                      Dino Points
                      <br />
                      every day
                    </div>
                  </div>

                  <div className="dino-credit-frequency">
                    Automatically replenished every 24 hours.
                  </div>

                  <div className="dino-comparison">
                    <div className="dino-comparison-box">
                      <div className="dino-comparison-label">
                        Free
                      </div>

                      <div className="dino-comparison-number">
                        5
                      </div>

                      <div className="dino-comparison-note">
                        Dino Points per day
                      </div>
                    </div>

                    <div className="dino-comparison-box">
                      <div className="dino-comparison-label">
                        Gold
                      </div>

                      <div className="dino-comparison-number">
                        50
                      </div>

                      <div className="dino-comparison-note">
                        Dino Points per day
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dino-benefits">
                  <div className="dino-benefit">
                    <span className="dino-benefit-icon">
                      ✓
                    </span>
                    50 Dino Points every 24 hours
                  </div>

                  <div className="dino-benefit">
                    <span className="dino-benefit-icon">
                      ✦
                    </span>
                    10× the daily credits
                  </div>

                  <div className="dino-benefit">
                    <span className="dino-benefit-icon">
                      +
                    </span>
                    More reading question generation
                  </div>

                  <div className="dino-benefit">
                    <span className="dino-benefit-icon">
                      +
                    </span>
                    More writing prompt generation
                  </div>
                </div>

                <button
                  type="button"
                  className="dino-main-button"
                  onClick={handleUpgrade}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment
                    ? 'Opening secure checkout…'
                    : 'Upgrade to Gold'}
                </button>

                <div className="dino-payment-note">
                  Secure Stripe Checkout test mode. Use Stripe test cards while sandboxing.
                </div>

                {paymentError && (
                  <div className="dino-payment-error">
                    {paymentError}
                  </div>
                )}

                <button
                  type="button"
                  className="dino-back-button"
                  onClick={() =>
                    navigate('/dashboard')
                  }
                >
                  Back to dashboard
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

    </AnimatedBackground>
  )
}

export default Upgrade
