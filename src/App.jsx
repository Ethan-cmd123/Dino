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