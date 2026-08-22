import React, { useEffect, useMemo, useState } from 'react'
import './Learn.css'

const GROQ_ENDPOINT = '/api/generate'
const GROQ_MODEL = 'openai/gpt-oss-120b'

const LEARN_STORAGE_KEY = 'dino-learn-state-v2'

const EXERCISE_TYPES = [
  'vocabulary',
  'grammar',
  'translation',
  'reading',
  'writing',
]

const FALLBACK_LESSONS = [
  {
    type: 'vocabulary',
    title: 'Core vocabulary',
    question: 'What does the target-language word mean?',
    prompt: 'Fill this in with the AI-generated lesson when available.',
    options: ['Meaning A', 'Meaning B', 'Meaning C', 'Meaning D'],
    answer: 0,
    explanation: 'This is a local fallback so the lesson remains usable if the AI request fails.',
  },
  {
    type: 'grammar',
    title: 'Grammar check',
    question: 'Choose the sentence that is grammatically correct.',
    prompt: 'Select the best sentence.',
    options: ['Sentence A', 'Sentence B', 'Sentence C', 'Sentence D'],
    answer: 0,
    explanation: 'The AI normally creates this exercise from your current topic and difficulty.',
  },
  {
    type: 'translation',
    title: 'Translation',
    question: 'Translate the sentence into the target language.',
    prompt: 'I am preparing for my exam.',
    answerText: 'Fallback translation',
    explanation: 'The fallback accepts a close answer so the lesson still has a sensible completion path.',
  },
  {
    type: 'reading',
    title: 'Reading',
    question: 'What is the main idea of the short text?',
    prompt: 'This short passage is available in the lesson when the AI is online.',
    options: ['A central idea', 'A detail', 'An unrelated claim', 'A different topic'],
    answer: 0,
    explanation: 'Reading practice is generated around the selected IB topic.',
  },
  {
    type: 'writing',
    title: 'Writing',
    question: 'Write a short response about the lesson topic.',
    prompt: 'Explain one way this topic affects young people today.',
    answerText: '',
    explanation: 'A writing exercise is completed when you submit a response.',
  },
]

function readState(userId) {
  try {
    const raw = window.localStorage.getItem(`${LEARN_STORAGE_KEY}:${userId || 'guest'}`)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeState(userId, state) {
  try {
    window.localStorage.setItem(
      `${LEARN_STORAGE_KEY}:${userId || 'guest'}`,
      JSON.stringify(state),
    )
  } catch {
    // Local persistence is best-effort only.
  }
}

function cleanJson(text) {
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

async function generateLesson({ language, theme, topic, weakAreas, level }) {
  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL,
      system: `
You are Dino, a professional IB Language B tutor.
Create one compact five-step lesson for the learner.
The lesson must combine vocabulary, grammar, translation, reading and writing.
Use original material only. Do not reproduce copyrighted material.
Do not use emojis in the generated academic content.
Return JSON only.

Required JSON shape:
{
  "title": "string",
  "theme": "string",
  "topic": "string",
  "exercises": [
    {
      "type": "vocabulary|grammar|translation|reading|writing",
      "title": "string",
      "question": "string",
      "prompt": "string",
      "options": ["string", "string", "string", "string"],
      "answer": 0,
      "answerText": "string",
      "explanation": "string"
    }
  ]
}
Each exercise type must appear exactly once, in this order:
vocabulary, grammar, translation, reading, writing.
For multiple-choice items, provide four options and a zero-based answer index.
For translation, provide answerText.
For writing, provide a concise prompt and an empty answerText.
The lesson must be suitable for the learner's level and topic.
        `.trim(),
      user: `
Language: ${language}
IB theme: ${theme}
Course topic: ${topic}
Learner level: ${level}
Known weak areas: ${weakAreas.length ? weakAreas.join(', ') : 'No known weak areas yet'}
Create a focused lesson that reinforces weak areas while teaching the selected topic.
      `.trim(),
      responseFormat: {
        type: 'json_schema',
        json_schema: {
          name: 'dino_learn_lesson',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              theme: { type: 'string' },
              topic: { type: 'string' },
              exercises: {
                type: 'array',
                minItems: 5,
                maxItems: 5,
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    title: { type: 'string' },
                    question: { type: 'string' },
                    prompt: { type: 'string' },
                    options: {
                      type: 'array',
                      minItems: 4,
                      maxItems: 4,
                      items: { type: 'string' },
                    },
                    answer: { type: 'integer' },
                    answerText: { type: 'string' },
                    explanation: { type: 'string' },
                  },
                  required: [
                    'type',
                    'title',
                    'question',
                    'prompt',
                    'options',
                    'answer',
                    'answerText',
                    'explanation',
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ['title', 'theme', 'topic', 'exercises'],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.35,
      maxTokens: 2400,
    }),
  })

  const text = await response.text()
  let payload = null
  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.error || `AI request failed (${response.status}).`)
  }

  const parsed = cleanJson(payload?.content || '')
  if (!parsed || !Array.isArray(parsed.exercises) || parsed.exercises.length !== 5) {
    throw new Error('AI returned an unexpected lesson format.')
  }

  const normalized = EXERCISE_TYPES.map((type) => {
    const item = parsed.exercises.find((exercise) => exercise.type === type)
    return item || FALLBACK_LESSONS[EXERCISE_TYPES.indexOf(type)]
  })

  return {
    ...parsed,
    exercises: normalized,
  }
}

function difficultyFromProgress(progress) {
  if (progress >= 70) return 'Advanced'
  if (progress >= 35) return 'Intermediate'
  return 'Beginner'
}

function getDailyKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`
}

export default function Learn({ user, language, allTopics = [], selectedTopics = [] }) {
  const userId = user?.id || 'guest'

  const orderedTopics = useMemo(() => {
    if (!allTopics.length) {
      return [
        { theme: 'Identities', topic: 'Lifestyles', local: 'Lifestyles' },
        { theme: 'Experiences', topic: 'Leisure activities', local: 'Leisure activities' },
        { theme: 'Human ingenuity', topic: 'Technology', local: 'Technology' },
        { theme: 'Social organization', topic: 'Education', local: 'Education' },
        { theme: 'Sharing the planet', topic: 'The environment', local: 'The environment' },
      ]
    }
    return allTopics
  }, [allTopics])

  const [state, setState] = useState(() => {
    const stored = readState(userId)
    return (
      stored || {
        xp: 0,
        streak: 0,
        dailyXp: 0,
        dailyGoal: 30,
        lastActiveDate: null,
        mastery: {},
        weakAreas: [],
        completedLessons: 0,
        lessonCount: 0,
        completedTopicIds: [],
      }
    )
  })

  const completedTopicSet = useMemo(() => {
    return new Set([...(selectedTopics || []), ...(state?.completedTopicIds || [])])
  }, [selectedTopics, state?.completedTopicIds])

  const nextTopicIndex = useMemo(() => {
    const firstIncomplete = orderedTopics.findIndex((item) => {
      const id = `${language}::${item.theme}::${item.topic}`
      return !completedTopicSet.has(id)
    })
    return firstIncomplete === -1 ? 0 : firstIncomplete
  }, [completedTopicSet, language, orderedTopics])

  const [lesson, setLesson] = useState(null)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [lessonError, setLessonError] = useState('')
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [flashOpen, setFlashOpen] = useState(false)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    const currentDay = getDailyKey()
    setState((current) => {
      if (current.lastActiveDate === currentDay) return current
      return {
        ...current,
        dailyXp: 0,
      }
    })
  }, [])

  useEffect(() => {
    writeState(userId, state)
  }, [state, userId])

  const progress = Math.min(
    100,
    Math.round((completedTopicSet.size / Math.max(orderedTopics.length, 1)) * 100),
  )

  const currentTopic = orderedTopics[nextTopicIndex] || orderedTopics[0]
  const currentTheme = currentTopic?.theme || 'Identities'
  const topicProgress = Math.min(100, Math.round(((nextTopicIndex % 5) / 5) * 100))
  const level = difficultyFromProgress(progress)
  const dailyPercent = Math.min(100, Math.round((state.dailyXp / state.dailyGoal) * 100))
  const currentExercise = lesson?.exercises?.[exerciseIndex]

  const pathItems = useMemo(() => {
    return orderedTopics.slice(0, 10).map((item, index) => {
      const id = `${language}::${item.theme}::${item.topic}`
      const complete = completedTopicSet.has(id)
      const current = index === nextTopicIndex
      const available = complete || current || index === nextTopicIndex + 1
      return {
        ...item,
        index,
        status: complete ? 'completed' : current ? 'current' : available ? 'available' : 'locked',
      }
    })
  }, [completedTopicSet, language, nextTopicIndex, orderedTopics])

  const flashcard = useMemo(() => {
    const weak = state.weakAreas[0]
    return {
      term: weak || (language.startsWith('French') ? 'cependant' : 'review'),
      meaning: weak
        ? 'Review this concept again in your next lesson.'
        : language.startsWith('French')
          ? 'however'
          : 'Keep practising this concept until it becomes automatic.',
    }
  }, [language, state.weakAreas])

  function updateWeakArea(label, correct) {
    setState((current) => {
      const weak = new Set(current.weakAreas)
      if (correct) weak.delete(label)
      else weak.add(label)
      return {
        ...current,
        weakAreas: Array.from(weak).slice(0, 12),
      }
    })
  }

  async function openLesson(topic = currentTopic) {
    if (!topic) return
    setLessonLoading(true)
    setLessonError('')
    setFeedback(null)
    setSelectedAnswer(null)
    setTextAnswer('')
    setExerciseIndex(0)

    try {
      const nextLesson = await generateLesson({
        language,
        theme: topic.theme,
        topic: topic.topic,
        weakAreas: state.weakAreas,
        level,
      })
      setLesson(nextLesson)
    } catch (error) {
      console.error('Learn lesson generation failed:', error)
      setLessonError('AI generation failed, so Dino loaded a local practice lesson instead.')
      setLesson({
        title: `${topic.topic} · Practice`,
        theme: topic.theme,
        topic: topic.topic,
        exercises: FALLBACK_LESSONS,
      })
    } finally {
      setLessonLoading(false)
    }
  }

  function evaluateExercise() {
    if (!currentExercise) return

    if (currentExercise.type === 'writing') {
      if (!textAnswer.trim()) {
        setFeedback({ correct: false, message: 'Write a response before submitting.' })
        return
      }
      updateWeakArea(`${currentTheme}: writing`, textAnswer.trim().length >= 25)
      setFeedback({
        correct: textAnswer.trim().length >= 25,
        message:
          textAnswer.trim().length >= 25
            ? 'Good response. You completed the writing task with enough substance to count.'
            : 'Add a little more detail. Aim for at least one developed idea and a supporting detail.',
      })
      return
    }

    if (currentExercise.type === 'translation') {
      const answer = textAnswer.trim().toLowerCase()
      const target = String(currentExercise.answerText || '').trim().toLowerCase()
      const correct = Boolean(answer) && Boolean(target) && (answer === target || answer.includes(target))
      updateWeakArea(`${currentTheme}: translation`, correct)
      setFeedback({
        correct,
        message: correct
          ? 'Correct. Your translation matches the target answer closely enough.'
          : `Not quite. Model answer: ${currentExercise.answerText}`,
      })
      return
    }

    if (selectedAnswer === null) {
      setFeedback({ correct: false, message: 'Choose an answer first.' })
      return
    }

    const correct = Number(selectedAnswer) === Number(currentExercise.answer)
    updateWeakArea(`${currentTheme}: ${currentExercise.type}`, correct)
    setFeedback({
      correct,
      message: correct
        ? 'Correct. Nice work.'
        : `Not quite. ${currentExercise.explanation || 'Review the concept and try again.'}`,
    })
  }

  function awardLesson() {
    const earned = lesson?.exercises?.reduce((sum, item) => {
      if (item.type === 'writing') return sum + 20
      if (item.type === 'reading') return sum + 15
      if (item.type === 'translation') return sum + 12
      return sum + 10
    }, 0) || 0

    const today = getDailyKey()
    setState((current) => {
      const previousDate = current.lastActiveDate
      let streak = current.streak
      if (!previousDate) streak = 1
      else if (previousDate === today) streak = current.streak
      else {
        const previous = new Date(previousDate)
        const currentDate = new Date(today)
        const difference = Math.round((currentDate - previous) / 86400000)
        streak = difference === 1 ? current.streak + 1 : 1
      }

      return {
        ...current,
        xp: current.xp + earned,
        dailyXp: current.dailyXp + earned,
        streak,
        lastActiveDate: today,
        completedLessons: current.completedLessons + 1,
        lessonCount: current.lessonCount + 1,
        completedTopicIds: Array.from(new Set([...(current.completedTopicIds || []), `${language}::${currentTheme}::${currentTopic?.topic}`])),
        mastery: {
          ...current.mastery,
          [currentTheme]: Math.min(100, Number(current.mastery?.[currentTheme] || topicProgress) + 8),
        },
      }
    })
  }

  function nextExercise() {
    if (!feedback?.correct && currentExercise?.type !== 'writing') return

    if (exerciseIndex < (lesson?.exercises?.length || 0) - 1) {
      setExerciseIndex((index) => index + 1)
      setFeedback(null)
      setSelectedAnswer(null)
      setTextAnswer('')
      return
    }

    awardLesson()
    setLesson(null)
    setFeedback(null)
    setSelectedAnswer(null)
    setTextAnswer('')
  }

  return (
    <section className="dino-learn">
      <div className="dino-learn-topbar">
        <div>
          <span className="dino-learn-kicker">AI learning path</span>
          <h1>Dino Learn</h1>
          <p>{language} · {currentTheme}</p>
        </div>

        <div className="dino-learn-stats">
          <div className="dino-learn-stat"><strong>🔥 {state.streak}</strong><span>streak</span></div>
          <div className="dino-learn-stat"><strong>⚡ {state.xp}</strong><span>XP</span></div>
          <div className="dino-learn-stat"><strong>🎯 {state.dailyXp}/{state.dailyGoal}</strong><span>today</span></div>
          <div className="dino-learn-stat"><strong>📚 {progress}%</strong><span>course</span></div>
        </div>
      </div>

      <div className="dino-learn-grid">
        <div className="dino-learn-left">
          <div className="dino-learn-hero">
            <div className="dino-learn-hero-copy">
              <span className="dino-learn-label">Continue learning</span>
              <h2>{currentTopic?.topic || 'Your next lesson'}</h2>
              <p>{currentTheme} · {currentTopic?.local || currentTopic?.topic}</p>
              <div className="dino-learn-hero-meta">
                <span>Lesson {nextTopicIndex + 1} of {orderedTopics.length}</span>
                <span>{level}</span>
              </div>
              <div className="dino-learn-progress-track">
                <div className="dino-learn-progress-fill" style={{ width: `${Math.max(8, progress)}%` }} />
              </div>
              <button type="button" className="dino-learn-primary" onClick={() => openLesson()} disabled={lessonLoading}>
                {lessonLoading ? 'Building your lesson…' : 'Continue learning →'}
              </button>
            </div>

            <div className="dino-learn-daily">
              <span className="dino-learn-label">Daily goal</span>
              <strong>{state.dailyXp} / {state.dailyGoal} XP</strong>
              <div className="dino-learn-daily-track"><div style={{ width: `${dailyPercent}%` }} /></div>
              <small>{dailyPercent >= 100 ? 'Goal complete. Keep the momentum.' : `${Math.max(0, state.dailyGoal - state.dailyXp)} XP remaining today`}</small>
            </div>
          </div>

          <div className="dino-learn-path-card">
            <div className="dino-learn-section-heading">
              <div>
                <span className="dino-learn-label">Learning path</span>
                <h3>Your course, turned into a journey.</h3>
              </div>
              <span className="dino-learn-chip">{orderedTopics.length} topics</span>
            </div>

            <div className="dino-learn-path">
              <div className="dino-learn-path-line" />
              {pathItems.map((item, index) => (
                <button
                  type="button"
                  key={`${item.theme}-${item.topic}`}
                  className={`dino-learn-node-row ${item.status}`}
                  onClick={() => item.status !== 'locked' && openLesson(item)}
                  disabled={item.status === 'locked'}
                >
                  <span className="dino-learn-node">{item.status === 'completed' ? '✓' : item.status === 'locked' ? '🔒' : index + 1}</span>
                  <span className="dino-learn-node-copy">
                    <strong>{item.topic}</strong>
                    <small>{item.theme} · {index % 3 === 0 ? 'Vocabulary' : index % 3 === 1 ? 'Grammar' : 'AI Practice'}</small>
                  </span>
                  <span className="dino-learn-node-status">{item.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="dino-learn-right">
          <div className="dino-learn-side-card">
            <div className="dino-learn-section-heading compact">
              <div>
                <span className="dino-learn-label">Skill mastery</span>
                <h3>Know what is improving.</h3>
              </div>
            </div>

            <div className="dino-learn-mastery-list">
              {['Identities', 'Experiences', 'Human ingenuity', 'Social organization', 'Sharing the planet'].map((theme) => {
                const value = Number(state.mastery?.[theme] || (theme === currentTheme ? topicProgress : 20))
                return (
                  <div className="dino-learn-mastery" key={theme}>
                    <div><strong>{theme}</strong><span>{value}%</span></div>
                    <div className="dino-learn-mini-track"><span style={{ width: `${value}%` }} /></div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="dino-learn-side-card flashcard-side">
            <div className="dino-learn-section-heading compact">
              <div>
                <span className="dino-learn-label">Review</span>
                <h3>Keep weak words alive.</h3>
              </div>
              <button type="button" className="dino-learn-icon-button" onClick={() => setFlashOpen((open) => !open)} aria-label="Flip review card">↻</button>
            </div>

            <button type="button" className={`dino-learn-flashcard ${flashOpen ? 'revealed' : ''}`} onClick={() => setFlashOpen((open) => !open)}>
              <span>{flashOpen ? flashcard.meaning : flashcard.term}</span>
              <small>{flashOpen ? 'meaning' : 'tap to reveal'}</small>
            </button>

            <button type="button" className="dino-learn-secondary" onClick={() => setShowReview((open) => !open)}>
              {showReview ? 'Hide review details' : 'Review mistakes'}
            </button>
            {showReview && (
              <div className="dino-learn-review-list">
                {state.weakAreas.length ? state.weakAreas.slice(0, 4).map((item) => <span key={item}>{item}</span>) : <span>No recurring weak areas yet.</span>}
              </div>
            )}
          </div>

          {lessonError && <div className="dino-learn-warning">{lessonError}</div>}
        </aside>
      </div>

      {lesson && currentExercise && (
        <div className="dino-learn-overlay" role="dialog" aria-modal="true" aria-label="Dino lesson">
          <div className="dino-learn-modal">
            <div className="dino-learn-modal-top">
              <button type="button" className="dino-learn-close" onClick={() => setLesson(null)}>×</button>
              <div className="dino-learn-modal-progress">
                <span>Lesson</span>
                <div><span style={{ width: `${((exerciseIndex + 1) / lesson.exercises.length) * 100}%` }} /></div>
                <strong>{exerciseIndex + 1}/{lesson.exercises.length}</strong>
              </div>
              <span className="dino-learn-hearts">♥ ♥ ♥</span>
            </div>

            <div className="dino-learn-modal-content">
              <span className="dino-learn-label">{currentExercise.title}</span>
              <h2>{lesson.title}</h2>
              <p className="dino-learn-question">{currentExercise.question}</p>

              {currentExercise.type === 'writing' || currentExercise.type === 'translation' ? (
                <div className="dino-learn-answer-block">
                  <p>{currentExercise.prompt}</p>
                  <textarea
                    value={textAnswer}
                    onChange={(event) => setTextAnswer(event.target.value)}
                    placeholder={currentExercise.type === 'writing' ? 'Write your response here…' : 'Type your translation…'}
                    rows={currentExercise.type === 'writing' ? 8 : 4}
                  />
                </div>
              ) : (
                <div className="dino-learn-options">
                  {(currentExercise.options || []).map((option, index) => (
                    <button
                      type="button"
                      key={`${option}-${index}`}
                      className={selectedAnswer === index ? 'selected' : ''}
                      onClick={() => setSelectedAnswer(index)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {feedback && (
                <div className={`dino-learn-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                  <strong>{feedback.correct ? 'Correct' : 'Keep going'}</strong>
                  <p>{feedback.message}</p>
                </div>
              )}
            </div>

            <div className="dino-learn-modal-footer">
              <span>+{currentExercise.type === 'writing' ? 20 : currentExercise.type === 'reading' ? 15 : 10} XP</span>
              {!feedback ? (
                <button type="button" className="dino-learn-primary" onClick={evaluateExercise}>Check answer</button>
              ) : (
                <button type="button" className="dino-learn-primary" onClick={nextExercise} disabled={!feedback.correct && currentExercise.type !== 'writing'}>
                  {exerciseIndex < lesson.exercises.length - 1 ? 'Next →' : 'Finish lesson'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}