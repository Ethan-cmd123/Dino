const HERO_BG =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260626_041422_4a459e05-abce-4150-9fb7-4ededc423cd1.png&w=1280&q=85'

function AnimatedBackground({ children, className = '' }) {
  return (
    <section
      className={`animated-page ${className}`}
      style={{
        '--hero-image': `url("${HERO_BG}")`,
      }}
    >
      <div className="animated-background-image" />

      <div className="animated-overlay" />

      <div className="background-curves background-curves-left">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className="background-curve background-curve-left"
            style={{
              width: `${50 + index * 10}px`,
              animationDelay: `${index * 0.22}s`,
            }}
          />
        ))}
      </div>

      <div className="background-curves background-curves-right">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className="background-curve background-curve-right"
            style={{
              width: `${50 + index * 10}px`,
              animationDelay: `${index * 0.22}s`,
            }}
          />
        ))}
      </div>

      <div className="background-top-curves">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="background-top-curve"
            style={{
              height: `${42 + index * 8}px`,
              animationDelay: `${index * 0.22}s`,
            }}
          />
        ))}
      </div>

      {children}

      <div className="animated-bottom-blur" />
    </section>
  )
}

export default AnimatedBackground