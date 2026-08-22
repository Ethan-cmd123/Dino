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
  /* GOLD                                                                      */
  /* ------------------------------------------------------------------------ */

  const [isGold, setIsGold] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadGoldStatus() {
      if (!user?.id) return

      try {
        const gold = await getGoldMembership(user.id)
        if (mounted) setIsGold(Boolean(gold))
      } catch (error) {
        console.error('Gold membership check failed:', error)
      }
    }

    loadGoldStatus()

    return () => {
      mounted = false
    }
  }, [user?.id])

  /* ------------------------------------------------------------------------ */
  /* AI LEARNING PATH                                                          */
  /* ------------------------------------------------------------------------ */

  const LEARNING_SCHEMA = {
    type: 'json_schema',
    json_schema: {
      name: 'dino_integrated_language_lesson',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          intro: { type: 'string' },
          words: {
            type: 'array',
            minItems: 3,
            maxItems: 4,
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
          reading: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              text: { type: 'string' },
              question: { type: 'string' },
              answer: { type: 'string' },
              explanation: { type: 'string' },
            },
            required: ['title', 'text', 'question', 'answer', 'explanation'],
            additionalProperties: false,
          },
          writing: {
            type: 'object',
            properties: {
              prompt: { type: 'string' },
              suggestedLength: { type: 'string' },
              successCriteria: {
                type: 'array',
                minItems: 3,
                maxItems: 4,
                items: { type: 'string' },
              },
            },
            required: ['prompt', 'suggestedLength', 'successCriteria'],
            additionalProperties: false,
          },
          takeaway: { type: 'string' },
        },
        required: ['title', 'intro', 'words', 'reading', 'writing', 'takeaway'],
        additionalProperties: false,
      },
    },
  }

  const [learningTopic, setLearningTopic] = useState('')
  const [learningDifficulty, setLearningDifficulty] = useState('Intermediate')
  const [learningLesson, setLearningLesson] = useState(null)
  const [learningStep, setLearningStep] = useState(0)
  const [learningAnswers, setLearningAnswers] = useState({ reading: '', writing: '' })
  const [learningReadingGrade, setLearningReadingGrade] = useState(null)
  const [learningWritingGrade, setLearningWritingGrade] = useState(null)
  const [learningGenerating, setLearningGenerating] = useState(false)
  const [learningGrading, setLearningGrading] = useState(false)
  const [learningError, setLearningError] = useState('')

  const selectedLearningTopic = useMemo(
    () => allTopics.find((item) => item.topic === learningTopic) || null,
    [allTopics, learningTopic],
  )

  const learningThemeIndex = useMemo(() => {
    const selectedIndex = course.themes.findIndex((theme) =>
      theme.topics.some(([topic]) => topic === learningTopic),
    )
    return selectedIndex < 0 ? 0 : selectedIndex
  }, [course, learningTopic])

  const generateLearningLesson = async () => {
    if (!user || !selectedLearningTopic || learningGenerating) return

    setLearningError('')

    try {
      const syncedPoints = await syncUserCredits(user.id)
      setDinoPoints(syncedPoints)

      if (syncedPoints < 1) {
        setLearningError(
          'You need 1 Dino point to build an AI lesson. Come back in 24 hours for 5 more.',
        )
        return
      }

      const nextPointTotal = await spendUserCredits(user.id, 1)
      setDinoPoints(nextPointTotal)
    } catch (error) {
      setLearningError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while checking Dino points.',
      )
      return
    }

    setLearningGenerating(true)
    setLearningLesson(null)
    setLearningStep(0)
    setLearningAnswers({ reading: '', writing: '' })
    setLearningReadingGrade(null)
    setLearningWritingGrade(null)

    try {
      const raw = await callGroq({
        system: `
You are an expert IB Language B learning designer.

Create one original, cohesive micro-lesson that deliberately combines vocabulary, reading comprehension and writing practice around the same course topic.

Rules:
- Never use emojis.
- Never reproduce copyrighted material.
- Use original target-language content appropriate for the student's Language B.
- Keep the lesson useful for IB exam preparation.
- Vocabulary must be practical and reusable.
- The reading must be original and answerable from the supplied text.
- The writing prompt must encourage use of the new vocabulary and ideas from the reading.
- Keep explanations concise but academically useful.
- Return only the required structured data.
        `.trim(),
        user: `
Language: ${language}
Difficulty: ${learningDifficulty}
IB theme: ${selectedLearningTopic.theme}
Course topic: ${selectedLearningTopic.topic}
Target-language topic: ${selectedLearningTopic.local}

Create a 5-part lesson flow:
1. Learn 3-4 vocabulary items.
2. Read a short original text.
3. Answer one comprehension question about the text.
4. Write a short response using the vocabulary and topic ideas.
5. Finish with one practical takeaway.
        `.trim(),
        responseFormat: LEARNING_SCHEMA,
        temperature: 0.35,
        maxTokens: 2600,
      })

      const parsed = cleanModelJSON(raw)

      if (!parsed || !parsed.words || !parsed.reading || !parsed.writing) {
        throw new Error('Groq returned an invalid integrated lesson.')
      }

      setLearningLesson(parsed)
    } catch (error) {
      setLearningError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while creating the lesson.',
      )
    } finally {
      setLearningGenerating(false)
    }
  }

  const gradeLearningStep = async (type) => {
    if (!learningLesson || learningGrading) return

    const answer = String(
      learningAnswers[type] || '',
    ).trim()

    if (!answer) {
      setLearningError(
        type === 'reading'
          ? 'Write an answer before asking Dino to mark the reading step.'
          : 'Write a response before asking Dino for writing feedback.',
      )
      return
    }

    setLearningError('')
    setLearningGrading(true)

    try {
      const responseFormat = {
        type: 'json_schema',
        json_schema: {
          name: `dino_learning_${type}_grade`,
          strict: true,
          schema:
            type === 'reading'
              ? {
                  type: 'object',
                  properties: {
                    score: { type: 'integer' },
                    feedback: { type: 'string' },
                    nextStep: { type: 'string' },
                  },
                  required: ['score', 'feedback', 'nextStep'],
                  additionalProperties: false,
                }
              : {
                  type: 'object',
                  properties: {
                    feedback: { type: 'string' },
                    strengths: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 4,
                      items: { type: 'string' },
                    },
                    improvements: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 4,
                      items: { type: 'string' },
                    },
                    nextStep: { type: 'string' },
                  },
                  required: ['feedback', 'strengths', 'improvements', 'nextStep'],
                  additionalProperties: false,
                },
        },
      }

      const raw = await callGroq({
        system: `
You are an expert IB Language B coach.
Grade only the student's supplied response.
Be honest, concise, specific and encouraging.
Do not use emojis.
Return only structured JSON.
        `.trim(),
        user:
          type === 'reading'
            ? `
Language: ${language}
Difficulty: ${learningDifficulty}
Topic: ${selectedLearningTopic?.topic || learningTopic}
Question: ${learningLesson.reading.question}
Original answer: ${learningLesson.reading.answer}
Marking explanation: ${learningLesson.reading.explanation}
Student answer: ${answer}
Award 0-5 marks based on meaning and evidence from the text.
            `.trim()
            : `
Language: ${language}
Difficulty: ${learningDifficulty}
Topic: ${selectedLearningTopic?.topic || learningTopic}
Writing prompt: ${learningLesson.writing.prompt}
Suggested length: ${learningLesson.writing.suggestedLength}
Success criteria: ${learningLesson.writing.successCriteria.join('; ')}
Student response: ${answer}
Give practical IB-style feedback. Do not rewrite the whole response.
            `.trim(),
        responseFormat,
        temperature: 0.1,
        maxTokens: type === 'reading' ? 900 : 1200,
      })

      const parsed = cleanModelJSON(raw)

      if (!parsed) {
        throw new Error('Groq returned an invalid lesson grade.')
      }

      if (type === 'reading') {
        setLearningReadingGrade({
          ...parsed,
          score: Math.min(5, Math.max(0, Number(parsed.score) || 0)),
        })
      } else {
        setLearningWritingGrade(parsed)
      }
    } catch (error) {
      setLearningError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while grading this lesson.',
      )
    } finally {
      setLearningGrading(false)
    }
  }

  const finishLearningLesson = async () => {
    if (!selectedLearningTopic || !user) return

    const topicId = `${language}::${selectedLearningTopic.theme}::${selectedLearningTopic.topic}`

    if (!selectedTopics.includes(topicId)) {
      await toggleTopic(
        selectedLearningTopic.theme,
        selectedLearningTopic.topic,
      )
    }

    setLearningStep(4)
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


  if (authLoading || profileLoading) {
    return (
      <AnimatedBackground className="onboarding-page">
        <div className="dino-loading-shell">
          <div className="dino-loading-orbit" />
          <div>
            <strong>Loading Dino</strong>
            <span>Preparing your learning space…</span>
          </div>
        </div>
      </AnimatedBackground>
    )
  }

  if (!user) return null

  return (
    <>
      <style>{`
        :root {
          --dino-ink: #0b0d0c;
          --dino-muted: #6d756f;
          --dino-line: rgba(16, 25, 19, 0.09);
          --dino-accent: #20d67b;
          --dino-accent-dark: #0f7a46;
          --dino-soft: rgba(255,255,255,.76);
          --dino-shadow: 0 24px 70px rgba(15,35,22,.09);
        }

        body[data-page="dashboard"] {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          background: #f2f5f0 !important;
        }

        body[data-page="dashboard"] .navbar { display: none !important; }
        body[data-page="dashboard"] * { box-sizing: border-box; }

        .dino-dashboard {
          min-height: 100dvh;
          padding: 24px 28px 56px;
          color: var(--dino-ink);
        }

        .dino-dashboard::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 15% 10%, rgba(32,214,123,.13), transparent 28%),
            radial-gradient(circle at 85% 12%, rgba(255,255,255,.72), transparent 25%),
            radial-gradient(circle at 50% 100%, rgba(32,214,123,.07), transparent 35%);
          z-index: 0;
        }

        .dino-dashboard-shell {
          position: relative;
          z-index: 1;
          width: min(1380px, 100%);
          margin: 0 auto;
        }

        .dino-dashboard-sticky {
          position: sticky;
          top: 10px;
          z-index: 100;
          padding: 14px;
          border: 1px solid rgba(255,255,255,.88);
          border-radius: 24px;
          background: rgba(247,250,246,.78);
          box-shadow: 0 14px 50px rgba(13,28,18,.09);
          backdrop-filter: blur(26px) saturate(135%);
          -webkit-backdrop-filter: blur(26px) saturate(135%);
        }

        .dino-dashboard-header {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto auto;
          gap: 18px;
          align-items: center;
        }

        .dino-brand-row { display:flex; align-items:center; gap:11px; }
        .dino-logo-mark {
          width: 42px; height: 42px; display:grid; place-items:center;
          border-radius: 13px; background: #111; color:#fff;
          font-size: 19px; box-shadow: 0 8px 18px rgba(0,0,0,.14);
        }
        .dino-brand-copy { min-width:0; }
        .dino-kicker {
          display:block; margin-bottom:5px; color:#7b847e; font-size:9px;
          font-weight:800; text-transform:uppercase; letter-spacing:.13em;
        }
        .dino-dashboard-heading {
          margin:0; font-size: clamp(29px,4vw,47px); line-height:.92;
          font-weight:760; letter-spacing:-.065em;
        }
        .dino-dashboard-subheading { margin:6px 0 0; color:var(--dino-muted); font-size:11px; }

        .dino-top-stat-row { display:flex; align-items:center; gap:8px; }
        .dino-stat-pill {
          min-width:88px; padding:9px 11px; border:1px solid var(--dino-line);
          border-radius:14px; background:rgba(255,255,255,.72);
        }
        .dino-stat-pill span { display:block; color:#879088; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
        .dino-stat-pill strong { display:block; margin-top:4px; font-size:13px; }
        .dino-points-pill strong { color:var(--dino-accent-dark); }

        .dino-header-actions { display:flex; align-items:center; gap:8px; }
        .dino-user-email { max-width:190px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#7f8781; font-size:9px; }

        .dino-button, .dino-small-button, .dino-logout-button, .dino-upgrade-button,
        .dino-generate, .dino-mark-button, .dino-tab { font:inherit; cursor:pointer; }
        .dino-button { min-height:39px; padding:0 14px; border:0; border-radius:12px; background:#111; color:#fff; font-size:10px; font-weight:750; }
        .dino-button:hover { transform:translateY(-1px); }
        .dino-small-button, .dino-logout-button {
          min-height:34px; padding:0 11px; border:1px solid var(--dino-line); border-radius:10px;
          background:rgba(255,255,255,.82); color:#4e564f; font-size:9px;
        }
        .dino-upgrade-button {
          position:relative; min-height:37px; padding:0 13px; border:1px solid rgba(255,210,70,.62);
          border-radius:11px; background:linear-gradient(135deg,#fff0a1,#dfb336,#fff0a1);
          color:#5e4200; font-size:10px; font-weight:850; overflow:hidden;
          box-shadow:0 7px 18px rgba(221,176,54,.22);
        }
        .dino-upgrade-button::after { content:"✦"; position:absolute; top:4px; right:6px; font-size:8px; opacity:.72; }

        .dino-progress { margin-top:13px; }
        .dino-progress-meta { display:flex; justify-content:space-between; color:#808981; font-size:8px; margin-bottom:6px; }
        .dino-progress-meta strong { color:#1d251f; }
        .dino-progress-track { height:7px; overflow:hidden; border-radius:99px; background:rgba(12,31,18,.08); }
        .dino-progress-fill { height:100%; border-radius:inherit; background:linear-gradient(90deg,#15bf69,#39e895); transition:width .4s ease; }

        .dino-tabs {
          display:flex; gap:5px; overflow-x:auto; scrollbar-width:none; margin-top:13px;
          padding:4px; border:1px solid rgba(255,255,255,.85); border-radius:15px;
          background:rgba(255,255,255,.57);
        }
        .dino-tabs::-webkit-scrollbar { display:none; }
        .dino-tab {
          flex:1 0 auto; min-height:41px; padding:0 15px; border:0; border-radius:11px;
          background:transparent; color:#7d857f; font-size:9px; font-weight:750; white-space:nowrap;
          transition:all .18s ease;
        }
        .dino-tab:hover { color:#111; background:rgba(255,255,255,.72); }
        .dino-tab.active { background:#111; color:#fff; box-shadow:0 7px 16px rgba(0,0,0,.12); }
        .dino-tab.learning-tab.active { background:linear-gradient(135deg,#102118,#183b27); color:#8affbc; }

        .dino-main { margin-top:18px; }
        .dino-panel {
          border:1px solid rgba(255,255,255,.9); border-radius:26px; padding:24px;
          background:rgba(248,250,247,.73); box-shadow:var(--dino-shadow);
          backdrop-filter:blur(22px) saturate(125%); -webkit-backdrop-filter:blur(22px) saturate(125%);
        }
        .dino-panel-heading { display:flex; justify-content:space-between; gap:20px; margin-bottom:21px; }
        .dino-panel-title { margin:0; font-size:clamp(26px,3vw,38px); letter-spacing:-.065em; line-height:.95; }
        .dino-panel-title span { color:var(--dino-accent-dark); font-style:italic; }
        .dino-panel-description { max-width:680px; margin:8px 0 0; color:#737d76; font-size:11px; line-height:1.55; }

        .dino-hero-card {
          display:grid; grid-template-columns:minmax(0,1.4fr) minmax(280px,.7fr); gap:16px;
          padding:19px; border:1px solid rgba(255,255,255,.88); border-radius:20px;
          background:linear-gradient(135deg,rgba(12,35,22,.96),rgba(22,65,40,.94)); color:#fff;
          box-shadow:0 18px 45px rgba(11,38,22,.18); margin-bottom:18px;
        }
        .dino-hero-card h3 { margin:4px 0 0; font-size:25px; letter-spacing:-.06em; }
        .dino-hero-card p { margin:7px 0 0; color:#b5c7bb; font-size:10px; line-height:1.55; }
        .dino-hero-actions { display:flex; gap:8px; align-items:center; justify-content:flex-end; flex-wrap:wrap; }
        .dino-hero-actions .dino-button { background:var(--dino-accent); color:#07170e; }
        .dino-hero-metric { padding:13px; border:1px solid rgba(255,255,255,.12); border-radius:15px; background:rgba(255,255,255,.06); }
        .dino-hero-metric span { display:block; color:#8fa99b; font-size:8px; text-transform:uppercase; letter-spacing:.08em; }
        .dino-hero-metric strong { display:block; margin-top:5px; font-size:17px; }

        .dino-theme-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; }
        .dino-theme-card {
          position:relative; min-height:338px; padding:15px; border:1px solid rgba(255,255,255,.88); border-radius:19px;
          background:rgba(255,255,255,.61); box-shadow:0 10px 30px rgba(10,31,16,.035); overflow:hidden;
          transition:transform .18s ease, box-shadow .18s ease;
        }
        .dino-theme-card:hover { transform:translateY(-3px); box-shadow:0 18px 38px rgba(10,31,16,.07); }
        .dino-theme-card::after { content:""; position:absolute; top:-60px; right:-40px; width:120px; height:120px; border-radius:50%; background:rgba(32,214,123,.09); }
        .dino-theme-top { display:flex; justify-content:space-between; color:#929b95; font-size:8px; }
        .dino-theme-title { margin:22px 0 3px; font-size:15px; letter-spacing:-.04em; }
        .dino-theme-local { color:#939b96; font-size:9px; }
        .dino-topic-list { display:flex; flex-direction:column; gap:7px; margin-top:15px; }
        .dino-topic { display:grid; grid-template-columns:21px minmax(0,1fr); align-items:center; gap:8px; padding:8px; border:1px solid rgba(11,27,17,.06); border-radius:11px; background:rgba(255,255,255,.69); cursor:pointer; transition:all .15s ease; }
        .dino-topic:hover { transform:translateX(2px); border-color:rgba(32,214,123,.22); }
        .dino-check { width:18px; height:18px; display:grid; place-items:center; border:1px solid rgba(12,24,16,.13); border-radius:6px; background:#fff; font-size:9px; }
        .dino-topic.completed { background:rgba(32,214,123,.09); border-color:rgba(32,214,123,.23); }
        .dino-topic.completed .dino-check { background:var(--dino-accent); border-color:var(--dino-accent); color:#082112; }
        .dino-topic-copy { min-width:0; display:flex; flex-direction:column; }
        .dino-topic-copy strong { font-size:9px; font-weight:700; }
        .dino-topic-copy small { margin-top:2px; overflow:hidden; color:#969e99; font-size:7px; text-overflow:ellipsis; white-space:nowrap; }

        .dino-reading-workspace { display:grid; grid-template-columns:minmax(0,1.25fr) 330px; gap:16px; }
        .dino-reading-card, .dino-writing-card { border:1px solid rgba(255,255,255,.88); border-radius:20px; background:rgba(255,255,255,.63); box-shadow:0 14px 34px rgba(10,31,16,.045); overflow:hidden; }
        .dino-reading-generator { height:690px; max-height:690px; display:flex; flex-direction:column; }
        .dino-card-topbar, .dino-writing-editor-topbar { min-height:55px; padding:0 17px; border-bottom:1px solid rgba(10,25,14,.06); display:flex; align-items:center; justify-content:space-between; }
        .dino-card-topbar-actions { display:flex; align-items:center; gap:7px; }
        .dino-card-label, .dino-prompt-label { color:#89938c; font-size:8px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; }
        .dino-card-status { color:#78817a; font-size:8px; }
        .dino-expand-button { width:31px; height:31px; border:1px solid var(--dino-line); border-radius:9px; background:#fff; color:#59615b; cursor:pointer; }
        .dino-expand-backdrop { position:fixed; inset:0; z-index:999; background:rgba(3,10,5,.28); backdrop-filter:blur(8px); }
        .dino-card-expanded { position:fixed !important; inset:24px; z-index:1000; width:auto !important; height:auto !important; max-height:none !important; box-shadow:0 35px 110px rgba(0,0,0,.2); }
        .dino-generator-body, .dino-writing-editor-content { flex:1; min-height:0; overflow:auto; padding:21px; }
        .dino-generator-title { margin:0; font-size:18px; letter-spacing:-.04em; }
        .dino-generator-description { margin:7px 0 0; color:#7d867f; font-size:9px; line-height:1.5; }
        .dino-generator-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:17px; }
        .dino-field-full { grid-column:1/-1; }
        .dino-field-label { display:block; margin-bottom:6px; color:#7e8881; font-size:8px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; }
        .dino-select, .dino-answer-box, .dino-writing-textarea, .dino-chat-input { width:100%; border:1px solid rgba(10,27,14,.09); border-radius:11px; outline:none; background:rgba(255,255,255,.9); color:#222; font:inherit; }
        .dino-select { min-height:42px; padding:0 11px; font-size:9px; }
        .dino-select:focus, .dino-answer-box:focus, .dino-writing-textarea:focus, .dino-chat-input:focus { border-color:rgba(32,214,123,.55); box-shadow:0 0 0 3px rgba(32,214,123,.11); }
        .dino-generate, .dino-mark-button { width:100%; min-height:42px; margin-top:13px; border:0; border-radius:11px; background:linear-gradient(135deg,#18c96f,#34e58b); color:#07180d; font-size:9px; font-weight:850; }
        .dino-generate:disabled, .dino-mark-button:disabled { opacity:.42; cursor:not-allowed; }
        .dino-generating { margin-top:10px; padding:9px 11px; border-radius:10px; background:rgba(32,214,123,.09); color:#4d6757; font-size:8px; }
        .dino-error { margin-top:10px; padding:10px 11px; border:1px solid rgba(176,40,40,.1); border-radius:11px; background:#fff6f6; color:#8d4a4a; font-size:8px; line-height:1.45; }
        .dino-question-list { display:flex; flex-direction:column; gap:12px; margin-top:17px; }
        .dino-generated-question, .dino-writing-task, .dino-feedback, .dino-writing-grade { padding:15px; border:1px solid rgba(10,25,14,.065); border-radius:15px; background:rgba(255,255,255,.72); }
        .dino-question-header { display:flex; justify-content:space-between; gap:12px; }
        .dino-question-number { font-size:10px; font-weight:800; }
        .dino-question-marks { color:#7d857f; font-size:8px; }
        .dino-reading-context { margin-top:11px; padding:12px; border-radius:12px; background:#f4f6f3; }
        .dino-reading-context-copy { margin-top:7px; color:#303832; font-size:10px; line-height:1.55; }
        .dino-question-text { margin-top:12px; color:#292f2b; font-size:10px; line-height:1.5; }
        .dino-answer-box { min-height:90px; margin-top:10px; padding:10px; resize:vertical; font-size:9px; line-height:1.5; }
        .dino-question-actions { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:9px; }
        .dino-grade-pill { color:#7f8881; font-size:8px; }
        .dino-mark-button { width:auto; min-width:105px; min-height:33px; margin-top:0; padding:0 12px; }
        .dino-feedback-score { color:#06733c; font-size:11px; font-weight:850; }
        .dino-total-score { display:flex; justify-content:space-between; margin-top:14px; padding:12px 13px; border-radius:12px; background:#eef7f1; }
        .dino-total-score span { color:#6f796f; font-size:8px; }
        .dino-total-score strong { font-size:11px; }

        .dino-writing-workspace { display:grid; grid-template-columns:300px minmax(0,1fr); gap:16px; }
        .dino-writing-controls { padding:19px; overflow:visible; }
        .dino-writing-editor { height:670px; max-height:670px; display:flex; flex-direction:column; }
        .dino-writing-editor-content { overflow:auto; }
        .dino-prompt-empty, .dino-empty-center { min-height:420px; display:grid; place-items:center; text-align:center; align-content:center; padding:30px; }
        .dino-prompt-icon { width:50px; height:50px; margin:0 auto 13px; display:grid; place-items:center; border-radius:15px; background:#111; color:#fff; box-shadow:0 12px 28px rgba(0,0,0,.12); }
        .dino-prompt-empty h3, .dino-empty-center h3 { margin:0; font-size:19px; letter-spacing:-.04em; }
        .dino-prompt-empty p, .dino-empty-center p { max-width:450px; margin:8px auto 0; color:#7a837c; font-size:10px; line-height:1.55; }
        .dino-writing-task h3 { margin:7px 0 0; font-size:19px; letter-spacing:-.05em; }
        .dino-writing-meta { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
        .dino-writing-meta span, .dino-criterion-scores span, .dino-vocabulary-count { padding:5px 7px; border:1px solid var(--dino-line); border-radius:999px; background:#f4f6f3; color:#69716b; font-size:7px; }
        .dino-writing-task-prompt { margin-top:13px; color:#303731; font-size:10px; line-height:1.55; }
        .dino-writing-answer-label { display:flex; justify-content:space-between; margin-top:15px; }
        .dino-writing-answer-label strong { font-size:9px; }
        .dino-writing-answer-label span { color:#8a928b; font-size:7px; }
        .dino-writing-textarea { min-height:280px; margin-top:8px; padding:12px; resize:vertical; font-size:10px; line-height:1.55; }
        .dino-writing-grade { margin-top:15px; }
        .dino-writing-grade-score { display:flex; align-items:end; justify-content:space-between; }
        .dino-writing-grade-score strong { font-size:30px; letter-spacing:-.06em; }
        .dino-criterion-scores { display:flex; flex-wrap:wrap; gap:6px; margin:12px 0; }
        .dino-writing-grade-section { margin-top:13px; }
        .dino-writing-grade-section strong { font-size:9px; }
        .dino-writing-grade-section ul { margin:7px 0 0; padding-left:17px; }
        .dino-writing-grade-section li { margin-bottom:4px; color:#5d665f; font-size:9px; line-height:1.45; }
        .dino-criteria { margin:8px 0 0; padding-left:17px; }
        .dino-criteria li { margin-bottom:5px; color:#5d665f; font-size:9px; line-height:1.45; }

        .dino-vocabulary-workspace { display:grid; grid-template-columns:280px minmax(0,1fr); gap:25px; }
        .dino-vocabulary-controls { padding:12px 0; }
        .dino-vocabulary-trainer { padding:11px 0; }
        .dino-vocabulary-topline { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
        .dino-vocabulary-topline h3 { margin:6px 0 0; font-size:21px; letter-spacing:-.05em; }
        .dino-vocabulary-card { width:100%; min-height:325px; margin-top:19px; padding:0; border:0; background:transparent; perspective:1200px; cursor:pointer; }
        .dino-flashcard-inner { position:relative; display:block; width:100%; min-height:325px; transform-style:preserve-3d; transition:transform .55s cubic-bezier(.2,.75,.2,1); }
        .dino-vocabulary-card.is-flipped .dino-flashcard-inner { transform:rotateY(180deg); }
        .dino-flashcard-face { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:32px; border:1px solid rgba(255,255,255,.88); border-radius:22px; background:rgba(255,255,255,.7); box-shadow:0 18px 40px rgba(11,31,17,.06); backface-visibility:hidden; -webkit-backface-visibility:hidden; }
        .dino-flashcard-front > strong { margin-top:11px; color:#111; font-size:clamp(34px,5vw,58px); letter-spacing:-.075em; }
        .dino-flashcard-hint { margin-top:11px; color:#7c857f; font-size:9px; }
        .dino-flashcard-back { transform:rotateY(180deg); background:linear-gradient(145deg,rgba(32,214,123,.15),rgba(255,255,255,.83)); }
        .dino-flashcard-back strong { color:#0b5b36; font-size:clamp(27px,4vw,42px); letter-spacing:-.06em; }
        .dino-flashcard-example { margin-top:15px; color:#2d5540; font-size:11px; line-height:1.55; }
        .dino-flashcard-note { margin-top:8px; color:#5d8069; font-size:9px; line-height:1.45; }
        .dino-vocabulary-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:10px; }

        /* LEARNING PATH */
        .dino-learning-shell { display:grid; grid-template-columns:minmax(0,1fr) 390px; gap:18px; align-items:start; }
        .dino-learning-path { padding:20px; border:1px solid rgba(255,255,255,.86); border-radius:22px; background:rgba(255,255,255,.57); }
        .dino-learning-path-header { display:flex; align-items:flex-start; justify-content:space-between; gap:15px; margin-bottom:16px; }
        .dino-learning-path-header h3 { margin:4px 0 0; font-size:24px; letter-spacing:-.05em; }
        .dino-learning-path-header p { margin:7px 0 0; color:#7b847d; font-size:9px; line-height:1.5; }
        .dino-learning-streak { min-width:95px; padding:10px 12px; border-radius:14px; background:#111; color:#fff; text-align:right; }
        .dino-learning-streak span { display:block; color:#97a69c; font-size:7px; text-transform:uppercase; letter-spacing:.1em; }
        .dino-learning-streak strong { display:block; margin-top:3px; font-size:15px; }
        .dino-learning-theme { position:relative; padding:13px 0 5px; }
        .dino-learning-theme + .dino-learning-theme { border-top:1px solid rgba(10,27,14,.06); }
        .dino-learning-theme-title { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .dino-learning-theme-title strong { font-size:11px; letter-spacing:-.02em; }
        .dino-learning-theme-title span { color:#8c958e; font-size:8px; }
        .dino-learning-nodes { position:relative; display:flex; flex-direction:column; align-items:center; gap:10px; padding:4px 10px 13px; }
        .dino-learning-nodes::before { content:""; position:absolute; top:31px; bottom:31px; width:4px; border-radius:99px; background:linear-gradient(#cfe8d8,#d9eadf); }
        .dino-learning-node { position:relative; z-index:1; display:grid; grid-template-columns:58px minmax(0,1fr) auto; gap:12px; align-items:center; width:min(620px,100%); padding:10px; border:1px solid rgba(10,27,14,.07); border-radius:16px; background:rgba(255,255,255,.84); box-shadow:0 8px 20px rgba(10,31,16,.035); transition:all .17s ease; }
        .dino-learning-node:hover { transform:translateY(-2px); box-shadow:0 14px 28px rgba(10,31,16,.07); }
        .dino-learning-node.complete { border-color:rgba(32,214,123,.27); background:rgba(235,251,242,.86); }
        .dino-learning-node.active { border-color:rgba(32,214,123,.34); box-shadow:0 0 0 3px rgba(32,214,123,.08),0 14px 28px rgba(10,31,16,.06); }
        .dino-learning-node.is-selected { background:#111; color:#fff; border-color:#111; }
        .dino-learning-node.is-selected .dino-learning-node-meta, .dino-learning-node.is-selected .dino-learning-node-copy small { color:#9ca8a1; }
        .dino-learning-node-bubble { width:54px; height:54px; display:grid; place-items:center; border-radius:16px; background:#eef4ef; font-size:19px; box-shadow:inset 0 1px 0 rgba(255,255,255,.9); }
        .dino-learning-node.complete .dino-learning-node-bubble { background:var(--dino-accent); }
        .dino-learning-node.is-selected .dino-learning-node-bubble { background:rgba(255,255,255,.11); }
        .dino-learning-node-copy { min-width:0; }
        .dino-learning-node-copy strong { display:block; font-size:10px; }
        .dino-learning-node-copy small { display:block; margin-top:3px; color:#8b948d; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; font-size:7px; }
        .dino-learning-node-meta { color:#87918a; font-size:7px; text-align:right; }
        .dino-learning-start { min-height:31px; padding:0 10px; border:0; border-radius:9px; background:var(--dino-accent); color:#082112; font-size:8px; font-weight:850; cursor:pointer; }

        .dino-lesson-card { position:sticky; top:170px; min-height:590px; padding:20px; border:1px solid rgba(255,255,255,.88); border-radius:22px; background:rgba(255,255,255,.73); box-shadow:0 18px 45px rgba(10,31,16,.07); backdrop-filter:blur(18px); }
        .dino-lesson-head { display:flex; justify-content:space-between; gap:12px; }
        .dino-lesson-head h3 { margin:4px 0 0; font-size:24px; line-height:.97; letter-spacing:-.055em; }
        .dino-lesson-step { color:#738078; font-size:8px; font-weight:800; }
        .dino-lesson-progress { height:5px; margin:13px 0 18px; border-radius:99px; background:#e7ece8; overflow:hidden; }
        .dino-lesson-progress span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,#19c66e,#44e99a); transition:width .3s ease; }
        .dino-lesson-intro { margin:0; color:#68736c; font-size:9px; line-height:1.55; }
        .dino-lesson-step-title { margin:21px 0 8px; font-size:16px; letter-spacing:-.04em; }
        .dino-lesson-word-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        .dino-lesson-word { padding:11px; border-radius:13px; background:#f5f8f5; border:1px solid rgba(10,25,14,.055); }
        .dino-lesson-word strong { display:block; font-size:13px; }
        .dino-lesson-word span { display:block; margin-top:3px; color:#2e6b49; font-size:8px; }
        .dino-lesson-word p { margin:7px 0 0; color:#667068; font-size:8px; line-height:1.45; }
        .dino-lesson-reading { padding:13px; border-radius:15px; background:#f5f7f5; border:1px solid rgba(10,25,14,.055); }
        .dino-lesson-reading h4 { margin:0; font-size:11px; }
        .dino-lesson-reading p { margin:7px 0 0; color:#4d554f; font-size:9px; line-height:1.55; }
        .dino-lesson-textarea { width:100%; min-height:100px; margin-top:10px; padding:10px; resize:vertical; border:1px solid rgba(10,25,14,.09); border-radius:11px; outline:none; background:#fff; font:inherit; font-size:9px; }
        .dino-lesson-feedback { margin-top:9px; padding:10px; border-radius:11px; background:#eef8f1; color:#446050; font-size:8px; line-height:1.5; }
        .dino-lesson-writing { padding:13px; border-radius:15px; background:#f5f7f5; border:1px solid rgba(10,25,14,.055); }
        .dino-lesson-writing p { margin:0; color:#343b36; font-size:9px; line-height:1.55; }
        .dino-success-list { margin:9px 0 0; padding-left:15px; }
        .dino-success-list li { margin-bottom:3px; color:#647068; font-size:8px; }
        .dino-lesson-actions { display:flex; justify-content:space-between; gap:8px; margin-top:16px; }
        .dino-lesson-actions .dino-button { flex:1; }
        .dino-lesson-complete { padding:26px 12px; text-align:center; }
        .dino-lesson-complete .dino-complete-icon { width:64px; height:64px; display:grid; place-items:center; margin:0 auto 14px; border-radius:21px; background:var(--dino-accent); font-size:25px; }
        .dino-lesson-complete h3 { margin:0; font-size:25px; letter-spacing:-.05em; }
        .dino-lesson-complete p { margin:8px auto 0; max-width:290px; color:#758078; font-size:9px; line-height:1.55; }

        .dino-loading-shell { min-height:100dvh; display:flex; align-items:center; justify-content:center; gap:13px; color:#1b241e; }
        .dino-loading-orbit { width:28px; height:28px; border:3px solid rgba(32,214,123,.2); border-top-color:var(--dino-accent); border-radius:50%; animation:dinoSpin .8s linear infinite; }
        .dino-loading-shell strong { display:block; font-size:13px; }
        .dino-loading-shell span { display:block; margin-top:3px; color:#7a847c; font-size:9px; }
        @keyframes dinoSpin { to { transform:rotate(360deg); } }

        @media (max-width:1100px) {
          .dino-dashboard-header { grid-template-columns:1fr auto; }
          .dino-header-actions { grid-column:1/-1; }
          .dino-theme-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
          .dino-learning-shell { grid-template-columns:1fr; }
          .dino-lesson-card { position:relative; top:auto; }
        }
        @media (max-width:820px) {
          .dino-dashboard { padding:14px 12px 36px; }
          .dino-dashboard-header { grid-template-columns:1fr; }
          .dino-top-stat-row { width:100%; }
          .dino-header-actions { flex-wrap:wrap; }
          .dino-user-email { max-width:100%; width:100%; }
          .dino-theme-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .dino-reading-workspace, .dino-writing-workspace, .dino-vocabulary-workspace { grid-template-columns:1fr; }
          .dino-reading-generator { height:auto; max-height:none; min-height:650px; }
          .dino-writing-editor { height:760px; max-height:760px; }
          .dino-hero-card { grid-template-columns:1fr; }
          .dino-hero-actions { justify-content:flex-start; }
        }
        @media (max-width:560px) {
          .dino-theme-grid { grid-template-columns:1fr; }
          .dino-panel { padding:15px; border-radius:20px; }
          .dino-generator-fields { grid-template-columns:1fr; }
          .dino-field-full { grid-column:auto; }
          .dino-learning-node { grid-template-columns:48px minmax(0,1fr); }
          .dino-learning-node-meta { grid-column:2; text-align:left; }
          .dino-lesson-card { padding:15px; }
        }
      `}</style>

      <AnimatedBackground className="dino-dashboard">
        <div className="dino-dashboard-shell">
          <div className="dino-dashboard-sticky">
            <header className="dino-dashboard-header">
              <div className="dino-brand-row">
                <div className="dino-logo-mark">🦖</div>
                <div className="dino-brand-copy">
                  <span className="dino-kicker">Dino · IB Language B</span>
                  <h1 className="dino-dashboard-heading">Learn with momentum.</h1>
                  <p className="dino-dashboard-subheading">{language} · AI practice built around your course.</p>
                </div>
              </div>

              <div className="dino-top-stat-row">
                <div className="dino-stat-pill">
                  <span>Points</span>
                  <strong>🦖 {dinoPoints}</strong>
                </div>
                <div className="dino-stat-pill">
                  <span>Course</span>
                  <strong>{courseProgress}%</strong>
                </div>
              </div>

              <div className="dino-header-actions">
                <div className="dino-user-email">{user.email}</div>
                {!isGold && (
                  <button type="button" className="dino-upgrade-button" onClick={() => { window.location.href = '/upgrade' }}>
                    ✦ Gold
                  </button>
                )}
                <button type="button" className="dino-logout-button" onClick={handleLogout}>Log out</button>
              </div>
            </header>

            <div className="dino-progress">
              <div className="dino-progress-meta"><span>Course progress</span><strong>{courseProgress}%</strong></div>
              <div className="dino-progress-track"><div className="dino-progress-fill" style={{ width: `${courseProgress}%` }} /></div>
            </div>

            <nav className="dino-tabs" aria-label="Learning sections">
              {[
                ['learn', 'Learn'],
                ['course', 'Course'],
                ['reading', 'Reading'],
                ['writing', 'Writing'],
                ['vocabulary', 'Vocabulary'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`dino-tab ${activeTab === value ? 'active' : ''} ${value === 'learn' ? 'learning-tab' : ''}`}
                  onClick={() => setActiveTab(value)}
                >
                  {value === 'learn' ? '✦ ' : ''}{label}
                </button>
              ))}
            </nav>
          </div>

          <main className="dino-main">
            {activeTab === 'learn' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">Dino Learning Path</span>
                    <h2 className="dino-panel-title">Learn the <span>whole skill.</span></h2>
                    <p className="dino-panel-description">
                      One path for every IB topic. Each lesson mixes vocabulary, original reading, comprehension and writing so you actually use what you learned instead of collecting lonely flashcards like a digital squirrel.
                    </p>
                  </div>
                </div>

                <div className="dino-hero-card">
                  <div>
                    <span className="dino-kicker" style={{ color: '#8fa99b' }}>AI-powered daily practice</span>
                    <h3>{learningLesson ? learningLesson.title : 'Choose a topic and start a lesson.'}</h3>
                    <p>
                      {learningLesson
                        ? learningLesson.intro
                        : 'Dino builds an original micro-lesson at your difficulty, then coaches you through the complete skill loop.'}
                    </p>
                  </div>
                  <div className="dino-hero-actions">
                    <div className="dino-hero-metric">
                      <span>Topics</span>
                      <strong>{totalCount}</strong>
                    </div>
                    <div className="dino-hero-metric">
                      <span>Completed</span>
                      <strong>{completedCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="dino-learning-shell">
                  <div className="dino-learning-path">
                    <div className="dino-learning-path-header">
                      <div>
                        <span className="dino-kicker">Your path</span>
                        <h3>Pick your next topic.</h3>
                        <p>Completed topics stay complete because your existing course progress remains the source of truth.</p>
                      </div>
                      <div className="dino-learning-streak">
                        <span>Progress</span>
                        <strong>{courseProgress}%</strong>
                      </div>
                    </div>

                    {course.themes.map((theme, themeIndex) => (
                      <section className="dino-learning-theme" key={theme.en}>
                        <div className="dino-learning-theme-title">
                          <strong>{String(themeIndex + 1).padStart(2, '0')} · {theme.en}</strong>
                          <span>{theme.local}</span>
                        </div>
                        <div className="dino-learning-nodes">
                          {theme.topics.map(([english, local], topicIndex) => {
                            const complete = isCompleted(theme.en, english)
                            const selected = learningTopic === english
                            return (
                              <article className={`dino-learning-node ${complete ? 'complete' : ''} ${selected ? 'is-selected' : ''}`} key={english}>
                                <div className="dino-learning-node-bubble">{complete ? '✓' : ['✦', '◆', '●', '▲', '■'][topicIndex % 5]}</div>
                                <div className="dino-learning-node-copy">
                                  <strong>{english}</strong>
                                  <small>{local}</small>
                                </div>
                                <div className="dino-learning-node-meta">
                                  <div>{complete ? 'Completed' : 'Ready'}</div>
                                  <button
                                    type="button"
                                    className="dino-learning-start"
                                    onClick={() => {
                                      setLearningTopic(english)
                                      setLearningLesson(null)
                                      setLearningStep(0)
                                      setLearningReadingGrade(null)
                                      setLearningWritingGrade(null)
                                      setLearningAnswers({ reading: '', writing: '' })
                                      setLearningError('')
                                    }}
                                  >
                                    {selected ? 'Selected' : complete ? 'Review' : 'Start'}
                                  </button>
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>

                  <aside className="dino-lesson-card">
                    {!learningTopic ? (
                      <div className="dino-empty-center">
                        <div className="dino-prompt-icon">✦</div>
                        <h3>Your lesson lives here.</h3>
                        <p>Select any topic in the learning path. Dino will combine vocabulary, reading and writing around one coherent lesson.</p>
                      </div>
                    ) : !learningLesson ? (
                      <>
                        <div className="dino-lesson-head">
                          <div>
                            <span className="dino-kicker">Selected topic</span>
                            <h3>{selectedLearningTopic?.topic}</h3>
                          </div>
                          <span className="dino-lesson-step">0 / 5</span>
                        </div>
                        <p className="dino-lesson-intro">{selectedLearningTopic?.theme} · {selectedLearningTopic?.local}</p>

                        <div className="dino-generator-fields" style={{ marginTop: 22 }}>
                          <div className="dino-field dino-field-full">
                            <label className="dino-field-label">Difficulty</label>
                            <select className="dino-select" value={learningDifficulty} onChange={(event) => setLearningDifficulty(event.target.value)}>
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                          </div>
                        </div>

                        <button type="button" className="dino-generate" disabled={learningGenerating} onClick={generateLearningLesson}>
                          {learningGenerating ? 'Building your lesson…' : 'Start AI lesson → 1 🦖'}
                        </button>
                        {learningGenerating && <div className="dino-generating">Dino is combining vocabulary, reading and writing into one lesson...</div>}
                        {learningError && <div className="dino-error">{learningError}</div>}
                      </>
                    ) : learningStep === 4 ? (
                      <div className="dino-lesson-complete">
                        <div className="dino-complete-icon">✓</div>
                        <span className="dino-kicker">Lesson complete</span>
                        <h3>Nice work.</h3>
                        <p>{learningLesson.takeaway}</p>
                        <button type="button" className="dino-button" style={{ marginTop: 17, width: '100%' }} onClick={() => setLearningLesson(null)}>
                          Choose another lesson
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="dino-lesson-head">
                          <div>
                            <span className="dino-kicker">AI lesson</span>
                            <h3>{learningLesson.title}</h3>
                          </div>
                          <span className="dino-lesson-step">{learningStep + 1} / 5</span>
                        </div>
                        <div className="dino-lesson-progress"><span style={{ width: `${((learningStep + 1) / 5) * 100}%` }} /></div>
                        <p className="dino-lesson-intro">{learningLesson.intro}</p>

                        {learningStep === 0 && (
                          <n>
                            <h4 className="dino-lesson-step-title">Learn the vocabulary</h4>
                            <div className="dino-lesson-word-grid">
                              {learningLesson.words.map((word) => (
                                <div className="dino-lesson-word" key={word.term}>
                                  <strong>{word.term}</strong>
                                  <span>{word.translation}</span>
                                  <p>{word.example}</p>
                                </div>
                              ))}
                            </div>
                          </n>
                        )}

                        {learningStep === 1 && (
                          <>
                            <h4 className="dino-lesson-step-title">Read and notice</h4>
                            <div className="dino-lesson-reading">
                              <h4>{learningLesson.reading.title}</h4>
                              <p>{renderMarkdown(learningLesson.reading.text)}</p>
                            </div>
                          </>
                        )}

                        {learningStep === 2 && (
                          <>
                            <h4 className="dino-lesson-step-title">Check comprehension</h4>
                            <div className="dino-lesson-reading">
                              <p><strong>{learningLesson.reading.question}</strong></p>
                              <textarea
                                className="dino-lesson-textarea"
                                value={learningAnswers.reading}
                                onChange={(event) => setLearningAnswers((current) => ({ ...current, reading: event.target.value }))}
                                placeholder="Answer in the target language."
                              />
                              <button type="button" className="dino-mark-button" style={{ marginTop: 9 }} disabled={learningGrading || !learningAnswers.reading.trim()} onClick={() => gradeLearningStep('reading')}>
                                {learningGrading ? 'Marking…' : 'Ask Dino to mark'}
                              </button>
                              {learningReadingGrade && (
                                <div className="dino-lesson-feedback">
                                  <strong>{learningReadingGrade.score}/5</strong><br />{renderMarkdown(learningReadingGrade.feedback)}<br /><br /><strong>Next step:</strong> {learningReadingGrade.nextStep}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {learningStep === 3 && (
                          <>
                            <h4 className="dino-lesson-step-title">Use it in writing</h4>
                            <div className="dino-lesson-writing">
                              <p><strong>{learningLesson.writing.prompt}</strong></p>
                              <p style={{ marginTop: 7, color: '#778078' }}>{learningLesson.writing.suggestedLength}</p>
                              <ul className="dino-success-list">
                                {learningLesson.writing.successCriteria.map((item) => <li key={item}>{item}</li>)}
                              </ul>
                              <textarea
                                className="dino-lesson-textarea"
                                style={{ minHeight: 160 }}
                                value={learningAnswers.writing}
                                onChange={(event) => setLearningAnswers((current) => ({ ...current, writing: event.target.value }))}
                                placeholder="Write your response here."
                              />
                              <button type="button" className="dino-mark-button" style={{ marginTop: 9 }} disabled={learningGrading || !learningAnswers.writing.trim()} onClick={() => gradeLearningStep('writing')}>
                                {learningGrading ? 'Analysing…' : 'Get AI feedback'}
                              </button>
                              {learningWritingGrade && (
                                <div className="dino-lesson-feedback">
                                  {renderMarkdown(learningWritingGrade.feedback)}
                                  <br /><strong>Strengths</strong>
                                  <ul>{learningWritingGrade.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
                                  <strong>Improve next</strong>
                                  <ul>{learningWritingGrade.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
                                  <strong>Next step:</strong> {learningWritingGrade.nextStep}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {learningError && <div className="dino-error">{learningError}</div>}

                        <div className="dino-lesson-actions">
                          <button type="button" className="dino-small-button" disabled={learningStep === 0} onClick={() => setLearningStep((current) => Math.max(0, current - 1))}>Back</button>
                          {learningStep < 3 ? (
                            <button type="button" className="dino-button" onClick={() => setLearningStep((current) => current + 1)}>Continue</button>
                          ) : (
                            <button type="button" className="dino-button" onClick={finishLearningLesson}>Complete lesson</button>
                          )}
                        </div>
                      </>
                    )}
                  </aside>
                </div>
              </section>
            )}

            {activeTab === 'course' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">Course map</span>
                    <h2 className="dino-panel-title">Master the <span>course.</span></h2>
                    <p className="dino-panel-description">Track every IB Language B theme and topic using your existing course progress.</p>
                  </div>
                </div>
                <div className="dino-theme-grid">
                  {course.themes.map((theme, index) => (
                    <article className="dino-theme-card" key={theme.en}>
                      <div className="dino-theme-top"><span>{String(index + 1).padStart(2, '0')}</span><span>{theme.topics.filter(([topic]) => isCompleted(theme.en, topic)).length}/{theme.topics.length}</span></div>
                      <h3 className="dino-theme-title">{theme.en}</h3>
                      <div className="dino-theme-local">{theme.local}</div>
                      <div className="dino-topic-list">
                        {theme.topics.map(([english, local]) => {
                          const complete = isCompleted(theme.en, english)
                          const topicId = `${language}::${theme.en}::${english}`
                          return (
                            <label key={english} className={`dino-topic ${complete ? 'completed' : ''}`}>
                              <input type="checkbox" checked={complete} disabled={savingTopic === topicId} onChange={() => toggleTopic(theme.en, english)} style={{ display: 'none' }} />
                              <span className="dino-check">{complete ? '✓' : ''}</span>
                              <span className="dino-topic-copy"><strong>{english}</strong><small>{local}</small></span>
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
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">Reading</span>
                    <h2 className="dino-panel-title">Train like the <span>examiner.</span></h2>
                    <p className="dino-panel-description">Generate original reading practice, answer in place and get AI marking with actionable feedback.</p>
                  </div>
                </div>
                <div className="dino-reading-workspace">
                  {expandedSection === 'questionbank' && <div className="dino-expand-backdrop" onClick={() => setExpandedSection(null)} />}
                  <div className={`dino-reading-card dino-reading-generator ${expandedSection === 'questionbank' ? 'dino-card-expanded' : ''}`}>
                    <div className="dino-card-topbar">
                      <span className="dino-card-label">Reading questionbank</span>
                      <div className="dino-card-topbar-actions">
                        <span className="dino-card-status">{generatedQuestions ? 'Questions ready' : 'Ready'}</span>
                        <button type="button" className="dino-expand-button" onClick={() => setExpandedSection((current) => current === 'questionbank' ? null : 'questionbank')} aria-label="Expand reading questionbank">↗</button>
                      </div>
                    </div>
                    {!generatedQuestions ? (
                      <div className="dino-generator-body">
                        <h3 className="dino-generator-title">Build a reading set.</h3>
                        <p className="dino-generator-description">Choose the question style, difficulty and IB course topic.</p>
                        <div className="dino-generator-fields">
                          <div className="dino-field"><label className="dino-field-label">Question type</label><select className="dino-select" value={readingType} onChange={(e) => setReadingType(e.target.value)}><option>Mixed</option><option>Multiple choice</option><option>Short answer</option><option>True / false</option><option>Vocabulary in context</option><option>Inference</option></select></div>
                          <div className="dino-field"><label className="dino-field-label">Difficulty</label><select className="dino-select" value={readingDifficulty} onChange={(e) => setReadingDifficulty(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                          <div className="dino-field"><label className="dino-field-label">Language</label><div className="dino-select" style={{ display:'flex', alignItems:'center' }}>{language}</div></div>
                          <div className="dino-field"><label className="dino-field-label">IB course topic</label><select className="dino-select" value={readingTopic} onChange={(e) => setReadingTopic(e.target.value)}><option value="">Select a course topic</option>{course.themes.map((theme) => <optgroup key={theme.en} label={`${theme.en} / ${theme.local}`}>{theme.topics.map(([english, local]) => <option key={english} value={english}>{english} / {local}</option>)}</optgroup>)}</select></div>
                        </div>
                        <button type="button" className="dino-generate" disabled={!readingTopic || isGeneratingQuestions} onClick={generateReadingQuestions}>{isGeneratingQuestions ? 'Generating...' : 'Generate questions → 1 🦖'}</button>
                        {isGeneratingQuestions && <div className="dino-generating">Dino is building the reading set...</div>}
                        {questionError && <div className="dino-error">{questionError}</div>}
                      </div>
                    ) : (
                      <div className="dino-generator-body">
                        <h3 className="dino-generator-title">{generatedQuestions.title}</h3>
                        <p className="dino-generator-description">{generatedQuestions.instructions}</p>
                        <div className="dino-question-list">
                          {generatedQuestions.questions.map((question) => {
                            const grade = readingGrades[question.id]
                            return (
                              <article className="dino-generated-question" key={question.id}>
                                <div className="dino-question-header"><span className="dino-question-number">Question {question.id}</span><span className="dino-question-marks">{question.marks} {question.marks === 1 ? 'mark' : 'marks'}</span></div>
                                {question.context && <div className="dino-reading-context"><div className="dino-card-label">Reading text</div><div className="dino-reading-context-copy">{renderMarkdown(question.context)}</div></div>}
                                <div className="dino-question-text">{renderMarkdown(question.question)}</div>
                                <textarea className="dino-answer-box" value={answerSubmission[question.id] || ''} onChange={(e) => setAnswerSubmission((current) => ({ ...current, [question.id]: e.target.value }))} placeholder={`Write your answer here. Maximum ${question.marks} ${question.marks === 1 ? 'mark' : 'marks'}.`} />
                                <div className="dino-question-actions"><span className="dino-grade-pill">{grade ? `${grade.score}/${grade.maxMarks} marked` : `${question.marks} marks available`}</span><button type="button" className="dino-mark-button" disabled={gradingQuestion !== null || !String(answerSubmission[question.id] || '').trim()} onClick={() => markReadingQuestion(question.id)}>{gradingQuestion === question.id ? 'Marking...' : grade ? 'Mark again' : 'Mark answer'}</button></div>
                                {grade && <div className="dino-feedback"><div className="dino-feedback-score">{grade.score}/{grade.maxMarks}</div><div style={{ marginTop: 8 }}>{renderMarkdown(grade.feedback)}</div><div style={{ marginTop: 8 }}>{renderMarkdown(`**Next step:** ${grade.nextStep}`)}</div></div>}
                              </article>
                            )
                          })}
                        </div>
                        <div className="dino-total-score"><span>Current reading score</span><strong>{readingEarnedMarks}/{readingTotalMarks}</strong></div>
                        {questionError && <div className="dino-error">{questionError}</div>}
                        <button type="button" className="dino-small-button" onClick={() => { setGeneratedQuestions(null); setAnswerSubmission({}); setReadingGrades({}); setQuestionError(''); setExpandedSection(null) }}>Generate a new set</button>
                      </div>
                    )}
                  </div>

                  <div className="dino-reading-card dino-tutor-card">
                    <div className="dino-card-topbar"><span className="dino-card-label">AI study context</span><span className="dino-card-status">Linked to your practice</span></div>
                    <div className="dino-empty-center" style={{ minHeight: 0, height: '100%' }}>
                      <div className="dino-prompt-icon">✦</div>
                      <h3>Your reading workspace is focused.</h3>
                      <p>Use the generated text, answer it in the panel and let Dino grade the actual response. The existing question generation and grading logic remains unchanged.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'writing' && (
              <section className="dino-panel">
                <div className="dino-panel-heading"><div><span className="dino-kicker">Writing</span><h2 className="dino-panel-title">Write. Get <span>better.</span></h2><p className="dino-panel-description">Generate an IB-style task, write your response and get examiner-style feedback using the existing grading flow.</p></div></div>
                <div className="dino-writing-workspace">
                  {expandedSection === 'writing' && <div className="dino-expand-backdrop" onClick={() => setExpandedSection(null)} />}
                  <div className="dino-writing-card dino-writing-controls">
                    <label className="dino-field-label">Course topic</label>
                    <select className="dino-select" value={writingTopic} onChange={(e) => setWritingTopic(e.target.value)}><option value="">Select a course topic</option>{course.themes.map((theme) => <optgroup key={theme.en} label={`${theme.en} / ${theme.local}`}>{theme.topics.map(([english, local]) => <option key={english} value={english}>{english} / {local}</option>)}</optgroup>)}</select>
                    <label className="dino-field-label">Text type</label>
                    <select className="dino-select" value={writingType} onChange={(e) => setWritingType(e.target.value)}>{writingTypes.map((type) => <option key={type}>{type}</option>)}</select>
                    <label className="dino-field-label">Difficulty</label>
                    <select className="dino-select" value={writingDifficulty} onChange={(e) => setWritingDifficulty(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
                    <button type="button" className="dino-generate" disabled={!writingTopic || writingGenerating} onClick={createPrompt}>{writingGenerating ? 'Generating...' : 'Generate prompt → 1 🦖'}</button>
                    {writingGenerating && <div className="dino-generating">Dino is building your task...</div>}
                    {questionError && !writingTask && <div className="dino-error">{questionError}</div>}
                  </div>
                  <div className={`dino-writing-card dino-writing-editor ${expandedSection === 'writing' ? 'dino-card-expanded' : ''}`}>
                    <div className="dino-writing-editor-topbar"><button type="button" className="dino-expand-button" onClick={() => setExpandedSection((current) => current === 'writing' ? null : 'writing')} aria-label="Expand writing workspace">↗</button></div>
                    <div className="dino-writing-editor-content">
                      {!writingTask ? (
                        <div className="dino-prompt-empty"><div className="dino-prompt-icon">✦</div><h3>Your writing task will appear here.</h3><p>Select a topic, text type and difficulty, then generate an original IB-style task.</p></div>
                      ) : (
                        <>
                          <div className="dino-writing-task"><span className="dino-prompt-label">Generated task</span><h3>{writingTask.title}</h3><div className="dino-writing-meta"><span>{writingType}</span><span>{writingDifficulty}</span><span>30 marks</span><span>{writingTask.suggestedLength}</span></div><div className="dino-writing-task-prompt">{renderMarkdown(writingTask.prompt)}</div><div className="dino-prompt-label">IB Paper 1 criteria</div><ol className="dino-criteria"><li>Criterion A: Language — 12 marks</li><li>Criterion B: Message — 12 marks</li><li>Criterion C: Conceptual understanding — 6 marks</li></ol></div>
                          <div className="dino-writing-answer-label"><strong>Your response</strong><span>30 marks available</span></div>
                          <textarea className="dino-writing-textarea" value={writingAnswer} onChange={(e) => setWritingAnswer(e.target.value)} placeholder="Write your response here..." />
                          <button type="button" className="dino-mark-button" style={{ width:'100%', marginTop:10 }} disabled={!writingAnswer.trim() || writingGrading} onClick={markWriting}>{writingGrading ? 'Marking response...' : 'Mark response'}</button>
                          {questionError && writingTask && <div className="dino-error">{questionError}</div>}
                          {writingGrade && (
                            <div className="dino-writing-grade"><div className="dino-writing-grade-score"><span className="dino-prompt-label">Result</span><strong>{writingGrade.score}/30</strong></div><div className="dino-criterion-scores"><span>Language {writingGrade.criterionA}/12</span><span>Message {writingGrade.criterionB}/12</span><span>Conceptual understanding {writingGrade.criterionC}/6</span></div>{renderMarkdown(writingGrade.feedback)}<div className="dino-writing-grade-section"><strong>Strengths</strong><ul>{writingGrade.strengths.map((item,index)=><li key={index}>{item}</li>)}</ul></div><div className="dino-writing-grade-section"><strong>Improve next</strong><ul>{writingGrade.improvements.map((item,index)=><li key={index}>{item}</li>)}</ul></div><div className="dino-writing-grade-section"><strong>Next step</strong><p style={{ margin: 0, marginTop: 5, color:'#4b4b4b', fontSize:9, lineHeight:1.45 }}>{writingGrade.nextStep}</p></div><button type="button" className="dino-small-button" onClick={createPrompt} disabled={writingGenerating}>Generate another task</button></div>
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
                <div className="dino-panel-heading"><div><span className="dino-kicker">Vocabulary</span><h2 className="dino-panel-title">Make words <span>stick.</span></h2><p className="dino-panel-description">Generate a topic-specific set and practise it one term at a time using your existing AI vocabulary flow.</p></div></div>
                <div className="dino-vocabulary-workspace">
                  <div className="dino-vocabulary-controls">
                    <label className="dino-field-label">Course topic</label>
                    <select className="dino-select" value={vocabularyTopic} onChange={(e) => setVocabularyTopic(e.target.value)}><option value="">Select a course topic</option>{course.themes.map((theme) => <optgroup key={theme.en} label={`${theme.en} / ${theme.local}`}>{theme.topics.map(([english, local]) => <option key={english} value={english}>{english} / {local}</option>)}</optgroup>)}</select>
                    <button type="button" className="dino-generate" disabled={!vocabularyTopic || vocabularyGenerating} onClick={generateVocabulary}>{vocabularyGenerating ? 'Generating...' : 'Generate vocabulary → 1 🦖'}</button>
                    {questionError && <div className="dino-error">{questionError}</div>}
                  </div>
                  <div className="dino-vocabulary-trainer">
                    {!vocabularySet ? (
                      <div className="dino-prompt-empty"><div className="dino-prompt-icon">✦</div><h3>Your vocabulary set will appear here.</h3><p>Select any topic to generate a fresh target-language set.</p></div>
                    ) : (
                      <>
                        <div className="dino-vocabulary-topline"><div><span className="dino-prompt-label">Vocabulary trainer</span><h3>{vocabularySet.title}</h3></div><span className="dino-vocabulary-count">{vocabularyIndex + 1} / {vocabularySet.words.length}</span></div>
                        <p className="dino-generator-description">{vocabularySet.instructions}</p>
                        <button type="button" className={`dino-vocabulary-card ${vocabularyRevealed ? 'is-flipped' : ''}`} onClick={() => setVocabularyRevealed((current) => !current)} aria-label={vocabularyRevealed ? 'Flip card to term' : 'Flip card to answer'}>
                          <span className="dino-flashcard-inner">
                            <span className="dino-flashcard-face dino-flashcard-front"><span className="dino-prompt-label">Target language</span><strong>{vocabularySet.words[vocabularyIndex].term}</strong><span className="dino-flashcard-hint">Tap to reveal the meaning.</span></span>
                            <span className="dino-flashcard-face dino-flashcard-back"><span className="dino-prompt-label">Meaning</span><strong>{vocabularySet.words[vocabularyIndex].translation}</strong><span className="dino-flashcard-example">{vocabularySet.words[vocabularyIndex].example}</span><span className="dino-flashcard-note">{vocabularySet.words[vocabularyIndex].note}</span></span>
                          </span>
                        </button>
                        <div className="dino-vocabulary-actions"><button type="button" className="dino-small-button" onClick={() => setVocabularyRevealed((current) => !current)}>Flip card</button><button type="button" className="dino-mark-button" onClick={() => { setVocabularyIndex((current) => (current + 1) % vocabularySet.words.length); setVocabularyRevealed(false) }}>Next word</button></div>
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
