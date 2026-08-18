import { useEffect, useRef } from 'react'
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

  const duplicatedGreetings = [
    ...greetings,
    ...greetings,
    ...greetings,
    ...greetings,
  ]

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

        @media (max-width: 700px) {
          .home-dino-world {
            height: 80px;
          }

          .home-wandering-dino {
            width: 40px;
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
          An AI-powered learning app built around reading, writing,
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