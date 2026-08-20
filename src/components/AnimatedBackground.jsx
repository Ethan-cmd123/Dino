const HERO_BG = '/assets/background.png'

function AnimatedBackground({ children, className = '' }) {
  return (
    <section
      className={`animated-page ${className}`}
      style={{
        backgroundImage: `url("${HERO_BG}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </section>
  )
}

export default AnimatedBackground