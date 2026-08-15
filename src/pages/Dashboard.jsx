import { useEffect, useMemo, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'

/*
|--------------------------------------------------------------------------
| Groq
|--------------------------------------------------------------------------
|
| For local development:
|
|   .env
|   VITE_GROQ_API_KEY=your_key_here
|
| IMPORTANT:
| Putting a Groq API key directly in a Vite frontend exposes it to users.
| This is acceptable for a local prototype, but production should proxy
| requests through your own backend/server.
|
*/

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

const GROQ_ENDPOINT =
  'https://api.groq.com/openai/v1/chat/completions'

const GROQ_MODEL = 'openai/gpt-oss-120b'

/* ==========================================================================
   WRITING
   ========================================================================== */

const writingTypes = [
  'Article',
  'Blog',
  'Formal letter',
  'Email',
  'Speech',
  'Proposal',
  'Review',
  'Interview',
]

/* ==========================================================================
   IB LANGUAGE B COURSE OUTLINE
   ========================================================================== */

const COURSE = {
  'French B': {
    themes: [
      {
        en: 'Identities',
        local: 'Identités',
        topics: [
          ['Lifestyles', 'Modes de vie'],
          ['Health and wellbeing', 'Santé et bien-être'],
          ['Beliefs and values', 'Croyances et valeurs'],
          ['Subcultures', 'Sous-cultures'],
          ['Language and identity', 'Langue et identité'],
        ],
      },
      {
        en: 'Experiences',
        local: 'Expériences',
        topics: [
          ['Leisure activities', 'Activités de loisirs'],
          ['Holidays and travel', 'Vacances et voyages'],
          ['Life stories', 'Récits de vie'],
          ['Rites of passage', 'Rites de passage'],
          ['Customs and traditions', 'Coutumes et traditions'],
          ['Migration', 'Migration'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Ingéniosité humaine',
        topics: [
          ['Entertainment', 'Divertissement'],
          ['Artistic expressions', 'Expressions artistiques'],
          ['Communication and media', 'Communication et médias'],
          ['Technology', 'Technologie'],
          ['Scientific innovation', 'Innovation scientifique'],
        ],
      },
      {
        en: 'Social organization',
        local: 'Organisation sociale',
        topics: [
          ['Social relationships', 'Relations sociales'],
          ['Community', 'Communauté'],
          ['Social engagement', 'Engagement social'],
          ['Education', 'Éducation'],
          ['The world of work', 'Le monde du travail'],
          ['Law and order', 'Droit et ordre public'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Partage de la planète',
        topics: [
          ['The environment', "L’environnement"],
          ['Human rights', 'Droits humains'],
          ['Peace and conflict', 'Paix et conflits'],
          ['Equality', 'Égalité'],
          ['Globalization', 'Mondialisation'],
          ['Ethics', 'Éthique'],
          ['Urban and rural environment', 'Environnement urbain et rural'],
        ],
      },
    ],
  },

  'Spanish B': {
    themes: [
      {
        en: 'Identities',
        local: 'Identidades',
        topics: [
          ['Lifestyles', 'Estilos de vida'],
          ['Health and wellbeing', 'Salud y bienestar'],
          ['Beliefs and values', 'Creencias y valores'],
          ['Subcultures', 'Subculturas'],
          ['Language and identity', 'Lengua e identidad'],
        ],
      },
      {
        en: 'Experiences',
        local: 'Experiencias',
        topics: [
          ['Leisure activities', 'Actividades de ocio'],
          ['Holidays and travel', 'Vacaciones y viajes'],
          ['Life stories', 'Historias de vida'],
          ['Rites of passage', 'Ritos de paso'],
          ['Customs and traditions', 'Costumbres y tradiciones'],
          ['Migration', 'Migración'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Ingenio humano',
        topics: [
          ['Entertainment', 'Entretenimiento'],
          ['Artistic expressions', 'Expresiones artísticas'],
          ['Communication and media', 'Comunicación y medios'],
          ['Technology', 'Tecnología'],
          ['Scientific innovation', 'Innovación científica'],
        ],
      },
      {
        en: 'Social organization',
        local: 'Organización social',
        topics: [
          ['Social relationships', 'Relaciones sociales'],
          ['Community', 'Comunidad'],
          ['Social engagement', 'Participación social'],
          ['Education', 'Educación'],
          ['The world of work', 'El mundo laboral'],
          ['Law and order', 'Ley y orden'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Compartir el planeta',
        topics: [
          ['The environment', 'El medio ambiente'],
          ['Human rights', 'Derechos humanos'],
          ['Peace and conflict', 'Paz y conflicto'],
          ['Equality', 'Igualdad'],
          ['Globalization', 'Globalización'],
          ['Ethics', 'Ética'],
          ['Urban and rural environment', 'Entorno urbano y rural'],
        ],
      },
    ],
  },

  'Chinese B': {
    themes: [
      {
        en: 'Identities',
        local: '身份认同',
        topics: [
          ['Lifestyles', '生活方式'],
          ['Health and wellbeing', '健康与身心福祉'],
          ['Beliefs and values', '信仰与价值观'],
          ['Subcultures', '亚文化'],
          ['Language and identity', '语言与身份认同'],
        ],
      },
      {
        en: 'Experiences',
        local: '经历',
        topics: [
          ['Leisure activities', '休闲活动'],
          ['Holidays and travel', '假期与旅行'],
          ['Life stories', '人生故事'],
          ['Rites of passage', '人生阶段仪式'],
          ['Customs and traditions', '习俗与传统'],
          ['Migration', '移民与迁徙'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: '人类智慧',
        topics: [
          ['Entertainment', '娱乐'],
          ['Artistic expressions', '艺术表达'],
          ['Communication and media', '传播与媒体'],
          ['Technology', '科技'],
          ['Scientific innovation', '科学创新'],
        ],
      },
      {
        en: 'Social organization',
        local: '社会组织',
        topics: [
          ['Social relationships', '社会关系'],
          ['Community', '社区'],
          ['Social engagement', '社会参与'],
          ['Education', '教育'],
          ['The world of work', '工作世界'],
          ['Law and order', '法律与秩序'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: '共享地球',
        topics: [
          ['The environment', '环境'],
          ['Human rights', '人权'],
          ['Peace and conflict', '和平与冲突'],
          ['Equality', '平等'],
          ['Globalization', '全球化'],
          ['Ethics', '伦理'],
          ['Urban and rural environment', '城市与农村环境'],
        ],
      },
    ],
  },

  'English B': {
    themes: [
      {
        en: 'Identities',
        local: 'Identities',
        topics: [
          ['Lifestyles', 'Lifestyles'],
          ['Health and wellbeing', 'Health and wellbeing'],
          ['Beliefs and values', 'Beliefs and values'],
          ['Subcultures', 'Subcultures'],
          ['Language and identity', 'Language and identity'],
        ],
      },
      {
        en: 'Experiences',
        local: 'Experiences',
        topics: [
          ['Leisure activities', 'Leisure activities'],
          ['Holidays and travel', 'Holidays and travel'],
          ['Life stories', 'Life stories'],
          ['Rites of passage', 'Rites of passage'],
          ['Customs and traditions', 'Customs and traditions'],
          ['Migration', 'Migration'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Human ingenuity',
        topics: [
          ['Entertainment', 'Entertainment'],
          ['Artistic expressions', 'Artistic expressions'],
          ['Communication and media', 'Communication and media'],
          ['Technology', 'Technology'],
          ['Scientific innovation', 'Scientific innovation'],
        ],
      },
      {
        en: 'Social organization',
        local: 'Social organization',
        topics: [
          ['Social relationships', 'Social relationships'],
          ['Community', 'Community'],
          ['Social engagement', 'Social engagement'],
          ['Education', 'Education'],
          ['The world of work', 'The world of work'],
          ['Law and order', 'Law and order'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Sharing the planet',
        topics: [
          ['The environment', 'The environment'],
          ['Human rights', 'Human rights'],
          ['Peace and conflict', 'Peace and conflict'],
          ['Equality', 'Equality'],
          ['Globalization', 'Globalization'],
          ['Ethics', 'Ethics'],
          ['Urban and rural environment', 'Urban and rural environment'],
        ],
      },
    ],
  },

  'German B': {
    themes: [
      {
        en: 'Identities',
        local: 'Identitäten',
        topics: [
          ['Lifestyles', 'Lebensstile'],
          ['Health and wellbeing', 'Gesundheit und Wohlbefinden'],
          ['Beliefs and values', 'Glaubensvorstellungen und Werte'],
          ['Subcultures', 'Subkulturen'],
          ['Language and identity', 'Sprache und Identität'],
        ],
      },
      {
        en: 'Experiences',
        local: 'Erfahrungen',
        topics: [
          ['Leisure activities', 'Freizeitaktivitäten'],
          ['Holidays and travel', 'Urlaub und Reisen'],
          ['Life stories', 'Lebensgeschichten'],
          ['Rites of passage', 'Übergangsriten'],
          ['Customs and traditions', 'Bräuche und Traditionen'],
          ['Migration', 'Migration'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Menschlicher Erfindergeist',
        topics: [
          ['Entertainment', 'Unterhaltung'],
          ['Artistic expressions', 'Künstlerische Ausdrucksformen'],
          ['Communication and media', 'Kommunikation und Medien'],
          ['Technology', 'Technologie'],
          ['Scientific innovation', 'Wissenschaftliche Innovation'],
        ],
      },
      {
        en: 'Social organization',
        local: 'Soziale Organisation',
        topics: [
          ['Social relationships', 'Soziale Beziehungen'],
          ['Community', 'Gemeinschaft'],
          ['Social engagement', 'Soziales Engagement'],
          ['Education', 'Bildung'],
          ['The world of work', 'Arbeitswelt'],
          ['Law and order', 'Recht und Ordnung'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Den Planeten teilen',
        topics: [
          ['The environment', 'Die Umwelt'],
          ['Human rights', 'Menschenrechte'],
          ['Peace and conflict', 'Frieden und Konflikte'],
          ['Equality', 'Gleichheit'],
          ['Globalization', 'Globalisierung'],
          ['Ethics', 'Ethik'],
          ['Urban and rural environment', 'Städtische und ländliche Umwelt'],
        ],
      },
    ],
  },

  'Italian B': {
    themes: [
      {
        en: 'Identities',
        local: 'Identità',
        topics: [
          ['Lifestyles', 'Stili di vita'],
          ['Health and wellbeing', 'Salute e benessere'],
          ['Beliefs and values', 'Credenze e valori'],
          ['Subcultures', 'Sottoculture'],
          ['Language and identity', 'Lingua e identità'],
        ],
      },
      {
        en: 'Experiences',
        local: 'Esperienze',
        topics: [
          ['Leisure activities', 'Attività del tempo libero'],
          ['Holidays and travel', 'Vacanze e viaggi'],
          ['Life stories', 'Storie di vita'],
          ['Rites of passage', 'Riti di passaggio'],
          ['Customs and traditions', 'Usi e tradizioni'],
          ['Migration', 'Migrazione'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Ingegno umano',
        topics: [
          ['Entertainment', 'Intrattenimento'],
          ['Artistic expressions', 'Espressioni artistiche'],
          ['Communication and media', 'Comunicazione e media'],
          ['Technology', 'Tecnologia'],
          ['Scientific innovation', 'Innovazione scientifica'],
        ],
      },
      {
        en: 'Social organization',
        local: 'Organizzazione sociale',
        topics: [
          ['Social relationships', 'Relazioni sociali'],
          ['Community', 'Comunità'],
          ['Social engagement', 'Impegno sociale'],
          ['Education', 'Istruzione'],
          ['The world of work', 'Mondo del lavoro'],
          ['Law and order', 'Legge e ordine'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Condivisione del pianeta',
        topics: [
          ['The environment', "L'ambiente"],
          ['Human rights', 'Diritti umani'],
          ['Peace and conflict', 'Pace e conflitto'],
          ['Equality', 'Uguaglianza'],
          ['Globalization', 'Globalizzazione'],
          ['Ethics', 'Etica'],
          ['Urban and rural environment', 'Ambiente urbano e rurale'],
        ],
      },
    ],
  },

  'Japanese B': {
    themes: [
      {
        en: 'Identities',
        local: 'アイデンティティ',
        topics: [
          ['Lifestyles', 'ライフスタイル'],
          ['Health and wellbeing', '健康とウェルビーイング'],
          ['Beliefs and values', '信念と価値観'],
          ['Subcultures', 'サブカルチャー'],
          ['Language and identity', '言語とアイデンティティ'],
        ],
      },
      {
        en: 'Experiences',
        local: '経験',
        topics: [
          ['Leisure activities', '余暇活動'],
          ['Holidays and travel', '休暇と旅行'],
          ['Life stories', '人生の物語'],
          ['Rites of passage', '通過儀礼'],
          ['Customs and traditions', '習慣と伝統'],
          ['Migration', '移住'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: '人間の創意工夫',
        topics: [
          ['Entertainment', 'エンターテインメント'],
          ['Artistic expressions', '芸術表現'],
          ['Communication and media', 'コミュニケーションとメディア'],
          ['Technology', 'テクノロジー'],
          ['Scientific innovation', '科学技術の革新'],
        ],
      },
      {
        en: 'Social organization',
        local: '社会組織',
        topics: [
          ['Social relationships', '社会的関係'],
          ['Community', 'コミュニティ'],
          ['Social engagement', '社会参加'],
          ['Education', '教育'],
          ['The world of work', '仕事の世界'],
          ['Law and order', '法律と秩序'],
        ],
      },
      {
        en: 'Sharing the planet',
        local: '地球を共有すること',
        topics: [
          ['The environment', '環境'],
          ['Human rights', '人権'],
          ['Peace and conflict', '平和と紛争'],
          ['Equality', '平等'],
          ['Globalization', 'グローバル化'],
          ['Ethics', '倫理'],
          ['Urban and rural environment', '都市と農村の環境'],
        ],
      },
    ],
  },
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

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

function safeParseJSON(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function cleanModelJSON(text) {
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)

    if (!match) {
      return null
    }

    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

/* ==========================================================================
   GROQ API
   ========================================================================== */

async function callGroq({
  system,
  user,
  responseFormat,
  temperature = 0.3,
  maxTokens = 1800,
}) {
  if (!GROQ_API_KEY) {
    throw new Error(
      'Missing VITE_GROQ_API_KEY. Add it to your .env file and restart Vite.',
    )
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature,
      max_completion_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: user,
        },
      ],
      ...(responseFormat
        ? {
            response_format: responseFormat,
          }
        : {}),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `Groq request failed with status ${response.status}.`

    throw new Error(message)
  }

  return data?.choices?.[0]?.message?.content || ''
}

/* ==========================================================================
   QUESTION GENERATION SCHEMA
   ========================================================================== */

const QUESTION_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'ib_language_b_question_set',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        instructions: {
          type: 'string',
        },
        questions: {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
              },
              question: {
                type: 'string',
              },
              context: {
                type: 'string',
              },
              answer: {
                type: 'string',
              },
              explanation: {
                type: 'string',
              },
            },
            required: [
              'id',
              'question',
              'context',
              'answer',
              'explanation',
            ],
            additionalProperties: false,
          },
        },
      },
      required: [
        'title',
        'instructions',
        'questions',
      ],
      additionalProperties: false,
    },
  },
}

/* ==========================================================================
   APP
   ========================================================================== */

function Dashboard() {
  const [activeTab, setActiveTab] = useState('course')

  const [language, setLanguage] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])

  const [writingTopic, setWritingTopic] = useState('')
  const [writingType, setWritingType] = useState('Article')
  const [generatedPrompt, setGeneratedPrompt] = useState('')

  /* Reading */

  const [readingType, setReadingType] = useState(
    'Mixed',
  )

  const [readingTopic, setReadingTopic] = useState('')

  const [generatedQuestions, setGeneratedQuestions] =
    useState(null)

  const [isGeneratingQuestions, setIsGeneratingQuestions] =
    useState(false)

  const [questionError, setQuestionError] =
    useState('')

  const [answerDraft, setAnswerDraft] = useState('')

  const [answerSubmission, setAnswerSubmission] =
    useState({
      1: '',
      2: '',
    })

  const [grading, setGrading] = useState(false)

  const [gradingResult, setGradingResult] =
    useState(null)

  const [chatMessages, setChatMessages] = useState([])

  const [chatInput, setChatInput] = useState('')

  const [chatTyping, setChatTyping] = useState(false)

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */

  useEffect(() => {
    document.body.dataset.page = 'dashboard'

    return () => {
      delete document.body.dataset.page
    }
  }, [])

  useEffect(() => {
    const savedLanguage =
      getCookie('dino_language')

    setLanguage(
      savedLanguage || 'English B',
    )

    try {
      const savedTopics =
        localStorage.getItem(
          'dino_completed_topics',
        )

      if (savedTopics) {
        const parsed = JSON.parse(
          savedTopics,
        )

        if (Array.isArray(parsed)) {
          setSelectedTopics(parsed)
        }
      }
    } catch {
      setSelectedTopics([])
    }
  }, [])

  /* ==========================================================================
     COURSE
     ========================================================================== */

  const course = useMemo(() => {
    return (
      COURSE[language] ||
      COURSE['English B']
    )
  }, [language])

  const allTopics = useMemo(() => {
    return course.themes.flatMap(
      (theme) =>
        theme.topics.map(
          (topic) => ({
            theme: theme.en,
            themeLocal: theme.local,
            topic: topic[0],
            local: topic[1],
          }),
        ),
    )
  }, [course])

  const completedCount =
    selectedTopics.length

  const totalCount =
    allTopics.length

  const courseProgress =
    totalCount > 0
      ? Math.round(
          (completedCount /
            totalCount) *
            100,
        )
      : 0

  const toggleTopic = (
    themeName,
    topicEnglish,
  ) => {
    const id =
      `${themeName}::${topicEnglish}`

    setSelectedTopics(
      (current) => {
        const next =
          current.includes(id)
            ? current.filter(
                (item) =>
                  item !== id,
              )
            : [
                ...current,
                id,
              ]

        localStorage.setItem(
          'dino_completed_topics',
          JSON.stringify(next),
        )

        return next
      },
    )
  }

  const isCompleted = (
    themeName,
    topicEnglish,
  ) => {
    return selectedTopics.includes(
      `${themeName}::${topicEnglish}`,
    )
  }

  /* ==========================================================================
     READING QUESTION GENERATION
     ========================================================================== */

  const generateReadingQuestions =
    async () => {
      if (
        !readingTopic ||
        !readingType
      ) {
        return
      }

      setQuestionError('')
      setGradingResult(null)
      setAnswerSubmission({
        1: '',
        2: '',
      })
      setAnswerDraft('')
      setGeneratedQuestions(null)
      setIsGeneratingQuestions(true)

      const selectedTopic =
        allTopics.find(
          (item) =>
            item.topic ===
            readingTopic,
        )

      try {
        const systemPrompt = `
You are Dino, an expert IB Language B tutor.

Your task is to create high-quality reading comprehension practice for an IB Language B student.

Follow these rules carefully:

1. The student's Language B is: ${language}.
2. The IB theme is: ${selectedTopic?.theme || 'General Language B'}.
3. The specific course topic is: ${selectedTopic?.topic || readingTopic}.
4. The topic's equivalent in the student's language is:
   ${selectedTopic?.local || readingTopic}.
5. The requested question style is: ${readingType}.
6. Produce exactly TWO questions.
7. Questions must be appropriate for IB Language B students.
8. Questions should test actual reading/comprehension ability rather than random trivia.
9. The context can be a short original passage if needed.
10. If a passage is used, write it yourself. Do not reproduce copyrighted source material.
11. Questions should be answerable from the supplied context.
12. The answer field must contain the correct answer.
13. The explanation must briefly explain why that answer is correct.
14. Keep the questions challenging enough to be useful but concise enough for a dashboard.
15. The student will later answer through a tutor chat. Make the answer keys robust enough for semantic grading.
16. Do not mention that you are an AI.
17. Return ONLY the requested structured data.
`.trim()

        const userPrompt = `
Create a two-question IB Language B reading practice set.

Language B:
${language}

IB theme:
${selectedTopic?.theme || 'General'}

Course topic:
${selectedTopic?.topic || readingTopic}

Course topic in the target language:
${selectedTopic?.local || readingTopic}

Question type:
${readingType}

Make the two questions meaningfully different.
`.trim()

        const raw = await callGroq({
          system: systemPrompt,
          user: userPrompt,
          responseFormat:
            QUESTION_SCHEMA,
          temperature: 0.35,
          maxTokens: 1800,
        })

        const parsed =
          cleanModelJSON(raw)

        if (
          !parsed ||
          !Array.isArray(
            parsed.questions,
          ) ||
          parsed.questions.length !== 2
        ) {
          throw new Error(
            'Groq returned an unexpected question format.',
          )
        }

        const normalizedQuestions =
          parsed.questions.map(
            (question, index) => ({
              id:
                question.id ||
                index + 1,
              question:
                question.question,
              context:
                question.context ||
                '',
              answer:
                question.answer,
              explanation:
                question.explanation ||
                '',
            }),
          )

        const result = {
          title:
            parsed.title ||
            `${readingTopic} practice`,
          instructions:
            parsed.instructions ||
            'Answer both questions.',
          questions:
            normalizedQuestions,
        }

        setGeneratedQuestions(
          result,
        )

        setChatMessages([
          {
            role: 'tutor',
            text: `I've created two ${readingType.toLowerCase()} reading questions on ${readingTopic}. Answer both in the chat using "1: ..." and "2: ...". I'll mark them once I have both.`,
          },
        ])
      } catch (error) {
        setQuestionError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while generating the questions.',
        )
      } finally {
        setIsGeneratingQuestions(
          false,
        )
      }
    }

  /* ==========================================================================
     ANSWER EXTRACTION
     ========================================================================== */

  const parseSubmittedAnswers =
    (text) => {
      const normalized =
        text.replace(
          /\r/g,
          '',
        )

      const answer1 =
        normalized.match(
          /(?:^|\n)\s*1\s*[:.)-]\s*([\s\S]*?)(?=\n\s*2\s*[:.)-]|$)/i,
        )

      const answer2 =
        normalized.match(
          /(?:^|\n)\s*2\s*[:.)-]\s*([\s\S]*)$/i,
        )

      return {
        one:
          answer1?.[1]?.trim() ||
          '',
        two:
          answer2?.[1]?.trim() ||
          '',
      }
    }

  const bothAnswersPresent = (
    answers,
  ) => {
    return (
      Boolean(
        answers.one.trim(),
      ) &&
      Boolean(
        answers.two.trim(),
      )
    )
  }

  /* ==========================================================================
     GRADE ANSWERS
     ========================================================================== */

  const gradeReadingAnswers =
    async (
      providedAnswers,
    ) => {
      if (
        !generatedQuestions ||
        grading
      ) {
        return
      }

      setGrading(true)
      setChatTyping(true)
      setQuestionError('')

      try {
        const systemPrompt = `
You are Dino, an expert IB Language B reading tutor.

You are grading a student's answers to exactly two reading questions.

Be encouraging but academically honest.

Your job is to:
- judge whether each answer is correct
- allow equivalent wording where the meaning is correct
- consider the student's target Language B
- distinguish fully correct, partially correct, and incorrect responses
- explain mistakes clearly
- do not invent requirements that the question did not ask for
- do not penalize harmless wording differences
- keep feedback concise
- give one overall result
- do not pretend to have access to a marking rubric that was not supplied

Return ONLY the requested structured JSON.
`.trim()

        const userPrompt = `
LANGUAGE:
${language}

TOPIC:
${readingTopic}

QUESTION 1:
${generatedQuestions.questions[0].question}

CONTEXT 1:
${generatedQuestions.questions[0].context}

OFFICIAL ANSWER 1:
${generatedQuestions.questions[0].answer}

QUESTION 2:
${generatedQuestions.questions[1].question}

CONTEXT 2:
${generatedQuestions.questions[1].context}

OFFICIAL ANSWER 2:
${generatedQuestions.questions[1].answer}

STUDENT ANSWER 1:
${providedAnswers.one}

STUDENT ANSWER 2:
${providedAnswers.two}

Grade both answers.
`.trim()

        const responseFormat = {
          type: 'json_schema',
          json_schema: {
            name: 'ib_reading_grade',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                overall: {
                  type: 'string',
                },
                score: {
                  type: 'integer',
                },
                feedback: {
                  type: 'string',
                },
                question_1: {
                  type: 'object',
                  properties: {
                    correct: {
                      type: 'boolean',
                    },
                    score: {
                      type: 'integer',
                    },
                    feedback: {
                      type: 'string',
                    },
                  },
                  required: [
                    'correct',
                    'score',
                    'feedback',
                  ],
                  additionalProperties:
                    false,
                },
                question_2: {
                  type: 'object',
                  properties: {
                    correct: {
                      type: 'boolean',
                    },
                    score: {
                      type: 'integer',
                    },
                    feedback: {
                      type: 'string',
                    },
                  },
                  required: [
                    'correct',
                    'score',
                    'feedback',
                  ],
                  additionalProperties:
                    false,
                },
              },
              required: [
                'overall',
                'score',
                'feedback',
                'question_1',
                'question_2',
              ],
              additionalProperties:
                false,
            },
          },
        }

        const raw =
          await callGroq({
            system:
              systemPrompt,
            user:
              userPrompt,
            responseFormat,
            temperature: 0.15,
            maxTokens: 1000,
          })

        const parsed =
          cleanModelJSON(raw)

        if (!parsed) {
          throw new Error(
            'Groq returned an invalid grading response.',
          )
        }

        setGradingResult(
          parsed,
        )

        setChatMessages(
          (current) => [
            ...current,
            {
              role: 'tutor',
              text: `I've marked both answers. You scored ${parsed.score}/2. ${parsed.feedback}`,
            },
          ],
        )

        /*
         * The generated question set deliberately disappears
         * after both answers have been graded.
         */

        setTimeout(() => {
          setGeneratedQuestions(
            null,
          )

          setAnswerSubmission({
            1: '',
            2: '',
          })

          setAnswerDraft('')
        }, 2500)
      } catch (error) {
        setQuestionError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while grading your answers.',
        )
      } finally {
        setGrading(false)
        setChatTyping(false)
      }
    }

  /* ==========================================================================
     CHAT
     ========================================================================== */

  const sendReadingChat =
    async () => {
      const text =
        chatInput.trim()

      if (!text || chatTyping) {
        return
      }

      const parsedAnswers =
        parseSubmittedAnswers(
          text,
        )

      const updatedAnswers = {
        one:
          parsedAnswers.one ||
          answerSubmission[1],
        two:
          parsedAnswers.two ||
          answerSubmission[2],
      }

      setChatMessages(
        (current) => [
          ...current,
          {
            role: 'user',
            text,
          },
        ],
      )

      setChatInput('')

      if (
        generatedQuestions &&
        bothAnswersPresent(
          updatedAnswers,
        )
      ) {
        setAnswerSubmission({
          1: updatedAnswers.one,
          2: updatedAnswers.two,
        })

        await gradeReadingAnswers(
          updatedAnswers,
        )

        return
      }

      /*
       * Normal tutor conversation.
       * This uses the actual Groq model too.
       */

      setChatTyping(true)

      try {
        const tutorSystem = `
You are Dino, an IB Language B reading tutor.

The student's language is ${language}.
The current course topic is ${readingTopic || 'not selected'}.

You are helping the student with a reading practice session.

Rules:
- Be concise.
- Encourage the student to answer the generated questions.
- Do not reveal answer keys before grading.
- If they ask about the questions, clarify rather than immediately giving the answer.
- If they have not supplied both answers, remind them to answer using:
  1: ...
  2: ...
- You are a tutor, not a generic chatbot.
`.trim()

        const conversation =
          chatMessages
            .slice(-8)
            .map(
              (
                message,
              ) => ({
                role:
                  message.role ===
                  'tutor'
                    ? 'assistant'
                    : 'user',
                content:
                  message.text,
              }),
            )

        const raw =
          await callGroq({
            system:
              tutorSystem,
            user:
              text,
            temperature: 0.35,
            maxTokens: 500,
          })

        setChatMessages(
          (current) => [
            ...current,
            {
              role: 'tutor',
              text:
                raw ||
                'I could not generate a response.',
            },
          ],
        )
      } catch (error) {
        setChatMessages(
          (current) => [
            ...current,
            {
              role: 'tutor',
              text:
                error instanceof Error
                  ? error.message
                  : 'Tutor connection failed.',
            },
          ],
        )
      } finally {
        setChatTyping(false)
      }
    }

  const handleChatKeyDown =
    (event) => {
      if (
        event.key === 'Enter' &&
        !event.shiftKey
      ) {
        event.preventDefault()
        sendReadingChat()
      }
    }

  /* ==========================================================================
     WRITING
     ========================================================================== */

  const createPrompt =
    () => {
      if (!writingTopic) {
        return
      }

      const selected =
        allTopics.find(
          (item) =>
            item.topic ===
            writingTopic,
        )

      if (!selected) {
        return
      }

      const prompt =
        `Write a ${writingType.toLowerCase()} about ${selected.topic.toLowerCase()} (${selected.local}) within the theme "${selected.theme}". Develop a clear perspective, support your ideas with relevant examples, and use language appropriate for an IB Language B audience.`

      setGeneratedPrompt(
        prompt,
      )
    }

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <>
      <style>{`
        body[data-page="dashboard"] {
          overflow: hidden !important;
        }

        body[data-page="dashboard"] .navbar {
          display: none !important;
        }

        .dino-dashboard {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100dvh;
          padding: 28px 34px 24px;
          overflow: hidden;
        }

        .dino-dashboard-shell {
          position: relative;
          z-index: 10;
          width: min(1260px, 100%);
          height: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .dino-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          flex: 0 0 auto;
        }

        .dino-kicker {
          display: block;
          margin-bottom: 8px;
          color: #878787;
          font-size: 10px;
          line-height: 1;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .03em;
        }

        .dino-dashboard-heading {
          margin: 0;
          color: #0a0a0a;
          font-family: Inter, sans-serif;
          font-size: clamp(42px, 5vw, 64px);
          line-height: .93;
          font-weight: 600;
          letter-spacing: -.085em;
        }

        .dino-dashboard-heading span {
          font-style: italic;
        }

        .dino-progress {
          width: 210px;
          flex: 0 0 210px;
        }

        .dino-progress-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #858585;
          font-size: 9px;
        }

        .dino-progress-meta strong {
          color: #0a0a0a;
          font-size: 10px;
        }

        .dino-progress-track {
          height: 4px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(0,0,0,.065);
        }

        .dino-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #0a0a0a;
          transition: width .3s ease;
        }

        .dino-tabs {
          width: 100%;
          margin-top: 22px;
          padding: 4px;
          display: flex;
          gap: 3px;
          overflow-x: auto;
          scrollbar-width: none;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 14px;
          background: rgba(255,255,255,.72);
          backdrop-filter: blur(16px);
          flex: 0 0 auto;
        }

        .dino-tabs::-webkit-scrollbar {
          display: none;
        }

        .dino-tab {
          flex: 1 0 auto;
          min-height: 38px;
          padding: 8px 14px;
          border-radius: 10px;
          background: transparent;
          color: #767676;
          font-family: Inter, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -.025em;
          white-space: nowrap;
          cursor: pointer;
          transition:
            background .18s ease,
            color .18s ease;
        }

        .dino-tab:hover {
          color: #0a0a0a;
        }

        .dino-tab.active {
          background: #0a0a0a;
          color: #fff;
        }

        .dino-content {
          min-height: 0;
          flex: 1;
          margin-top: 18px;
          overflow: hidden;
        }

        .dino-panel {
          width: 100%;
          height: 100%;
          min-height: 0;
        }

        .dino-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
          margin-bottom: 15px;
        }

        .dino-panel-title {
          margin: 0;
          color: #0a0a0a;
          font-size: clamp(27px, 3vw, 38px);
          line-height: .96;
          font-weight: 600;
          letter-spacing: -.07em;
        }

        .dino-panel-title span {
          font-style: italic;
        }

        .dino-panel-description {
          max-width: 550px;
          margin: 7px 0 0;
          color: #777;
          font-size: 11px;
          line-height: 1.45;
        }

        .dino-subtle-note {
          max-width: 250px;
          color: #8d8d8d;
          font-size: 9px;
          line-height: 1.4;
          text-align: right;
        }

        /* =========================================================
           COURSE OUTLINE
           ========================================================= */

        .dino-theme-grid {
          height: calc(100% - 79px);
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 9px;
        }

        .dino-theme {
          min-width: 0;
          height: 100%;
          padding: 15px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 17px;
          background: rgba(255,255,255,.76);
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 35px rgba(0,0,0,.025);
          display: flex;
          flex-direction: column;
        }

        .dino-theme-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dino-theme-number,
        .dino-theme-count {
          color: #999;
          font-size: 8px;
          font-weight: 600;
        }

        .dino-theme-title {
          margin: 17px 0 0;
          font-size: 18px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: -.055em;
        }

        .dino-theme-local {
          margin-top: 4px;
          color: #777;
          font-size: 10px;
          font-weight: 500;
        }

        .dino-topic-list {
          min-height: 0;
          margin-top: 16px;
          overflow: auto;
          padding-right: 3px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dino-topic {
          position: relative;
          min-width: 0;
          padding: 7px 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          border-radius: 9px;
          cursor: pointer;
          transition: background .15s ease;
        }

        .dino-topic:hover {
          background: rgba(0,0,0,.035);
        }

        .dino-topic input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .dino-check {
          width: 15px;
          height: 15px;
          flex: 0 0 15px;
          border: 1px solid rgba(0,0,0,.2);
          border-radius: 4px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 8px;
          font-weight: 700;
        }

        .dino-topic:hover .dino-check {
          border-color: #0a0a0a;
        }

        .dino-topic.completed .dino-check {
          border-color: #0a0a0a;
          background: #0a0a0a;
        }

        .dino-topic-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .dino-topic-copy strong {
          overflow: hidden;
          color: #1b1b1b;
          font-size: 8.5px;
          line-height: 1.15;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dino-topic-copy small {
          margin-top: 2px;
          overflow: hidden;
          color: #929292;
          font-size: 7.5px;
          line-height: 1.15;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dino-topic.completed .dino-topic-copy {
          opacity: .38;
        }

        /* =========================================================
           READING
           ========================================================= */

        .dino-reading-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .dino-reading-workspace {
          min-height: 0;
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 14px;
        }

        .dino-reading-card {
          min-width: 0;
          min-height: 0;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px;
          background: rgba(255,255,255,.78);
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 35px rgba(0,0,0,.025);
        }

        /* GENERATOR */

        .dino-reading-generator {
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dino-card-topbar {
          height: 51px;
          padding: 0 17px;
          border-bottom: 1px solid rgba(0,0,0,.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 0 0 51px;
        }

        .dino-card-label {
          color: #898989;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .dino-card-status {
          padding: 5px 8px;
          border-radius: 99px;
          background: rgba(0,0,0,.035);
          color: #8a8a8a;
          font-size: 8px;
        }

        .dino-generator-body {
          min-height: 0;
          flex: 1;
          padding: 22px;
          overflow: auto;
        }

        .dino-generator-title {
          margin: 0;
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -.055em;
        }

        .dino-generator-description {
          max-width: 470px;
          margin: 7px 0 20px;
          color: #808080;
          font-size: 10px;
          line-height: 1.45;
        }

        .dino-generator-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .dino-field {
          min-width: 0;
        }

        .dino-field-full {
          grid-column: 1 / -1;
        }

        .dino-field-label {
          display: block;
          margin-bottom: 6px;
          color: #808080;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .02em;
        }

        .dino-select {
          width: 100%;
          min-height: 42px;
          padding: 0 11px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 11px;
          outline: none;
          background: #fff;
          color: #0a0a0a;
          font-family: Inter, sans-serif;
          font-size: 10px;
        }

        .dino-generate {
          width: 100%;
          min-height: 44px;
          margin-top: 17px;
          border: 0;
          border-radius: 11px;
          background: #0a0a0a;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .15s ease, opacity .15s ease;
        }

        .dino-generate:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .dino-generate:disabled {
          opacity: .3;
          cursor: not-allowed;
        }

        .dino-error {
          margin-top: 10px;
          padding: 10px 11px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 11px;
          background: rgba(0,0,0,.035);
          color: #777;
          font-size: 9px;
          line-height: 1.45;
        }

        /* QUESTION LIST */

        .dino-question-list {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dino-generated-question {
          padding: 16px;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 14px;
          background: rgba(250,250,250,.7);
        }

        .dino-question-number {
          display: inline-flex;
          width: 23px;
          height: 23px;
          border-radius: 7px;
          background: #0a0a0a;
          color: #fff;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 600;
        }

        .dino-question-context {
          margin: 10px 0 0;
          color: #666;
          font-size: 9px;
          line-height: 1.5;
        }

        .dino-question-text {
          margin: 8px 0 0;
          color: #111;
          font-size: 12px;
          line-height: 1.45;
          font-weight: 600;
        }

        .dino-answer-instruction {
          margin-top: 15px;
          padding: 10px 11px;
          border-radius: 10px;
          background: rgba(23,201,100,.07);
          color: #3f664e;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-generating {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #777;
          font-size: 10px;
        }

        .dino-generating-dots {
          display: inline-flex;
          gap: 3px;
        }

        .dino-generating-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #888;
          animation: dinoTyping 1.15s infinite ease-in-out;
        }

        .dino-generating-dot:nth-child(2) {
          animation-delay: .15s;
        }

        .dino-generating-dot:nth-child(3) {
          animation-delay: .3s;
        }

        /* TUTOR */

        .dino-tutor-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dino-tutor-head {
          min-height: 58px;
          padding: 9px 13px;
          border-bottom: 1px solid rgba(0,0,0,.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 0 0 58px;
        }

        .dino-tutor-identity {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dino-tutor-avatar {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: #0a0a0a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }

        .dino-tutor-name {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dino-tutor-name strong {
          font-size: 10px;
        }

        .dino-tutor-name span {
          color: #909090;
          font-size: 8px;
        }

        .dino-tutor-online {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #888;
          font-size: 8px;
        }

        .dino-tutor-online-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #17c964;
        }

        .dino-chat-area {
          flex: 1;
          min-height: 0;
          padding: 15px;
          overflow-y: auto;
          background: rgba(250,250,250,.55);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dino-chat-message {
          max-width: 86%;
          padding: 9px 10px;
          border-radius: 12px;
          font-size: 9px;
          line-height: 1.45;
          white-space: pre-wrap;
        }

        .dino-chat-message.tutor {
          align-self: flex-start;
          border: 1px solid rgba(0,0,0,.05);
          background: #fff;
          color: #333;
        }

        .dino-chat-message.user {
          align-self: flex-end;
          background: #0a0a0a;
          color: #fff;
        }

        .dino-typing {
          width: 46px;
          height: 29px;
          padding: 0 9px;
          border: 1px solid rgba(0,0,0,.05);
          border-radius: 12px;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dino-typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #aaa;
          animation: dinoTyping 1.15s infinite ease-in-out;
        }

        .dino-typing-dot:nth-child(2) {
          animation-delay: .15s;
        }

        .dino-typing-dot:nth-child(3) {
          animation-delay: .3s;
        }

        .dino-chat-bottom {
          min-height: 62px;
          padding: 10px;
          border-top: 1px solid rgba(0,0,0,.06);
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,.7);
          flex: 0 0 62px;
        }

        .dino-chat-input {
          min-width: 0;
          flex: 1;
          height: 38px;
          padding: 0 12px;
          outline: none;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 11px;
          background: #fff;
          color: #111;
          font-family: Inter, sans-serif;
          font-size: 10px;
        }

        .dino-chat-input::placeholder {
          color: #999;
        }

        .dino-chat-send {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border: 0;
          border-radius: 11px;
          background: #0a0a0a;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
        }

        /* EMPTY QUESTION STATE */

        .dino-reading-placeholder {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
        }

        .dino-reading-placeholder-content {
          max-width: 350px;
        }

        .dino-reading-placeholder-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 15px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 15px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,.035);
        }

        .dino-reading-placeholder h3 {
          margin: 0;
          font-size: 19px;
          line-height: 1.05;
          font-weight: 600;
          letter-spacing: -.055em;
        }

        .dino-reading-placeholder p {
          margin: 9px 0 0;
          color: #878787;
          font-size: 10px;
          line-height: 1.5;
        }

        /* GRADING RESULT */

        .dino-grade {
          margin-top: 12px;
          padding: 11px 12px;
          border: 1px solid rgba(23,201,100,.18);
          border-radius: 11px;
          background: rgba(23,201,100,.07);
          color: #376346;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-grade strong {
          display: block;
          margin-bottom: 3px;
          color: #20502e;
          font-size: 10px;
        }

        /* WRITING */

        .dino-writing-workspace {
          height: calc(100% - 78px);
          display: grid;
          grid-template-columns: 360px minmax(0,1fr);
          gap: 14px;
        }

        .dino-writing-card {
          min-height: 0;
          padding: 20px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px;
          background: rgba(255,255,255,.77);
          backdrop-filter: blur(16px);
        }

        .dino-writing-controls {
          display: flex;
          flex-direction: column;
        }

        .dino-writing-controls .dino-select {
          margin-bottom: 17px;
        }

        .dino-prompt-card {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dino-prompt-empty {
          max-width: 380px;
          text-align: center;
        }

        .dino-prompt-icon {
          width: 44px;
          height: 44px;
          margin: 0 auto 13px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 13px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
        }

        .dino-prompt-empty h3 {
          margin: 0;
          font-size: 18px;
          letter-spacing: -.05em;
        }

        .dino-prompt-empty p {
          margin: 8px 0 0;
          color: #858585;
          font-size: 10px;
          line-height: 1.5;
        }

        .dino-prompt-content {
          width: 100%;
        }

        .dino-prompt-label {
          color: #898989;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .dino-prompt-content h3 {
          margin: 10px 0 0;
          font-size: 23px;
        }

        .dino-prompt-content p {
          margin: 12px 0 22px;
          color: #666;
          font-size: 12px;
          line-height: 1.55;
        }

        .dino-small-button {
          min-height: 38px;
          padding: 0 15px;
          border: 0;
          border-radius: 11px;
          background: #0a0a0a;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
        }

        /* COMING SOON */

        .dino-coming-page {
          width: 100%;
          height: calc(100% - 78px);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px;
          background: rgba(255,255,255,.77);
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 35px rgba(0,0,0,.025);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .dino-coming-content {
          max-width: 620px;
          padding: 30px;
        }

        .dino-coming-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 18px;
          background: rgba(255,255,255,.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
          font-size: 22px;
          box-shadow: 0 10px 25px rgba(0,0,0,.04);
        }

        .dino-coming-content h2 {
          margin: 0;
          color: #0a0a0a;
          font-size: clamp(48px,7vw,82px);
          line-height: .9;
          font-weight: 600;
          letter-spacing: -.09em;
        }

        .dino-coming-content p {
          max-width: 430px;
          margin: 17px auto 0;
          color: #808080;
          font-size: 12px;
          line-height: 1.5;
        }

        /* PERSONAL */

        .dino-personal-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 10px;
        }

        .dino-personal-card {
          min-height: 240px;
          padding: 19px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 18px;
          background: rgba(255,255,255,.77);
          backdrop-filter: blur(12px);
        }

        .dino-personal-label {
          color: #888;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .dino-empty {
          margin-top: 50px;
        }

        .dino-empty strong {
          font-size: 16px;
        }

        .dino-empty p {
          max-width: 300px;
          margin: 7px 0 0;
          color: #888;
          font-size: 10px;
        }

        .dino-settings {
          margin-top: 27px;
          border-top: 1px solid rgba(0,0,0,.06);
        }

        .dino-setting-row {
          min-height: 48px;
          border-bottom: 1px solid rgba(0,0,0,.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dino-setting-row span {
          color: #888;
          font-size: 10px;
        }

        .dino-setting-row strong {
          font-size: 10px;
        }

        @keyframes dinoTyping {
          0%,60%,100% {
            transform: translateY(0);
            opacity: .4;
          }

          30% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }

        @media (max-width: 1050px) {
          .dino-theme-grid {
            grid-template-columns: repeat(3,minmax(0,1fr));
            overflow-y: auto;
          }

          .dino-theme {
            height: auto;
            min-height: 290px;
          }

          .dino-reading-workspace {
            grid-template-columns: minmax(0,1fr) 315px;
          }
        }

        @media (max-width: 760px) {
          .dino-dashboard {
            padding: 72px 18px 18px;
          }

          .dino-dashboard-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .dino-progress {
            width: 100%;
          }

          .dino-tabs {
            margin-top: 14px;
          }

          .dino-content {
            overflow-y: auto;
          }

          .dino-panel {
            height: auto;
          }

          .dino-panel-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .dino-theme-grid {
            height: auto;
            grid-template-columns: 1fr;
          }

          .dino-theme {
            height: auto;
          }

          .dino-reading-workspace {
            height: auto;
            grid-template-columns: 1fr;
          }

          .dino-tutor-card {
            min-height: 520px;
          }

          .dino-generator-fields {
            grid-template-columns: 1fr;
          }

          .dino-field-full {
            grid-column: auto;
          }

          .dino-writing-workspace {
            height: auto;
            grid-template-columns: 1fr;
          }

          .dino-personal-grid {
            grid-template-columns: 1fr;
          }

          .dino-coming-page {
            height: 450px;
          }
        }
      `}</style>

      <AnimatedBackground className="dino-dashboard">
        <div className="dino-dashboard-shell">

          {/* =====================================================
              HEADER
             ===================================================== */}

          <header className="dino-dashboard-header">
            <div>
              <span className="dino-kicker">
                Dino / {language}
              </span>

              <h1 className="dino-dashboard-heading">
                Your language
                <span> workspace.</span>
              </h1>
            </div>

            <div className="dino-progress">
              <div className="dino-progress-meta">
                <span>
                  Course progress
                </span>

                <strong>
                  {completedCount}/
                  {totalCount}
                </strong>
              </div>

              <div className="dino-progress-track">
                <div
                  className="dino-progress-fill"
                  style={{
                    width:
                      `${courseProgress}%`,
                  }}
                />
              </div>
            </div>
          </header>

          {/* =====================================================
              TABS
             ===================================================== */}

          <nav className="dino-tabs">

            <button
              className={
                activeTab === 'course'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab('course')
              }
            >
              Course Outline
            </button>

            <button
              className={
                activeTab === 'reading'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab('reading')
              }
            >
              Reading Questionbank
            </button>

            <button
              className={
                activeTab === 'writing'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab('writing')
              }
            >
              Writing Practice
            </button>

            <button
              className={
                activeTab === 'coming'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab('coming')
              }
            >
              Grammar and Sentence Structures
            </button>

            <button
              className={
                activeTab === 'vocab'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab('vocab')
              }
            >
              Personal Vocab and Settings
            </button>

          </nav>

          <main className="dino-content">

            {/* =====================================================
                COURSE OUTLINE
               ===================================================== */}

            {activeTab === 'course' && (
              <section className="dino-panel">

                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      IB Language B
                    </span>

                    <h2 className="dino-panel-title">
                      Course outline
                    </h2>

                    <p className="dino-panel-description">
                      Your five IB themes and recommended
                      topic areas in English and {language}.
                    </p>
                  </div>

                  <div className="dino-subtle-note">
                    Tick each topic after you've finished it.
                  </div>
                </div>

                <div className="dino-theme-grid">

                  {course.themes.map(
                    (
                      theme,
                      index,
                    ) => (
                      <article
                        className="dino-theme"
                        key={
                          theme.en
                        }
                      >
                        <div className="dino-theme-top">
                          <span className="dino-theme-number">
                            {String(
                              index +
                                1,
                            ).padStart(
                              2,
                              '0',
                            )}
                          </span>

                          <span className="dino-theme-count">
                            {
                              theme.topics.filter(
                                (
                                  topic,
                                ) =>
                                  isCompleted(
                                    theme.en,
                                    topic[0],
                                  ),
                              ).length
                            }
                            /
                            {
                              theme
                                .topics
                                .length
                            }
                          </span>
                        </div>

                        <h3 className="dino-theme-title">
                          {theme.en}
                        </h3>

                        <div className="dino-theme-local">
                          {theme.local}
                        </div>

                        <div className="dino-topic-list">
                          {theme.topics.map(
                            ([
                              english,
                              local,
                            ]) => {
                              const complete =
                                isCompleted(
                                  theme.en,
                                  english,
                                )

                              return (
                                <label
                                  key={
                                    english
                                  }
                                  className={
                                    complete
                                      ? 'dino-topic completed'
                                      : 'dino-topic'
                                  }
                                  title="Mark this topic complete"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      complete
                                    }
                                    onChange={() =>
                                      toggleTopic(
                                        theme.en,
                                        english,
                                      )
                                    }
                                  />

                                  <span className="dino-check">
                                    {complete
                                      ? '✓'
                                      : ''}
                                  </span>

                                  <span className="dino-topic-copy">
                                    <strong>
                                      {
                                        english
                                      }
                                    </strong>

                                    <small>
                                      {
                                        local
                                      }
                                    </small>
                                  </span>
                                </label>
                              )
                            },
                          )}
                        </div>
                      </article>
                    ),
                  )}

                </div>
              </section>
            )}

            {/* =====================================================
                READING QUESTIONBANK
               ===================================================== */}

            {activeTab === 'reading' && (
              <section className="dino-panel dino-reading-panel">

                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Reading
                    </span>

                    <h2 className="dino-panel-title">
                      Reading
                      <span>
                        {' '}
                        questionbank.
                      </span>
                    </h2>

                    <p className="dino-panel-description">
                      Choose what you want to practise,
                      generate two questions, then answer
                      them directly through your Dino tutor.
                    </p>
                  </div>

                  <div className="dino-subtle-note">
                    Groq generates the questions and marks
                    your submitted answers.
                  </div>
                </div>

                <div className="dino-reading-workspace">

                  {/* =================================================
                      LEFT: GENERATOR / QUESTIONS
                     ================================================= */}

                  <div className="dino-reading-card dino-reading-generator">

                    <div className="dino-card-topbar">
                      <span className="dino-card-label">
                        Reading questionbank
                      </span>

                      <span className="dino-card-status">
                        {generatedQuestions
                          ? 'Questions ready'
                          : 'Ready'}
                      </span>
                    </div>

                    {!generatedQuestions ? (
                      <div className="dino-generator-body">

                        <h3 className="dino-generator-title">
                          Build a reading set.
                        </h3>

                        <p className="dino-generator-description">
                          Pick the style of question and the
                          IB course topic you want to practise.
                        </p>

                        <div className="dino-generator-fields">

                          <div className="dino-field">
                            <label className="dino-field-label">
                              Question type
                            </label>

                            <select
                              className="dino-select"
                              value={
                                readingType
                              }
                              onChange={(
                                event,
                              ) =>
                                setReadingType(
                                  event
                                    .target
                                    .value,
                                )
                              }
                            >
                              <option>
                                Mixed
                              </option>

                              <option>
                                Multiple choice
                              </option>

                              <option>
                                Short answer
                              </option>

                              <option>
                                True / false
                              </option>

                              <option>
                                Vocabulary in context
                              </option>

                              <option>
                                Inference
                              </option>
                            </select>
                          </div>

                          <div className="dino-field">
                            <label className="dino-field-label">
                              Language
                            </label>

                            <div
                              style={{
                                minHeight:
                                  '42px',
                                padding:
                                  '0 11px',
                                border:
                                  '1px solid rgba(0,0,0,.08)',
                                borderRadius:
                                  '11px',
                                background:
                                  '#fff',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                fontSize:
                                  '10px',
                                fontWeight:
                                  500,
                              }}
                            >
                              {language}
                            </div>
                          </div>

                          <div className="dino-field dino-field-full">
                            <label className="dino-field-label">
                              IB course topic
                            </label>

                            <select
                              className="dino-select"
                              value={
                                readingTopic
                              }
                              onChange={(
                                event,
                              ) =>
                                setReadingTopic(
                                  event
                                    .target
                                    .value,
                                )
                              }
                            >
                              <option value="">
                                Select a course topic
                              </option>

                              {course.themes.map(
                                (
                                  theme,
                                ) => (
                                  <optgroup
                                    key={
                                      theme.en
                                    }
                                    label={`${theme.en} / ${theme.local}`}
                                  >
                                    {theme.topics.map(
                                      ([
                                        english,
                                        local,
                                      ]) => (
                                        <option
                                          key={
                                            english
                                          }
                                          value={
                                            english
                                          }
                                        >
                                          {
                                            english
                                          }{' '}
                                          /{' '}
                                          {
                                            local
                                          }
                                        </option>
                                      ),
                                    )}
                                  </optgroup>
                                ),
                              )}
                            </select>
                          </div>

                        </div>

                        <button
                          type="button"
                          className="dino-generate"
                          disabled={
                            !readingTopic ||
                            isGeneratingQuestions
                          }
                          onClick={
                            generateReadingQuestions
                          }
                        >
                          {isGeneratingQuestions
                            ? 'Generating...'
                            : 'Generate questions →'}
                        </button>

                        {isGeneratingQuestions && (
                          <div
                            style={{
                              marginTop:
                                '14px',
                            }}
                            className="dino-generating"
                          >
                            <span>
                              Dino is writing your
                              questions
                            </span>

                            <span className="dino-generating-dots">
                              <span className="dino-generating-dot" />
                              <span className="dino-generating-dot" />
                              <span className="dino-generating-dot" />
                            </span>
                          </div>
                        )}

                        {questionError && (
                          <div className="dino-error">
                            {questionError}
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="dino-generator-body">

                        <h3 className="dino-generator-title">
                          {generatedQuestions.title}
                        </h3>

                        <p className="dino-generator-description">
                          {generatedQuestions.instructions}
                        </p>

                        <div className="dino-question-list">

                          {generatedQuestions.questions.map(
                            (
                              question,
                            ) => (
                              <article
                                className="dino-generated-question"
                                key={
                                  question.id
                                }
                              >
                                <span className="dino-question-number">
                                  {
                                    question.id
                                  }
                                </span>

                                {question.context && (
                                  <p className="dino-question-context">
                                    {
                                      question.context
                                    }
                                  </p>
                                )}

                                <p className="dino-question-text">
                                  {
                                    question.question
                                  }
                                </p>
                              </article>
                            ),
                          )}

                        </div>

                        <div className="dino-answer-instruction">
                          <strong>
                            Answer both through the tutor →
                          </strong>
                          <br />
                          Tell the tutor your answers as:
                          <br />
                          <strong>
                            1: your answer
                          </strong>
                          <br />
                          <strong>
                            2: your answer
                          </strong>
                          <br />
                          Once both are submitted, Dino will
                          mark them and this question set will
                          disappear automatically.
                        </div>

                        {gradingResult && (
                          <div className="dino-grade">
                            <strong>
                              {gradingResult.score}/2
                            </strong>

                            {gradingResult.feedback}
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {/* =================================================
                      RIGHT: AI TUTOR
                     ================================================= */}

                  <div className="dino-reading-card dino-tutor-card">

                    <div className="dino-tutor-head">

                      <div className="dino-tutor-identity">
                        <div className="dino-tutor-avatar">
                          D
                        </div>

                        <div className="dino-tutor-name">
                          <strong>
                            Dino Tutor
                          </strong>

                          <span>
                            Reading assistant
                          </span>
                        </div>
                      </div>

                      <div className="dino-tutor-online">
                        <span className="dino-tutor-online-dot" />
                        {GROQ_API_KEY
                          ? 'Connected'
                          : 'Not configured'}
                      </div>

                    </div>

                    <div className="dino-chat-area">

                      {chatMessages.length === 0 && (
                        <div className="dino-chat-message tutor">
                          Generate a reading set on the left
                          and I'll help you work through it.
                        </div>
                      )}

                      {chatMessages.map(
                        (
                          message,
                          index,
                        ) => (
                          <div
                            key={
                              index
                            }
                            className={
                              message.role ===
                              'user'
                                ? 'dino-chat-message user'
                                : 'dino-chat-message tutor'
                            }
                          >
                            {
                              message.text
                            }
                          </div>
                        ),
                      )}

                      {chatTyping && (
                        <div className="dino-typing">
                          <span className="dino-typing-dot" />
                          <span className="dino-typing-dot" />
                          <span className="dino-typing-dot" />
                        </div>
                      )}

                    </div>

                    <div className="dino-chat-bottom">

                      <textarea
                        className="dino-chat-input"
                        value={
                          chatInput
                        }
                        onChange={(
                          event,
                        ) =>
                          setChatInput(
                            event
                              .target
                              .value,
                          )
                        }
                        onKeyDown={
                          handleChatKeyDown
                        }
                        placeholder={
                          generatedQuestions
                            ? 'Answer both questions here...'
                            : 'Ask your tutor...'
                        }
                        rows={1}
                      />

                      <button
                        type="button"
                        className="dino-chat-send"
                        onClick={
                          sendReadingChat
                        }
                        disabled={
                          chatTyping
                        }
                      >
                        ↑
                      </button>

                    </div>

                  </div>

                </div>

              </section>
            )}

            {/* =====================================================
                WRITING
               ===================================================== */}

            {activeTab === 'writing' && (
              <section className="dino-panel">

                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Writing
                    </span>

                    <h2 className="dino-panel-title">
                      Practice
                      <span> smarter.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Choose a course topic and generate an
                      IB-style writing prompt.
                    </p>
                  </div>
                </div>

                <div className="dino-writing-workspace">

                  <div className="dino-writing-card dino-writing-controls">

                    <label className="dino-field-label">
                      Course topic
                    </label>

                    <select
                      className="dino-select"
                      value={
                        writingTopic
                      }
                      onChange={(
                        event,
                      ) =>
                        setWritingTopic(
                          event
                            .target
                            .value,
                        )
                      }
                    >
                      <option value="">
                        Select a course topic
                      </option>

                      {course.themes.map(
                        (
                          theme,
                        ) => (
                          <optgroup
                            key={
                              theme.en
                            }
                            label={`${theme.en} / ${theme.local}`}
                          >
                            {theme.topics.map(
                              ([
                                english,
                                local,
                              ]) => (
                                <option
                                  value={
                                    english
                                  }
                                  key={
                                    english
                                  }
                                >
                                  {
                                    english
                                  }{' '}
                                  /{' '}
                                  {
                                    local
                                  }
                                </option>
                              ),
                            )}
                          </optgroup>
                        ),
                      )}
                    </select>

                    <label className="dino-field-label">
                      Text type
                    </label>

                    <select
                      className="dino-select"
                      value={
                        writingType
                      }
                      onChange={(
                        event,
                      ) =>
                        setWritingType(
                          event
                            .target
                            .value,
                        )
                      }
                    >
                      {writingTypes.map(
                        (
                          type,
                        ) => (
                          <option
                            value={
                              type
                            }
                            key={
                              type
                            }
                          >
                            {
                              type
                            }
                          </option>
                        ),
                      )}
                    </select>

                    <button
                      type="button"
                      className="dino-generate"
                      disabled={
                        !writingTopic
                      }
                      onClick={
                        createPrompt
                      }
                    >
                      Generate prompt →
                    </button>

                  </div>

                  <div className="dino-writing-card dino-prompt-card">

                    {!generatedPrompt ? (
                      <div className="dino-prompt-empty">

                        <div className="dino-prompt-icon">
                          ✦
                        </div>

                        <h3>
                          Your prompt will appear here.
                        </h3>

                        <p>
                          Select a course topic and text
                          type, then generate your task.
                        </p>

                      </div>
                    ) : (
                      <div className="dino-prompt-content">

                        <span className="dino-prompt-label">
                          Generated task
                        </span>

                        <h3>
                          {writingType}
                        </h3>

                        <p>
                          {generatedPrompt}
                        </p>

                        <button
                          type="button"
                          className="dino-small-button"
                        >
                          Start writing →
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </section>
            )}

            {/* =====================================================
                GRAMMAR / SENTENCE STRUCTURES
               ===================================================== */}

            {activeTab === 'coming' && (
              <section className="dino-panel">

                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Grammar & Sentence Structures
                    </span>
                  </div>
                </div>

                <div className="dino-coming-page">

                  <div className="dino-coming-content">

                    <div className="dino-coming-icon">
                      ✦
                    </div>

                    <h2>
                      Coming Soon...
                    </h2>

                    <p>
                      Grammar activities and sentence
                      structure practice are currently being
                      developed for Dino.
                    </p>

                  </div>

                </div>

              </section>
            )}

            {/* =====================================================
                VOCAB / SETTINGS
               ===================================================== */}

            {activeTab === 'vocab' && (
              <section className="dino-panel">

                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Personal
                    </span>

                    <h2 className="dino-panel-title">
                      Vocabulary and
                      <span> settings.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Your personal vocabulary bank and study
                      preferences will live here.
                    </p>
                  </div>
                </div>

                <div className="dino-personal-grid">

                  <div className="dino-personal-card">
                    <span className="dino-personal-label">
                      Personal vocabulary
                    </span>

                    <div className="dino-empty">
                      <strong>
                        Your vocabulary bank is empty.
                      </strong>

                      <p>
                        Words you save while studying will
                        appear here.
                      </p>
                    </div>
                  </div>

                  <div className="dino-personal-card">
                    <span className="dino-personal-label">
                      Settings
                    </span>

                    <div className="dino-settings">

                      <div className="dino-setting-row">
                        <span>
                          Language
                        </span>

                        <strong>
                          {language}
                        </strong>
                      </div>

                      <div className="dino-setting-row">
                        <span>
                          Goals
                        </span>

                        <strong>
                          {getCookie('dino_goals')
                            ? 'Configured'
                            : 'Not configured'}
                        </strong>
                      </div>

                    </div>
                  </div>

                </div>

              </section>
            )}

          </main>
        </div>
      </AnimatedBackground>
    </>
  )
}

export default Dashboard