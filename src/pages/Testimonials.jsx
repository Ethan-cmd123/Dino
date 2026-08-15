import AnimatedBackground from '../components/AnimatedBackground'

const testimonials = [
  {
    quote:
      'Dino makes language practice feel much less repetitive and much more focused.',
    name: 'IB Student',
    detail: 'Language B student',
  },
  {
    quote:
      'The reading and writing focus is exactly what I wanted from a study tool.',
    name: 'IB Student',
    detail: 'Language B student',
  },
  {
    quote:
      'It feels built around actually improving instead of just doing endless exercises.',
    name: 'IB Student',
    detail: 'Language B student',
  },
]

function Testimonials() {
  return (
    <AnimatedBackground className="content-page">
      <div className="content-page-inner testimonials-page">
        <span className="page-eyebrow">
          Students
        </span>

        <h1 className="content-title">
          From IB students
          <span> globally.</span>
        </h1>

        <p className="content-text">
          Feedback from students using Dino as part of
          their language learning.
        </p>

        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <div
              className="testimonial-card"
              key={index}
            >
              <div className="quote-mark">
                “
              </div>

              <p>{item.quote}</p>

              <div className="testimonial-author">
                <strong>{item.name}</strong>
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default Testimonials