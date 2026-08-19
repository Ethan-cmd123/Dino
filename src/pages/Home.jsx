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
    const cleanupFunctions = []

    const random = (min, max) =>
      Math.random() * (max - min) + min

    const getFloorY = (dino) =>
      window.innerHeight - dino.size

    const createDino = (index) => {
      const element = dinoRefs.current[index]

      if (!element) {
        return null
      }

      const size = random(32, 68)

      const dino = {
        element,

        x: random(
          0,
          Math.max(0, window.innerWidth - size),
        ),

        y: 0,

        size,

        direction:
          Math.random() > 0.5 ? 1 : -1,

        speed: random(18, 42),

        state: 'walking',

        stateUntil:
          performance.now() + random(1000, 4000),

        nextDecision:
          performance.now() + random(1500, 5000),

        hopStart: -1,

        hopDuration: random(350, 520),

        hopHeight: random(8, 20),

        nextHop:
          performance.now() + random(1000, 4500),

        bobSeed: random(0, Math.PI * 2),

        pointerId: null,

        pointerDown: false,

        dragging: false,

        dragStartX: 0,

        dragStartY: 0,

        grabOffsetX: 0,

        grabOffsetY: 0,

        rotation: 0,

        fallVelocity: 0,

        wobbleTime: random(0, Math.PI * 2),
      }

      element.style.width = `${size}px`

      const renderDino = (
        x,
        y,
        rotation = 0,
      ) => {
        const scaleX =
          dino.direction === -1 ? 1 : -1

        element.style.transform =
          `translate3d(${x}px, ${-y}px, 0) rotate(${rotation}deg) scaleX(${scaleX})`
      }

      const onPointerDown = (event) => {
        if (
          event.pointerType === 'mouse' &&
          event.button !== 0
        ) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        dino.pointerId = event.pointerId
        dino.pointerDown = true
        dino.dragging = false

        dino.dragStartX = event.clientX
        dino.dragStartY = event.clientY

        const rect = element.getBoundingClientRect()

        dino.grabOffsetX =
          event.clientX -
          (rect.left + rect.width / 2)

        dino.grabOffsetY =
          event.clientY -
          (rect.top + rect.height / 2)

        try {
          element.setPointerCapture(event.pointerId)
        } catch {}
      }

      const onPointerMove = (event) => {
        if (
          !dino.pointerDown ||
          dino.pointerId !== event.pointerId
        ) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        const dx =
          event.clientX - dino.dragStartX

        const dy =
          event.clientY - dino.dragStartY

        const distance =
          Math.sqrt(dx * dx + dy * dy)

        const dragThreshold = 8

        if (
          !dino.dragging &&
          distance < dragThreshold
        ) {
          return
        }

        if (!dino.dragging) {
          dino.dragging = true
          dino.state = 'dragging'
          dino.hopStart = -1
          dino.rotation = 0
          dino.wobbleTime =
            performance.now() * 0.01

          element.style.cursor = 'grabbing'
          element.style.zIndex = '100'
        }

        const halfSize =
          dino.size / 2

        let newX =
          event.clientX -
          dino.grabOffsetX -
          halfSize

        let newY =
          event.clientY -
          dino.grabOffsetY -
          halfSize

        const maxX =
          window.innerWidth - dino.size

        const maxY =
          window.innerHeight - dino.size

        newX = Math.max(
          0,
          Math.min(maxX, newX),
        )

        newY = Math.max(
          0,
          Math.min(maxY, newY),
        )

        dino.x = newX

        dino.y = newY

        dino.wobbleTime += 0.35

        const wobble =
          Math.sin(dino.wobbleTime) * 9

        renderDino(
          dino.x,
          dino.y,
          wobble,
        )
      }

      const onPointerUp = (event) => {
        if (
          !dino.pointerDown ||
          dino.pointerId !== event.pointerId
        ) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        dino.pointerDown = false

        try {
          element.releasePointerCapture(event.pointerId)
        } catch {}

        if (!dino.dragging) {
          dino.pointerId = null
          return
        }

        dino.dragging = false
        dino.pointerId = null
        dino.state = 'falling'

        dino.fallVelocity = 0

        element.style.cursor = 'grab'
        element.style.zIndex = '20'
      }

      const onPointerCancel = (event) => {
        if (
          !dino.pointerDown ||
          dino.pointerId !== event.pointerId
        ) {
          return
        }

        dino.pointerDown = false

        try {
          element.releasePointerCapture(event.pointerId)
        } catch {}

        if (dino.dragging) {
          dino.dragging = false
          dino.state = 'falling'
          dino.fallVelocity = 0
        }

        dino.pointerId = null

        element.style.cursor = 'grab'
        element.style.zIndex = '20'
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
        onPointerUp,
      )

      element.addEventListener(
        'pointercancel',
        onPointerCancel,
      )

      cleanupFunctions.push(() => {
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
          onPointerUp,
        )

        element.removeEventListener(
          'pointercancel',
          onPointerCancel,
        )
      })

      renderDino(
        dino.x,
        0,
        0,
      )

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

        if (
          dino.pointerDown ||
          dino.dragging
        ) {
          return
        }

        if (dino.state === 'falling') {
          const gravity = 850

          dino.fallVelocity +=
            gravity * delta

          dino.y +=
            dino.fallVelocity * delta

          if (
            dino.y >=
            getFloorY(dino)
          ) {
            dino.y =
              getFloorY(dino)

            dino.fallVelocity = 0
            dino.rotation = 0
            dino.state = 'walking'

            dino.nextDecision =
              now + random(1200, 3500)

            dino.nextHop =
              now + random(1000, 3500)
          }

          renderDino(
            dino.x,
            dino.y,
            dino.rotation,
          )

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

        renderDino(
          dino.x,
          hopY + bobY,
          tilt,
        )

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

      cleanupFunctions.forEach(
        (cleanup) => cleanup(),
      )
    }
  }, [])

  return (
    <AnimatedBackground className="home-page">
      <style>{`
        .home-dino-world {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
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
            draggable="false"
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