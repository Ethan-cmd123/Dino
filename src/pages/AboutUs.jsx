import AnimatedBackground from '../components/AnimatedBackground'

function AboutUs() {
  return (
    <AnimatedBackground className="content-page">
      <div className="content-page-inner about-page">
        <span className="page-eyebrow">
          About Dino
        </span>

        <h1 className="content-title">
          Built for the way
          <span> students learn.</span>
        </h1>

        <p className="content-text large">
          Dino is an AI-powered IB Language B learning
          experience focused on the parts of language
          learning that matter most: understanding,
          communicating, and improving.
        </p>

        <div className="about-stats">
          <div>
            <strong>Reading</strong>
            <span>Understand more</span>
          </div>

          <div>
            <strong>Writing</strong>
            <span>Express better</span>
          </div>

          <div>
            <strong>Language</strong>
            <span>Use it confidently</span>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default AboutUs