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
        x: random(0, Math.max(20, window.innerWidth - size)),
        y: 0,
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

        dragging: false,
        pointerId: null,
        dragOffsetX: 0,
        dragOffsetY: 0,
        lastPointerX: 0,
        lastPointerY: 0,
        lastPointerTime: 0,
        velocityX: 0,
        velocityY: 0,
        throwRotation: 0,
        throwRotationVelocity: 0,
      }

      element.style.width = `${size}px`

      const wobble = () => {
        element.animate(
          [
            {
              transform: `translate3d(${dino.x}px, ${-dino.y}px, 0) rotate(-7deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
            {
              transform: `translate3d(${dino.x}px, ${-dino.y}px, 0) rotate(7deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
            {
              transform: `translate3d(${dino.x}px, ${-dino.y}px, 0) rotate(-5deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
          ],
          {
            duration: 260,
            easing: 'ease-in-out',
          },
        )
      }

      const onPointerDown = (event) => {
        event.preventDefault()
        event.stopPropagation()

        dino.dragging = true
        dino.pointerId = event.pointerId
        dino.state = 'dragging'
        dino.hopStart = -1
        dino.velocityX = 0
        dino.velocityY = 0
        dino.throwRotationVelocity = 0

        const rect = element.getBoundingClientRect()

        dino.dragOffsetX =
          event.clientX -
          (rect.left + rect.width / 2)

        dino.dragOffsetY =
          event.clientY -
          (rect.top + rect.height / 2)

        dino.lastPointerX = event.clientX
        dino.lastPointerY = event.clientY
        dino.lastPointerTime = performance.now()

        element.style.cursor = 'grabbing'
        element.style.zIndex = '100'
        element.style.transition = 'none'

        try {
          element.setPointerCapture(event.pointerId)
        } catch {}

        wobble()
      }

      const onPointerMove = (event) => {
        if (
          !dino.dragging ||
          dino.pointerId !== event.pointerId
        ) {
          return
        }

        event.preventDefault()

        const now = performance.now()
        const dt = Math.max(
          8,
          now - dino.lastPointerTime,
        )

        const dx =
          event.clientX -
          dino.lastPointerX

        const dy =
          event.clientY -
          dino.lastPointerY

        dino.velocityX =
          (dx / dt) * 1000

        dino.velocityY =
          (dy / dt) * 1000

        dino.x =
          event.clientX -
          dino.dragOffsetX -
          dino.size / 2

        dino.y =
          window.innerHeight -
          (event.clientY -
            dino.dragOffsetY +
            dino.size / 2)

        dino.lastPointerX = event.clientX
        dino.lastPointerY = event.clientY
        dino.lastPointerTime = now

        const rotation =
          Math.max(
            -28,
            Math.min(
              28,
              dino.velocityX * 0.035,
            ),
          )

        dino.throwRotation = rotation

        element.style.transform =
          `translate3d(${dino.x}px, ${-dino.y}px, 0) rotate(${rotation}deg) scaleX(${dino.direction === -1 ? 1 : -1})`
      }

      const releaseDino = (event) => {
        if (
          !dino.dragging ||
          dino.pointerId !== event.pointerId
        ) {
          return
        }

        dino.dragging = false
        dino.pointerId = null
        dino.state = 'thrown'

        dino.x = Math.max(
          -dino.size * 0.5,
          Math.min(
            window.innerWidth -
              dino.size * 0.5,
            dino.x,
          ),
        )

        dino.y = Math.max(
          0,
          Math.min(
            window.innerHeight -
              dino.size,
            dino.y,
          ),
        )

        dino.velocityX = Math.max(
          -1600,
          Math.min(1600, dino.velocityX),
        )

        dino.velocityY = Math.max(
          -1800,
          Math.min(1800, -dino.velocityY),
        )

        dino.throwRotationVelocity =
          dino.velocityX * 0.11

        element.style.cursor = 'grab'
        element.style.zIndex = '20'

        try {
          element.releasePointerCapture(event.pointerId)
        } catch {}

        wobble()

        setTimeout(() => {
          if (!dino.dragging) {
            element.style.zIndex = '20'
          }
        }, 120)
      }

      element.addEventListener(
        'pointerdown',
        onPointerDown,
      )

      element.addEventListener(
        'pointermove',
        onPointerMove,
      )

      element.addEventListener(
        'pointerup',
        releaseDino,
      )

      element.addEventListener(
        'pointercancel',
        releaseDino,
      )

      element.addEventListener(
        'lostpointercapture',
        (event) => {
          if (
            dino.dragging &&
            dino.pointerId === event.pointerId
          ) {
            dino.dragging = false
            dino.pointerId = null
            dino.state = 'thrown'
          }
        },
      )

      return {
        dino,
        cleanup: () => {
          element.removeEventListener(
            'pointerdown',
            onPointerDown,
          )
          element.removeEventListener(
            'pointermove',
            onPointerMove,
          )
          element.removeEventListener(
            'pointerup',
            releaseDino,
          )
          element.removeEventListener(
            'pointercancel',
            releaseDino,
          )
        },
      }
    }

    const cleanups = []

    for (let index = 0; index < dinoCount; index++) {
      const result = createDino(index)

      if (result) {
        dinos.push(result.dino)
        cleanups.push(result.cleanup)
      }
    }

    let animationFrame = 0
    let lastTime = performance.now()

    const animate = (now) => {
      const delta =
        Math.min(now - lastTime, 40) / 1000

      lastTime = now

      const width = window.innerWidth
      const height = window.innerHeight

      dinos.forEach((dino) => {
        if (!dino.element) {
          return
        }

        if (dino.dragging) {
          dino.element.style.transform =
            `translate3d(${dino.x}px, ${-dino.y}px, 0) rotate(${dino.throwRotation}deg) scaleX(${dino.direction === -1 ? 1 : -1})`

          return
        }

        if (dino.state === 'thrown') {
          const gravity = 1850

          dino.velocityY +=
            gravity * delta

          dino.x +=
            dino.velocityX * delta

          dino.y +=
            dino.velocityY * delta

          dino.throwRotation +=
            dino.throwRotationVelocity *
            delta

          dino.throwRotationVelocity *=
            Math.pow(0.985, delta * 60)

          const floorY = 16

          if (dino.y <= floorY) {
            dino.y = floorY

            if (
              Math.abs(dino.velocityY) >
              120
            ) {
              dino.velocityY *= -0.46
              dino.velocityX *= 0.84
              dino.throwRotationVelocity *=
                0.76
            } else {
              dino.velocityY = 0
              dino.velocityX *= 0.92
              dino.throwRotationVelocity *=
                0.9

              if (
                Math.abs(dino.velocityX) <
                  8 &&
                Math.abs(
                  dino.throwRotationVelocity,
                ) < 8
              ) {
                dino.state = 'walking'
                dino.nextDecision =
                  now + random(1200, 4000)
                dino.nextHop =
                  now + random(800, 3500)
              }
            }
          }

          const rightEdge =
            width - dino.size * 0.35

          const leftEdge =
            -dino.size * 0.65

          if (dino.x > rightEdge) {
            dino.x = rightEdge
            dino.velocityX *= -0.62
            dino.throwRotationVelocity *=
              -0.75
          }

          if (dino.x < leftEdge) {
            dino.x = leftEdge
            dino.velocityX *= -0.62
            dino.throwRotationVelocity *=
              -0.75
          }

          if (dino.y > height + dino.size) {
            dino.y = floorY
            dino.velocityY =
              -Math.abs(dino.velocityY) * 0.45
            dino.velocityX *= 0.8
          }

          dino.element.style.transform =
            `translate3d(${dino.x}px, ${-dino.y}px, 0) rotate(${dino.throwRotation}deg) scaleX(${dino.direction === -1 ? 1 : -1})`

          return
        }

        if (now >= dino.nextDecision) {
          const roll = Math.random()

          if (roll < 0.18) {
            dino.state = 'resting'
            dino.stateUntil =
              now + random(600, 2200)
          } else if (roll < 0.34) {
            dino.direction *= -1
            dino.state = 'walking'
            dino.stateUntil =
              now + random(1800, 6000)
          } else {
            dino.state = 'walking'
            dino.stateUntil =
              now + random(2000, 7000)
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
          dino.hopDuration =
            random(300, 520)
          dino.hopHeight =
            random(8, 22)

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

      cleanups.forEach((cleanup) => cleanup())
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
          pointer-events: auto;
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-drag: none;
          transform-origin: center bottom;
          will-change: transform;
        }

        .home-wandering-dino:active {
          cursor: grabbing;
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