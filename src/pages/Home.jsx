import { useEffect, useRef, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'

const greetings = [
  'Hello',
  'Bonjour',
  '你好',
  'Hola',
  'Ciao',
  'Hallo',
  'Olá',
  'こんにちは',
  '안녕하세요',
  'Привет',
  'مرحبا',
  'Hej',
  'Salut',
  'Merhaba',
  'שלום',
  'नमस्ते',
  'สวัสดี',
  'Xin chào',
  'Halo',
  'Hei',
]

function Home({ navigate }) {
  const dinoRefs = useRef([])
  const [showScrollCard, setShowScrollCard] = useState(false)
  const scrollTimeoutRef = useRef(null)

  const duplicatedGreetings = [
    ...greetings,
    ...greetings,
    ...greetings,
    ...greetings,
  ]

  useEffect(() => {
    const showCard = () => {
      setShowScrollCard(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setShowScrollCard(false)
      }, 7000)
    }

    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        showCard()
      }
    }

    const handleTouchMove = () => {
      showCard()
    }

    const handleKeyDown = (event) => {
      const scrollKeys = [
        'ArrowDown',
        'PageDown',
        ' ',
        'End',
      ]

      if (scrollKeys.includes(event.key)) {
        showCard()
      }
    }

    window.addEventListener('wheel', handleWheel, {
      passive: true,
      capture: true,
    })

    window.addEventListener('touchmove', handleTouchMove, {
      passive: true,
      capture: true,
    })

    window.addEventListener('keydown', handleKeyDown, {
      capture: true,
    })

    return () => {
      window.removeEventListener('wheel', handleWheel, {
        capture: true,
      })

      window.removeEventListener('touchmove', handleTouchMove, {
        capture: true,
      })

      window.removeEventListener('keydown', handleKeyDown, {
        capture: true,
      })

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const dinoCount = 7
    const dinos = []

    const random = (min, max) =>
      Math.random() * (max - min) + min

    const createDino = (index) => {
      const element = dinoRefs.current[index]

      if (!element) {
        return null
      }

      const size = random(32, 68)

      const dino = {
        element,
        x: random(-window.innerWidth, window.innerWidth),
        size,
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: random(18, 42),
        state: 'walking',
        stateUntil: performance.now() + random(1000, 4000),
        nextDecision: performance.now() + random(1500, 5000),
        hopStart: -1,
        hopDuration: random(350, 520),
        hopHeight: random(8, 20),
        nextHop: performance.now() + random(1000, 4500),
        bobSeed: random(0, Math.PI * 2),
      }

      element.style.width = `${size}px`

      return dino
    }

    for (let index = 0; index < dinoCount; index++) {
      const dino = createDino(index)

      if (dino) {
        dinos.push(dino)
      }
    }

    let animationFrame = 0
    let lastTime = performance.now()

    const animate = (now) => {
      const delta =
        Math.min(now - lastTime, 40) / 1000

      lastTime = now

      const width = window.innerWidth

      dinos.forEach((dino) => {
        if (!dino.element) {
          return
        }

        if (now >= dino.nextDecision) {
          const roll = Math.random()

          if (roll < 0.18) {
            dino.state = 'resting'
            dino.stateUntil = now + random(600, 2200)
          } else if (roll < 0.34) {
            dino.direction *= -1
            dino.state = 'walking'
            dino.stateUntil = now + random(1800, 6000)
          } else {
            dino.state = 'walking'
            dino.stateUntil = now + random(2000, 7000)
          }

          dino.nextDecision =
            now + random(1300, 4500)
        }

        if (now >= dino.stateUntil) {
          dino.state = 'walking'
        }

        if (
          dino.hopStart < 0 &&
          now >= dino.nextHop &&
          dino.state !== 'resting'
        ) {
          dino.hopStart = now
          dino.hopDuration = random(300, 520)
          dino.hopHeight = random(8, 22)
          dino.nextHop =
            now + random(1700, 5000)
        }

        if (dino.state === 'walking') {
          dino.x +=
            dino.speed *
            dino.direction *
            delta
        }

        let hopY = 0

        if (dino.hopStart >= 0) {
          const progress =
            (now - dino.hopStart) /
            dino.hopDuration

          if (progress >= 1) {
            dino.hopStart = -1
          } else {
            hopY =
              Math.sin(progress * Math.PI) *
              dino.hopHeight
          }
        }

        let bobY = 0

        if (dino.state === 'walking') {
          bobY =
            Math.sin(
              now * 0.018 +
                dino.bobSeed,
            ) * 1.4
        }

        let tilt = 0

        if (dino.state === 'walking') {
          tilt =
            Math.sin(
              now * 0.012 +
                dino.bobSeed,
            ) * 1.2
        }

        const scaleX =
          dino.direction === -1
            ? 1
            : -1

        dino.element.style.transform =
          `translate3d(${dino.x}px, ${-hopY - bobY}px, 0) rotate(${tilt}deg) scaleX(${scaleX})`

        const offscreenMargin =
          dino.size + 100

        if (
          dino.direction === 1 &&
          dino.x >
            width + offscreenMargin
        ) {
          dino.x =
            -random(80, 350)

          dino.direction = 1
          dino.state = 'walking'
          dino.nextDecision =
            now + random(1200, 4500)
        }

        if (
          dino.direction === -1 &&
          dino.x <
            -offscreenMargin
        ) {
          dino.x =
            width + random(80, 350)

          dino.direction = -1
          dino.state = 'walking'
          dino.nextDecision =
            now + random(1200, 4500)
        }
      })

      animationFrame =
        requestAnimationFrame(animate)
    }

    animationFrame =
      requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <AnimatedBackground className="home-page">
      <style>{`
        .home-dino-world {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 105px;
          pointer-events: none;
          z-index: 20;
          overflow: visible;
        }

        .home-wandering-dino {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 50px;
          height: auto;
          display: block;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          transform-origin: center bottom;
          will-change: transform;
        }

        .home-scroll-card {
          position: fixed;
          left: 50%;
          bottom: 24px;
          width: min(720px, calc(100vw - 32px));
          z-index: 999999;
          padding: 20px;
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.98),
              rgba(248, 255, 251, 0.96)
            );
          border: 1px solid rgba(0, 210, 106, 0.18);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.18),
            0 8px 30px rgba(0, 210, 106, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          opacity: 0;
          pointer-events: none;
          transform:
            translateX(-50%)
            translateY(140%);
          transition:
            opacity 0.4s ease,
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .home-scroll-card.visible {
          opacity: 1;
          pointer-events: auto;
          transform:
            translateX(-50%)
            translateY(0);
        }

        .home-scroll-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background:
            radial-gradient(
              circle at 5% 0%,
              rgba(0, 210, 106, 0.12),
              transparent 32%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(0, 210, 106, 0.08),
              transparent 30%
            );
        }

        .home-scroll-card-content {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .home-scroll-card-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: #00a957;
        }

        .home-scroll-card-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00d26a;
          box-shadow:
            0 0 0 4px rgba(0, 210, 106, 0.10),
            0 0 14px rgba(0, 210, 106, 0.45);
          flex: 0 0 auto;
        }

        .home-scroll-card-title {
          margin: 0;
          color: #0a0a0a;
          font-size: clamp(18px, 2vw, 24px);
          line-height: 1.12;
          font-weight: 800;
          letter-spacing: -0.035em;
        }

        .home-scroll-card-copy {
          margin: 7px 0 0;
          max-width: 560px;
          color: #5e645f;
          font-size: 14px;
          line-height: 1.5;
        }

        .home-scroll-card-action {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          border: 0;
          border-radius: 14px;
          padding: 13px 17px;
          background: #00d26a;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow:
            0 10px 24px rgba(0, 210, 106, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .home-scroll-card-action:hover {
          transform: translateY(-2px);
          background: #00c462;
          box-shadow:
            0 14px 28px rgba(0, 210, 106, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
        }

        .home-scroll-card-action:active {
          transform: translateY(0);
        }

        @media (max-width: 700px) {
          .home-dino-world {
            height: 80px;
          }

          .home-wandering-dino {
            width: 40px;
          }

          .home-scroll-card {
            bottom: 14px;
            width: calc(100vw - 20px);
            padding: 16px;
            border-radius: 20px;
            align-items: flex-end;
          }

          .home-scroll-card-copy {
            font-size: 13px;
          }

          .home-scroll-card-action {
            padding: 12px 14px;
            white-space: nowrap;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-scroll-card {
            transition: opacity 0.2s ease;
            transform: translateX(-50%);
          }

          .home-scroll-card.visible {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div
        className="home-dino-world"
        aria-hidden="true"
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <img
            key={index}
            ref={(element) => {
              dinoRefs.current[index] = element
            }}
            src="/assets/dino.png"
            alt=""
            className="home-wandering-dino"
          />
        ))}
      </div>

      <div
        className={`home-scroll-card ${
          showScrollCard ? 'visible' : ''
        }`}
      >
        <div className="home-scroll-card-content">
          <div className="home-scroll-card-eyebrow">
            <span className="home-scroll-card-eyebrow-dot" />
            Apparently, you kept scrolling
          </div>

          <h2 className="home-scroll-card-title">
            We could write a paragraph selling Dino to you...
          </h2>

          <p className="home-scroll-card-copy">
            But that feels a little backwards. Dino is built to be
            used, not explained to death on a landing page. Try it
            yourself and see what your IB Language B study could
            actually feel like.
          </p>
        </div>

        <button
          type="button"
          className="home-scroll-card-action"
          onClick={() => navigate('/get-started')}
        >
          Get started free →
        </button>
      </div>

      <div className="hero-content">
        <div className="greeting-mask">
          <div className="greeting-track">
            {duplicatedGreetings.map((greeting, index) => (
              <span
                className="greeting-item"
                key={`${greeting}-${index}`}
              >
                {greeting}
              </span>
            ))}
          </div>
        </div>

        <h1 className="hero-title">
          Learn IB Language B{' '}
          <span className="smarter">smarter</span>, not harder.
        </h1>

        <p className="hero-subtitle">
          A learning app built around reading, writing,
          vocabulary, and the skills you actually use in IB Language B.
        </p>

        <div className="cta-row">
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/get-started')}
          >
            Start Learning
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/testimonials')}
          >
            <span className="secondary-copy">
              <span className="secondary-title">
                Testimonials
              </span>

              <span className="secondary-meta">
                <span className="status-dot" />
                From IB students globally
              </span>
            </span>
          </button>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default Home