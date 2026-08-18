import { useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'

function Upgrade({ navigate }) {
  const [showTransaction, setShowTransaction] =
    useState(false)

  return (
    <AnimatedBackground className="onboarding-page">
      <style>
        {`
          .dino-upgrade-page {
            width: 100%;
            max-width: 540px;
            margin: 0 auto;
          }

          .dino-upgrade-card {
            width: 100%;
            box-sizing: border-box;
            padding: 36px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 22px;
            background: rgba(255,255,255,.78);
            backdrop-filter: blur(18px);
            box-shadow: 0 22px 60px rgba(0,0,0,.055);
            position: relative;
            overflow: hidden;
          }

          .dino-upgrade-card::before {
            content: '';
            position: absolute;
            top: -120px;
            right: -100px;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            background:
              radial-gradient(
                circle,
                rgba(225,180,55,.25) 0%,
                rgba(225,180,55,.08) 42%,
                transparent 72%
              );
            pointer-events: none;
          }

          .dino-upgrade-card::after {
            content: '';
            position: absolute;
            bottom: -130px;
            left: -110px;
            width: 240px;
            height: 240px;
            border-radius: 50%;
            background:
              radial-gradient(
                circle,
                rgba(225,180,55,.13) 0%,
                transparent 70%
              );
            pointer-events: none;
          }

          .dino-upgrade-kicker {
            display: block;
            margin-bottom: 9px;
            color: #a07b25;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 700;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: .06em;
          }

          .dino-upgrade-title {
            margin: 0;
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: clamp(42px, 7vw, 60px);
            font-weight: 600;
            line-height: .92;
            letter-spacing: -.085em;
            position: relative;
            z-index: 1;
          }

          .dino-upgrade-title span {
            font-style: italic;
            background:
              linear-gradient(
                135deg,
                #8d691c 0%,
                #c79627 35%,
                #f0cd67 58%,
                #9e761e 100%
              );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .dino-upgrade-description {
            max-width: 430px;
            margin: 13px 0 25px;
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.55;
            position: relative;
            z-index: 1;
          }

          .dino-gold-box {
            width: 100%;
            box-sizing: border-box;
            padding: 20px;
            margin-bottom: 16px;
            border: 1px solid rgba(193,149,43,.22);
            border-radius: 17px;
            background:
              linear-gradient(
                135deg,
                rgba(255,248,223,.84),
                rgba(248,236,197,.72)
              );
            position: relative;
            z-index: 1;
          }

          .dino-gold-box-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 17px;
          }

          .dino-gold-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 74px;
            height: 25px;
            padding: 0 10px;
            box-sizing: border-box;
            border-radius: 999px;
            border: 1px solid rgba(177,132,24,.22);
            background: rgba(255,255,255,.55);
            color: #8e681b;
            font-family: Inter, sans-serif;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .06em;
          }

          .dino-gold-price {
            color: #8b681d;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .03em;
          }

          .dino-credit-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .dino-credit-item {
            min-width: 0;
            padding: 14px;
            border-radius: 13px;
            background: rgba(255,255,255,.6);
            border: 1px solid rgba(0,0,0,.045);
          }

          .dino-credit-label {
            margin-bottom: 7px;
            color: #999;
            font-family: Inter, sans-serif;
            font-size: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: .035em;
          }

          .dino-credit-number {
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: 27px;
            font-weight: 600;
            line-height: 1;
            letter-spacing: -.06em;
          }

          .dino-credit-number.gold {
            color: #a2741e;
          }

          .dino-credit-sub {
            margin-top: 5px;
            color: #999;
            font-family: Inter, sans-serif;
            font-size: 8px;
            line-height: 1.3;
          }

          .dino-benefits {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 9px;
            margin: 17px 0 20px;
            position: relative;
            z-index: 1;
          }

          .dino-benefit {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #555;
            font-family: Inter, sans-serif;
            font-size: 10px;
            line-height: 1.35;
          }

          .dino-benefit-dot {
            flex: 0 0 auto;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #c69a32;
            box-shadow: 0 0 0 4px rgba(198,154,50,.09);
          }

          .dino-upgrade-button {
            width: 100%;
            height: 54px;
            margin-top: 2px;
            border: 0;
            border-radius: 14px;
            background:
              linear-gradient(
                135deg,
                #111111 0%,
                #24211b 42%,
                #8c681f 100%
              );
            color: #ffffff;
            font-family: Inter, sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: -.01em;
            cursor: pointer;
            transition:
              transform .16s ease,
              box-shadow .16s ease,
              opacity .16s ease;
            position: relative;
            z-index: 1;
            box-shadow:
              0 12px 25px rgba(157,116,31,.14);
          }

          .dino-upgrade-button:hover {
            transform: translateY(-1px);
            box-shadow:
              0 15px 30px rgba(157,116,31,.2);
          }

          .dino-upgrade-button:active {
            transform: translateY(0);
          }

          .dino-secure-note {
            margin-top: 11px;
            color: #aaa;
            font-family: Inter, sans-serif;
            font-size: 8px;
            text-align: center;
            line-height: 1.45;
            position: relative;
            z-index: 1;
          }

          .dino-upgrade-back {
            width: 100%;
            margin-top: 18px;
            border: 0;
            background: transparent;
            color: #aaa;
            font-family: Inter, sans-serif;
            font-size: 9px;
            cursor: pointer;
          }

          .dino-upgrade-back:hover {
            color: #777;
          }

          .dino-transaction-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            background: rgba(0,0,0,.28);
            backdrop-filter: blur(8px);
            z-index: 9999;
          }

          .dino-transaction-modal {
            width: 100%;
            max-width: 390px;
            box-sizing: border-box;
            padding: 27px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 20px;
            background: rgba(255,255,255,.95);
            box-shadow: 0 30px 80px rgba(0,0,0,.2);
          }

          .dino-transaction-kicker {
            display: block;
            margin-bottom: 9px;
            color: #a07b25;
            font-family: Inter, sans-serif;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .05em;
          }

          .dino-transaction-title {
            margin: 0;
            color: #0a0a0a;
            font-family: Inter, sans-serif;
            font-size: 30px;
            font-weight: 600;
            line-height: .98;
            letter-spacing: -.065em;
          }

          .dino-transaction-text {
            margin: 12px 0 18px;
            color: #777;
            font-family: Inter, sans-serif;
            font-size: 10px;
            line-height: 1.5;
          }

          .dino-placeholder-payment {
            width: 100%;
            box-sizing: border-box;
            padding: 16px;
            margin-bottom: 14px;
            border: 1px dashed rgba(0,0,0,.14);
            border-radius: 14px;
            background: #fafafa;
          }

          .dino-placeholder-line {
            height: 10px;
            margin-bottom: 8px;
            border-radius: 999px;
            background: #e9e9e9;
          }

          .dino-placeholder-line:last-child {
            width: 58%;
            margin-bottom: 0;
          }

          .dino-modal-button {
            width: 100%;
            height: 48px;
            border: 0;
            border-radius: 13px;
            background: #0a0a0a;
            color: #fff;
            font-family: Inter, sans-serif;
            font-size: 10px;
            font-weight: 600;
            cursor: pointer;
          }

          @media (max-width: 600px) {
            .dino-upgrade-card {
              padding: 25px;
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

              <span className="dino-upgrade-kicker">
                Dino Gold
              </span>

              <h1 className="dino-upgrade-title">
                Go <span>gold.</span>
              </h1>

              <p className="dino-upgrade-description">
                Give your Dino account a serious upgrade.
                Get 50 Dino Points every day instead of
                5, giving you 10× more daily generation
                power for reading questions and writing practice.
              </p>

              <div className="dino-gold-box">
                <div className="dino-gold-box-top">
                  <span className="dino-gold-badge">
                    Gold
                  </span>

                  <span className="dino-gold-price">
                    Payment placeholder
                  </span>
                </div>

                <div className="dino-credit-comparison">
                  <div className="dino-credit-item">
                    <div className="dino-credit-label">
                      Free
                    </div>

                    <div className="dino-credit-number">
                      5
                    </div>

                    <div className="dino-credit-sub">
                      Dino Points daily
                    </div>
                  </div>

                  <div className="dino-credit-item">
                    <div className="dino-credit-label">
                      Gold
                    </div>

                    <div className="dino-credit-number gold">
                      50
                    </div>

                    <div className="dino-credit-sub">
                      Dino Points daily
                    </div>
                  </div>
                </div>
              </div>

              <div className="dino-benefits">
                <div className="dino-benefit">
                  <span className="dino-benefit-dot" />
                  50 Dino Points added every 24 hours
                </div>

                <div className="dino-benefit">
                  <span className="dino-benefit-dot" />
                  10× the daily credits of the free plan
                </div>

                <div className="dino-benefit">
                  <span className="dino-benefit-dot" />
                  More reading question generation
                </div>

                <div className="dino-benefit">
                  <span className="dino-benefit-dot" />
                  More writing prompt generation
                </div>

                <div className="dino-benefit">
                  <span className="dino-benefit-dot" />
                  Gold access placeholder for future features
                </div>
              </div>

              <button
                type="button"
                className="dino-upgrade-button"
                onClick={() =>
                  setShowTransaction(true)
                }
              >
                Upgrade to Gold
              </button>

              <div className="dino-secure-note">
                Transaction system coming soon. This button
                currently opens a payment placeholder.
              </div>

              <button
                type="button"
                className="dino-upgrade-back"
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

      {showTransaction && (
        <div
          className="dino-transaction-overlay"
          onClick={() =>
            setShowTransaction(false)
          }
        >
          <div
            className="dino-transaction-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <span className="dino-transaction-kicker">
              Gold checkout
            </span>

            <h2 className="dino-transaction-title">
              Payment is not live yet.
            </h2>

            <p className="dino-transaction-text">
              This is a placeholder transaction screen
              for Dino Gold. Once payments are connected,
              this area can be replaced with your real
              checkout flow.
            </p>

            <div className="dino-placeholder-payment">
              <div className="dino-placeholder-line" />
              <div className="dino-placeholder-line" />
              <div className="dino-placeholder-line" />
            </div>

            <button
              type="button"
              className="dino-modal-button"
              onClick={() =>
                setShowTransaction(false)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AnimatedBackground>
  )
}

export default Upgrade