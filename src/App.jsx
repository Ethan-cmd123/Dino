import { useEffect, useRef, useState } from 'react'
import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import GetStarted from './pages/GetStarted'
import Dashboard from './pages/Dashboard'
import Testimonials from './pages/Testimonials'
import FAQs from './pages/FAQs'
import AboutUs from './pages/AboutUs'
import Blog from './pages/Blog'
import Upgrade from './pages/upgrade'

const routes = {
  '/': Home,
  '/login': Login,
  '/get-started': GetStarted,
  '/get-started.jsx': GetStarted,
  '/dashboard': Dashboard,
  '/testimonials': Testimonials,
  '/faqs': FAQs,
  '/about-us': AboutUs,
  '/blog': Blog,
  '/upgrade': Upgrade,
  '/upgrade.jsx': Upgrade,
}

function normalizePath(pathname) {
  let path = pathname
    .replace(/\/+$/, '')
    || '/'

  if (
    path.length > 1 &&
    path.endsWith('.jsx')
  ) {
    path = path.slice(0, -4)
  }

  return path
}

function getCurrentPath() {
  const pathname = normalizePath(
    window.location.pathname,
  )

  if (routes[pathname]) {
    return pathname
  }

  /*
   * Blog article routes use:
   * /blog/post-slug
   */

  if (pathname.startsWith('/blog/')) {
    return pathname
  }

  return '/'
}

function App() {
  const [path, setPath] =
    useState(getCurrentPath)

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [
    isTransitioning,
    setIsTransitioning,
  ] = useState(false)

  const dinoRefs = useRef([])

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath())
      setMenuOpen(false)
    }

    window.addEventListener(
      'popstate',
      handlePopState,
    )

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState,
      )
    }
  }, [])

  useEffect(() => {
    const dinoCount = 7
    const dinos = []

    const random = (min, max) =>
      Math.random() * (max - min) + min

    const createDino = (index) => {
      const element =
        dinoRefs.current[index]

      if (!element) {
        return null
      }

      const size = random(32, 68)

      const dino = {
        element,
        x: random(
          -window.innerWidth,
          window.innerWidth,
        ),
        size,
        direction:
          Math.random() > 0.5
            ? 1
            : -1,
        speed: random(18, 42),
        state: 'walking',
        stateUntil: performance.now() + random(1000, 4000),
        nextDecision:
          performance.now() + random(1500, 5000),
        hopStart: -1,
        hopDuration: random(350, 520),
        hopHeight: random(8, 20),
        nextHop:
          performance.now() + random(1000, 4500),
        bobSeed: random(0, Math.PI * 2),
      }

      element.style.width =
        `${size}px`

      return dino
    }

    for (
      let index = 0;
      index < dinoCount;
      index++
    ) {
      const dino =
        createDino(index)

      if (dino) {
        dinos.push(dino)
      }
    }

    let animationFrame = 0
    let lastTime = performance.now()

    const animate = (now) => {
      const delta =
        Math.min(
          now - lastTime,
          40,
        ) / 1000

      lastTime = now

      const width =
        window.innerWidth

      dinos.forEach((dino) => {
        if (!dino.element) {
          return
        }

        /*
         * Randomly decide whether the dino
         * should keep walking, pause,
         * or turn around.
         */
        if (
          now >= dino.nextDecision
        ) {
          const roll =
            Math.random()

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

        if (
          now >= dino.stateUntil
        ) {
          dino.state = 'walking'
        }

        /*
         * Random little hops.
         */
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

        /*
         * Move like a tiny creature instead
         * of sliding like a CSS decoration.
         */
        if (
          dino.state === 'walking'
        ) {
          dino.x +=
            dino.speed *
            dino.direction *
            delta
        }

        /*
         * Hop arc.
         */
        let hopY = 0

        if (
          dino.hopStart >= 0
        ) {
          const progress =
            (now - dino.hopStart) /
            dino.hopDuration

          if (
            progress >= 1
          ) {
            dino.hopStart = -1
          } else {
            hopY =
              Math.sin(
                progress *
                  Math.PI,
              ) *
              dino.hopHeight
          }
        }

        /*
         * Tiny walking bounce.
         */
        let bobY = 0

        if (
          dino.state === 'walking'
        ) {
          bobY =
            Math.sin(
              now * 0.018 +
                dino.bobSeed,
            ) *
            1.4
        }

        /*
         * Tiny tilt makes the movement
         * feel less robotic.
         */
        let tilt = 0

        if (
          dino.state === 'walking'
        ) {
          tilt =
            Math.sin(
              now * 0.012 +
                dino.bobSeed,
            ) *
            1.2
        }

        /*
         * Face the direction of travel.
         *
         * The source image faces left,
         * so flip horizontally when
         * travelling right.
         */
        const scaleX =
          dino.direction === -1
            ? 1
            : -1

        dino.element.style.transform =
          `translate3d(${dino.x}px, ${-hopY - bobY}px, 0) rotate(${tilt}deg) scaleX(${scaleX})`

        /*
         * Once they have completely left
         * the screen, randomly respawn them
         * from the opposite side.
         */
        const offscreenMargin =
          dino.size + 100

        if (
          dino.direction === 1 &&
          dino.x >
            width + offscreenMargin
        ) {
          dino.x =
            -random(
              80,
              350,
            )

          dino.direction = 1

          dino.state = 'walking'

          dino.nextDecision =
            now +
            random(
              1200,
              4500,
            )
        }

        if (
          dino.direction === -1 &&
          dino.x <
            -offscreenMargin
        ) {
          dino.x =
            width +
            random(
              80,
              350,
            )

          dino.direction = -1

          dino.state = 'walking'

          dino.nextDecision =
            now +
            random(
              1200,
              4500,
            )
        }
      })

      animationFrame =
        requestAnimationFrame(
          animate,
        )
    }

    animationFrame =
      requestAnimationFrame(
        animate,
      )

    return () => {
      cancelAnimationFrame(
        animationFrame,
      )
    }
  }, [])

  const navigate = (to) => {
    const destination =
      normalizePath(
        String(to || '').trim(),
      )

    /*
     * Allow normal routes and blog article URLs.
     */
    const isValidRoute =
      Boolean(routes[destination]) ||
      destination === '/blog' ||
      destination.startsWith('/blog/')

    if (!isValidRoute) {
      console.error(
        `Dino router: route "${destination}" does not exist.`,
      )

      return
    }

    if (destination === path) {
      setMenuOpen(false)
      return
    }

    setIsTransitioning(true)
    setMenuOpen(false)

    window.history.pushState(
      {},
      '',
      destination,
    )

    setPath(destination)

    window.scrollTo({
      top: 0,
      behavior: 'instant',
    })

    window.setTimeout(() => {
      setIsTransitioning(false)
    }, 220)
  }

  /*
   * Determine which page component should render.
   *
   * /blog                -> Blog index
   * /blog/example-post   -> Blog article
   */
  let CurrentPage = routes[path] || Home

  let pageProps = {
    navigate,
  }

  if (path.startsWith('/blog/')) {
    CurrentPage = Blog

    pageProps = {
      navigate,
      slug: path.replace('/blog/', ''),
    }
  }

  return (
    <div className="app">
      <style>{`
        .dino-world {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100px;
          pointer-events: none;
          z-index: 40;
          overflow: visible;
        }

        .wandering-dino {
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
          .dino-world {
            height: 80px;
          }

          .wandering-dino {
            width: 40px;
          }
        }
      `}</style>

      <div
        className="dino-world"
        aria-hidden="true"
      >
        {Array.from({
          length: 7,
        }).map((_, index) => (
          <img
            key={index}
            ref={(element) => {
              dinoRefs.current[index] =
                element
            }}
            src="/assets/dino.png"
            alt=""
            className="wandering-dino"
          />
        ))}
      </div>

      <div
        className={`page-transition ${
          isTransitioning
            ? 'active'
            : ''
        }`}
      />

      <header className="navbar">
        <div className="nav-inner">
          <button
            type="button"
            className="logo"
            onClick={() =>
              navigate('/')
            }
            aria-label="Go home"
          >
            Dino
            <span className="trademark">
              ®
            </span>
          </button>

          <button
            type="button"
            className="menu-button"
            onClick={() =>
              setMenuOpen(true)
            }
            aria-label="Open menu"
          >
            <span>
              Menu
            </span>

            <span className="menu-chevron">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      </header>

      <div
        className={`drawer ${
          menuOpen
            ? 'drawer-open'
            : ''
        }`}
      >
        <div className="drawer-inner">
          <button
            type="button"
            className="drawer-close"
            onClick={() =>
              setMenuOpen(false)
            }
            aria-label="Close menu"
          >
            <span>
              Close
            </span>

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <nav className="drawer-nav">
            <button
              type="button"
              onClick={() =>
                navigate('/get-started')
              }
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/login')
              }
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/blog')
              }
            >
              Blog
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/faqs')
              }
            >
              FAQs
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/about-us')
              }
            >
              About Us
            </button>
          </nav>

          <div className="drawer-footer">
            ©{' '}
            {new Date().getFullYear()}{' '}
            Dino
          </div>
        </div>
      </div>

      <main className="page-container">
        <CurrentPage
          {...pageProps}
        />
      </main>
    </div>
  )
}

export default App
