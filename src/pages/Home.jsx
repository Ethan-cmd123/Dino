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
  const duplicatedGreetings = [
    ...greetings,
    ...greetings,
    ...greetings,
    ...greetings,
  ]

  return (
    <AnimatedBackground className="home-page">
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
              <span className="secondary-title">Testimonials</span>

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