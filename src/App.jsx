import { useEffect, useState } from 'react'
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
        .cute-dino-field {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: 120px;
          pointer-events: none;
          z-index: 30;
          overflow: hidden;
        }

        .cute-dino {
          position: absolute;
          bottom: -2px;
          width: var(--dino-size);
          height: auto;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          animation:
            dino-hop
            var(--hop-duration)
            var(--hop-delay)
            ease-in-out
            infinite;
          transform-origin: bottom center;
          will-change: transform;
        }

        .cute-dino-1 {
          left: 4%;
          --dino-size: 48px;
          --hop-height: 18px;
          --hop-duration: 1.8s;
          --hop-delay: -0.2s;
        }

        .cute-dino-2 {
          left: 17%;
          --dino-size: 34px;
          --hop-height: 12px;
          --hop-duration: 2.15s;
          --hop-delay: -1.1s;
        }

        .cute-dino-3 {
          left: 31%;
          --dino-size: 58px;
          --hop-height: 22px;
          --hop-duration: 1.95s;
          --hop-delay: -0.65s;
        }

        .cute-dino-4 {
          left: 47%;
          --dino-size: 40px;
          --hop-height: 15px;
          --hop-duration: 2.35s;
          --hop-delay: -1.7s;
        }

        .cute-dino-5 {
          left: 61%;
          --dino-size: 68px;
          --hop-height: 25px;
          --hop-duration: 2.05s;
          --hop-delay: -0.9s;
        }

        .cute-dino-6 {
          left: 78%;
          --dino-size: 37px;
          --hop-height: 14px;
          --hop-duration: 1.7s;
          --hop-delay: -1.35s;
        }

        .cute-dino-7 {
          left: 91%;
          --dino-size: 52px;
          --hop-height: 19px;
          --hop-duration: 2.25s;
          --hop-delay: -0.4s;
        }

        @keyframes dino-hop {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          18% {
            transform: translateY(calc(var(--hop-height) * -0.25))
              rotate(-2deg);
          }

          35% {
            transform: translateY(calc(var(--hop-height) * -1))
              rotate(2deg);
          }

          52% {
            transform: translateY(calc(var(--hop-height) * -0.45))
              rotate(-1.5deg);
          }

          68% {
            transform: translateY(0)
              rotate(1deg);
          }

          84% {
            transform: translateY(calc(var(--hop-height) * -0.12))
              rotate(0deg);
          }
        }

        @media (max-width: 700px) {
          .cute-dino-field {
            height: 90px;
          }

          .cute-dino-2,
          .cute-dino-4,
          .cute-dino-6 {
            display: none;
          }

          .cute-dino-1 {
            left: 2%;
            --dino-size: 38px;
          }

          .cute-dino-3 {
            left: 27%;
            --dino-size: 46px;
          }

          .cute-dino-5 {
            left: 56%;
            --dino-size: 52px;
          }

          .cute-dino-7 {
            left: 82%;
            --dino-size: 42px;
          }
        }
      `}</style>

      <div className="cute-dino-field" aria-hidden="true">
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-1"
        />
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-2"
        />
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-3"
        />
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-4"
        />
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-5"
        />
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-6"
        />
        <img
          src="/assets/dino.png"
          alt=""
          className="cute-dino cute-dino-7"
        />
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