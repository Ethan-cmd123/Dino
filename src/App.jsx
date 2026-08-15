import { useEffect, useState } from 'react'
import './App.css'

import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import Dashboard from './pages/Dashboard'
import Testimonials from './pages/Testimonials'
import FAQs from './pages/FAQs'
import AboutUs from './pages/AboutUs'

const routes = {
  '/': Home,
  '/get-started': GetStarted,
  '/dashboard': Dashboard,
  '/testimonials': Testimonials,
  '/faqs': FAQs,
  '/about-us': AboutUs,
}

function App() {
  const getCurrentPath = () => {
    const path = window.location.pathname
    return routes[path] ? path : '/'
  }

  const [path, setPath] = useState(getCurrentPath)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath())
      setMenuOpen(false)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (to) => {
    if (to === path) {
      setMenuOpen(false)
      return
    }

    setIsTransitioning(true)
    setMenuOpen(false)

    setTimeout(() => {
      window.history.pushState({}, '', to)
      setPath(to)

      window.scrollTo(0, 0)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 40)
    }, 180)
  }

  const CurrentPage = routes[path] || Home

  return (
    <div className="app">
      <div className={`page-transition ${isTransitioning ? 'active' : ''}`} />

      <header className="navbar">
        <div className="nav-inner">
          <button
            type="button"
            className="logo"
            onClick={() => navigate('/')}
            aria-label="Go home"
          >
            Dino
            <span className="trademark">®</span>
          </button>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(true)}
          >
            <span>Menu</span>

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

      <div className={`drawer ${menuOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-inner">
          <button
            type="button"
            className="drawer-close"
            onClick={() => setMenuOpen(false)}
          >
            <span>Close</span>

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
            <button onClick={() => navigate('/get-started')}>
              Get Started
            </button>

            <button onClick={() => navigate('/faqs')}>
              FAQs
            </button>

            <button onClick={() => navigate('/about-us')}>
              About Us
            </button>
          </nav>

          <div className="drawer-footer">
            © {new Date().getFullYear()} Dino
          </div>
        </div>
      </div>

      <main className="page-container">
        <CurrentPage navigate={navigate} />
      </main>
    </div>
  )
}

export default App