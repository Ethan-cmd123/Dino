import AnimatedBackground from '../components/AnimatedBackground'

const questions = [
  {
    question: 'What is Dino?',
    answer:
      'Dino is a learning app designed around IB Language B skills, especially reading, writing, vocabulary, and practical language use.',
  },
  {
    question: 'Who is Dino for?',
    answer:
      'Dino is designed for students studying IB Language B who want focused practice outside the classroom.',
  },
  {
    question: 'Does Dino replace teachers?',
    answer:
      'No. Dino is a learning tool designed to support your study alongside your teacher and normal IB coursework.',
  },
  {
    question: 'What does Dino focus on?',
    answer:
      'The experience centres around reading, writing, vocabulary, grammar, comprehension, and broader language development.',
  },
]

function FAQs() {
  return (
    <AnimatedBackground className="content-page">
      <div className="content-page-inner faq-page">
        <span className="page-eyebrow">
          Questions
        </span>

        <h1 className="content-title">
          Frequently asked
          <span> questions.</span>
        </h1>

        <div className="faq-list">
          {questions.map((item, index) => (
            <details
              className="faq-item"
              key={index}
            >
              <summary>
                <span>{item.question}</span>

                <span className="faq-plus">
                  +
                </span>
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default FAQs
