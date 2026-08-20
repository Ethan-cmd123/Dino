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
  getGoldMembership,
} from "../api/credentials";
/*
|--------------------------------------------------------------------------
| Groq
|--------------------------------------------------------------------------
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
   COURSE OUTLINE
   ========================================================================== */

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
          [
            'Human rights',
            'Droits humains',
          ],
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
          ['Entertainment', 'Entretenimiento'],
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
            '科学技术的革新',
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
          ['Leisure activities', 'Leisure activities'],
          [
            'Holidays and travel',
            'Holidays and travel',
          ],
          ['Life stories', 'Life stories'],
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
          [
            'Human rights',
            'Human rights',
          ],
          [
            'Peace and conflict',
            'Peace and conflict',
          ],
          ['Equality', 'Equality'],
          ['Globalization', 'Globalization'],
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
          ['Entertainment', 'Intrattenimento'],
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
          [
            'Leisure activities',
            '余暇活動',
          ],
          [
            'Holidays and travel',
            '休暇と旅行',
          ],
          [
            'Life stories',
            '人生の物語',
          ],
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
            '和平と紛争',
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

/* ==========================================================================
   HELPERS
   ========================================================================== */

function cleanModelJSON(text) {
  if (!text) return null

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

/* ==========================================================================
   GROQ
   ========================================================================== */

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

/* ==========================================================================
   QUESTION SCHEMAS
   ========================================================================== */

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
        suggestedLength: { type: 'string' },
      },
      required: [
        'title',
        'prompt',
        'suggestedLength',
      ],
      additionalProperties: false,
    },
  },
}

const VOCABULARY_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'ib_language_b_vocabulary_set',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        instructions: { type: 'string' },
        words: {
          type: 'array',
          minItems: 10,
          maxItems: 10,
          items: {
            type: 'object',
            properties: {
              term: { type: 'string' },
              translation: { type: 'string' },
              example: { type: 'string' },
              note: { type: 'string' },
            },
            required: ['term', 'translation', 'example', 'note'],
            additionalProperties: false,
          },
        },
      },
      required: ['title', 'instructions', 'words'],
      additionalProperties: false,
    },
  },
}

/* ==========================================================================
   MARKDOWN RENDERING
   ========================================================================== */

function splitInlineMarkdown(text, keyPrefix = 'md') {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g,
  )

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

    const linkMatch =
      token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

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

    return (
      <span key={`${keyPrefix}-t-${index}`}>
        {token}
      </span>
    )
  })
}

function renderMarkdown(text, className = '') {
  const source =
    String(text || '').replace(/\r/g, '')
  const blocks = source.split('\n\n')

  return (
    <div
      className={`dino-markdown ${className}`.trim()}
    >
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n')
        const firstLine =
          lines[0]?.trim() || ''

        if (/^###\s+/.test(firstLine)) {
          return (
            <h5 key={blockIndex}>
              {splitInlineMarkdown(
                firstLine.replace(/^###\s+/, ''),
                `h3-${blockIndex}`,
              )}
            </h5>
          )
        }

        if (/^##\s+/.test(firstLine)) {
          return (
            <h4 key={blockIndex}>
              {splitInlineMarkdown(
                firstLine.replace(/^##\s+/, ''),
                `h2-${blockIndex}`,
              )}
            </h4>
          )
        }

        if (/^#\s+/.test(firstLine)) {
          return (
            <h3 key={blockIndex}>
              {splitInlineMarkdown(
                firstLine.replace(/^#\s+/, ''),
                `h1-${blockIndex}`,
              )}
            </h3>
          )
        }

        if (
          lines.every((line) =>
            /^[-*]\s+/.test(line.trim()),
          )
        ) {
          return (
            <ul key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>
                  {splitInlineMarkdown(
                    line
                      .trim()
                      .replace(/^[-*]\s+/, ''),
                    `li-${blockIndex}-${index}`,
                  )}
                </li>
              ))}
            </ul>
          )
        }

        if (
          lines.every((line) =>
            /^\d+\.\s+/.test(line.trim()),
          )
        ) {
          return (
            <ol key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index}>
                  {splitInlineMarkdown(
                    line
                      .trim()
                      .replace(/^\d+\.\s+/, ''),
                    `oli-${blockIndex}-${index}`,
                  )}
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
                {splitInlineMarkdown(
                  line,
                  `p-${blockIndex}-${index}`,
                )}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

/* ==========================================================================
   APP
   ========================================================================== */

function Dashboard({ navigate }) {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profileLoading, setProfileLoading] =
    useState(true)
  const [dinoPoints, setDinoPoints] =
    useState(0)
  const [language, setLanguage] =
    useState('English B')
  const [activeTab, setActiveTab] =
    useState('course')
  const [selectedTopics, setSelectedTopics] =
    useState([])
  const [savingTopic, setSavingTopic] =
    useState('')

  const [writingTopic, setWritingTopic] =
    useState('')
  const [writingType, setWritingType] =
    useState('Article')
  const [writingDifficulty, setWritingDifficulty] =
    useState('Intermediate')
  const [writingTask, setWritingTask] =
    useState(null)
  const [writingAnswer, setWritingAnswer] =
    useState('')
  const [writingGrade, setWritingGrade] =
    useState(null)
  const [writingGenerating, setWritingGenerating] =
    useState(false)
  const [writingGrading, setWritingGrading] =
    useState(false)

  const [vocabularyTopic, setVocabularyTopic] =
    useState('')
  const [vocabularySet, setVocabularySet] =
    useState(null)
  const [vocabularyGenerating, setVocabularyGenerating] =
    useState(false)
  const [vocabularyIndex, setVocabularyIndex] =
    useState(0)
  const [vocabularyRevealed, setVocabularyRevealed] =
    useState(false)

  const [readingType, setReadingType] =
    useState('Mixed')
  const [readingDifficulty, setReadingDifficulty] =
    useState('Intermediate')
  const [readingTopic, setReadingTopic] =
    useState('')
  const [generatedQuestions, setGeneratedQuestions] =
    useState(null)
  const [isGeneratingQuestions, setIsGeneratingQuestions] =
    useState(false)
  const [questionError, setQuestionError] =
    useState('')
  const [answerSubmission, setAnswerSubmission] =
    useState({})
  const [readingGrades, setReadingGrades] =
    useState({})
  const [gradingQuestion, setGradingQuestion] =
    useState(null)

  const [expandedSection, setExpandedSection] =
    useState(null)

  /* ------------------------------------------------------------------------ */
  /* AUTH                                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true

    async function initialiseAuth() {
      try {
        const currentUser =
          await getCurrentUser()

        if (!currentUser) {
          navigate('/login')
          return
        }

        if (mounted) {
          setUser(currentUser)
          setAuthLoading(false)
        }

        try {
          const profile =
            await getProfile(currentUser.id)

          if (mounted) {
            setLanguage(
              profile?.language ||
                currentUser?.user_metadata?.language ||
                'English B',
            )
          }
        } catch (error) {
          console.error(
            'Profile loading failed:',
            error,
          )
        }

        try {
          const savedProgress =
            await getCourseProgress(
              currentUser.id,
            )

          if (mounted) {
            setSelectedTopics(savedProgress)
          }
        } catch (error) {
          console.error(
            'Course progress loading failed:',
            error,
          )
        }

        try {
          const syncedPoints =
            await syncUserCredits(
              currentUser.id,
            )

          if (mounted) {
            setDinoPoints(syncedPoints)
          }
        } catch (error) {
          console.error(
            'Dino points loading failed:',
            error,
          )
        } finally {
          if (mounted) {
            setProfileLoading(false)
          }
        }
      } catch (error) {
        console.error(
          'Dashboard auth check failed:',
          error,
        )
        navigate('/login')
      }
    }

    initialiseAuth()

    const authSubscription =
      onAuthStateChange(
        (event, session) => {
          if (
            event === 'SIGNED_OUT' ||
            !session
          ) {
            navigate('/login')
            return
          }

          setUser(session.user)
          setAuthLoading(false)
        },
      )

    return () => {
      mounted = false
      authSubscription?.data?.subscription?.unsubscribe?.()
    }
  }, [navigate])

  useEffect(() => {
    document.body.dataset.page =
      'dashboard'

    return () => {
      delete document.body.dataset.page
    }
  }, [])

  useEffect(() => {
    if (!expandedSection) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setExpandedSection(null)
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [expandedSection])

  /* ------------------------------------------------------------------------ */
  /* COURSE                                                                    */
  /* ------------------------------------------------------------------------ */

  const course = useMemo(() => {
    return (
      COURSE[language] ||
      COURSE['English B']
    )
  }, [language])

  const allTopics = useMemo(() => {
    return course.themes.flatMap(
      (theme) =>
        theme.topics.map((topic) => ({
          theme: theme.en,
          themeLocal: theme.local,
          topic: topic[0],
          local: topic[1],
        })),
    )
  }, [course])

  const completedCount =
    selectedTopics.length
  const totalCount = allTopics.length

  const courseProgress =
    totalCount > 0
      ? Math.round(
          (completedCount /
            totalCount) *
            100,
        )
      : 0

  const toggleTopic = async (
    themeName,
    topicEnglish,
  ) => {
    if (!user || savingTopic) return

    const topicId =
      `${language}::${themeName}::${topicEnglish}`

    const currentlyCompleted =
      selectedTopics.includes(topicId)

    const nextCompleted =
      !currentlyCompleted

    setSavingTopic(topicId)

    setSelectedTopics((current) =>
      nextCompleted
        ? [...current, topicId]
        : current.filter(
            (item) =>
              item !== topicId,
          ),
    )

    try {
      await setCourseTopicCompleted(
        user.id,
        topicId,
        nextCompleted,
      )
    } catch (error) {
      console.error(
        'Saving course topic failed:',
        error,
      )

      setSelectedTopics((current) => {
        if (currentlyCompleted) {
          return [
            ...current,
            topicId,
          ]
        }

        return current.filter(
          (item) =>
            item !== topicId,
        )
      })
    } finally {
      setSavingTopic('')
    }
  }

  const isCompleted = (
    themeName,
    topicEnglish,
  ) => {
    return selectedTopics.includes(
      `${language}::${themeName}::${topicEnglish}`,
    )
  }

  /* ------------------------------------------------------------------------ */
  /* READING                                                                   */
  /* ------------------------------------------------------------------------ */

  const generateReadingQuestions =
    async () => {
      if (
        !readingTopic ||
        !readingType
      ) {
        return
      }

      try {
        const syncedPoints =
          await syncUserCredits(user.id)

        setDinoPoints(syncedPoints)

        if (syncedPoints < 1) {
          setQuestionError(
            'You need 1 Dino point to generate a reading question set. Come back in 24 hours for 5 more.',
          )
          return
        }

        const nextPointTotal =
          await spendUserCredits(
            user.id,
            1,
          )

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
      setExpandedSection(null)
      setIsGeneratingQuestions(true)

      const selectedTopic =
        allTopics.find(
          (item) =>
            item.topic ===
            readingTopic,
        )

      try {
        const systemPrompt = `
You create expert IB Language B practice materials.

Create original, high-quality reading comprehension practice for an IB Language B student.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Keep every response suitable for focused academic practice.
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

        const raw =
          await callGroq({
            system: systemPrompt,
            user: userPrompt,
            responseFormat:
              QUESTION_SCHEMA,
            temperature: 0.35,
            maxTokens: 2200,
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
            (
              question,
              index,
            ) => ({
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
              marks: Math.max(
                1,
                Number(
                  question.marks,
                ) || 1,
              ),
            }),
          )

        const result = {
          title:
            parsed.title ||
            `${readingTopic} practice`,
          instructions:
            parsed.instructions ||
            'Answer each question in its own answer box, then use Mark to check your response.',
          questions:
            normalizedQuestions,
        }

        setGeneratedQuestions(
          result,
        )

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

  const markReadingQuestion =
    async (questionId) => {
      if (
        !generatedQuestions ||
        gradingQuestion !== null
      ) {
        return
      }

      const question =
        generatedQuestions.questions.find(
          (item) =>
            item.id === questionId,
        )

      if (!question) return

      const answer = String(
        answerSubmission[
          questionId
        ] || '',
      ).trim()

      if (!answer) {
        setQuestionError(
          `Write an answer for question ${questionId} before marking it.`,
        )
        return
      }

      setQuestionError('')
      setGradingQuestion(
        questionId,
      )

      try {
        const responseFormat = {
          type: 'json_schema',
          json_schema: {
            name: 'ib_reading_single_grade',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                score: {
                  type: 'integer',
                },
                feedback: {
                  type: 'string',
                },
                nextStep: {
                  type: 'string',
                },
              },
              required: [
                'score',
                'feedback',
                'nextStep',
              ],
              additionalProperties: false,
            },
          },
        }

        const systemPrompt = `
You are an expert IB Language B reading examiner.

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

        const raw =
          await callGroq({
            system: systemPrompt,
            user: userPrompt,
            responseFormat,
            temperature: 0.1,
            maxTokens: 800,
          })

        const parsed =
          cleanModelJSON(raw)

        if (!parsed) {
          throw new Error(
            'Groq returned an invalid grading response.',
          )
        }

        const safeScore =
          Math.min(
            Math.max(
              0,
              Number(
                parsed.score,
              ) || 0,
            ),
            question.marks,
          )

        setReadingGrades(
          (current) => ({
            ...current,
            [questionId]: {
              ...parsed,
              score:
                safeScore,
              maxMarks:
                question.marks,
            },
          }),
        )

      } catch (error) {
        setQuestionError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while marking the answer.',
        )
      } finally {
        setGradingQuestion(
          null,
        )
      }
    }

  const readingTotalMarks =
    generatedQuestions
      ? generatedQuestions.questions.reduce(
          (sum, question) =>
            sum + question.marks,
          0,
        )
      : 0

  const readingEarnedMarks =
    generatedQuestions
      ? generatedQuestions.questions.reduce(
          (
            sum,
            question,
          ) =>
            sum +
            Number(
              readingGrades[
                question.id
              ]?.score || 0,
            ),
          0,
        )
      : 0

  /* ------------------------------------------------------------------------ */
  /* WRITING                                                                  */
  /* ------------------------------------------------------------------------ */

  const createPrompt =
    async () => {
      if (
        !writingTopic ||
        writingGenerating
      ) {
        return
      }

      const selected =
        allTopics.find(
          (item) =>
            item.topic ===
            writingTopic,
        )

      if (!selected) return

      try {
        const syncedPoints =
          await syncUserCredits(
            user.id,
          )

        setDinoPoints(
          syncedPoints,
        )

        if (syncedPoints < 1) {
          setQuestionError(
            'You need 1 Dino point to generate a writing prompt. Come back in 24 hours for 5 more.',
          )
          return
        }

        const nextPointTotal =
          await spendUserCredits(
            user.id,
            1,
          )

        setDinoPoints(
          nextPointTotal,
        )
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
You create expert IB Language B writing practice materials.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Create an original IB-style writing task.
- Match the requested difficulty and text type.
- Make the task realistic for the student's Language B.
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
- a sensible suggested length
`.trim()

        const raw =
          await callGroq({
            system: systemPrompt,
            user: userPrompt,
            responseFormat:
              WRITING_PROMPT_SCHEMA,
            temperature: 0.45,
            maxTokens: 1200,
          })

        const parsed =
          cleanModelJSON(raw)

        if (!parsed) {
          throw new Error(
            'Groq returned an invalid writing prompt.',
          )
        }

        setWritingTask(parsed)
      } catch (error) {
        setQuestionError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while generating the writing task.',
        )
      } finally {
        setWritingGenerating(
          false,
        )
      }
    }

  const markWriting =
    async () => {
      if (
        !writingTask ||
        !writingAnswer.trim() ||
        writingGrading
      ) {
        return
      }

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
                score: {
                  type: 'integer',
                },
                criterionA: { type: 'integer' },
                criterionB: { type: 'integer' },
                criterionC: { type: 'integer' },
                feedback: {
                  type: 'string',
                },
                strengths: {
                  type: 'array',
                  minItems: 1,
                  maxItems: 5,
                  items: {
                    type: 'string',
                  },
                },
                improvements: {
                  type: 'array',
                  minItems: 1,
                  maxItems: 5,
                  items: {
                    type: 'string',
                  },
                },
                nextStep: {
                  type: 'string',
                },
              },
              required: [
                'score',
                'criterionA',
                'criterionB',
                'criterionC',
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
You are an expert IB Language B writing examiner.

IMPORTANT:
- Do NOT use emojis.
- Do NOT output emojis.
- Grade the student's actual writing using the IB Language B Paper 1 criteria.
- Be fair and academically honest.
- Assess Criterion A: Language (0-12), Criterion B: Message (0-12), and Criterion C: Conceptual understanding (0-6).
- The total score must equal A + B + C and be out of 30.
- Do not penalise the student for things the task did not require.
- Consider task fulfilment, organisation, language, clarity, register, and conceptual understanding.
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

SUGGESTED LENGTH:
${writingTask.suggestedLength}

MAXIMUM MARKS:
30

STUDENT RESPONSE:
${writingAnswer}
`.trim()

        const raw =
          await callGroq({
            system:
              systemPrompt,
            user:
              userPrompt,
            responseFormat,
            temperature: 0.1,
            maxTokens: 1600,
          })

        const parsed =
          cleanModelJSON(raw)

        if (!parsed) {
          throw new Error(
            'Groq returned an invalid writing grade.',
          )
        }

        const criterionA = Math.min(12, Math.max(0, Number(parsed.criterionA) || 0))
        const criterionB = Math.min(12, Math.max(0, Number(parsed.criterionB) || 0))
        const criterionC = Math.min(6, Math.max(0, Number(parsed.criterionC) || 0))

        setWritingGrade({
          ...parsed,
          criterionA,
          criterionB,
          criterionC,
          score: criterionA + criterionB + criterionC,
        })
      } catch (error) {
        setQuestionError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while marking the writing.',
        )
      } finally {
        setWritingGrading(
          false,
        )
      }
    }

  const generateVocabulary = async () => {
    if (!vocabularyTopic || vocabularyGenerating) return

    const selected = allTopics.find(
      (item) => item.topic === vocabularyTopic,
    )

    if (!selected) return

    setVocabularyGenerating(true)
    setQuestionError('')

    try {
      const syncedPoints = await syncUserCredits(user.id)
      setDinoPoints(syncedPoints)

      if (syncedPoints < 1) {
        setQuestionError(
          'You need 1 Dino point to generate a vocabulary set. Come back in 24 hours for 5 more.',
        )
        return
      }

      const nextPointTotal = await spendUserCredits(user.id, 1)
      setDinoPoints(nextPointTotal)

      const raw = await callGroq({
        system: `
You create focused IB Language B vocabulary practice.

IMPORTANT:
- Do NOT use emojis.
- Return exactly ten useful, level-appropriate terms or short phrases.
- Give each term in the target language, an English translation, a natural target-language example sentence, and a brief usage note.
- Avoid obscure or duplicate vocabulary.
- Return only structured data.
`.trim(),
        user: `
Language: ${language}
IB theme: ${selected.theme}
Course topic: ${selected.topic}
Target-language topic: ${selected.local}
`.trim(),
        responseFormat: VOCABULARY_SCHEMA,
        temperature: 0.35,
        maxTokens: 1800,
      })

      const parsed = cleanModelJSON(raw)
      if (!parsed || !Array.isArray(parsed.words)) {
        throw new Error('Groq returned an invalid vocabulary set.')
      }

      setVocabularySet(parsed)
      setVocabularyIndex(0)
      setVocabularyRevealed(false)
    } catch (error) {
      setQuestionError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while generating the vocabulary set.',
      )
    } finally {
      setVocabularyGenerating(false)
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
      console.error(
        'Logout failed:',
        error,
      )
    }
  }

  if (
    authLoading ||
    profileLoading
  ) {
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
          <div
            style={{
              color: '#222',
              fontSize: '12px',
            }}
          >
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
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        /* Completely hide the site's normal navbar on the dashboard */
        body[data-page="dashboard"] .navbar {
          display: none !important;
        }

        /* =========================================================
          DASHBOARD BASE
          ========================================================= */

        .dino-dashboard {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          padding: 28px 34px 40px;
          overflow: visible;
        }

        .dino-dashboard-shell {
          position: relative;
          z-index: 1;
          width: min(1260px, 100%);
          min-height: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* =========================================================
          DASHBOARD STICKY HEADER
          This is now the ONLY top navigation on the dashboard.
          ========================================================= */

        .dino-dashboard-sticky {
          position: sticky !important;
          top: 0 !important;
          z-index: 100 !important;

          width: 100%;

          margin: -28px 0 0 !important;
          padding: 28px 0 12px !important;

          background:
            linear-gradient(
              to bottom,
              rgba(255,255,255,.97) 0%,
              rgba(255,255,255,.91) 62%,
              rgba(255,255,255,.72) 82%,
              rgba(255,255,255,0) 100%
            ) !important;

          border: 0 !important;
          box-shadow: none !important;

          backdrop-filter: blur(14px) saturate(115%);
          -webkit-backdrop-filter: blur(14px) saturate(115%);
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

        /* =========================================================
          HEADER ACTIONS
          ========================================================= */

        .dino-header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
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

          border: 1px solid color-mix(
            in srgb,
            var(--accent) 40%,
            rgba(0,0,0,.08)
          );

          border-radius: 999px;

          background: rgba(255,255,255,.72);

          color: #111;
          font-size: 9px;
          line-height: 1;

          box-shadow:
            0 6px 18px rgba(0,0,0,.025),
            inset 0 1px 0 rgba(255,255,255,.85);

          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
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

          border: 1px solid rgba(0,0,0,.07);
          border-radius: 9px;

          background: rgba(255,255,255,.68);

          color: #666;
          font-size: 8px;

          cursor: pointer;

          box-shadow:
            0 5px 14px rgba(0,0,0,.02),
            inset 0 1px 0 rgba(255,255,255,.82);

          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);

          transition:
            background .15s ease,
            color .15s ease,
            transform .15s ease,
            border-color .15s ease;
        }

        .dino-logout-button:hover {
          background: rgba(255,255,255,.88);
          color: #222;
          border-color: rgba(0,0,0,.1);
          transform: translateY(-1px);
        }

        /* =========================================================
          PROGRESS
          ========================================================= */

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
          background: var(--accent);
          transition: width .3s ease;
        }

        /* =========================================================
          TABS
          ========================================================= */

        .dino-tabs {
          width: 100%;
          margin-top: 20px;
          padding: 4px;

          display: flex;
          gap: 3px;

          overflow-x: auto;
          scrollbar-width: none;

          border: 1px solid rgba(255,255,255,.74);
          border-radius: 13px;

          background: rgba(255,255,255,.58);

          box-shadow:
            0 8px 24px rgba(0,0,0,.035),
            inset 0 1px 0 rgba(255,255,255,.9);

          backdrop-filter: blur(16px) saturate(115%);
          -webkit-backdrop-filter: blur(16px) saturate(115%);

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

          transition:
            background .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .dino-tab:hover {
          color: #0a0a0a;
        }

        .dino-tab.active {
          background: var(--accent);
          color: #062515;
          box-shadow:
            0 3px 10px color-mix(
              in srgb,
              var(--accent) 28%,
              transparent
            );
        }

        /* =========================================================
          MAIN
          ========================================================= */

        .dino-main {
          min-height: 0;
          margin-top: 18px;
          padding-top: 0;
        }

        /* =========================================================
          MAIN GLASS PANEL
          ========================================================= */

        .dino-panel {
          position: relative;

          width: 100%;
          height: auto;
          min-height: 0;

          padding: 22px;

          overflow: visible;

          border: 1px solid rgba(255,255,255,.76);
          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.80),
              rgba(255,255,255,.60)
            );

          box-shadow:
            0 18px 45px rgba(0,0,0,.045),
            0 2px 10px rgba(0,0,0,.025),
            inset 0 1px 0 rgba(255,255,255,.92),
            inset 0 -1px 0 rgba(255,255,255,.35);

          backdrop-filter: blur(18px) saturate(120%);
          -webkit-backdrop-filter: blur(18px) saturate(120%);
        }

        .dino-panel::before {
          content: "";
          position: absolute;
          inset: 0;

          border-radius: inherit;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.30),
              transparent 30%
            );

          pointer-events: none;
        }

        .dino-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 18px;
        }

        .dino-panel-title {
          margin: 0;
          color: #0a0a0a;
          font-size: 25px;
          line-height: 1;
          letter-spacing: -.06em;
          font-weight: 600;
        }

        .dino-panel-description {
          max-width: 600px;
          margin: 7px 0 0;
          color: #818181;
          font-size: 10px;
          line-height: 1.5;
        }

        /* =========================================================
          THEMES
          ========================================================= */

        .dino-theme-grid {
          min-height: 0;

          display: grid;
          grid-template-columns: repeat(5, minmax(0,1fr));
          gap: 10px;

          overflow: visible;
        }

        .dino-theme {
          min-width: 0;
          height: 100%;
          min-height: 340px;
          padding: 14px;

          border: 1px solid rgba(255,255,255,.72);
          border-radius: 16px;

          background: rgba(255,255,255,.48);

          box-shadow:
            0 8px 22px rgba(0,0,0,.025),
            inset 0 1px 0 rgba(255,255,255,.86);

          backdrop-filter: blur(14px) saturate(115%);
          -webkit-backdrop-filter: blur(14px) saturate(115%);

          transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .dino-theme:hover {
          transform: translateY(-2px);

          background: rgba(255,255,255,.60);

          box-shadow:
            0 14px 28px rgba(0,0,0,.04),
            inset 0 1px 0 rgba(255,255,255,.92);
        }

        .dino-theme-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dino-theme-number,
        .dino-theme-count {
          color: #9b9b9b;
          font-size: 8px;
        }

        .dino-theme-title {
          margin: 20px 0 2px;
          color: #111;
          font-size: 15px;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .dino-theme-local {
          color: #9a9a9a;
          font-size: 9px;
        }

        .dino-topic-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 15px;
        }

        .dino-topic {
          position: relative;

          display: grid;
          grid-template-columns: 15px minmax(0,1fr);
          gap: 9px;
          align-items: center;

          padding: 8px;

          border: 1px solid rgba(255,255,255,.66);
          border-radius: 10px;

          background: rgba(255,255,255,.48);

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.75);

          cursor: pointer;

          transition:
            transform .15s ease,
            background .15s ease,
            border-color .15s ease;
        }

        .dino-topic:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,.66);
          border-color: rgba(255,255,255,.9);
        }

        .dino-topic input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .dino-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 15px;
          height: 15px;

          border: 1px solid rgba(0,0,0,.14);
          border-radius: 4px;

          color: #fff;
          font-size: 8px;

          background: rgba(255,255,255,.82);
        }

        .dino-topic.completed .dino-check {
          border-color: var(--accent);
          background: var(--accent);
        }

        .dino-topic-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .dino-topic-copy strong {
          color: #272727;
          font-size: 9px;
          font-weight: 500;
        }

        .dino-topic-copy small {
          margin-top: 2px;
          overflow: hidden;

          color: #999;
          font-size: 7px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* =========================================================
          READING
          ========================================================= */

        .dino-reading-panel {
          overflow: visible;
        }

        .dino-reading-workspace {
          min-height: 0;
        }

        .dino-reading-card {
          min-width: 0;
          min-height: 0;

          border: 1px solid rgba(255,255,255,.70);
          border-radius: 16px;

          background: rgba(255,255,255,.48);

          backdrop-filter: blur(14px) saturate(115%);
          -webkit-backdrop-filter: blur(14px) saturate(115%);

          box-shadow:
            0 10px 26px rgba(0,0,0,.03),
            inset 0 1px 0 rgba(255,255,255,.84);
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

          background: rgba(255,255,255,.76);

          color: #5f5f5f;
          font-size: 13px;
          line-height: 1;

          cursor: pointer;

          transition:
            background .15s ease,
            color .15s ease,
            transform .15s ease;
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
          -webkit-backdrop-filter: blur(5px);
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
          gap: 8px;
        }

        .dino-card-label {
          color: #777;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .dino-card-status {
          color: #8f8f8f;
          font-size: 8px;
        }

        .dino-generator-body {
          min-height: 0;
          flex: 1;
          padding: 21px;
          overflow-y: auto;
        }

        .dino-generator-title {
          margin: 0;
          color: #111;
          font-size: 17px;
          line-height: 1.1;
          letter-spacing: -.045em;
        }

        .dino-generator-description {
          margin: 6px 0 0;
          color: #8b8b8b;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-generator-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 10px;
          margin-top: 17px;
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
          color: #7d7d7d;
          font-size: 8px;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: .04em;
          font-weight: 600;
        }

        .dino-select {
          width: 100%;
          min-height: 42px;

          padding: 0 11px;

          border: 1px solid rgba(0,0,0,.08);
          border-radius: 11px;
          outline: none;

          background: rgba(255,255,255,.84);
          color: #272727;

          font-family: inherit;
          font-size: 10px;
        }

        .dino-select:focus,
        .dino-answer-box:focus,
        .dino-writing-textarea:focus {
          border-color: var(--accent);

          box-shadow:
            0 0 0 3px color-mix(
              in srgb,
              var(--accent) 16%,
              transparent
            );
        }

        .dino-generate {
          width: 100%;
          min-height: 42px;

          margin-top: 13px;

          border: 0;
          border-radius: 11px;

          background: var(--accent);
          color: #062515;

          font-size: 9px;
          font-weight: 600;

          cursor: pointer;
        }

        .dino-generate:disabled {
          cursor: not-allowed;
          opacity: .45;
        }

        .dino-generating {
          margin-top: 12px;
          color: #777;
          font-size: 9px;
        }

        .dino-error {
          margin-top: 10px;
          padding: 9px 10px;

          border: 1px solid rgba(150,0,0,.08);
          border-radius: 10px;

          background: rgba(255,245,245,.9);
          color: #8c4545;

          font-size: 9px;
          line-height: 1.4;
        }

        .dino-question-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-top: 17px;
        }

        .dino-generated-question {
          padding: 14px;

          border: 1px solid rgba(0,0,0,.06);
          border-radius: 14px;

          background: rgba(255,255,255,.48);

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.72);
        }

        .dino-question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .dino-question-number {
          color: #111;
          font-size: 10px;
          font-weight: 600;
        }

        .dino-question-marks {
          color: #858585;
          font-size: 8px;
        }

        .dino-reading-context {
          margin-top: 11px;
          padding: 12px;

          border-radius: 11px;

          background: rgba(255,255,255,.68);

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.72);
        }

        .dino-reading-context-label {
          color: #8b8b8b;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: .05em;
          font-weight: 600;
        }

        .dino-reading-context-copy {
          margin-top: 7px;
          color: #353535;
          font-size: 10px;
          line-height: 1.55;
        }

        .dino-question-text {
          margin-top: 12px;
          color: #252525;
          font-size: 10px;
          line-height: 1.5;
        }

        .dino-answer-box {
          width: 100%;
          min-height: 90px;

          margin-top: 11px;
          padding: 10px;

          resize: vertical;

          border: 1px solid rgba(0,0,0,.08);
          border-radius: 11px;
          outline: none;

          background: rgba(255,255,255,.88);
          color: #222;

          font: inherit;
          font-size: 10px;
          line-height: 1.5;
        }

        .dino-answer-box:focus {
          border-color: rgba(0,0,0,.16);
        }

        .dino-question-actions {
          margin-top: 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dino-grade-pill {
          color: #878787;
          font-size: 8px;
        }

        .dino-mark-button {
          min-height: 32px;
          padding: 0 12px;

          border: 0;
          border-radius: 9px;

          background: var(--accent);
          color: #062515;

          font-size: 8px;
          font-weight: 600;

          cursor: pointer;
        }

        .dino-mark-button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .dino-feedback {
          margin-top: 10px;
          padding: 11px;

          border-radius: 11px;

          background: rgba(244,244,244,.9);
        }

        .dino-feedback-score {
          color: #007b3f;
          font-size: 11px;
          font-weight: 700;
        }

        .dino-total-score {
          margin-top: 14px;
          padding: 12px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          border: 1px solid rgba(0,0,0,.06);
          border-radius: 11px;

          background: rgba(255,255,255,.65);
        }

        .dino-total-score span {
          color: #858585;
          font-size: 8px;
        }

        .dino-total-score strong {
          color: #111;
          font-size: 11px;
        }

        .dino-small-button {
          min-height: 32px;
          margin-top: 10px;
          padding: 0 12px;

          border: 1px solid rgba(0,0,0,.08);
          border-radius: 9px;

          background: rgba(255,255,255,.78);
          color: #353535;

          font-size: 8px;
          cursor: pointer;
        }

        /* =========================================================
          TUTOR
          ========================================================= */

        .dino-tutor-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;

          border-radius: 15px;
        }

        .dino-tutor-head {
          min-height: 62px;
          padding: 0 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(0,0,0,.06);
        }

        .dino-tutor-identity {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .dino-tutor-avatar {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #111;
          color: #fff;

          font-size: 10px;
          font-weight: 600;
        }

        .dino-tutor-name {
          display: flex;
          flex-direction: column;
        }

        .dino-tutor-name strong {
          color: #151515;
          font-size: 9px;
        }

        .dino-tutor-name span {
          margin-top: 2px;
          color: #969696;
          font-size: 7px;
        }

        .dino-tutor-online {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: #7f7f7f;
          font-size: 7px;
        }

        .dino-tutor-online-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #7b9b77;
        }

        .dino-chat-area {
          min-height: 0;
          flex: 1;

          padding: 13px;

          overflow-y: auto;

          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .dino-chat-message {
          max-width: 94%;

          padding: 9px 10px;

          border-radius: 11px;

          font-size: 9px;
          line-height: 1.45;
        }

        .dino-chat-message.tutor {
          align-self: flex-start;
          background: rgba(244,244,244,.86);
          color: #343434;
        }

        .dino-chat-message.user {
          align-self: flex-end;
          background: #111;
          color: #fff;
        }

        .dino-chat-bottom {
          padding: 11px;
          border-top: 1px solid rgba(0,0,0,.06);
        }

        .dino-chat-input {
          width: 100%;
          min-height: 55px;

          padding: 9px;

          resize: vertical;

          border: 1px solid rgba(0,0,0,.08);
          border-radius: 10px;
          outline: none;

          background: rgba(255,255,255,.88);
          color: #222;

          font-family: inherit;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-chat-send {
          width: 100%;
          min-height: 32px;

          margin-top: 7px;

          border: 0;
          border-radius: 9px;

          background: #111;
          color: #fff;

          font-size: 8px;
          font-weight: 600;

          cursor: pointer;
        }

        .dino-typing {
          display: inline-flex;
          gap: 4px;
          align-items: center;
          padding: 7px 9px;
        }

        .dino-typing-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #999;

          animation: dinoTyping 1s infinite ease-in-out;
        }

        .dino-typing-dot:nth-child(2) {
          animation-delay: .12s;
        }

        .dino-typing-dot:nth-child(3) {
          animation-delay: .24s;
        }

        @keyframes dinoTyping {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: .45;
          }

          30% {
            transform: translateY(-2px);
            opacity: 1;
          }
        }

        /* =========================================================
          WRITING
          ========================================================= */

        .dino-writing-workspace {
          min-height: 0;
          height: auto;

          display: grid;
          grid-template-columns: 340px minmax(0,1fr);
          gap: 14px;
        }

        .dino-writing-card {
          min-height: 0;

          border: 1px solid rgba(255,255,255,.70);
          border-radius: 16px;

          background: rgba(255,255,255,.48);

          backdrop-filter: blur(14px) saturate(115%);
          -webkit-backdrop-filter: blur(14px) saturate(115%);

          box-shadow:
            0 10px 26px rgba(0,0,0,.03),
            inset 0 1px 0 rgba(255,255,255,.84);

          overflow: visible;
        }

        .dino-writing-controls {
          padding: 20px;
          overflow: visible;

          display: flex;
          flex-direction: column;
        }

        .dino-writing-controls .dino-select {
          margin-bottom: 17px;
        }

        .dino-writing-editor {
          padding: 0;
          overflow: visible;
        }

        .dino-writing-editor-topbar {
          min-height: 51px;
          padding: 0 17px;

          border-bottom: 1px solid rgba(0,0,0,.06);

          display: flex;
          align-items: center;
          justify-content: flex-end;

          flex: 0 0 51px;
        }

        .dino-writing-editor-content {
          padding: 22px;
        }

        .dino-writing-editor.dino-card-expanded {
          display: flex;
          flex-direction: column;
        }

        .dino-writing-editor.dino-card-expanded .dino-writing-editor-content {
          min-height: 0;
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

          background: rgba(255,255,255,.75);

          display: flex;
          align-items: center;
          justify-content: center;

          color: #777;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9);
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

          background: rgba(255,255,255,.48);

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.72);
        }

        .dino-writing-task h3 {
          margin: 7px 0 0;
          color: #111;
          font-size: 18px;
          line-height: 1.1;
          letter-spacing: -.045em;
        }

        .dino-writing-task-prompt {
          margin-top: 13px;
          color: #333;
          font-size: 10px;
          line-height: 1.55;
        }

        .dino-writing-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .dino-writing-meta span {
          padding: 5px 7px;

          border-radius: 999px;
          background: rgba(255,255,255,.78);

          color: #858585;
          font-size: 7px;

          border: 1px solid rgba(0,0,0,.05);
        }

        .dino-writing-answer-label {
          margin-top: 15px;

          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dino-writing-answer-label strong {
          color: #222;
          font-size: 9px;
        }

        .dino-writing-answer-label span {
          color: #8c8c8c;
          font-size: 7px;
        }

        .dino-writing-textarea {
          width: 100%;
          min-height: 270px;

          margin-top: 8px;
          padding: 12px;

          resize: vertical;

          border: 1px solid rgba(0,0,0,.08);
          border-radius: 12px;
          outline: none;

          background: rgba(255,255,255,.88);
          color: #222;

          font-family: inherit;
          font-size: 10px;
          line-height: 1.55;
        }

        .dino-writing-textarea:focus {
          border-color: rgba(0,0,0,.16);
        }

        .dino-writing-grade {
          margin-top: 15px;
          padding: 15px;

          border: 1px solid rgba(0,0,0,.07);
          border-radius: 14px;

          background: rgba(248,248,248,.72);
        }

        .dino-writing-grade-score {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
          margin-bottom: 12px;
        }

        .dino-writing-grade-score strong {
          color: #111;
          font-size: 26px;
          line-height: .9;
          letter-spacing: -.05em;
        }

        .dino-criterion-scores {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 12px;
        }

        .dino-criterion-scores span,
        .dino-vocabulary-count {
          padding: 5px 7px;

          border: 1px solid rgba(0,0,0,.06);
          border-radius: 999px;

          background: rgba(255,255,255,.7);

          color: #666;
          font-size: 8px;
        }

        .dino-writing-grade-section {
          margin-top: 13px;
        }

        .dino-writing-grade-section strong {
          color: #222;
          font-size: 9px;
        }

        .dino-writing-grade-section ul {
          margin: 6px 0 0;
          padding-left: 16px;
        }

        .dino-writing-grade-section li {
          margin-bottom: 3px;
          color: #5b5b5b;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-criteria {
          margin: 8px 0 0;
          padding-left: 17px;
        }

        .dino-criteria li {
          margin-bottom: 5px;
          color: #595959;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-prompt-label {
          color: #8b8b8b;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: .05em;
          font-weight: 600;
        }

        /* =========================================================
          VOCABULARY
          ========================================================= */

        .dino-vocabulary-workspace {
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 28px;
        }

        .dino-vocabulary-controls {
          padding: 20px 0;
        }

        .dino-vocabulary-controls .dino-select {
          margin-bottom: 8px;
        }

        .dino-vocabulary-trainer {
          min-height: 460px;
          padding: 20px 0;
        }

        .dino-vocabulary-topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .dino-vocabulary-topline h3 {
          margin: 6px 0 0;
          color: #111;
          font-size: 20px;
          letter-spacing: -.05em;
        }

        .dino-vocabulary-card {
          width: 100%;
          min-height: 280px;

          margin-top: 20px;
          padding: 0;

          border: 0;
          border-radius: 18px;

          background: transparent;
          color: inherit;

          text-align: left;

          perspective: 1200px;
          cursor: pointer;
        }

        .dino-flashcard-inner {
          position: relative;
          display: block;

          width: 100%;
          min-height: 280px;

          transform-style: preserve-3d;

          transition:
            transform .55s cubic-bezier(.2,.75,.2,1);
        }

        .dino-vocabulary-card.is-flipped .dino-flashcard-inner {
          transform: rotateY(180deg);
        }

        .dino-flashcard-face {
          position: absolute;
          inset: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;

          padding: 28px;

          border: 1px solid rgba(255,255,255,.74);
          border-radius: 18px;

          background: rgba(255,255,255,.62);

          box-shadow:
            0 12px 28px rgba(0,0,0,.035),
            inset 0 1px 0 rgba(255,255,255,.88);

          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .dino-flashcard-back {
          transform: rotateY(180deg);

          background:
            color-mix(
              in srgb,
              var(--accent) 13%,
              rgba(255,255,255,.78)
            );
        }

        .dino-flashcard-hint {
          margin-top: 12px;
          color: #777;
          font-size: 9px;
        }

        .dino-flashcard-back strong {
          color: #062515;
          font-size: clamp(24px, 4vw, 38px);
          letter-spacing: -.055em;
        }

        .dino-flashcard-example {
          margin-top: 16px;
          color: #244636;
          font-size: 12px;
          line-height: 1.5;
        }

        .dino-flashcard-note {
          margin-top: 8px;
          color: #527161;
          font-size: 10px;
          line-height: 1.45;
        }

        .dino-vocabulary-card:focus-visible {
          outline:
            3px solid
            color-mix(
              in srgb,
              var(--accent) 45%,
              transparent
            );

          outline-offset: 4px;
        }

        .dino-vocabulary-card:hover .dino-flashcard-face {
          border-color:
            color-mix(
              in srgb,
              var(--accent) 38%,
              rgba(0,0,0,.07)
            );
        }

        .dino-vocabulary-card .dino-flashcard-front > strong {
          margin-top: 10px;
          color: #111;
          font-size: clamp(30px, 5vw, 52px);
          letter-spacing: -.07em;
        }

        .dino-vocabulary-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }

        /* =========================================================
          COMING SOON
          ========================================================= */

        .dino-coming-page {
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          text-align: center;
        }

        .dino-coming-content {
          max-width: 520px;
        }

        .dino-coming-icon {
          width: 50px;
          height: 50px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(0,0,0,.08);
          border-radius: 15px;

          background: rgba(255,255,255,.76);

          font-size: 17px;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9);
        }

        .dino-coming-content h2 {
          margin: 18px 0 0;

          color: #111;

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

        /* =========================================================
          GOLD BUTTON
          ========================================================= */

        .dino-upgrade-button {
          position: relative;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          padding: 10px 16px;

          border: 1px solid rgba(255, 215, 90, 0.65);
          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #fff4b0 0%,
              #f7d65a 25%,
              #d9a928 50%,
              #f6d96a 75%,
              #fff1a3 100%
            );

          color: #5a3b00;

          font-weight: 800;
          font-size: 13px;
          letter-spacing: -0.2px;

          cursor: pointer;

          box-shadow:
            0 0 0 1px rgba(255,215,90,0.15),
            0 4px 14px rgba(218,168,37,0.28),
            inset 0 1px 0 rgba(255,255,255,0.75);

          overflow: hidden;

          transition:
            transform .18s ease,
            box-shadow .18s ease,
            filter .18s ease;
        }

        .dino-upgrade-button::before {
          content: "";

          position: absolute;

          top: -40%;
          left: -90%;

          width: 55%;
          height: 180%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.75),
              transparent
            );

          transform: rotate(20deg);

          animation:
            dino-gold-shine 2.8s ease-in-out infinite;

          pointer-events: none;
        }

        .dino-upgrade-button::after {
          content: "✦";

          position: absolute;

          top: 2px;
          right: 7px;

          font-size: 9px;
          color: rgba(255,255,255,.9);

          animation:
            dino-gold-sparkle 1.5s ease-in-out infinite;

          pointer-events: none;
        }

        .dino-upgrade-button:hover {
          transform: translateY(-1px);

          filter: brightness(1.06);

          box-shadow:
            0 0 0 1px rgba(255,215,90,0.25),
            0 7px 20px rgba(218,168,37,0.4),
            0 0 18px rgba(255,215,90,0.18),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .dino-upgrade-button:active {
          transform: translateY(0);
        }

        @keyframes dino-gold-shine {
          0% {
            left: -90%;
          }

          45%,
          100% {
            left: 140%;
          }
        }

        @keyframes dino-gold-sparkle {
          0%,
          100% {
            opacity: .35;
            transform: scale(.85) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.15) rotate(20deg);
          }
        }

        /* =========================================================
          RESPONSIVE
          ========================================================= */

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

          .dino-vocabulary-workspace {
            grid-template-columns: 260px minmax(0,1fr);
          }
        }

        @media (max-width: 820px) {
          .dino-dashboard {
            padding: 18px 18px 30px;
          }

          .dino-dashboard-sticky {
            position: sticky !important;
            top: 0 !important;
            z-index: 100 !important;

            width: 100%;

            margin: -28px 0 0 !important;
            padding: 28px 0 12px !important;

            background: transparent !important;
            border: 0 !important;
            border-radius: 0 !important;

            box-shadow: none !important;

            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;

            overflow: visible !important;
          }
          .dino-dashboard-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .dino-header-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .dino-progress {
            width: 100%;
            flex: none;
          }

          .dino-panel {
            padding: 16px;
            border-radius: 18px;
          }

          .dino-theme-grid {
            height: auto;
            grid-template-columns: repeat(2,minmax(0,1fr));
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

          .dino-vocabulary-workspace {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .dino-vocabulary-trainer {
            min-height: 400px;
            padding-top: 0;
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
        }

        @media (max-width: 520px) {
          .dino-theme-grid {
            grid-template-columns: 1fr;
          }

          .dino-dashboard-heading {
            font-size: 43px;
          }

          .dino-panel-title {
            font-size: 22px;
          }

          .dino-dashboard-sticky {
            padding-bottom: 10px !important;
          }
        }
      `}</style>

      <AnimatedBackground className="dino-dashboard">
        <div className="dino-dashboard-shell">

          <div className="dino-dashboard-sticky">
          <header className="dino-dashboard-header">
            <div>
              <span className="dino-kicker">
                Dino
              </span>

              <h1 className="dino-dashboard-heading">
                Dashboard. 
              </h1>
            </div>

            <style>
            {`
              .dino-header-actions {
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .dino-upgrade-button {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                padding: 10px 16px;
                border: 1px solid rgba(255, 215, 90, 0.65);
                border-radius: 10px;
                background:
                  linear-gradient(
                    135deg,
                    #fff4b0 0%,
                    #f7d65a 25%,
                    #d9a928 50%,
                    #f6d96a 75%,
                    #fff1a3 100%
                  );
                color: #5a3b00;
                font-weight: 800;
                font-size: 13px;
                letter-spacing: -0.2px;
                cursor: pointer;
                box-shadow:
                  0 0 0 1px rgba(255, 215, 90, 0.15),
                  0 4px 14px rgba(218, 168, 37, 0.28),
                  inset 0 1px 0 rgba(255, 255, 255, 0.75);
                overflow: hidden;
                transition:
                  transform 0.18s ease,
                  box-shadow 0.18s ease,
                  filter 0.18s ease;
              }

              .dino-upgrade-button::before {
                content: "";
                position: absolute;
                top: -40%;
                left: -90%;
                width: 55%;
                height: 180%;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.75),
                  transparent
                );
                transform: rotate(20deg);
                animation: dino-gold-shine 2.8s ease-in-out infinite;
                pointer-events: none;
              }

              .dino-upgrade-button::after {
                content: "✦";
                position: absolute;
                top: 2px;
                right: 7px;
                font-size: 9px;
                color: rgba(255, 255, 255, 0.9);
                animation: dino-gold-sparkle 1.5s ease-in-out infinite;
                pointer-events: none;
              }

              .dino-upgrade-button:hover {
                transform: translateY(-1px);
                filter: brightness(1.06);
                box-shadow:
                  0 0 0 1px rgba(255, 215, 90, 0.25),
                  0 7px 20px rgba(218, 168, 37, 0.4),
                  0 0 18px rgba(255, 215, 90, 0.18),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8);
              }

              .dino-upgrade-button:active {
                transform: translateY(0);
              }

              @keyframes dino-gold-shine {
                0% {
                  left: -90%;
                }

                45%,
                100% {
                  left: 140%;
                }
              }

              @keyframes dino-gold-sparkle {
                0%,
                100% {
                  opacity: 0.35;
                  transform: scale(0.85) rotate(0deg);
                }

                50% {
                  opacity: 1;
                  transform: scale(1.15) rotate(20deg);
                }
              }
            `}
          </style>

          <div className="dino-header-actions">
            <div className="dino-user-email">
              {user.email}
            </div>

            <div className="dino-points-pill">
              <span className="dino-points-coin">
                🦖
              </span>

              <strong>
                {dinoPoints}
              </strong>

              <span>Dino points</span>
            </div>

            <button
              type="button"
              className="dino-logout-button"
              onClick={handleLogout}
            >
              Log out
            </button>

            {(() => {
              const [gold, setGold] = window.React?.useState?.(false) || [false, () => {}];

              if (!window.__dinoGoldCheckStarted) {
                window.__dinoGoldCheckStarted = true;

                import("../api/credentials")
                  .then(async ({ getCurrentUser, getGoldMembership }) => {
                    try {
                      const user = await getCurrentUser();

                      if (!user) {
                        return;
                      }

                      const isGold = await getGoldMembership(user.id);

                      window.__dinoIsGoldMember = isGold;

                      window.dispatchEvent(
                        new CustomEvent("dino-gold-membership-check"),
                      );
                    } catch (error) {
                      console.error(
                        "Failed to check Gold membership:",
                        error,
                      );
                    }
                  });
              }

              if (window.__dinoIsGoldMember) {
                return null;
              }

              return (
                <button
                  type="button"
                  className="dino-upgrade-button"
                  onClick={() => {
                    window.location.href = "/upgrade";
                  }}
                >
                  ✦ Upgrade to Gold
                </button>
              );
            })()}
          </div>


            <div className="dino-progress">
              <div className="dino-progress-meta">
                <span>
                  Course progress
                </span>
                <strong>
                  {courseProgress}%
                </strong>
              </div>

              <div className="dino-progress-track">
                <div
                  className="dino-progress-fill"
                  style={{
                    width: `${courseProgress}%`,
                  }}
                />
              </div>
            </div>
          </header>

          <nav className="dino-tabs">
            {[
              ['course', 'Course'],
              ['reading', 'Reading'],
              ['writing', 'Writing'],
              ['vocabulary', 'Vocabulary'],
            ].map(
              ([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={
                    activeTab === value
                      ? 'dino-tab active'
                      : 'dino-tab'
                  }
                  onClick={() =>
                    setActiveTab(value)
                  }
                >
                  {label}
                </button>
              ),
            )}
          </nav>
          </div>

          <main className="dino-main">

            {activeTab === 'course' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Course
                    </span>

                    <h2 className="dino-panel-title">
                      Master the <span>course.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Track your progress across every IB Language B course theme and topic.
                    </p>
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
                        key={theme.en}
                      >
                        <div className="dino-theme-top">
                          <span className="dino-theme-number">
                            {String(
                              index + 1,
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

                              const topicId =
                                `${language}::${theme.en}::${english}`

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
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      complete
                                    }
                                    disabled={
                                      savingTopic ===
                                      topicId
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

            {activeTab === 'reading' && (
              <section className="dino-panel dino-reading-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Reading
                    </span>

                    <h2 className="dino-panel-title">
                      Reading <span>questionbank.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Generate marked reading questions and answer them in place.
                    </p>
                  </div>
                </div>

                <div className="dino-reading-workspace">
                  {expandedSection === 'questionbank' && (
                    <div
                      className="dino-expand-backdrop"
                      onClick={() =>
                        setExpandedSection(
                          null,
                        )
                      }
                    />
                  )}

                  <div
                    className={`dino-reading-card dino-reading-generator ${
                      expandedSection ===
                      'questionbank'
                        ? 'dino-card-expanded'
                        : ''
                    }`}
                  >
                    <div className="dino-card-topbar">
                      <span className="dino-card-label">
                        Reading questionbank
                      </span>

                      <div className="dino-card-topbar-actions">
                        <span className="dino-card-status">
                          {generatedQuestions
                            ? 'Questions ready'
                            : 'Ready'}
                        </span>

                        <button
                          type="button"
                          className="dino-expand-button"
                          aria-label={
                            expandedSection ===
                            'questionbank'
                              ? 'Close expanded question bank'
                              : 'Expand question bank'
                          }
                          title={
                            expandedSection ===
                            'questionbank'
                              ? 'Close expanded view'
                              : 'Expand question bank'
                          }
                          onClick={() =>
                            setExpandedSection(
                              expandedSection ===
                                'questionbank'
                                ? null
                                : 'questionbank',
                            )
                          }
                        >
                          {expandedSection ===
                          'questionbank'
                            ? '↙'
                            : '↗'}
                        </button>
                      </div>
                    </div>

                    {!generatedQuestions ? (
                      <div className="dino-generator-body">
                        <h3 className="dino-generator-title">
                          Build a reading set.
                        </h3>

                        <p className="dino-generator-description">
                          Choose the question style, difficulty, and IB course topic.
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
                                  event.target
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
                              Difficulty
                            </label>

                            <select
                              className="dino-select"
                              value={
                                readingDifficulty
                              }
                              onChange={(
                                event,
                              ) =>
                                setReadingDifficulty(
                                  event.target
                                    .value,
                                )
                              }
                            >
                              <option>
                                Beginner
                              </option>
                              <option>
                                Intermediate
                              </option>
                              <option>
                                Advanced
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

                          <div className="dino-field">
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
                                  event.target
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
                            : `Generate questions → 1 🦖`}
                        </button>

                        {isGeneratingQuestions && (
                          <div className="dino-generating">
                            Dino is building the reading set...
                          </div>
                        )}

                        {questionError && (
                          <div className="dino-error">
                            {
                              questionError
                            }
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="dino-generator-body">
                        <h3 className="dino-generator-title">
                          {
                            generatedQuestions.title
                          }
                        </h3>

                        <p className="dino-generator-description">
                          {
                            generatedQuestions.instructions
                          }
                        </p>

                        <div className="dino-question-list">
                          {generatedQuestions.questions.map(
                            (
                              question,
                            ) => {
                              const grade =
                                readingGrades[
                                  question.id
                                ]

                              return (
                                <article
                                  className="dino-generated-question"
                                  key={
                                    question.id
                                  }
                                >
                                  <div className="dino-question-header">
                                    <span className="dino-question-number">
                                      Question{' '}
                                      {
                                        question.id
                                      }
                                    </span>

                                    <span className="dino-question-marks">
                                      {
                                        question.marks
                                      }{' '}
                                      {question.marks ===
                                      1
                                        ? 'mark'
                                        : 'marks'}
                                    </span>
                                  </div>

                                  {question.context && (
                                    <div className="dino-reading-context">
                                      <div className="dino-reading-context-label">
                                        Reading text
                                      </div>

                                      <div className="dino-reading-context-copy">
                                        {renderMarkdown(
                                          question.context,
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <div className="dino-question-text">
                                    {renderMarkdown(
                                      question.question,
                                    )}
                                  </div>

                                  <textarea
                                    className="dino-answer-box"
                                    value={
                                      answerSubmission[
                                        question.id
                                      ] || ''
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      setAnswerSubmission(
                                        (
                                          current,
                                        ) => ({
                                          ...current,
                                          [question.id]:
                                            event
                                              .target
                                              .value,
                                        }),
                                      )
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
                                        gradingQuestion !==
                                          null ||
                                        !String(
                                          answerSubmission[
                                            question.id
                                          ] || '',
                                        ).trim()
                                      }
                                      onClick={() =>
                                        markReadingQuestion(
                                          question.id,
                                        )
                                      }
                                    >
                                      {gradingQuestion ===
                                      question.id
                                        ? 'Marking...'
                                        : grade
                                          ? 'Mark again'
                                          : 'Mark answer'}
                                    </button>
                                  </div>

                                  {grade && (
                                    <div className="dino-feedback">
                                      <div className="dino-feedback-score">
                                        {
                                          grade.score
                                        }
                                        /
                                        {
                                          grade.maxMarks
                                        }
                                      </div>

                                      <div
                                        style={{
                                          marginTop:
                                            '8px',
                                        }}
                                      >
                                        {renderMarkdown(
                                          grade.feedback,
                                        )}
                                      </div>

                                      <div
                                        style={{
                                          marginTop:
                                            '8px',
                                        }}
                                      >
                                        {renderMarkdown(
                                          `**Next step:** ${grade.nextStep}`,
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </article>
                              )
                            },
                          )}
                        </div>

                        <div className="dino-total-score">
                          <span>
                            Current reading score
                          </span>

                          <strong>
                            {
                              readingEarnedMarks
                            }
                            /
                            {
                              readingTotalMarks
                            }
                          </strong>
                        </div>

                        {questionError && (
                          <div className="dino-error">
                            {
                              questionError
                            }
                          </div>
                        )}

                        <button
                          type="button"
                          className="dino-small-button"
                          onClick={() => {
                            setGeneratedQuestions(
                              null,
                            )
                            setAnswerSubmission(
                              {},
                            )
                            setReadingGrades(
                              {},
                            )
                            setQuestionError(
                              '',
                            )
                            setExpandedSection(
                              null,
                            )
                          }}
                        >
                          Generate a new set
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </section>
            )}

            {activeTab === 'writing' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Writing
                    </span>

                    <h2 className="dino-panel-title">
                      Practice <span>smarter.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Generate an IB-style writing task, write your response, then get an examiner-style mark and actionable feedback.
                    </p>
                  </div>
                </div>

                <div className="dino-writing-workspace">
                  {expandedSection === 'writing' && (
                    <div
                      className="dino-expand-backdrop"
                      onClick={() =>
                        setExpandedSection(
                          null,
                        )
                      }
                    />
                  )}

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
                          event.target
                            .value,
                        )
                      }
                    >
                      <option value="">
                        Select a course topic
                      </option>

                      {course.themes.map(
                        (theme) => (
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
                          event.target
                            .value,
                        )
                      }
                    >
                      {writingTypes.map(
                        (type) => (
                          <option
                            value={
                              type
                            }
                            key={
                              type
                            }
                          >
                            {type}
                          </option>
                        ),
                      )}
                    </select>

                    <label className="dino-field-label">
                      Difficulty
                    </label>

                    <select
                      className="dino-select"
                      value={
                        writingDifficulty
                      }
                      onChange={(
                        event,
                      ) =>
                        setWritingDifficulty(
                          event.target
                            .value,
                        )
                      }
                    >
                      <option>
                        Beginner
                      </option>
                      <option>
                        Intermediate
                      </option>
                      <option>
                        Advanced
                      </option>
                    </select>

                    <button
                      type="button"
                      className="dino-generate"
                      disabled={
                        !writingTopic ||
                        writingGenerating
                      }
                      onClick={
                        createPrompt
                      }
                    >
                      {writingGenerating
                        ? 'Generating...'
                        : 'Generate prompt → 1 🦖'}
                    </button>

                    {writingGenerating && (
                      <div className="dino-generating">
                        Dino is building your task...
                      </div>
                    )}

                    {questionError &&
                      !writingTask && (
                        <div className="dino-error">
                          {
                            questionError
                          }
                        </div>
                      )}
                  </div>

                  <div
                    className={`dino-writing-card dino-writing-editor ${
                      expandedSection ===
                      'writing'
                        ? 'dino-card-expanded'
                        : ''
                    }`}
                  >
                    <div className="dino-writing-editor-topbar">
                      <button
                        type="button"
                        className="dino-expand-button"
                        aria-label={
                          expandedSection ===
                          'writing'
                            ? 'Close expanded writing section'
                            : 'Expand writing section'
                        }
                        title={
                          expandedSection ===
                          'writing'
                            ? 'Close expanded view'
                            : 'Expand writing section'
                        }
                        onClick={() =>
                          setExpandedSection(
                            expandedSection ===
                              'writing'
                              ? null
                              : 'writing',
                          )
                        }
                      >
                        {expandedSection ===
                        'writing'
                          ? '↙'
                          : '↗'}
                      </button>
                    </div>

                    <div className="dino-writing-editor-content">
                      {!writingTask ? (
                        <div className="dino-prompt-empty">
                          <div className="dino-prompt-icon">
                            ✦
                          </div>

                          <h3>
                            Your writing task will appear here.
                          </h3>

                          <p>
                            Select a course topic, text type, and difficulty, then let Dino generate the task and marking criteria.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="dino-writing-task">
                            <span className="dino-prompt-label">
                              Generated task
                            </span>

                            <h3>
                              {
                                writingTask.title
                              }
                            </h3>

                            <div className="dino-writing-meta">
                              <span>
                                {
                                  writingType
                                }
                              </span>

                              <span>
                                {
                                  writingDifficulty
                                }
                              </span>

                              <span>
                                30 marks
                              </span>

                              <span>
                                {
                                  writingTask.suggestedLength
                                }
                              </span>
                            </div>

                            <div className="dino-writing-task-prompt">
                              {renderMarkdown(
                                writingTask.prompt,
                              )}
                            </div>

                            <div className="dino-prompt-label">
                              IB Paper 1 criteria
                            </div>

                            <ol className="dino-criteria">
                              <li>Criterion A: Language — 12 marks</li>
                              <li>Criterion B: Message — 12 marks</li>
                              <li>Criterion C: Conceptual understanding — 6 marks</li>
                            </ol>
                          </div>

                          <div className="dino-writing-answer-label">
                            <strong>
                              Your response
                            </strong>

                            <span>
                              30 marks available
                            </span>
                          </div>

                          <textarea
                            className="dino-writing-textarea"
                            value={
                              writingAnswer
                            }
                            onChange={(
                              event,
                            ) =>
                              setWritingAnswer(
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Write your response here..."
                          />

                          <button
                            type="button"
                            className="dino-mark-button"
                            style={{
                              width: '100%',
                              marginTop:
                                '10px',
                            }}
                            disabled={
                              !writingAnswer.trim() ||
                              writingGrading
                            }
                            onClick={
                              markWriting
                            }
                          >
                            {writingGrading
                              ? 'Marking response...'
                              : 'Mark response'}
                          </button>

                          {questionError &&
                            writingTask && (
                              <div className="dino-error">
                                {
                                  questionError
                                }
                              </div>
                            )}

                          {writingGrade && (
                            <div className="dino-writing-grade">
                              <div className="dino-writing-grade-score">
                                <span className="dino-prompt-label">
                                  Result
                                </span>

                                <strong>
                                  {
                                    writingGrade.score
                                  }
                                  /
                                  30
                                </strong>
                              </div>

                              <div className="dino-criterion-scores">
                                <span>Language {writingGrade.criterionA}/12</span>
                                <span>Message {writingGrade.criterionB}/12</span>
                                <span>Conceptual understanding {writingGrade.criterionC}/6</span>
                              </div>

                              {renderMarkdown(
                                writingGrade.feedback,
                              )}

                              <div className="dino-writing-grade-section">
                                <strong>
                                  Strengths
                                </strong>

                                <ul>
                                  {writingGrade.strengths.map(
                                    (
                                      item,
                                      index,
                                    ) => (
                                      <li
                                        key={
                                          index
                                        }
                                      >
                                        {
                                          item
                                        }
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              <div className="dino-writing-grade-section">
                                <strong>
                                  Improve next
                                </strong>

                                <ul>
                                  {writingGrade.improvements.map(
                                    (
                                      item,
                                      index,
                                    ) => (
                                      <li
                                        key={
                                          index
                                        }
                                      >
                                        {
                                          item
                                        }
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              <div className="dino-writing-grade-section">
                                <strong>
                                  Next step
                                </strong>

                                <p
                                  style={{
                                    margin:
                                      0,
                                    color:
                                      '#4b4b4b',
                                    fontSize:
                                      '10px',
                                    lineHeight:
                                      1.45,
                                  }}
                                >
                                  {
                                    writingGrade.nextStep
                                  }
                                </p>
                              </div>

                              <button
                                type="button"
                                className="dino-small-button"
                                onClick={
                                  createPrompt
                                }
                                disabled={
                                  writingGenerating
                                }
                              >
                                Generate another task
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'vocabulary' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">Vocabulary</span>
                    <h2 className="dino-panel-title">
                      Learn words that <span>stick.</span>
                    </h2>
                    <p className="dino-panel-description">
                      Build a focused vocabulary set for any topic in your course, then practise one term at a time.
                    </p>
                  </div>
                </div>

                <div className="dino-vocabulary-workspace">
                  <div className="dino-vocabulary-controls">
                    <label className="dino-field-label">Course topic</label>
                    <select
                      className="dino-select"
                      value={vocabularyTopic}
                      onChange={(event) => setVocabularyTopic(event.target.value)}
                    >
                      <option value="">Select a course topic</option>
                      {course.themes.map((theme) => (
                        <optgroup key={theme.en} label={`${theme.en} / ${theme.local}`}>
                          {theme.topics.map(([english, local]) => (
                            <option key={english} value={english}>
                              {english} / {local}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="dino-generate"
                      disabled={!vocabularyTopic || vocabularyGenerating}
                      onClick={generateVocabulary}
                    >
                      {vocabularyGenerating ? 'Generating...' : 'Generate vocabulary → 1 🦖'}
                    </button>

                    {questionError && <div className="dino-error">{questionError}</div>}
                  </div>

                  <div className="dino-vocabulary-trainer">
                    {!vocabularySet ? (
                      <div className="dino-prompt-empty">
                        <div className="dino-prompt-icon">✦</div>
                        <h3>Your vocabulary set will appear here.</h3>
                        <p>Select any IB course topic to start training.</p>
                      </div>
                    ) : (
                      <>
                        <div className="dino-vocabulary-topline">
                          <div>
                            <span className="dino-prompt-label">Vocabulary trainer</span>
                            <h3>{vocabularySet.title}</h3>
                          </div>
                          <span className="dino-vocabulary-count">
                            {vocabularyIndex + 1} / {vocabularySet.words.length}
                          </span>
                        </div>

                        <p className="dino-generator-description">{vocabularySet.instructions}</p>

                        <button
                          type="button"
                          className={`dino-vocabulary-card ${vocabularyRevealed ? 'is-flipped' : ''}`}
                          onClick={() => setVocabularyRevealed((current) => !current)}
                          aria-label={vocabularyRevealed ? 'Flip card to term' : 'Flip card to answer'}
                        >
                          <span className="dino-flashcard-inner">
                            <span className="dino-flashcard-face dino-flashcard-front">
                              <span className="dino-prompt-label">Target language</span>
                              <strong>{vocabularySet.words[vocabularyIndex].term}</strong>
                              <span className="dino-flashcard-hint">Tap the card to reveal the answer</span>
                            </span>
                            <span className="dino-flashcard-face dino-flashcard-back">
                              <span className="dino-prompt-label">Meaning</span>
                              <strong>{vocabularySet.words[vocabularyIndex].translation}</strong>
                              <span className="dino-flashcard-example">{vocabularySet.words[vocabularyIndex].example}</span>
                              <span className="dino-flashcard-note">{vocabularySet.words[vocabularyIndex].note}</span>
                            </span>
                          </span>
                        </button>

                        <div className="dino-vocabulary-actions">
                          <button
                            type="button"
                            className="dino-small-button"
                            onClick={() => setVocabularyRevealed((current) => !current)}
                          >
                            Flip card
                          </button>
                          <button
                            type="button"
                            className="dino-mark-button"
                            onClick={() => {
                              setVocabularyIndex((current) => (current + 1) % vocabularySet.words.length)
                              setVocabularyRevealed(false)
                            }}
                          >
                            Next word
                          </button>
                        </div>
                      </>
                    )}
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
