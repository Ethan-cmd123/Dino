import { useEffect, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'

const languages = [
  'French B',
  'Spanish B',
  'Chinese B',
  'English B',
  'German B',
  'Italian B',
  'Japanese B',
]

const goals = [
  'Improve reading',
  'Improve writing',
  'Build vocabulary',
  'Improve grammar',
  'Prepare for exams',
  'Become more fluent',
]

function getCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))

  return match
    ? decodeURIComponent(match.split('=').slice(1).join('='))
    : ''
}

function setCookie(name, value, days = 365) {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString()

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/; SameSite=Lax`
}

function GetStarted({ navigate }) {
  const [step, setStep] = useState(1)

  const [language, setLanguage] = useState('')
  const [examDate, setExamDate] = useState('')
  const [selectedGoals, setSelectedGoals] = useState([])

  /*
   * Check whether the user has already completed onboarding.
   * If all required cookies exist, skip the onboarding entirely.
   */
  useEffect(() => {
    const savedLanguage = getCookie('dino_language')
    const savedExamDate = getCookie('dino_exam_date')
    const savedGoals = getCookie('dino_goals')

    if (savedLanguage && savedExamDate && savedGoals) {
      navigate('/dashboard')
      return
    }

    // Restore partially completed onboarding if available.
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    if (savedExamDate) {
      setExamDate(savedExamDate)
    }

    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals)

        if (Array.isArray(parsedGoals)) {
          setSelectedGoals(parsedGoals)
        }
      } catch {
        setSelectedGoals([])
      }
    }
  }, [navigate])

  const toggleGoal = (goal) => {
    setSelectedGoals((current) =>
      current.includes(goal)
        ? current.filter((item) => item !== goal)
        : [...current, goal],
    )
  }

  const nextStep = () => {
    if (step === 1 && !language) {
      return
    }

    if (step === 2 && !examDate) {
      return
    }

    setStep((current) => Math.min(current + 1, 3))
  }

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 1))
  }

  const finish = () => {
    if (selectedGoals.length === 0) {
      return
    }

    setCookie('dino_language', language)
    setCookie('dino_exam_date', examDate)
    setCookie('dino_goals', JSON.stringify(selectedGoals))

    navigate('/dashboard')
  }

  const bypassOnboarding = () => {
    navigate('/dashboard')
  }

  return (
    <AnimatedBackground className="onboarding-page">
      <div className="onboarding-wrapper">
        <div className="onboarding-header">
          <div className="onboarding-brand">
            Dino
          </div>

          <div className="step-counter">
            {step} / 3
          </div>
        </div>

        <div className="progress-line">
          <div
            className="progress-line-active"
            style={{
              width: `${(step / 3) * 100}%`,
            }}
          />
        </div>

        <div className="onboarding-content">
          {step === 1 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                First things first
              </span>

              <h1 className="onboarding-title">
                What is your
                <span> Language B?</span>
              </h1>

              <p className="onboarding-description">
                Choose the language you're studying for IB.
              </p>

              <div className="choice-grid">
                {languages.map((item) => (
                  <button
                    type="button"
                    className={`choice-card ${
                      language === item ? 'selected' : ''
                    }`}
                    key={item}
                    onClick={() => setLanguage(item)}
                  >
                    <span>{item}</span>

                    <span className="choice-circle">
                      {language === item && '✓'}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="login-bypass"
                onClick={bypassOnboarding}
              >
                Go away, I want to login
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                Timeline
              </span>

              <h1 className="onboarding-title">
                When is your
                <span> IB exam?</span>
              </h1>

              <p className="onboarding-description">
                We'll use this to shape your study timeline.
              </p>

              <div className="date-wrapper">
                <input
                  type="date"
                  value={examDate}
                  onChange={(event) =>
                    setExamDate(event.target.value)
                  }
                  className="exam-date"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="date-hint">
                Pick the date of your Language B examination.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step">
              <span className="page-eyebrow">
                Your goals
              </span>

              <h1 className="onboarding-title">
                What do you want
                <span> to improve?</span>
              </h1>

              <p className="onboarding-description">
                Choose everything you're interested in.
              </p>

              <div className="goal-grid">
                {goals.map((goal) => (
                  <button
                    type="button"
                    className={`goal-card ${
                      selectedGoals.includes(goal)
                        ? 'selected'
                        : ''
                    }`}
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                  >
                    <span>{goal}</span>

                    <span className="goal-check">
                      {selectedGoals.includes(goal)
                        ? '✓'
                        : '+'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          <button
            type="button"
            className="back-button"
            onClick={previousStep}
            disabled={step === 1}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              className="next-button"
              onClick={nextStep}
              disabled={
                (step === 1 && !language) ||
                (step === 2 && !examDate)
              }
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="next-button"
              onClick={finish}
              disabled={selectedGoals.length === 0}
            >
              Enter Dino
            </button>
          )}
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default GetStarted