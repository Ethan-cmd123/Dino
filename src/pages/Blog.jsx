import { useEffect } from 'react'

/*
|--------------------------------------------------------------------------
| BLOG DATABASE
|--------------------------------------------------------------------------
|
| Add new blog posts here.
|
| Example URL:
|
| slug: "how-to-learn-french-faster"
|
| becomes:
|
| /blog/how-to-learn-french-faster
|
|--------------------------------------------------------------------------
*/

const BLOG_POSTS = [
  {
    slug: 'how-to-prepare-for-ib-language-b',
    title: 'How to Prepare for IB Language B',
    description:
      'A practical guide to preparing for IB Language B without wasting hours on ineffective study.',
    category: 'IB Language B',
    author: 'Dino',
    date: 'August 16, 2026',
    readTime: '5 min read',
    featured: true,

    content: [
      {
        type: 'paragraph',
        text:
          'IB Language B is much easier to approach when you stop treating it like a giant vocabulary memorisation contest. The real goal is being able to communicate clearly, understand different types of texts and respond naturally under pressure.',
      },

      {
        type: 'heading',
        level: 2,
        text:
          'Focus on the skills that actually matter',
      },

      {
        type: 'paragraph',
        text:
          'A strong study routine should combine reading, writing, listening and speaking. Spending all of your time memorising vocabulary creates the illusion of progress while leaving important communication skills untouched.',
      },

      {
        type: 'list',
        items: [
          'Read authentic content regularly.',
          'Write short responses using different text types.',
          'Practise listening without subtitles.',
          'Speak regularly instead of waiting until exam season.',
        ],
      },

      {
        type: 'heading',
        level: 2,
        text:
          'Build vocabulary through context',
      },

      {
        type: 'paragraph',
        text:
          'Instead of memorising isolated words, learn vocabulary through sentences and situations. This makes it much easier to retrieve the correct word when you actually need it.',
      },

      {
        type: 'quote',
        text:
          'The best vocabulary is vocabulary you can actually use.',
      },

      {
        type: 'heading',
        level: 2,
        text:
          'Use mistakes as data',
      },

      {
        type: 'paragraph',
        text:
          'Every mistake gives you information about what needs work. Keep track of repeated grammar errors, weak vocabulary and problems with specific text types. That gives your study sessions a target instead of turning them into random revision.',
      },

      {
        type: 'code',
        language: 'text',
        text:
`Weekly study loop

1. Read
2. Write
3. Get feedback
4. Review mistakes
5. Repeat`,
      },

      {
        type: 'paragraph',
        text:
          'The key is consistency. A smaller amount of deliberate practice repeated every week will usually beat occasional marathon study sessions.',
      },
    ],
  },

  {
    slug: 'how-to-use-feedback-tools-for-language-learning',
    title: 'How to Use Feedback Tools for Language Learning',
    description:
      'How students can use feedback tools without turning their learning into copy-and-paste homework.',
    category: 'Study Skills',
    author: 'Dino',
    date: 'August 15, 2026',
    readTime: '4 min read',
    featured: false,

    content: [
      {
        type: 'paragraph',
        text:
          'Feedback tools can be useful for language learning when you use them to guide your own work rather than complete it for you.',
      },

      {
        type: 'heading',
        level: 2,
        text:
          'Ask for feedback instead of answers',
      },

      {
        type: 'paragraph',
        text:
          'One of the most effective approaches is to submit your own work and ask for feedback. That lets you identify mistakes while still doing the thinking yourself.',
      },

      {
        type: 'list',
        items: [
          'Ask for grammar corrections.',
          'Ask why an answer is wrong.',
          'Ask for alternative vocabulary.',
          'Ask for exam-style feedback.',
        ],
      },

      {
        type: 'paragraph',
        text:
          'The point is not to make school disappear. Unfortunately, humanity has not yet invented the magical button that makes knowledge enter your brain while you sleep.',
      },
    ],
  },

  {
    slug: 'best-way-to-study-for-language-exams',
    title: 'The Best Way to Study for Language Exams',
    description:
      'A simple study system for improving language performance without endless revision.',
    category: 'Study Skills',
    author: 'Dino',
    date: 'August 14, 2026',
    readTime: '6 min read',
    featured: false,

    content: [
      {
        type: 'paragraph',
        text:
          'Effective exam preparation is less about studying for longer and more about deliberately practising the skills the exam actually measures.',
      },

      {
        type: 'heading',
        level: 2,
        text:
          'Start with weak areas',
      },

      {
        type: 'paragraph',
        text:
          'Spend most of your time on areas where you are making repeated mistakes. Reviewing something you already know feels productive, but it usually produces very little improvement.',
      },

      {
        type: 'heading',
        level: 2,
        text:
          'Practise under realistic conditions',
      },

      {
        type: 'paragraph',
        text:
          'Timed writing and reading tasks are especially useful because they force you to retrieve information and make decisions under pressure.',
      },
    ],
  },
]

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatDate(dateString) {
  return dateString
}

function getPostBySlug(slug) {
  return BLOG_POSTS.find(
    (post) => post.slug === slug,
  )
}

/*
|--------------------------------------------------------------------------
| CONTENT RENDERER
|--------------------------------------------------------------------------
*/

function BlogContent({ content }) {
  return (
    <div className="blog-content">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 3) {
              return (
                <h3 key={index}>
                  {block.text}
                </h3>
              )
            }

            return (
              <h2 key={index}>
                {block.text}
              </h2>
            )

          case 'paragraph':
            return (
              <p key={index}>
                {block.text}
              </p>
            )

          case 'list':
            return (
              <ul key={index}>
                {block.items.map(
                  (item, itemIndex) => (
                    <li
                      key={itemIndex}
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            )

          case 'quote':
            return (
              <blockquote
                key={index}
              >
                {block.text}
              </blockquote>
            )

          case 'code':
            return (
              <pre
                key={index}
              >
                <code>
                  {block.text}
                </code>
              </pre>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| BLOG INDEX
|--------------------------------------------------------------------------
*/

function BlogIndex({ navigate }) {
  const featuredPosts =
    BLOG_POSTS.filter(
      (post) =>
        post.featured,
    )

  const regularPosts =
    BLOG_POSTS.filter(
      (post) =>
        !post.featured,
    )

  return (
    <section className="blog-page">
      <div className="blog-header">
        <p className="blog-eyebrow">
          DINO BLOG
        </p>

        <h1>
          Learn smarter.
        </h1>

        <p className="blog-description">
          Ideas, strategies and resources
          for becoming better at languages,
          learning and school.
        </p>
      </div>

      {featuredPosts.length > 0 && (
        <section className="blog-featured">
          {featuredPosts.map(
            (post) => (
              <button
                type="button"
                className="blog-featured-card"
                key={post.slug}
                onClick={() =>
                  navigate(
                    `/blog/${post.slug}`,
                  )
                }
              >
                <div className="blog-card-meta">
                  <span>
                    {post.category}
                  </span>

                  <span>
                    {post.readTime}
                  </span>
                </div>

                <h2>
                  {post.title}
                </h2>

                <p>
                  {post.description}
                </p>

                <span className="blog-read-link">
                  Read article
                  <span>
                    →
                  </span>
                </span>
              </button>
            ),
          )}
        </section>
      )}

      <section className="blog-list-section">
        <div className="blog-section-heading">
          <p>
            LATEST
          </p>

          <h2>
            From the blog
          </h2>
        </div>

        <div className="blog-grid">
          {regularPosts.map(
            (post) => (
              <button
                type="button"
                className="blog-card"
                key={post.slug}
                onClick={() =>
                  navigate(
                    `/blog/${post.slug}`,
                  )
                }
              >
                <div className="blog-card-meta">
                  <span>
                    {post.category}
                  </span>

                  <span>
                    {post.readTime}
                  </span>
                </div>

                <h3>
                  {post.title}
                </h3>

                <p>
                  {post.description}
                </p>

                <div className="blog-card-bottom">
                  <span>
                    {formatDate(
                      post.date,
                    )}
                  </span>

                  <span>
                    →
                  </span>
                </div>
              </button>
            ),
          )}
        </div>
      </section>
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| BLOG ARTICLE
|--------------------------------------------------------------------------
*/

function BlogArticle({
  navigate,
  slug,
}) {
  const post =
    getPostBySlug(slug)

  useEffect(() => {
    if (!post) {
      document.title =
        'Blog post not found — Dino'

      return
    }

    document.title =
      `${post.title} — Dino`
  }, [post])

  if (!post) {
    return (
      <section className="blog-not-found">
        <p className="blog-eyebrow">
          BLOG
        </p>

        <h1>
          Article not found.
        </h1>

        <p>
          This post does not exist.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/blog')
          }
        >
          Back to Blog
        </button>
      </section>
    )
  }

  return (
    <article className="blog-article">
      <button
        type="button"
        className="blog-back"
        onClick={() =>
          navigate('/blog')
        }
      >
        ← Back to Blog
      </button>

      <header className="blog-article-header">
        <div className="blog-card-meta">
          <span>
            {post.category}
          </span>

          <span>
            {post.readTime}
          </span>
        </div>

        <h1>
          {post.title}
        </h1>

        <p className="blog-article-description">
          {post.description}
        </p>

        <div className="blog-author">
          <span>
            By {post.author}
          </span>

          <span>
            {formatDate(
              post.date,
            )}
          </span>
        </div>
      </header>

      <BlogContent
        content={post.content}
      />

      <footer className="blog-article-footer">
        <button
          type="button"
          onClick={() =>
            navigate('/blog')
          }
        >
          ← Back to all articles
        </button>
      </footer>
    </article>
  )
}

/*
|--------------------------------------------------------------------------
| MAIN BLOG COMPONENT
|--------------------------------------------------------------------------
*/

export default function Blog({
  navigate,
  slug,
}) {
  if (slug) {
    return (
      <BlogArticle
        navigate={navigate}
        slug={slug}
      />
    )
  }

  return (
    <BlogIndex
      navigate={navigate}
    />
  )
}

/*
|--------------------------------------------------------------------------
| OPTIONAL EXPORT
|--------------------------------------------------------------------------
|
| Useful later if you want to build:
| - sitemap generation
| - RSS
| - search
| - admin tools
| - related articles
|
|--------------------------------------------------------------------------
*/

export { BLOG_POSTS }
