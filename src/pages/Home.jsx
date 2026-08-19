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

    const getWorldHeight = () =>
      window.innerWidth <= 700 ? 80 : 105

    const createDino = (index) => {
      const element = dinoRefs.current[index]

      if (!element) {
        return null
      }

      const size = random(32, 68)
      const worldHeight = getWorldHeight()

      const dino = {
        element,
        x: random(
          0,
          Math.max(0, window.innerWidth - size),
        ),
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

        dragOffsetX: 0,
        dragOffsetY: 0,

        dragX: 0,
        dragY: 0,

        worldHeight,
      }

      element.style.width = `${size}px`

      const setDragTransform = (rotation = 0) => {
        element.style.transform =
          `translate3d(${dino.dragX}px, ${-dino.dragY}px, 0) rotate(${rotation}deg) scaleX(${dino.direction === -1 ? 1 : -1})`
      }

      const wobble = () => {
        if (!dino.dragging) {
          return
        }

        element.animate(
          [
            {
              transform:
                `translate3d(${dino.dragX}px, ${-dino.dragY}px, 0) rotate(-6deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
            {
              transform:
                `translate3d(${dino.dragX}px, ${-dino.dragY}px, 0) rotate(6deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
            {
              transform:
                `translate3d(${dino.dragX}px, ${-dino.dragY}px, 0) rotate(-5deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
            {
              transform:
                `translate3d(${dino.dragX}px, ${-dino.dragY}px, 0) rotate(5deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
            {
              transform:
                `translate3d(${dino.dragX}px, ${-dino.dragY}px, 0) rotate(0deg) scaleX(${dino.direction === -1 ? 1 : -1})`,
            },
          ],
          {
            duration: 450,
            easing: 'ease-in-out',
          },
        )
      }

      const startDrag = (event) => {
        if (event.button !== undefined && event.button !== 0) {
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

        dino.dragOffsetX =
          event.clientX -
          (rect.left + rect.width / 2)

        dino.dragOffsetY =
          event.clientY -
          (rect.top + rect.height / 2)

        dino.dragX = dino.x
        dino.dragY = 0

        element.style.cursor = 'grab'

        try {
          element.setPointerCapture(event.pointerId)
        } catch {}
      }

      const moveDino = (event) => {
        if (
          !dino.pointerDown ||
          dino.pointerId !== event.pointerId
        ) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        const movedX =
          event.clientX - dino.dragStartX

        const movedY =
          event.clientY - dino.dragStartY

        const distance = Math.sqrt(
          movedX * movedX +
          movedY * movedY,
        )

        const dragThreshold = 7

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

          element.style.cursor = 'grabbing'
          element.style.zIndex = '100'
          element.style.pointerEvents = 'auto'

          wobble()
        }

        const worldHeight = getWorldHeight()

        const halfWidth =
          dino.size / 2

        const maxX =
          window.innerWidth - dino.size

        const maxY =
          worldHeight - dino.size

        let newX =
          event.clientX -
          dino.dragOffsetX -
          halfWidth

        let newY =
          window.innerHeight -
          event.clientY -
          dino.dragOffsetY -
          halfWidth

        newX = Math.max(
          0,
          Math.min(maxX, newX),
        )

        newY = Math.max(
          0,
          Math.min(maxY, newY),
        )

        dino.dragX = newX
        dino.dragY = newY

        const rotation =
          Math.sin(
            performance.now() * 0.018,
          ) * 7

        setDragTransform(rotation)
      }

      const endDrag = (event) => {
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
        dino.state = 'walking'

        dino.x = Math.max(
          0,
          Math.min(
            window.innerWidth - dino.size,
            dino.dragX,
          ),
        )

        element.style.cursor = 'grab'
        element.style.zIndex = '20'

        dino.nextDecision =
          performance.now() + random(1200, 4500)

        dino.nextHop =
          performance.now() + random(1000, 4000)
      }

      const cancelDrag = (event) => {
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

        dino.dragging = false
        dino.pointerId = null
        dino.state = 'walking'

        element.style.cursor = 'grab'
        element.style.zIndex = '20'
      }

      element.addEventListener(
        'pointerdown',
        startDrag,
      )

      element.addEventListener(
        'pointermove',
        moveDino,
      )

      element.addEventListener(
        'pointerup',
        endDrag,
      )

      element.addEventListener(
        'pointercancel',
        cancelDrag,
      )

      cleanupFunctions.push(() => {
        element.removeEventListener(
          'pointerdown',
          startDrag,
        )

        element.removeEventListener(
          'pointermove',
          moveDino,
        )

        element.removeEventListener(
          'pointerup',
          endDrag,
        )

        element.removeEventListener(
          'pointercancel',
          cancelDrag,
        )
      })

      dino.element.style.transform =
        `translate3d(${dino.x}px, 0, 0) scaleX(${dino.direction === -1 ? 1 : -1})`

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

        if (dino.dragging || dino.pointerDown) {
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
            draggable="false"
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