import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'
import AnimatedBackground from '../components/AnimatedBackground'
import {
  getCurrentUser,
  getProfile,
  getCourseProgress,
  setCourseTopicCompleted,
  syncUserCredits,
  spendUserCredits,
  onAuthStateChange,
  signOut,
} from '../api/credentials'

/*
|--------------------------------------------------------------------------|
| Groq                                                                    |
|--------------------------------------------------------------------------|
|
| Requests are sent through:
|
|   /api/generate
|
| The GROQ_API_KEY remains server-side.
|
*/

const GROQ_ENDPOINT = '/api/generate'

const GROQ_MODEL =
  'openai/gpt-oss-120b'

/* ========================================================================== */
/* WRITING                                                                   */
/* ========================================================================== */

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

/* ========================================================================== */
/* COURSE OUTLINE                                                            */
/* ========================================================================== */

const COURSE = {
  'French B': {
    themes: [
      {
        en: 'Identities',
        local: 'Identités',
        topics: [
          ['Lifestyles', 'Modes de vie'],
          [
            'Health and wellbeing',
            'Santé et bien-être',
          ],
          [
            'Beliefs and values',
            'Croyances et valeurs',
          ],
          ['Subcultures', 'Sous-cultures'],
          [
            'Language and identity',
            'Langue et identité',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: 'Expériences',
        topics: [
          [
            'Leisure activities',
            'Activités de loisirs',
          ],
          [
            'Holidays and travel',
            'Vacances et voyages',
          ],
          [
            'Life stories',
            'Récits de vie',
          ],
          [
            'Rites of passage',
            'Rites de passage',
          ],
          [
            'Customs and traditions',
            'Coutumes et traditions',
          ],
          ['Migration', 'Migration'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Ingéniosité humaine',
        topics: [
          ['Entertainment', 'Divertissement'],
          [
            'Artistic expressions',
            'Expressions artistiques',
          ],
          [
            'Communication and media',
            'Communication et médias',
          ],
          ['Technology', 'Technologie'],
          [
            'Scientific innovation',
            'Innovation scientifique',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: 'Organisation sociale',
        topics: [
          [
            'Social relationships',
            'Relations sociales',
          ],
          ['Community', 'Communauté'],
          [
            'Social engagement',
            'Engagement social',
          ],
          ['Education', 'Éducation'],
          [
            'The world of work',
            'Le monde du travail',
          ],
          [
            'Law and order',
            'Droit et ordre public',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Partage de la planète',
        topics: [
          [
            'The environment',
            "L’environnement",
          ],
          ['Human rights', 'Droits humains'],
          [
            'Peace and conflict',
            'Paix et conflits',
          ],
          ['Equality', 'Égalité'],
          [
            'Globalization',
            'Mondialisation',
          ],
          ['Ethics', 'Éthique'],
          [
            'Urban and rural environment',
            'Environnement urbain et rural',
          ],
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
          [
            'Health and wellbeing',
            'Salud y bienestar',
          ],
          [
            'Beliefs and values',
            'Creencias y valores',
          ],
          ['Subcultures', 'Subculturas'],
          [
            'Language and identity',
            'Lengua e identidad',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: 'Experiencias',
        topics: [
          [
            'Leisure activities',
            'Actividades de ocio',
          ],
          [
            'Holidays and travel',
            'Vacaciones y viajes',
          ],
          [
            'Life stories',
            'Historias de vida',
          ],
          [
            'Rites of passage',
            'Ritos de paso',
          ],
          [
            'Customs and traditions',
            'Costumbres y tradiciones',
          ],
          ['Migration', 'Migración'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Ingenio humano',
        topics: [
          [
            'Entertainment',
            'Entretenimiento',
          ],
          [
            'Artistic expressions',
            'Expresiones artísticas',
          ],
          [
            'Communication and media',
            'Comunicación y medios',
          ],
          ['Technology', 'Tecnología'],
          [
            'Scientific innovation',
            'Innovación científica',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: 'Organización social',
        topics: [
          [
            'Social relationships',
            'Relaciones sociales',
          ],
          ['Community', 'Comunidad'],
          [
            'Social engagement',
            'Participación social',
          ],
          ['Education', 'Educación'],
          [
            'The world of work',
            'El mundo laboral',
          ],
          [
            'Law and order',
            'Ley y orden',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Compartir el planeta',
        topics: [
          [
            'The environment',
            'El medio ambiente',
          ],
          [
            'Human rights',
            'Derechos humanos',
          ],
          [
            'Peace and conflict',
            'Paz y conflicto',
          ],
          ['Equality', 'Igualdad'],
          [
            'Globalization',
            'Globalización',
          ],
          ['Ethics', 'Ética'],
          [
            'Urban and rural environment',
            'Entorno urbano y rural',
          ],
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
          [
            'Health and wellbeing',
            '健康与身心福祉',
          ],
          [
            'Beliefs and values',
            '信仰与价值观',
          ],
          ['Subcultures', '亚文化'],
          [
            'Language and identity',
            '语言与身份认同',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: '经历',
        topics: [
          ['Leisure activities', '休闲活动'],
          [
            'Holidays and travel',
            '假期与旅行',
          ],
          [
            'Life stories',
            '人生故事',
          ],
          [
            'Rites of passage',
            '人生阶段仪式',
          ],
          [
            'Customs and traditions',
            '习俗与传统',
          ],
          [
            'Migration',
            '移民与迁徙',
          ],
        ],
      },
      {
        en: 'Human ingenuity',
        local: '人类智慧',
        topics: [
          ['Entertainment', '娱乐'],
          ['Artistic expressions', '艺术表达'],
          [
            'Communication and media',
            '传播与媒体',
          ],
          ['Technology', '科技'],
          [
            'Scientific innovation',
            '科学创新',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: '社会组织',
        topics: [
          [
            'Social relationships',
            '社会关系',
          ],
          ['Community', '社区'],
          [
            'Social engagement',
            '社会参与',
          ],
          ['Education', '教育'],
          [
            'The world of work',
            '工作世界',
          ],
          [
            'Law and order',
            '法律与秩序',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: '共享地球',
        topics: [
          ['The environment', '环境'],
          ['Human rights', '人权'],
          [
            'Peace and conflict',
            '和平与冲突',
          ],
          ['Equality', '平等'],
          ['Globalization', '全球化'],
          ['Ethics', '伦理'],
          [
            'Urban and rural environment',
            '城市与农村环境',
          ],
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
          [
            'Health and wellbeing',
            'Health and wellbeing',
          ],
          [
            'Beliefs and values',
            'Beliefs and values',
          ],
          ['Subcultures', 'Subcultures'],
          [
            'Language and identity',
            'Language and identity',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: 'Experiences',
        topics: [
          [
            'Leisure activities',
            'Leisure activities',
          ],
          [
            'Holidays and travel',
            'Holidays and travel',
          ],
          [
            'Life stories',
            'Life stories',
          ],
          [
            'Rites of passage',
            'Rites of passage',
          ],
          [
            'Customs and traditions',
            'Customs and traditions',
          ],
          ['Migration', 'Migration'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Human ingenuity',
        topics: [
          ['Entertainment', 'Entertainment'],
          [
            'Artistic expressions',
            'Artistic expressions',
          ],
          [
            'Communication and media',
            'Communication and media',
          ],
          ['Technology', 'Technology'],
          [
            'Scientific innovation',
            'Scientific innovation',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: 'Social organization',
        topics: [
          [
            'Social relationships',
            'Social relationships',
          ],
          ['Community', 'Community'],
          [
            'Social engagement',
            'Social engagement',
          ],
          ['Education', 'Education'],
          [
            'The world of work',
            'The world of work',
          ],
          [
            'Law and order',
            'Law and order',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Sharing the planet',
        topics: [
          [
            'The environment',
            'The environment',
          ],
          ['Human rights', 'Human rights'],
          [
            'Peace and conflict',
            'Peace and conflict',
          ],
          ['Equality', 'Equality'],
          [
            'Globalization',
            'Globalization',
          ],
          ['Ethics', 'Ethics'],
          [
            'Urban and rural environment',
            'Urban and rural environment',
          ],
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
          [
            'Health and wellbeing',
            'Gesundheit und Wohlbefinden',
          ],
          [
            'Beliefs and values',
            'Glaubensvorstellungen und Werte',
          ],
          ['Subcultures', 'Subkulturen'],
          [
            'Language and identity',
            'Sprache und Identität',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: 'Erfahrungen',
        topics: [
          [
            'Leisure activities',
            'Freizeitaktivitäten',
          ],
          [
            'Holidays and travel',
            'Urlaub und Reisen',
          ],
          [
            'Life stories',
            'Lebensgeschichten',
          ],
          [
            'Rites of passage',
            'Übergangsriten',
          ],
          [
            'Customs and traditions',
            'Bräuche und Traditionen',
          ],
          ['Migration', 'Migration'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Menschlicher Erfindergeist',
        topics: [
          ['Entertainment', 'Unterhaltung'],
          [
            'Artistic expressions',
            'Künstlerische Ausdrucksformen',
          ],
          [
            'Communication and media',
            'Kommunikation und Medien',
          ],
          ['Technology', 'Technologie'],
          [
            'Scientific innovation',
            'Wissenschaftliche Innovation',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: 'Soziale Organisation',
        topics: [
          [
            'Social relationships',
            'Soziale Beziehungen',
          ],
          ['Community', 'Gemeinschaft'],
          [
            'Social engagement',
            'Soziales Engagement',
          ],
          ['Education', 'Bildung'],
          [
            'The world of work',
            'Arbeitswelt',
          ],
          [
            'Law and order',
            'Recht und Ordnung',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Den Planeten teilen',
        topics: [
          ['The environment', 'Die Umwelt'],
          ['Human rights', 'Menschenrechte'],
          [
            'Peace and conflict',
            'Frieden und Konflikte',
          ],
          ['Equality', 'Gleichheit'],
          [
            'Globalization',
            'Globalisierung',
          ],
          ['Ethics', 'Ethik'],
          [
            'Urban and rural environment',
            'Städtische und ländliche Umwelt',
          ],
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
          [
            'Health and wellbeing',
            'Salute e benessere',
          ],
          [
            'Beliefs and values',
            'Credenze e valori',
          ],
          ['Subcultures', 'Sottoculture'],
          [
            'Language and identity',
            'Lingua e identità',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: 'Esperienze',
        topics: [
          [
            'Leisure activities',
            'Attività del tempo libero',
          ],
          [
            'Holidays and travel',
            'Vacanze e viaggi',
          ],
          [
            'Life stories',
            'Storie di vita',
          ],
          [
            'Rites of passage',
            'Riti di passaggio',
          ],
          [
            'Customs and traditions',
            'Usi e tradizioni',
          ],
          ['Migration', 'Migrazione'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: 'Ingegno umano',
        topics: [
          [
            'Entertainment',
            'Intrattenimento',
          ],
          [
            'Artistic expressions',
            'Espressioni artistiche',
          ],
          [
            'Communication and media',
            'Comunicazione e media',
          ],
          ['Technology', 'Tecnologia'],
          [
            'Scientific innovation',
            'Innovazione scientifica',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: 'Organizzazione sociale',
        topics: [
          [
            'Social relationships',
            'Relazioni sociali',
          ],
          ['Community', 'Comunità'],
          [
            'Social engagement',
            'Impegno sociale',
          ],
          ['Education', 'Istruzione'],
          [
            'The world of work',
            'Mondo del lavoro',
          ],
          [
            'Law and order',
            'Legge e ordine',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: 'Condivisione del pianeta',
        topics: [
          [
            'The environment',
            "L'ambiente",
          ],
          [
            'Human rights',
            'Diritti umani',
          ],
          [
            'Peace and conflict',
            'Pace e conflitto',
          ],
          ['Equality', 'Uguaglianza'],
          [
            'Globalization',
            'Globalizzazione',
          ],
          ['Ethics', 'Etica'],
          [
            'Urban and rural environment',
            'Ambiente urbano e rurale',
          ],
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
          [
            'Health and wellbeing',
            '健康とウェルビーイング',
          ],
          [
            'Beliefs and values',
            '信念と価値観',
          ],
          ['Subcultures', 'サブカルチャー'],
          [
            'Language and identity',
            '言語とアイデンティティ',
          ],
        ],
      },
      {
        en: 'Experiences',
        local: '経験',
        topics: [
          ['Leisure activities', '余暇活動'],
          [
            'Holidays and travel',
            '休暇と旅行',
          ],
          ['Life stories', '人生の物語'],
          [
            'Rites of passage',
            '通過儀礼',
          ],
          [
            'Customs and traditions',
            '習慣と伝統',
          ],
          ['Migration', '移住'],
        ],
      },
      {
        en: 'Human ingenuity',
        local: '人間の創意工夫',
        topics: [
          [
            'Entertainment',
            'エンターテインメント',
          ],
          [
            'Artistic expressions',
            '芸術表現',
          ],
          [
            'Communication and media',
            'コミュニケーションとメディア',
          ],
          ['Technology', 'テクノロジー'],
          [
            'Scientific innovation',
            '科学技術の革新',
          ],
        ],
      },
      {
        en: 'Social organization',
        local: '社会組織',
        topics: [
          [
            'Social relationships',
            '社会的関係',
          ],
          ['Community', 'コミュニティ'],
          [
            'Social engagement',
            '社会参加',
          ],
          ['Education', '教育'],
          [
            'The world of work',
            '仕事の世界',
          ],
          [
            'Law and order',
            '法律と秩序',
          ],
        ],
      },
      {
        en: 'Sharing the planet',
        local: '地球を共有すること',
        topics: [
          ['The environment', '環境'],
          ['Human rights', '人権'],
          [
            'Peace and conflict',
            '平和と紛争',
          ],
          ['Equality', '平等'],
          [
            'Globalization',
            'グローバル化',
          ],
          ['Ethics', '倫理'],
          [
            'Urban and rural environment',
            '都市と農村の環境',
          ],
        ],
      },
    ],
  },
}

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function cleanModelJSON(text) {
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    const match =
      text.match(/\{[\s\S]*\}/)

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

/* ========================================================================== */
/* GROQ                                                                      */
/* ========================================================================== */

async function callGroq({
  system,
  user,
  responseFormat,
  temperature = 0.3,
  maxTokens = 1800,
}) {
  const response = await fetch(
    GROQ_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        system,
        user,
        responseFormat,
        temperature,
        maxTokens,
      }),
    },
  )

  const responseText =
    await response.text()

  let data = null

  try {
    data = responseText
      ? JSON.parse(
          responseText,
        )
      : null
  } catch {
    throw new Error(
      responseText ||
        `Server returned an invalid response (${response.status}).`,
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `API request failed with status ${response.status}.`,
    )
  }

  return data?.content || ''
}

/* ========================================================================== */
/* QUESTION SCHEMAS                                                           */
/* ========================================================================== */

const QUESTION_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'ib_language_b_question_set',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        instructions: { type: 'string' },
        questions: {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              question: { type: 'string' },
              context: { type: 'string' },
              answer: { type: 'string' },
              explanation: { type: 'string' },
              marks: { type: 'integer' },
            },
            required: [
              'id',
              'question',
              'context',
              'answer',
              'explanation',
              'marks',
            ],
            additionalProperties: false,
          },
        },
      },
      required: ['title', 'instructions', 'questions'],
      additionalProperties: false,
    },
  },
}

const WRITING_PROMPT_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'ib_language_b_writing_prompt',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        prompt: { type: 'string' },
        criteria: {
          type: 'array',
          minItems: 3,
          maxItems: 4,
          items: { type: 'string' },
        },
        suggestedLength: { type: 'string' },
        marks: { type: 'integer' },
      },
      required: [
        'title',
        'prompt',
        'criteria',
        'suggestedLength',
        'marks',
      ],
      additionalProperties: false,
    },
  },
}

/* ========================================================================== */
/* MARKDOWN RENDERING                                                         */
/* ========================================================================== */

function splitInlineMarkdown(text, keyPrefix = 'md') {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)

  return tokens.map((token, index) => {
    if (!token) return null

    if (/^\*\*[^*]+\*\*$/.test(token)) {
      return (
        <strong key={`${keyPrefix}-b-${index}`}>
          {token.slice(2, -2)}
        </strong>
      )
    }

    if (/^\*[^*]+\*$/.test(token)) {
      return (
        <em key={`${keyPrefix}-i-${index}`}>
          {token.slice(1, -1)}
        </em>
      )
    }

    if (/^`[^`]+`$/.test(token)) {
      return (
        <code key={`${keyPrefix}-c-${index}`}>
          {token.slice(1, -1)}
        </code>
      )
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a
          key={`${keyPrefix}-a-${index}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
        >
          {linkMatch[1]}
        </a>
      )
    }

    return <span key={`${keyPrefix}-t-${index}`}>{token}</span>
  })
}

function renderMarkdown(text, className = '') {
  const source = String(text || '').replace(/\r/g, '')
  const blocks = source.split('\n\n')

  return (
    <div className={`dino-markdown ${className}`.trim()}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n')
        const firstLine = lines[0]?.trim() || ''

        if (/^###\s+/.test(firstLine)) {
          return (
            <h5 key={blockIndex}>
              {splitInlineMarkdown(firstLine.replace(/^###\s+/, ''), `h3-${blockIndex}`)}
            </h5>
          )
        }

        if (/^##\s+/.test(firstLine)) {
          return (
            <h4 key={blockIndex}>
              {splitInlineMarkdown(firstLine.replace(/^##\s+/, ''), `h2-${blockIndex}`)}
            </h4>
          )
        }

        if (/^#\s+/.test(firstLine)) {
          return (
            <h3 key={blockIndex}>
              {splitInlineMarkdown(firstLine.replace(/^#\s+/, ''), `h1-${blockIndex}`)}
            </h3>
          )
        }

        if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
          return (
            <ul key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>
                  {splitInlineMarkdown(line.trim().replace(/^[-*]\s+/, ''), `li-${blockIndex}-${index}`)}
                </li>
              ))}
            </ul>
          )
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
          return (
            <ol key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>
                  {splitInlineMarkdown(line.trim().replace(/^\d+\.\s+/, ''), `oli-${blockIndex}-${index}`)}
                </li>
              ))}
            </ol>
          )
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {index > 0 && <br />}
                {splitInlineMarkdown(line, `p-${blockIndex}-${index}`)}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

/* ========================================================================== */
/* APP                                                                        */
/* ========================================================================== */

function Dashboard({ navigate }) {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [dinoPoints, setDinoPoints] = useState(0)
  const [language, setLanguage] = useState('English B')
  const [activeTab, setActiveTab] = useState('course')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [savingTopic, setSavingTopic] = useState('')

  const [writingTopic, setWritingTopic] = useState('')
  const [writingType, setWritingType] = useState('Article')
  const [writingDifficulty, setWritingDifficulty] = useState('Intermediate')
  const [writingTask, setWritingTask] = useState(null)
  const [writingAnswer, setWritingAnswer] = useState('')
  const [writingGrade, setWritingGrade] = useState(null)
  const [writingGenerating, setWritingGenerating] = useState(false)
  const [writingGrading, setWritingGrading] = useState(false)

  const [readingType, setReadingType] = useState('Mixed')
  const [readingDifficulty, setReadingDifficulty] = useState('Intermediate')
  const [readingTopic, setReadingTopic] = useState('')
  const [generatedQuestions, setGeneratedQuestions] = useState(null)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [questionError, setQuestionError] = useState('')
  const [answerSubmission, setAnswerSubmission] = useState({})
  const [readingGrades, setReadingGrades] = useState({})
  const [gradingQuestion, setGradingQuestion] = useState(null)

  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatTyping, setChatTyping] = useState(false)
  const [expandedReadingSection, setExpandedReadingSection] = useState(null)

  /* ------------------------------------------------------------------------ */
  /* AUTH                                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true

    async function initialiseAuth() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          navigate('/login')
          return
        }

        if (mounted) {
          setUser(currentUser)
          setAuthLoading(false)
        }

        try {
          const profile = await getProfile(currentUser.id)

          if (mounted) {
            setLanguage(
              profile?.language ||
                currentUser?.user_metadata?.language ||
                'English B',
            )
          }
        } catch (error) {
          console.error('Profile loading failed:', error)
        }

        try {
          const savedProgress = await getCourseProgress(currentUser.id)

          if (mounted) {
            setSelectedTopics(savedProgress)
          }
        } catch (error) {
          console.error('Course progress loading failed:', error)
        }

        try {
          const syncedPoints = await syncUserCredits(currentUser.id)

          if (mounted) {
            setDinoPoints(syncedPoints)
          }
        } catch (error) {
          console.error('Dino points loading failed:', error)
        } finally {
          if (mounted) {
            setProfileLoading(false)
          }
        }
      } catch (error) {
        console.error('Dashboard auth check failed:', error)
        navigate('/login')
      }
    }

    initialiseAuth()

    const authSubscription = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login')
        return
      }

      setUser(session.user)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      authSubscription?.data?.subscription?.unsubscribe?.()
    }
  }, [navigate])

  useEffect(() => {
    document.body.dataset.page = 'dashboard'

    return () => {
      delete document.body.dataset.page
    }
  }, [])

  useEffect(() => {
    if (!expandedReadingSection) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setExpandedReadingSection(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedReadingSection])

  /* ------------------------------------------------------------------------ */
  /* COURSE                                                                    */
  /* ------------------------------------------------------------------------ */

  const course = useMemo(() => {
    return COURSE[language] || COURSE['English B']
  }, [language])

  const allTopics = useMemo(() => {
    return course.themes.flatMap((theme) =>
      theme.topics.map((topic) => ({
        theme: theme.en,
        themeLocal: theme.local,
        topic: topic[0],
        local: topic[1],
      })),
    )
  }, [course])

  const completedCount = selectedTopics.length
  const totalCount = allTopics.length

  const courseProgress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const toggleTopic = async (themeName, topicEnglish) => {
    if (!user || savingTopic) return

    const topicId = `${language}::${themeName}::${topicEnglish}`
    const currentlyCompleted = selectedTopics.includes(topicId)
    const nextCompleted = !currentlyCompleted

    setSavingTopic(topicId)

    setSelectedTopics((current) =>
      nextCompleted
        ? [...current, topicId]
        : current.filter((item) => item !== topicId),
    )

    try {
      await setCourseTopicCompleted(user.id, topicId, nextCompleted)
    } catch (error) {
      console.error('Saving course topic failed:', error)

      setSelectedTopics((current) => {
        if (currentlyCompleted) return [...current, topicId]
        return current.filter((item) => item !== topicId)
      })
    } finally {
      setSavingTopic('')
    }
  }

  const isCompleted = (themeName, topicEnglish) => {
    return selectedTopics.includes(`${language}::${themeName}::${topicEnglish}`)
  }

  /* ------------------------------------------------------------------------ */
  /* READING                                                                   */
  /* ------------------------------------------------------------------------ */

  const generateReadingQuestions = async () => {
    if (!readingTopic || !readingType) return

    try {
      const syncedPoints = await syncUserCredits(user.id)
      setDinoPoints(syncedPoints)

      if (syncedPoints < 1) {
        setQuestionError('You need 1 Dino point to generate a reading question set. Come back in 24 hours for 5 more.')
        return
      }

      const nextPointTotal = await spendUserCredits(user.id, 1)
      setDinoPoints(nextPointTotal)
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while checking Dino points.',
      )
      return
    }

    setQuestionError('')
    setGeneratedQuestions(null)
    setAnswerSubmission({})
    setReadingGrades({})
    setIsGeneratingQuestions(true)

    const selectedTopic = allTopics.find((item) => item.topic === readingTopic)

    try {
      const systemPrompt = `
You are Dino, an expert IB Language B tutor.

Create original, high-quality reading comprehension practice for an IB Language B student.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Keep every response suitable for a focused academic tutor.
- Never reproduce copyrighted source material.
- Make every question answerable from the supplied original context.
- Match the requested difficulty.
- Allocate realistic marks to every question.
- The sum of marks should normally be between 6 and 10.
- Give a clear answer key and concise marking guidance.
- Return only structured data.
`.trim()

      const userPrompt = `
Create exactly TWO ${readingType} reading questions.

Language:
${language}

Difficulty:
${readingDifficulty}

IB theme:
${selectedTopic?.theme || 'General Language B'}

Course topic:
${selectedTopic?.topic || readingTopic}

Target-language topic:
${selectedTopic?.local || readingTopic}

Each question must include:
- a useful original reading context when needed
- a clear question
- an integer mark allocation
- the ideal answer
- a concise explanation
`.trim()

      const raw = await callGroq({
        system: systemPrompt,
        user: userPrompt,
        responseFormat: QUESTION_SCHEMA,
        temperature: 0.35,
        maxTokens: 2200,
      })

      const parsed = cleanModelJSON(raw)

      if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length !== 2) {
        throw new Error('Groq returned an unexpected question format.')
      }

      const normalizedQuestions = parsed.questions.map((question, index) => ({
        id: question.id || index + 1,
        question: question.question,
        context: question.context || '',
        answer: question.answer,
        explanation: question.explanation || '',
        marks: Math.max(1, Number(question.marks) || 1),
      }))

      const result = {
        title: parsed.title || `${readingTopic} practice`,
        instructions:
          parsed.instructions ||
          'Answer each question in its own answer box. Use the tutor for hints or clarification without asking for the answer.',
        questions: normalizedQuestions,
      }

      setGeneratedQuestions(result)

      setChatMessages([
        {
          role: 'tutor',
          text:
            `I generated a ${readingDifficulty.toLowerCase()} reading set on ${readingTopic}. You can answer directly under each question, ask me for help, or use Mark when you are ready. I will not reveal answer keys before marking.`,
        },
      ])
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while generating the questions.',
      )
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const markReadingQuestion = async (questionId) => {
    if (!generatedQuestions || gradingQuestion !== null) return

    const question = generatedQuestions.questions.find(
      (item) => item.id === questionId,
    )

    if (!question) return

    const answer = String(answerSubmission[questionId] || '').trim()

    if (!answer) {
      setQuestionError(`Write an answer for question ${questionId} before marking it.`)
      return
    }

    setQuestionError('')
    setGradingQuestion(questionId)
    setChatTyping(true)

    try {
      const responseFormat = {
        type: 'json_schema',
        json_schema: {
          name: 'ib_reading_single_grade',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              feedback: { type: 'string' },
              nextStep: { type: 'string' },
            },
            required: ['score', 'feedback', 'nextStep'],
            additionalProperties: false,
          },
        },
      }

      const systemPrompt = `
You are Dino, an expert IB Language B reading tutor.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Grade only the supplied question.
- Award 0 through the question's maximum marks.
- Accept equivalent wording when the meaning is correct.
- Do not invent requirements.
- Explain exactly what was correct, what was missing, and how to improve.
- Be concise, academically honest, and encouraging.
- Return only structured JSON.
`.trim()

      const userPrompt = `
LANGUAGE:
${language}

DIFFICULTY:
${readingDifficulty}

QUESTION:
${question.question}

READING CONTEXT:
${question.context}

MAXIMUM MARKS:
${question.marks}

OFFICIAL ANSWER:
${question.answer}

MARKING EXPLANATION:
${question.explanation}

STUDENT ANSWER:
${answer}
`.trim()

      const raw = await callGroq({
        system: systemPrompt,
        user: userPrompt,
        responseFormat,
        temperature: 0.1,
        maxTokens: 800,
      })

      const parsed = cleanModelJSON(raw)

      if (!parsed) {
        throw new Error('Groq returned an invalid grading response.')
      }

      const safeScore = Math.min(
        Math.max(0, Number(parsed.score) || 0),
        question.marks,
      )

      setReadingGrades((current) => ({
        ...current,
        [questionId]: {
          ...parsed,
          score: safeScore,
          maxMarks: question.marks,
        },
      }))

      setChatMessages((current) => [
        ...current,
        {
          role: 'tutor',
          text: `Question ${questionId}: ${safeScore}/${question.marks}. ${parsed.feedback}\n\nNext step: ${parsed.nextStep}`,
        },
      ])
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while marking the answer.',
      )
    } finally {
      setGradingQuestion(null)
      setChatTyping(false)
    }
  }

  const readingTotalMarks = generatedQuestions
    ? generatedQuestions.questions.reduce(
        (sum, question) => sum + question.marks,
        0,
      )
    : 0

  const readingEarnedMarks = generatedQuestions
    ? generatedQuestions.questions.reduce(
        (sum, question) =>
          sum + Number(readingGrades[question.id]?.score || 0),
        0,
      )
    : 0

  /* ------------------------------------------------------------------------ */
  /* READING TUTOR                                                             */
  /* ------------------------------------------------------------------------ */

  const sendReadingChat = async () => {
    const text = chatInput.trim()

    if (!text || chatTyping) return

    setChatMessages((current) => [...current, { role: 'user', text }])
    setChatInput('')
    setChatTyping(true)

    try {
      const questionContext = generatedQuestions
        ? generatedQuestions.questions
            .map(
              (question) =>
                `Question ${question.id}: ${question.question}\nContext: ${question.context}`,
            )
            .join('\n\n')
        : 'No reading question set has been generated yet.'

      const tutorSystem = `
You are Dino, an expert IB Language B tutor helping the student with reading practice.

IMPORTANT:
- NO EMOJIS. Never use an emoji in any response.
- Never output emojis.
- Help the student understand the question, vocabulary, reading strategy, or their own reasoning.
- Give hints and guidance rather than directly giving an answer before marking.
- Never reveal the official answer unless the question has already been marked.
- If the student asks for a hint, give a progressive hint, not the answer.
- Use clear headings, short paragraphs, and bullet points when useful.
- Markdown is allowed and encouraged for readability.
- Keep the response directly relevant to the student's current reading task.

LANGUAGE:
${language}

TOPIC:
${readingTopic || 'Not selected'}

DIFFICULTY:
${readingDifficulty}

CURRENT QUESTIONS:
${questionContext}
`.trim()

      const raw = await callGroq({
        system: tutorSystem,
        user: text,
        temperature: 0.3,
        maxTokens: 700,
      })

      setChatMessages((current) => [
        ...current,
        {
          role: 'tutor',
          text: raw || 'I could not generate a response.',
        },
      ])
    } catch (error) {
      setChatMessages((current) => [
        ...current,
        {
          role: 'tutor',
          text:
            error instanceof Error
              ? error.message
              : 'Tutor connection failed.',
        },
      ])
    } finally {
      setChatTyping(false)
    }
  }

  const handleChatKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendReadingChat()
    }
  }

  /* ------------------------------------------------------------------------ */
  /* WRITING                                                                  */
  /* ------------------------------------------------------------------------ */

  const createPrompt = async () => {
    if (!writingTopic || writingGenerating) return

    const selected = allTopics.find((item) => item.topic === writingTopic)

    if (!selected) return

    try {
      const syncedPoints = await syncUserCredits(user.id)
      setDinoPoints(syncedPoints)

      if (syncedPoints < 1) {
        setQuestionError('You need 1 Dino point to generate a writing prompt. Come back in 24 hours for 5 more.')
        return
      }

      const nextPointTotal = await spendUserCredits(user.id, 1)
      setDinoPoints(nextPointTotal)
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while checking Dino points.',
      )
      return
    }

    setWritingGenerating(true)
    setWritingGrade(null)
    setWritingAnswer('')

    try {
      const systemPrompt = `
You are Dino, an expert IB Language B writing tutor.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Create an original IB-style writing task.
- Match the requested difficulty and text type.
- Make the task realistic for the student's Language B.
- Provide clear assessment criteria.
- Keep the prompt precise but sufficiently challenging.
- Return only structured data.
`.trim()

      const userPrompt = `
Language:
${language}

Difficulty:
${writingDifficulty}

Text type:
${writingType}

IB theme:
${selected.theme}

Course topic:
${selected.topic}

Target-language topic:
${selected.local}

Create one writing task with:
- a concise title
- the student-facing prompt
- 3 or 4 clear criteria for self-checking
- a sensible suggested length
- a maximum mark total between 10 and 20
`.trim()

      const raw = await callGroq({
        system: systemPrompt,
        user: userPrompt,
        responseFormat: WRITING_PROMPT_SCHEMA,
        temperature: 0.45,
        maxTokens: 1200,
      })

      const parsed = cleanModelJSON(raw)

      if (!parsed) {
        throw new Error('Groq returned an invalid writing prompt.')
      }

      setWritingTask({
        ...parsed,
        marks: Math.max(10, Number(parsed.marks) || 15),
      })
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while generating the writing task.',
      )
    } finally {
      setWritingGenerating(false)
    }
  }

  const markWriting = async () => {
    if (!writingTask || !writingAnswer.trim() || writingGrading) return

    setWritingGrading(true)

    try {
      const responseFormat = {
        type: 'json_schema',
        json_schema: {
          name: 'ib_writing_grade',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              feedback: { type: 'string' },
              strengths: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: { type: 'string' },
              },
              improvements: {
                type: 'array',
                minItems: 1,
                maxItems: 5,
                items: { type: 'string' },
              },
              nextStep: { type: 'string' },
            },
            required: [
              'score',
              'feedback',
              'strengths',
              'improvements',
              'nextStep',
            ],
            additionalProperties: false,
          },
        },
      }

      const systemPrompt = `
You are Dino, an expert IB Language B writing examiner and tutor.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Grade the student's actual writing against the task and criteria supplied.
- Be fair and academically honest.
- Award 0 through the maximum mark.
- Do not penalise the student for things the task did not require.
- Consider task fulfilment, organisation, language, clarity, register, and the supplied criteria.
- Give specific feedback with examples of what to improve, but do not rewrite the entire response for the student.
- Use Markdown in feedback where it improves readability.
- Return only structured JSON.
`.trim()

      const userPrompt = `
LANGUAGE:
${language}

DIFFICULTY:
${writingDifficulty}

TEXT TYPE:
${writingType}

TASK:
${writingTask.prompt}

CRITERIA:
${writingTask.criteria.map((item, index) => `${index + 1}. ${item}`).join('\n')}

SUGGESTED LENGTH:
${writingTask.suggestedLength}

MAXIMUM MARKS:
${writingTask.marks}

STUDENT RESPONSE:
${writingAnswer}
`.trim()

      const raw = await callGroq({
        system: systemPrompt,
        user: userPrompt,
        responseFormat,
        temperature: 0.1,
        maxTokens: 1600,
      })

      const parsed = cleanModelJSON(raw)

      if (!parsed) {
        throw new Error('Groq returned an invalid writing grade.')
      }

      setWritingGrade({
        ...parsed,
        score: Math.min(
          Math.max(0, Number(parsed.score) || 0),
          writingTask.marks,
        ),
      })
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while marking the writing.',
      )
    } finally {
      setWritingGrading(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* LOGOUT                                                                    */
  /* ------------------------------------------------------------------------ */

  async function handleLogout() {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <AnimatedBackground className="onboarding-page">
        <div
          style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: '#222', fontSize: '12px' }}>
            Loading your workspace…
          </div>
        </div>
      </AnimatedBackground>
    )
  }

  if (!user) return null

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

        .dino-dashboard-heading span,
        .dino-panel-title span {
          font-style: italic;
        }

        .dino-header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .dino-user-email {
          max-width: 180px;
          overflow: hidden;
          color: #888;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dino-points-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 999px;
          background: rgba(255,255,255,.7);
          color: #111;
          font-size: 9px;
          line-height: 1;
          box-shadow: 0 8px 24px rgba(0,0,0,.02);
        }

        .dino-points-coin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          font-size: 10px;
          line-height: 1;
        }

        .dino-logout-button {
          height: 31px;
          padding: 0 11px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 9px;
          background: rgba(255,255,255,.75);
          color: #666;
          font-size: 8px;
          cursor: pointer;
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
          border: 0;
          background: transparent;
          color: #767676;
          font-family: Inter, sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -.025em;
          white-space: nowrap;
          cursor: pointer;
          transition: background .18s ease, color .18s ease;
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
          overflow-y: auto;
          padding-right: 4px;
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

        .dino-panel-description {
          max-width: 650px;
          margin: 7px 0 0;
          color: #777;
          font-size: 11px;
          line-height: 1.5;
        }

        .dino-subtle-note {
          max-width: 250px;
          color: #8d8d8d;
          font-size: 9px;
          line-height: 1.4;
          text-align: right;
        }

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

        .dino-reading-panel {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dino-reading-workspace {
          min-height: 0;
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
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

        .dino-expand-button {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 8px;
          background: rgba(255,255,255,.8);
          color: #5f5f5f;
          font-size: 13px;
          line-height: 1;
          cursor: pointer;
          transition: background .15s ease, color .15s ease, transform .15s ease;
        }

        .dino-expand-button:hover {
          background: #fff;
          color: #111;
          transform: translateY(-1px);
        }

        .dino-expand-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(0,0,0,.28);
          backdrop-filter: blur(5px);
        }

        .dino-card-expanded {
          position: fixed !important;
          inset: 28px;
          z-index: 81;
          width: auto !important;
          height: auto !important;
          min-width: 0;
          min-height: 0;
          border-radius: 22px;
          box-shadow: 0 30px 90px rgba(0,0,0,.16);
        }

        .dino-card-expanded .dino-generator-body,
        .dino-card-expanded .dino-chat-area {
          min-height: 0;
        }

        .dino-question-expanded {
          position: fixed !important;
          inset: 42px;
          z-index: 82;
          max-width: none;
          max-height: none;
          overflow-y: auto;
          padding: 24px;
          border-radius: 20px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 30px 90px rgba(0,0,0,.16);
        }

        .dino-question-expanded .dino-reading-context-copy {
          max-width: 100%;
        }

        .dino-question-expanded .dino-answer-box {
          min-height: 220px;
        }

        .dino-reading-generator {
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dino-card-topbar {
          min-height: 51px;
          padding: 0 17px;
          border-bottom: 1px solid rgba(0,0,0,.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 0 0 51px;
        }

        .dino-card-topbar-actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .dino-card-label,
        .dino-field-label,
        .dino-prompt-label {
          color: #898989;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .02em;
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
          overflow-y: auto;
        }

        .dino-generator-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -.055em;
        }

        .dino-generator-description {
          max-width: 650px;
          margin: 7px 0 20px;
          color: #808080;
          font-size: 10px;
          line-height: 1.5;
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

        .dino-generate,
        .dino-small-button,
        .dino-mark-button {
          min-height: 44px;
          border: 0;
          border-radius: 11px;
          background: #0a0a0a;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .15s ease, opacity .15s ease;
        }

        .dino-generate {
          width: 100%;
          margin-top: 17px;
        }

        .dino-generate:hover:not(:disabled),
        .dino-small-button:hover:not(:disabled),
        .dino-mark-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .dino-generate:disabled,
        .dino-small-button:disabled,
        .dino-mark-button:disabled {
          opacity: .3;
          cursor: not-allowed;
          transform: none;
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

        .dino-question-list {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .dino-generated-question {
          padding: 19px;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 16px;
          background: rgba(250,250,250,.7);
        }

        .dino-question-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .dino-question-number {
          display: inline-flex;
          min-width: 28px;
          height: 28px;
          padding: 0 8px;
          border-radius: 8px;
          background: #0a0a0a;
          color: #fff;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 600;
        }

        .dino-question-marks {
          color: #747474;
          font-size: 10px;
          font-weight: 600;
        }

        .dino-reading-context {
          margin-top: 14px;
          padding: 16px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid rgba(0,0,0,.05);
        }

        .dino-reading-context-label {
          margin-bottom: 8px;
          color: #929292;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .dino-reading-context-copy {
          color: #363636;
          font-size: 14px;
          line-height: 1.7;
          letter-spacing: -.01em;
        }

        .dino-question-text {
          margin: 17px 0 0;
          color: #111;
          font-size: 18px;
          line-height: 1.45;
          font-weight: 650;
          letter-spacing: -.025em;
        }

        .dino-answer-box,
        .dino-writing-textarea {
          width: 100%;
          margin-top: 13px;
          padding: 13px 14px;
          border: 1px solid rgba(0,0,0,.09);
          border-radius: 12px;
          outline: none;
          resize: vertical;
          background: #fff;
          color: #111;
          font-family: Inter, sans-serif;
          font-size: 12px;
          line-height: 1.55;
        }

        .dino-answer-box {
          min-height: 115px;
        }

        .dino-writing-textarea {
          min-height: 380px;
          font-size: 13px;
        }

        .dino-answer-box:focus,
        .dino-writing-textarea:focus,
        .dino-chat-input:focus {
          border-color: rgba(0,0,0,.22);
          box-shadow: 0 0 0 3px rgba(0,0,0,.035);
        }

        .dino-question-actions {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dino-mark-button {
          min-height: 38px;
          padding: 0 13px;
        }

        .dino-grade-pill {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(0,0,0,.04);
          color: #595959;
          font-size: 9px;
          font-weight: 600;
        }

        .dino-feedback {
          margin-top: 11px;
          padding: 13px;
          border-radius: 12px;
          background: rgba(0,0,0,.035);
          border: 1px solid rgba(0,0,0,.06);
        }

        .dino-feedback-score {
          font-size: 11px;
          font-weight: 700;
          color: #111;
        }

        .dino-markdown {
          color: #3d3d3d;
          font-size: 10px;
          line-height: 1.58;
        }

        .dino-markdown p {
          margin: 0 0 8px;
        }

        .dino-markdown p:last-child {
          margin-bottom: 0;
        }

        .dino-markdown h3,
        .dino-markdown h4,
        .dino-markdown h5 {
          margin: 0 0 8px;
          color: #141414;
          line-height: 1.25;
        }

        .dino-markdown h3 { font-size: 14px; }
        .dino-markdown h4 { font-size: 12px; }
        .dino-markdown h5 { font-size: 11px; }

        .dino-markdown ul,
        .dino-markdown ol {
          margin: 0 0 8px 16px;
          padding: 0;
        }

        .dino-markdown li {
          margin: 3px 0;
        }

        .dino-markdown code {
          padding: 2px 5px;
          border-radius: 5px;
          background: rgba(0,0,0,.05);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: .9em;
        }

        .dino-markdown a {
          color: #111;
          text-decoration: underline;
        }

        .dino-total-score {
          margin-top: 15px;
          padding: 12px 13px;
          border-radius: 12px;
          background: #0a0a0a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .dino-total-score span {
          font-size: 9px;
          opacity: .7;
        }

        .dino-total-score strong {
          font-size: 13px;
        }

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
          max-width: 92%;
          padding: 10px 11px;
          border-radius: 12px;
          font-size: 10px;
          line-height: 1.5;
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
          white-space: pre-wrap;
        }

        .dino-chat-message.user .dino-markdown {
          color: #fff;
        }

        .dino-chat-bottom {
          min-height: 70px;
          padding: 10px;
          border-top: 1px solid rgba(0,0,0,.06);
          display: flex;
          align-items: flex-end;
          gap: 7px;
          background: rgba(255,255,255,.7);
          flex: 0 0 70px;
        }

        .dino-chat-input {
          min-width: 0;
          flex: 1;
          min-height: 42px;
          max-height: 120px;
          padding: 10px 12px;
          outline: none;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 11px;
          background: #fff;
          color: #111;
          font-family: Inter, sans-serif;
          font-size: 10px;
          resize: none;
          line-height: 1.45;
        }

        .dino-chat-input::placeholder {
          color: #999;
        }

        .dino-chat-send {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border: 0;
          border-radius: 11px;
          background: #0a0a0a;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
        }

        .dino-writing-workspace {
          min-height: 0;
          height: calc(100% - 78px);
          display: grid;
          grid-template-columns: 340px minmax(0,1fr);
          gap: 14px;
        }

        .dino-writing-card {
          min-height: 0;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px;
          background: rgba(255,255,255,.77);
          backdrop-filter: blur(16px);
          overflow: hidden;
        }

        .dino-writing-controls {
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .dino-writing-controls .dino-select {
          margin-bottom: 17px;
        }

        .dino-writing-editor {
          padding: 22px;
          overflow-y: auto;
        }

        .dino-prompt-empty {
          height: 100%;
          min-height: 420px;
          max-width: 520px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
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

        .dino-writing-task {
          padding: 16px;
          border: 1px solid rgba(0,0,0,.06);
          border-radius: 14px;
          background: rgba(250,250,250,.7);
        }

        .dino-writing-task h3 {
          margin: 8px 0 0;
          font-size: 23px;
          letter-spacing: -.045em;
        }

        .dino-writing-task-prompt {
          margin: 12px 0 18px;
          color: #292929;
          font-size: 15px;
          line-height: 1.65;
        }

        .dino-criteria {
          margin: 0;
          padding-left: 17px;
          color: #5d5d5d;
          font-size: 10px;
          line-height: 1.55;
        }

        .dino-criteria li {
          margin: 5px 0;
        }

        .dino-writing-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 10px 0 0;
        }

        .dino-writing-meta span {
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(0,0,0,.045);
          color: #696969;
          font-size: 8px;
          font-weight: 600;
        }

        .dino-writing-answer-label {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dino-writing-answer-label strong {
          font-size: 11px;
        }

        .dino-writing-answer-label span {
          color: #8a8a8a;
          font-size: 8px;
        }

        .dino-writing-grade {
          margin-top: 14px;
          padding: 15px;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 14px;
          background: #fff;
        }

        .dino-writing-grade-score {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 11px;
        }

        .dino-writing-grade-score strong {
          font-size: 16px;
        }

        .dino-writing-grade-section {
          margin-top: 11px;
        }

        .dino-writing-grade-section strong {
          display: block;
          margin-bottom: 6px;
          font-size: 9px;
          text-transform: uppercase;
          color: #898989;
        }

        .dino-writing-grade-section ul {
          margin: 0;
          padding-left: 17px;
        }

        .dino-writing-grade-section li {
          margin: 4px 0;
          color: #4b4b4b;
          font-size: 10px;
          line-height: 1.45;
        }

        .dino-small-button {
          width: 100%;
          margin-top: 12px;
          padding: 0 15px;
        }

        .dino-coming-page {
          width: 100%;
          height: calc(100% - 78px);
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px;
          background: rgba(255,255,255,.77);
          backdrop-filter: blur(16px);
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

        .dino-generating {
          margin-top: 12px;
          color: #777;
          font-size: 9px;
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

          .dino-writing-workspace {
            grid-template-columns: 300px minmax(0,1fr);
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

          .dino-header-actions {
            width: 100%;
            justify-content: space-between;
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
            overflow: visible;
          }

          .dino-panel-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .dino-subtle-note {
            text-align: left;
          }

          .dino-theme-grid {
            height: auto;
            grid-template-columns: 1fr;
          }

          .dino-theme {
            height: auto;
          }

          .dino-reading-panel {
            overflow: visible;
          }

          .dino-reading-workspace {
            height: auto;
            grid-template-columns: 1fr;
          }

          .dino-reading-generator {
            overflow: visible;
          }

          .dino-tutor-card {
            min-height: 620px;
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

          .dino-writing-editor {
            min-height: 700px;
          }

          .dino-coming-page {
            height: 450px;
          }

          .dino-card-expanded {
            inset: 14px;
            border-radius: 17px;
          }

          .dino-question-expanded {
            inset: 14px;
            padding: 17px;
            border-radius: 17px;
          }
        }
      `}</style>

      <AnimatedBackground className="dino-dashboard">
        <div className="dino-dashboard-shell">

          <header className="dino-dashboard-header">
            <div>
              <span className="dino-kicker">Dino / {language}</span>
              <h1 className="dino-dashboard-heading">
                Your language <span>workspace.</span>
              </h1>
            </div>

            <div className="dino-header-actions">
              <span className="dino-user-email">{user.email}</span>

              <div className="dino-points-pill" aria-label="Dino points balance">
                <span className="dino-points-coin">🦖</span>
                <strong>{dinoPoints}</strong>
              </div>

              <button
                type="button"
                className="dino-logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>

              <div className="dino-progress">
                <div className="dino-progress-meta">
                  <span>Course progress</span>
                  <strong>{completedCount}/{totalCount}</strong>
                </div>

                <div className="dino-progress-track">
                  <div
                    className="dino-progress-fill"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </header>

          <nav className="dino-tabs">
            <button
              className={activeTab === 'course' ? 'dino-tab active' : 'dino-tab'}
              onClick={() => setActiveTab('course')}
            >
              Course Outline
            </button>

            <button
              className={activeTab === 'reading' ? 'dino-tab active' : 'dino-tab'}
              onClick={() => setActiveTab('reading')}
            >
              Reading Questionbank
            </button>

            <button
              className={activeTab === 'writing' ? 'dino-tab active' : 'dino-tab'}
              onClick={() => setActiveTab('writing')}
            >
              Writing Practice
            </button>

            <button
              className={activeTab === 'coming' ? 'dino-tab active' : 'dino-tab'}
              onClick={() => setActiveTab('coming')}
            >
              Grammar and Sentence Structures
            </button>
          </nav>

          <main className="dino-content">

            {activeTab === 'course' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">IB Language B</span>
                    <h2 className="dino-panel-title">Course outline</h2>
                    <p className="dino-panel-description">
                      Your five IB themes and recommended topic areas in English and {language}.
                    </p>
                  </div>

                  <div className="dino-subtle-note">
                    This checklist is saved across your devices.
                  </div>
                </div>

                <div className="dino-theme-grid">
                  {course.themes.map((theme, index) => (
                    <article className="dino-theme" key={theme.en}>
                      <div className="dino-theme-top">
                        <span className="dino-theme-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="dino-theme-count">
                          {theme.topics.filter((topic) =>
                            isCompleted(theme.en, topic[0]),
                          ).length}/{theme.topics.length}
                        </span>
                      </div>

                      <h3 className="dino-theme-title">{theme.en}</h3>
                      <div className="dino-theme-local">{theme.local}</div>

                      <div className="dino-topic-list">
                        {theme.topics.map(([english, local]) => {
                          const complete = isCompleted(theme.en, english)
                          const topicId = `${language}::${theme.en}::${english}`

                          return (
                            <label
                              key={english}
                              className={complete ? 'dino-topic completed' : 'dino-topic'}
                            >
                              <input
                                type="checkbox"
                                checked={complete}
                                disabled={savingTopic === topicId}
                                onChange={() => toggleTopic(theme.en, english)}
                              />

                              <span className="dino-check">
                                {complete ? '✓' : ''}
                              </span>

                              <span className="dino-topic-copy">
                                <strong>{english}</strong>
                                <small>{local}</small>
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'reading' && (
              <section className="dino-panel dino-reading-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">Reading</span>
                    <h2 className="dino-panel-title">
                      Reading <span>questionbank.</span>
                    </h2>
                    <p className="dino-panel-description">
                      Generate marked reading questions, answer them in place, and use Dino as a tutor when you get stuck.
                    </p>
                  </div>
                </div>

                <div className="dino-reading-workspace">
                  {expandedReadingSection && (
                    <div
                      className="dino-expand-backdrop"
                      onClick={() => setExpandedReadingSection(null)}
                    />
                  )}

                  <div
                    className={`dino-reading-card dino-reading-generator ${
                      expandedReadingSection === 'questionbank'
                        ? 'dino-card-expanded'
                        : ''
                    }`}
                  >
                    <div className="dino-card-topbar">
                      <span className="dino-card-label">Reading questionbank</span>

                      <div className="dino-card-topbar-actions">
                        <span className="dino-card-status">
                          {generatedQuestions ? 'Questions ready' : 'Ready'}
                        </span>

                        <button
                          type="button"
                          className="dino-expand-button"
                          aria-label={
                            expandedReadingSection === 'questionbank'
                              ? 'Close expanded question bank'
                              : 'Expand question bank'
                          }
                          title={
                            expandedReadingSection === 'questionbank'
                              ? 'Close expanded view'
                              : 'Expand question bank'
                          }
                          onClick={() =>
                            setExpandedReadingSection(
                              expandedReadingSection === 'questionbank'
                                ? null
                                : 'questionbank',
                            )
                          }
                        >
                          {expandedReadingSection === 'questionbank' ? '↙' : '↗'}
                        </button>
                      </div>
                    </div>

                    {!generatedQuestions ? (
                      <div className="dino-generator-body">
                        <h3 className="dino-generator-title">Build a reading set.</h3>

                        <p className="dino-generator-description">
                          Choose the question style, difficulty, and IB course topic.
                        </p>

                        <div className="dino-generator-fields">
                          <div className="dino-field">
                            <label className="dino-field-label">Question type</label>

                            <select
                              className="dino-select"
                              value={readingType}
                              onChange={(event) => setReadingType(event.target.value)}
                            >
                              <option>Mixed</option>
                              <option>Multiple choice</option>
                              <option>Short answer</option>
                              <option>True / false</option>
                              <option>Vocabulary in context</option>
                              <option>Inference</option>
                            </select>
                          </div>

                          <div className="dino-field">
                            <label className="dino-field-label">Difficulty</label>

                            <select
                              className="dino-select"
                              value={readingDifficulty}
                              onChange={(event) => setReadingDifficulty(event.target.value)}
                            >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                          </div>

                          <div className="dino-field">
                            <label className="dino-field-label">Language</label>

                            <div
                              style={{
                                minHeight: '42px',
                                padding: '0 11px',
                                border: '1px solid rgba(0,0,0,.08)',
                                borderRadius: '11px',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '10px',
                                fontWeight: 500,
                              }}
                            >
                              {language}
                            </div>
                          </div>

                          <div className="dino-field">
                            <label className="dino-field-label">IB course topic</label>

                            <select
                              className="dino-select"
                              value={readingTopic}
                              onChange={(event) => setReadingTopic(event.target.value)}
                            >
                              <option value="">Select a course topic</option>

                              {course.themes.map((theme) => (
                                <optgroup
                                  key={theme.en}
                                  label={`${theme.en} / ${theme.local}`}
                                >
                                  {theme.topics.map(([english, local]) => (
                                    <option key={english} value={english}>
                                      {english} / {local}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="dino-generate"
                          disabled={!readingTopic || isGeneratingQuestions}
                          onClick={generateReadingQuestions}
                        >
                          {isGeneratingQuestions ? 'Generating...' : `Generate questions → 1 🦖`}
                        </button>

                        {isGeneratingQuestions && (
                          <div className="dino-generating">
                            Dino is building the reading set...
                          </div>
                        )}

                        {questionError && <div className="dino-error">{questionError}</div>}
                      </div>
                    ) : (
                      <div className="dino-generator-body">
                        <h3 className="dino-generator-title">{generatedQuestions.title}</h3>

                        <p className="dino-generator-description">
                          {generatedQuestions.instructions}
                        </p>

                        <div className="dino-question-list">
                          {generatedQuestions.questions.map((question) => {
                            const grade = readingGrades[question.id]

                            return (
                              <article
                                className={`dino-generated-question ${
                                  expandedReadingSection === `question-${question.id}`
                                    ? 'dino-question-expanded'
                                    : ''
                                }`}
                                key={question.id}
                              >
                                <div className="dino-question-header">
                                  <span className="dino-question-number">
                                    Question {question.id}
                                  </span>

                                  <div className="dino-card-topbar-actions">
                                    <span className="dino-question-marks">
                                      {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                                    </span>

                                    <button
                                      type="button"
                                      className="dino-expand-button"
                                      aria-label={
                                        expandedReadingSection === `question-${question.id}`
                                          ? `Close expanded question ${question.id}`
                                          : `Expand question ${question.id}`
                                      }
                                      title={
                                        expandedReadingSection === `question-${question.id}`
                                          ? 'Close expanded view'
                                          : 'Expand question'
                                      }
                                      onClick={() =>
                                        setExpandedReadingSection(
                                          expandedReadingSection === `question-${question.id}`
                                            ? null
                                            : `question-${question.id}`,
                                        )
                                      }
                                    >
                                      {expandedReadingSection === `question-${question.id}`
                                        ? '↙'
                                        : '↗'}
                                    </button>
                                  </div>
                                </div>

                                {question.context && (
                                  <div className="dino-reading-context">
                                    <div className="dino-reading-context-label">
                                      Reading text
                                    </div>

                                    <div className="dino-reading-context-copy">
                                      {renderMarkdown(question.context)}
                                    </div>
                                  </div>
                                )}

                                <div className="dino-question-text">
                                  {renderMarkdown(question.question)}
                                </div>

                                <textarea
                                  className="dino-answer-box"
                                  value={answerSubmission[question.id] || ''}
                                  onChange={(event) =>
                                    setAnswerSubmission((current) => ({
                                      ...current,
                                      [question.id]: event.target.value,
                                    }))
                                  }
                                  placeholder={`Write your answer here. Maximum ${question.marks} ${question.marks === 1 ? 'mark' : 'marks'}.`}
                                />

                                <div className="dino-question-actions">
                                  <span className="dino-grade-pill">
                                    {grade
                                      ? `${grade.score}/${grade.maxMarks} marked`
                                      : `${question.marks} marks available`}
                                  </span>

                                  <button
                                    type="button"
                                    className="dino-mark-button"
                                    disabled={
                                      gradingQuestion !== null ||
                                      !String(answerSubmission[question.id] || '').trim()
                                    }
                                    onClick={() => markReadingQuestion(question.id)}
                                  >
                                    {gradingQuestion === question.id
                                      ? 'Marking...'
                                      : grade
                                        ? 'Mark again'
                                        : 'Mark answer'}
                                  </button>
                                </div>

                                {grade && (
                                  <div className="dino-feedback">
                                    <div className="dino-feedback-score">
                                      {grade.score}/{grade.maxMarks}
                                    </div>

                                    <div style={{ marginTop: '8px' }}>
                                      {renderMarkdown(grade.feedback)}
                                    </div>

                                    <div style={{ marginTop: '8px' }}>
                                      {renderMarkdown(`**Next step:** ${grade.nextStep}`)}
                                    </div>
                                  </div>
                                )}
                              </article>
                            )
                          })}
                        </div>

                        <div className="dino-total-score">
                          <span>Current reading score</span>
                          <strong>
                            {readingEarnedMarks}/{readingTotalMarks}
                          </strong>
                        </div>

                        {questionError && <div className="dino-error">{questionError}</div>}

                        <button
                          type="button"
                          className="dino-small-button"
                          onClick={() => {
                            setGeneratedQuestions(null)
                            setAnswerSubmission({})
                            setReadingGrades({})
                            setQuestionError('')
                          }}
                        >
                          Generate a new set
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="dino-reading-card dino-tutor-card">
                    <div className="dino-tutor-head">
                      <div className="dino-tutor-identity">
                        <div className="dino-tutor-avatar">D</div>

                        <div className="dino-tutor-name">
                          <strong>Dino Tutor</strong>
                          <span>Reading assistant</span>
                        </div>
                      </div>

                      <div className="dino-card-topbar-actions">
                        <div className="dino-tutor-online">
                          <span className="dino-tutor-online-dot" />
                          Connected
                        </div>

                        <button
                          type="button"
                          className="dino-expand-button"
                          aria-label={
                            expandedReadingSection === 'tutor'
                              ? 'Close expanded tutor'
                              : 'Expand tutor chat'
                          }
                          title={
                            expandedReadingSection === 'tutor'
                              ? 'Close expanded view'
                              : 'Expand tutor chat'
                          }
                          onClick={() =>
                            setExpandedReadingSection(
                              expandedReadingSection === 'tutor' ? null : 'tutor',
                            )
                          }
                        >
                          {expandedReadingSection === 'tutor' ? '↙' : '↗'}
                        </button>
                      </div>
                    </div>

                    <div className="dino-chat-area">
                      {chatMessages.length === 0 && (
                        <div className="dino-chat-message tutor">
                          Generate a reading set and I’ll help you work through the questions.
                        </div>
                      )}

                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={
                            message.role === 'user'
                              ? 'dino-chat-message user'
                              : 'dino-chat-message tutor'
                          }
                        >
                          {message.role === 'tutor'
                            ? renderMarkdown(message.text)
                            : message.text}
                        </div>
                      ))}

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
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={handleChatKeyDown}
                        placeholder="Ask the tutor for a hint, explanation, or strategy..."
                        rows={2}
                      />

                      <button
                        type="button"
                        className="dino-chat-send"
                        onClick={sendReadingChat}
                        disabled={chatTyping}
                      >
                        ↑
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'writing' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">Writing</span>
                    <h2 className="dino-panel-title">
                      Practice <span>smarter.</span>
                    </h2>
                    <p className="dino-panel-description">
                      Generate an AI writing task, write your response, then get an examiner-style mark and actionable feedback.
                    </p>
                  </div>
                </div>

                <div className="dino-writing-workspace">

                  <div className="dino-writing-card dino-writing-controls">
                    <label className="dino-field-label">Course topic</label>

                    <select
                      className="dino-select"
                      value={writingTopic}
                      onChange={(event) => setWritingTopic(event.target.value)}
                    >
                      <option value="">Select a course topic</option>

                      {course.themes.map((theme) => (
                        <optgroup
                          key={theme.en}
                          label={`${theme.en} / ${theme.local}`}
                        >
                          {theme.topics.map(([english, local]) => (
                            <option value={english} key={english}>
                              {english} / {local}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>

                    <label className="dino-field-label">Text type</label>

                    <select
                      className="dino-select"
                      value={writingType}
                      onChange={(event) => setWritingType(event.target.value)}
                    >
                      {writingTypes.map((type) => (
                        <option value={type} key={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <label className="dino-field-label">Difficulty</label>

                    <select
                      className="dino-select"
                      value={writingDifficulty}
                      onChange={(event) => setWritingDifficulty(event.target.value)}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>

                    <button
                      type="button"
                      className="dino-generate"
                      disabled={!writingTopic || writingGenerating}
                      onClick={createPrompt}
                    >
                      {writingGenerating ? 'Generating...' : 'Generate prompt → 1 🦖'}
                    </button>

                    {writingGenerating && (
                      <div className="dino-generating">
                        Dino is building your task...
                      </div>
                    )}

                    {questionError && !writingTask && (
                      <div className="dino-error">{questionError}</div>
                    )}
                  </div>

                  <div className="dino-writing-card dino-writing-editor">
                    {!writingTask ? (
                      <div className="dino-prompt-empty">
                        <div className="dino-prompt-icon">✦</div>

                        <h3>Your writing task will appear here.</h3>

                        <p>
                          Select a course topic, text type, and difficulty, then let Dino generate the task and marking criteria.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="dino-writing-task">
                          <span className="dino-prompt-label">Generated task</span>

                          <h3>{writingTask.title}</h3>

                          <div className="dino-writing-meta">
                            <span>{writingType}</span>
                            <span>{writingDifficulty}</span>
                            <span>{writingTask.marks} marks</span>
                            <span>{writingTask.suggestedLength}</span>
                          </div>

                          <div className="dino-writing-task-prompt">
                            {renderMarkdown(writingTask.prompt)}
                          </div>

                          <div className="dino-prompt-label">Criteria</div>

                          <ol className="dino-criteria">
                            {writingTask.criteria.map((criterion, index) => (
                              <li key={index}>{criterion}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="dino-writing-answer-label">
                          <strong>Your response</strong>
                          <span>{writingTask.marks} marks available</span>
                        </div>

                        <textarea
                          className="dino-writing-textarea"
                          value={writingAnswer}
                          onChange={(event) => setWritingAnswer(event.target.value)}
                          placeholder="Write your response here..."
                        />

                        <button
                          type="button"
                          className="dino-mark-button"
                          style={{
                            width: '100%',
                            marginTop: '10px',
                          }}
                          disabled={!writingAnswer.trim() || writingGrading}
                          onClick={markWriting}
                        >
                          {writingGrading ? 'Marking response...' : 'Mark response'}
                        </button>

                        {questionError && writingTask && (
                          <div className="dino-error">{questionError}</div>
                        )}

                        {writingGrade && (
                          <div className="dino-writing-grade">
                            <div className="dino-writing-grade-score">
                              <span className="dino-prompt-label">Result</span>
                              <strong>
                                {writingGrade.score}/{writingTask.marks}
                              </strong>
                            </div>

                            {renderMarkdown(writingGrade.feedback)}

                            <div className="dino-writing-grade-section">
                              <strong>Strengths</strong>
                              <ul>
                                {writingGrade.strengths.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="dino-writing-grade-section">
                              <strong>Improve next</strong>
                              <ul>
                                {writingGrade.improvements.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="dino-writing-grade-section">
                              <strong>Next step</strong>
                              <p style={{ margin: 0, color: '#4b4b4b', fontSize: '10px', lineHeight: 1.45 }}>
                                {writingGrade.nextStep}
                              </p>
                            </div>

                            <button
                              type="button"
                              className="dino-small-button"
                              onClick={createPrompt}
                              disabled={writingGenerating}
                            >
                              Generate another task
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'coming' && (
              <section className="dino-panel">
                <div className="dino-coming-page">
                  <div className="dino-coming-content">
                    <div className="dino-coming-icon">✦</div>

                    <h2>Coming Soon...</h2>

                    <p>
                      Grammar activities and sentence structure practice are currently being developed for Dino.
                    </p>
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