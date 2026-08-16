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
  getDinoPoints,
  spendDinoPoints,
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

const DINOPOINT_READING_COST = 2
const DINOPOINT_WRITING_COST = 2

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
            'Lengua y identidad',
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
          ['Life stories', '人生故事'],
          [
            'Rites of passage',
            '人生阶段仪式',
          ],
          [
            'Customs and traditions',
            '习俗与传统',
          ],
          ['Migration', '移民与迁徙'],
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
          ['Law and order', '法律与秩序'],
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
          ['Law and order', 'Law and order'],
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
          ['Law and order', 'Recht und Ordnung'],
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
          ['Life stories', 'Storie di vita'],
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
          ['Law and order', 'Legge e ordine'],
        ],
      },

      {
        en: 'Sharing the planet',
        local: 'Condivisione del pianeta',
        topics: [
          ['The environment', "L'ambiente"],
          ['Human rights', 'Diritti umani'],
          [
            'Peace and conflict',
            'Pace e conflitti',
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
          ['Law and order', '法律と秩序'],
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
      required: [
        'title',
        'instructions',
        'questions',
      ],
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
          items: {
            type: 'string',
          },
        },
        suggestedLength: {
          type: 'string',
        },
        marks: {
          type: 'integer',
        },
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

function splitInlineMarkdown(
  text,
  keyPrefix = 'md',
) {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g,
  )

  return tokens.map(
    (token, index) => {
      if (!token) return null

      if (
        /^\*\*[^*]+\*\*$/.test(
          token,
        )
      ) {
        return (
          <strong
            key={`${keyPrefix}-b-${index}`}
          >
            {token.slice(2, -2)}
          </strong>
        )
      }

      if (
        /^\*[^*]+\*$/.test(
          token,
        )
      ) {
        return (
          <em
            key={`${keyPrefix}-i-${index}`}
          >
            {token.slice(1, -1)}
          </em>
        )
      }

      if (
        /^`[^`]+`$/.test(
          token,
        )
      ) {
        return (
          <code
            key={`${keyPrefix}-c-${index}`}
          >
            {token.slice(1, -1)}
          </code>
        )
      }

      const linkMatch =
        token.match(
          /^\[([^\]]+)\]\(([^)]+)\)$/,
        )

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
        <span
          key={`${keyPrefix}-t-${index}`}
        >
          {token}
        </span>
      )
    },
  )
}

function renderMarkdown(
  text,
  className = '',
) {
  const source = String(
    text || '',
  ).replace(/\r/g, '')

  const blocks =
    source.split('\n\n')

  return (
    <div
      className={`dino-markdown ${className}`.trim()}
    >
      {blocks.map(
        (
          block,
          blockIndex,
        ) => {
          const lines =
            block.split('\n')

          const firstLine =
            lines[0]?.trim() || ''

          if (
            /^###\s+/.test(
              firstLine,
            )
          ) {
            return (
              <h5
                key={
                  blockIndex
                }
              >
                {splitInlineMarkdown(
                  firstLine.replace(
                    /^###\s+/,
                    '',
                  ),
                  `h3-${blockIndex}`,
                )}
              </h5>
            )
          }

          if (
            /^##\s+/.test(
              firstLine,
            )
          ) {
            return (
              <h4
                key={
                  blockIndex
                }
              >
                {splitInlineMarkdown(
                  firstLine.replace(
                    /^##\s+/,
                    '',
                  ),
                  `h2-${blockIndex}`,
                )}
              </h4>
            )
          }

          if (
            /^#\s+/.test(
              firstLine,
            )
          ) {
            return (
              <h3
                key={
                  blockIndex
                }
              >
                {splitInlineMarkdown(
                  firstLine.replace(
                    /^#\s+/,
                    '',
                  ),
                  `h1-${blockIndex}`,
                )}
              </h3>
            )
          }

          if (
            lines.every(
              (line) =>
                /^[-*]\s+/.test(
                  line.trim(),
                ),
            )
          ) {
            return (
              <ul
                key={
                  blockIndex
                }
              >
                {lines.map(
                  (
                    line,
                    index,
                  ) => (
                    <li
                      key={
                        index
                      }
                    >
                      {splitInlineMarkdown(
                        line
                          .trim()
                          .replace(
                            /^[-*]\s+/,
                            '',
                          ),
                        `li-${blockIndex}-${index}`,
                      )}
                    </li>
                  ),
                )}
              </ul>
            )
          }

          if (
            lines.every(
              (line) =>
                /^\d+\.\s+/.test(
                  line.trim(),
                ),
            )
          ) {
            return (
              <ol
                key={
                  blockIndex
                }
              >
                {lines.map(
                  (
                    line,
                    index,
                  ) => (
                    <li
                      key={
                        index
                      }
                    >
                      {splitInlineMarkdown(
                        line
                          .trim()
                          .replace(
                            /^\d+\.\s+/,
                            '',
                          ),
                        `oli-${blockIndex}-${index}`,
                      )}
                    </li>
                  ),
                )}
              </ol>
            )
          }

          return (
            <p
              key={
                blockIndex
              }
            >
              {lines.map(
                (
                  line,
                  index,
                ) => (
                  <React.Fragment
                    key={index}
                  >
                    {index > 0 && (
                      <br />
                    )}
                    {splitInlineMarkdown(
                      line,
                      `p-${blockIndex}-${index}`,
                    )}
                  </React.Fragment>
                ),
              )}
            </p>
          )
        },
      )}
    </div>
  )
}

/* ========================================================================== */
/* APP                                                                        */
/* ========================================================================== */

function Dashboard({
  navigate,
}) {
  const [
    authLoading,
    setAuthLoading,
  ] = useState(true)

  const [user, setUser] =
    useState(null)

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(true)

  const [
    language,
    setLanguage,
  ] = useState('English B')

  const [
    dinoPoints,
    setDinoPoints,
  ] = useState(0)

  const [
    dinoPointsLoading,
    setDinoPointsLoading,
  ] = useState(true)

  const [
    dinoPointsError,
    setDinoPointsError,
  ] = useState('')

  const [
    activeTab,
    setActiveTab,
  ] = useState('course')

  const [
    selectedTopics,
    setSelectedTopics,
  ] = useState([])

  const [
    savingTopic,
    setSavingTopic,
  ] = useState('')

  const [
    writingTopic,
    setWritingTopic,
  ] = useState('')

  const [
    writingType,
    setWritingType,
  ] = useState('Article')

  const [
    writingDifficulty,
    setWritingDifficulty,
  ] = useState('Intermediate')

  const [
    writingTask,
    setWritingTask,
  ] = useState(null)

  const [
    writingAnswer,
    setWritingAnswer,
  ] = useState('')

  const [
    writingGrade,
    setWritingGrade,
  ] = useState(null)

  const [
    writingGenerating,
    setWritingGenerating,
  ] = useState(false)

  const [
    writingGrading,
    setWritingGrading,
  ] = useState(false)

  const [
    readingType,
    setReadingType,
  ] = useState('Mixed')

  const [
    readingDifficulty,
    setReadingDifficulty,
  ] = useState('Intermediate')

  const [
    readingTopic,
    setReadingTopic,
  ] = useState('')

  const [
    generatedQuestions,
    setGeneratedQuestions,
  ] = useState(null)

  const [
    isGeneratingQuestions,
    setIsGeneratingQuestions,
  ] = useState(false)

  const [
    questionError,
    setQuestionError,
  ] = useState('')

  const [
    answerSubmission,
    setAnswerSubmission,
  ] = useState({})

  const [
    readingGrades,
    setReadingGrades,
  ] = useState({})

  const [
    gradingQuestion,
    setGradingQuestion,
  ] = useState(null)

  const [
    chatMessages,
    setChatMessages,
  ] = useState([])

  const [
    chatInput,
    setChatInput,
  ] = useState('')

  const [
    chatTyping,
    setChatTyping,
  ] = useState(false)

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
            await getProfile(
              currentUser.id,
            )

          if (mounted) {
            setLanguage(
              profile?.language ||
                currentUser
                  ?.user_metadata
                  ?.language ||
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
            setSelectedTopics(
              savedProgress,
            )
          }
        } catch (error) {
          console.error(
            'Course progress loading failed:',
            error,
          )
        }

        try {
          const points =
            await getDinoPoints()

          if (mounted) {
            setDinoPoints(
              Number(
                points?.balance ??
                  0,
              ),
            )

            setDinoPointsError('')
          }
        } catch (error) {
          console.error(
            'DinoPoints loading failed:',
            error,
          )

          if (mounted) {
            setDinoPointsError(
              error instanceof
                Error
                ? error.message
                : 'Could not load DinoPoints.',
            )
          }
        } finally {
          if (mounted) {
            setDinoPointsLoading(
              false,
            )

            setProfileLoading(
              false,
            )
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
        (
          event,
          session,
        ) => {
          if (
            event ===
              'SIGNED_OUT' ||
            !session
          ) {
            navigate('/login')
            return
          }

          setUser(
            session.user,
          )

          setAuthLoading(
            false,
          )
        },
      )

    return () => {
      mounted = false

      authSubscription
        ?.data
        ?.subscription
        ?.unsubscribe?.()
    }
  }, [navigate])

  useEffect(() => {
    document.body.dataset.page =
      'dashboard'

    return () => {
      delete document.body
        .dataset.page
    }
  }, [])

  /* ------------------------------------------------------------------------ */
  /* COURSE                                                                  */
  /* ------------------------------------------------------------------------ */

  const course = useMemo(
    () =>
      COURSE[language] ||
      COURSE['English B'],
    [language],
  )

  const allTopics =
    useMemo(
      () =>
        course.themes.flatMap(
          (theme) =>
            theme.topics.map(
              (topic) => ({
                theme:
                  theme.en,
                themeLocal:
                  theme.local,
                topic:
                  topic[0],
                local:
                  topic[1],
              }),
            ),
        ),
      [course],
    )

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

  const toggleTopic = async (
    themeName,
    topicEnglish,
  ) => {
    if (
      !user ||
      savingTopic
    ) {
      return
    }

    const topicId =
      `${language}::${themeName}::${topicEnglish}`

    const currentlyCompleted =
      selectedTopics.includes(
        topicId,
      )

    const nextCompleted =
      !currentlyCompleted

    setSavingTopic(
      topicId,
    )

    setSelectedTopics(
      (current) =>
        nextCompleted
          ? [
              ...current,
              topicId,
            ]
          : current.filter(
              (item) =>
                item !==
                topicId,
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

      setSelectedTopics(
        (current) => {
          if (
            currentlyCompleted
          ) {
            return [
              ...current,
              topicId,
            ]
          }

          return current.filter(
            (item) =>
              item !==
              topicId,
          )
        },
      )
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
  /* DINOPOINTS                                                               */
  /* ------------------------------------------------------------------------ */

  const payDinoPoints =
    async (cost = 2) => {
      if (!user) {
        throw new Error(
          'You must be logged in to use DinoPoints.',
        )
      }

      const result =
        await spendDinoPoints(
          cost,
        )

      setDinoPoints(
        Number(
          result?.balance ??
            0,
        ),
      )

      setDinoPointsError('')

      return result
    }

  /* ------------------------------------------------------------------------ */
  /* READING                                                                  */
  /* ------------------------------------------------------------------------ */

  const generateReadingQuestions =
    async () => {
      if (
        !readingTopic ||
        !readingType ||
        isGeneratingQuestions
      ) {
        return
      }

      setQuestionError('')
      setGeneratedQuestions(
        null,
      )

      setAnswerSubmission({})
      setReadingGrades({})
      setIsGeneratingQuestions(
        true,
      )

      const selectedTopic =
        allTopics.find(
          (item) =>
            item.topic ===
            readingTopic,
        )

      try {
        await payDinoPoints(
          DINOPOINT_READING_COST,
        )

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

        const raw =
          await callGroq({
            system:
              systemPrompt,
            user:
              userPrompt,
            responseFormat:
              QUESTION_SCHEMA,
            temperature:
              0.35,
            maxTokens:
              2200,
          })

        const parsed =
          cleanModelJSON(
            raw,
          )

        if (
          !parsed ||
          !Array.isArray(
            parsed.questions,
          ) ||
          parsed.questions
            .length !== 2
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
              marks:
                Math.max(
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
            'Answer each question in its own answer box. Use the tutor for hints or clarification without asking for the answer.',
          questions:
            normalizedQuestions,
        }

        setGeneratedQuestions(
          result,
        )

        setChatMessages([
          {
            role: 'tutor',
            text:
              `I generated a ${readingDifficulty.toLowerCase()} reading set on ${readingTopic}. You can answer directly under each question, ask me for help, or use Mark when you are ready. I will not reveal answer keys before marking.`,
          },
        ])
      } catch (error) {
        setQuestionError(
          error instanceof
            Error
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
    async (
      questionId,
    ) => {
      if (
        !generatedQuestions ||
        gradingQuestion !==
          null
      ) {
        return
      }

      const question =
        generatedQuestions.questions.find(
          (item) =>
            item.id ===
            questionId,
        )

      if (!question) {
        return
      }

      const answer =
        String(
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

      setChatTyping(true)

      try {
        const responseFormat =
          {
            type:
              'json_schema',
            json_schema: {
              name:
                'ib_reading_single_grade',
              strict: true,
              schema: {
                type:
                  'object',
                properties: {
                  score:
                    {
                      type:
                        'integer',
                    },
                  feedback:
                    {
                      type:
                        'string',
                    },
                  nextStep:
                    {
                      type:
                        'string',
                    },
                },
                required: [
                  'score',
                  'feedback',
                  'nextStep',
                ],
                additionalProperties:
                  false,
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

        const raw =
          await callGroq({
            system:
              systemPrompt,
            user:
              userPrompt,
            responseFormat,
            temperature:
              0.1,
            maxTokens:
              800,
          })

        const parsed =
          cleanModelJSON(
            raw,
          )

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
            [questionId]:
              {
                ...parsed,
                score:
                  safeScore,
                maxMarks:
                  question.marks,
              },
          }),
        )

        setChatMessages(
          (current) => [
            ...current,
            {
              role: 'tutor',
              text:
                `Question ${questionId}: ${safeScore}/${question.marks}. ${parsed.feedback}\n\nNext step: ${parsed.nextStep}`,
            },
          ],
        )
      } catch (error) {
        setQuestionError(
          error instanceof
            Error
            ? error.message
            : 'Something went wrong while marking the answer.',
        )
      } finally {
        setGradingQuestion(
          null,
        )

        setChatTyping(false)
      }
    }

  const readingTotalMarks =
    generatedQuestions
      ? generatedQuestions.questions.reduce(
          (
            sum,
            question,
          ) =>
            sum +
            question.marks,
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
  /* READING TUTOR                                                            */
  /* ------------------------------------------------------------------------ */

  const sendReadingChat =
    async () => {
      const text =
        chatInput.trim()

      if (
        !text ||
        chatTyping
      ) {
        return
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
      setChatTyping(true)

      try {
        const questionContext =
          generatedQuestions
            ? generatedQuestions.questions
                .map(
                  (
                    question,
                  ) =>
                    `Question ${question.id}: ${question.question}\nContext: ${question.context}`,
                )
                .join(
                  '\n\n',
                )
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

        const raw =
          await callGroq({
            system:
              tutorSystem,
            user:
              text,
            temperature:
              0.3,
            maxTokens:
              700,
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
                error instanceof
                  Error
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
        event.key ===
          'Enter' &&
        !event.shiftKey
      ) {
        event.preventDefault()
        sendReadingChat()
      }
    }

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

      if (!selected) {
        return
      }

      setWritingGenerating(
        true,
      )

      setWritingGrade(null)
      setWritingAnswer('')

      try {
        await payDinoPoints(
          DINOPOINT_WRITING_COST,
        )

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

        const raw =
          await callGroq({
            system:
              systemPrompt,
            user:
              userPrompt,
            responseFormat:
              WRITING_PROMPT_SCHEMA,
            temperature:
              0.45,
            maxTokens:
              1200,
          })

        const parsed =
          cleanModelJSON(
            raw,
          )

        if (!parsed) {
          throw new Error(
            'Groq returned an invalid writing prompt.',
          )
        }

        setWritingTask({
          ...parsed,
          marks:
            Math.max(
              10,
              Number(
                parsed.marks,
              ) || 15,
            ),
        })
      } catch (error) {
        setQuestionError(
          error instanceof
            Error
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
        const responseFormat =
          {
            type:
              'json_schema',
            json_schema: {
              name:
                'ib_writing_grade',
              strict: true,
              schema: {
                type:
                  'object',
                properties: {
                  score:
                    {
                      type:
                        'integer',
                    },
                  feedback:
                    {
                      type:
                        'string',
                    },
                  strengths:
                    {
                      type:
                        'array',
                      minItems: 1,
                      maxItems: 5,
                      items:
                        {
                          type:
                            'string',
                        },
                    },
                  improvements:
                    {
                      type:
                        'array',
                      minItems: 1,
                      maxItems: 5,
                      items:
                        {
                          type:
                            'string',
                        },
                    },
                  nextStep:
                    {
                      type:
                        'string',
                    },
                },
                required: [
                  'score',
                  'feedback',
                  'strengths',
                  'improvements',
                  'nextStep',
                ],
                additionalProperties:
                  false,
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
${writingTask.criteria
  .map(
    (
      item,
      index,
    ) =>
      `${index + 1}. ${item}`,
  )
  .join('\n')}

SUGGESTED LENGTH:
${writingTask.suggestedLength}

MAXIMUM MARKS:
${writingTask.marks}

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
            temperature:
              0.1,
            maxTokens:
              1600,
          })

        const parsed =
          cleanModelJSON(
            raw,
          )

        if (!parsed) {
          throw new Error(
            'Groq returned an invalid writing grade.',
          )
        }

        setWritingGrade({
          ...parsed,
          score:
            Math.min(
              Math.max(
                0,
                Number(
                  parsed.score,
                ) || 0,
              ),
              writingTask.marks,
            ),
        })
      } catch (error) {
        setQuestionError(
          error instanceof
            Error
            ? error.message
            : 'Something went wrong while marking the writing.',
        )
      } finally {
        setWritingGrading(
          false,
        )
      }
    }

  /* ------------------------------------------------------------------------ */
  /* LOGOUT                                                                   */
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

  if (!user) {
    return null
  }

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

        .dino-points-badge {
          min-height: 31px;
          padding: 0 10px 0 7px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 10px;
          background: rgba(255,255,255,.82);
          color: #0a0a0a;
          box-shadow: 0 6px 18px rgba(0,0,0,.025);
        }

        .dino-points-badge.loading {
          opacity: .6;
        }

        .dino-points-icon {
          width: 20px;
          height: 20px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          color: #fff;
          font-size: 8px;
          font-weight: 700;
        }

        .dino-points-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1;
        }

        .dino-points-copy small {
          color: #8a8a8a;
          font-size: 7px;
          font-weight: 600;
          letter-spacing: .01em;
        }

        .dino-points-copy strong {
          margin-top: 3px;
          color: #0a0a0a;
          font-size: 11px;
          font-weight: 700;
        }

        .dino-points-error {
          position: absolute;
          top: 7px;
          right: 34px;
          max-width: 340px;
          padding: 6px 9px;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 8px;
          background: rgba(255,255,255,.9);
          color: #777;
          font-size: 7px;
          line-height: 1.35;
          pointer-events: none;
        }

        .dino-user-email {
          max-width: 180px;
          overflow: hidden;
          color: #888;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
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

        .dino-topic.completed .dino-check {
          background: #0a0a0a;
          border-color: #0a0a0a;
        }

        .dino-topic-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .dino-topic-copy strong {
          overflow: hidden;
          color: #282828;
          font-size: 9px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dino-topic-copy small {
          margin-top: 2px;
          overflow: hidden;
          color: #999;
          font-size: 7px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dino-progress-card {
          padding: 16px;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 15px;
          background: rgba(255,255,255,.76);
        }

        .dino-progress-card strong {
          color: #0a0a0a;
        }

        .dino-reading-workspace,
        .dino-writing-workspace {
          min-width: 0;
          display: grid;
          gap: 10px;
        }

        .dino-reading-workspace {
          grid-template-columns: minmax(0,1fr) 330px;
        }

        .dino-writing-workspace {
          grid-template-columns: 310px minmax(0,1fr);
        }

        .dino-reading-card,
        .dino-writing-card {
          min-width: 0;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px;
          background: rgba(255,255,255,.76);
          backdrop-filter: blur(16px);
        }

        .dino-reading-controls,
        .dino-writing-controls {
          padding: 17px;
        }

        .dino-reading-results,
        .dino-writing-editor {
          min-width: 0;
          padding: 19px;
        }

        .dino-field {
          min-width: 0;
          margin-bottom: 12px;
        }

        .dino-field-label {
          display: block;
          margin-bottom: 6px;
          color: #6e6e6e;
          font-size: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .03em;
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

        .dino-generating {
          margin-top: 10px;
          color: #888;
          font-size: 9px;
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

        .dino-field-full {
          grid-column: 1 / -1;
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
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #0a0a0a;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
        }

        .dino-question-marks {
          color: #777;
          font-size: 9px;
          font-weight: 600;
        }

        .dino-question-context {
          margin: 14px 0;
          padding: 12px;
          border-left: 2px solid #0a0a0a;
          background: rgba(0,0,0,.025);
          color: #555;
          font-size: 10px;
          line-height: 1.55;
        }

        .dino-question-copy {
          margin-top: 12px;
          color: #181818;
          font-size: 11px;
          line-height: 1.55;
        }

        .dino-answer-label {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          color: #6b6b6b;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .03em;
        }

        .dino-answer-textarea,
        .dino-writing-textarea,
        .dino-chat-input {
          width: 100%;
          resize: vertical;
          outline: none;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 11px;
          background: #fff;
          color: #111;
          font-family: Inter, sans-serif;
          font-size: 10px;
          line-height: 1.5;
        }

        .dino-answer-textarea {
          min-height: 110px;
          margin-top: 8px;
          padding: 10px;
        }

        .dino-writing-textarea {
          min-height: 300px;
          margin-top: 10px;
          padding: 13px;
        }

        .dino-answer-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 9px;
        }

        .dino-mark-button {
          min-height: 37px;
          padding: 0 14px;
        }

        .dino-grade {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 12px;
          background: rgba(0,0,0,.025);
        }

        .dino-grade-score {
          font-size: 11px;
          font-weight: 700;
        }

        .dino-grade-feedback {
          margin-top: 7px;
          color: #555;
          font-size: 9px;
          line-height: 1.5;
        }

        .dino-reading-summary {
          margin-top: 16px;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-radius: 12px;
          background: #0a0a0a;
          color: #fff;
        }

        .dino-reading-summary strong {
          display: block;
          font-size: 17px;
          letter-spacing: -.04em;
        }

        .dino-reading-summary span {
          color: rgba(255,255,255,.62);
          font-size: 8px;
        }

        .dino-chat {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
        }

        .dino-chat-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .dino-chat-title strong {
          color: #111;
          font-size: 12px;
        }

        .dino-chat-messages {
          min-height: 0;
          flex: 1;
          overflow-y: auto;
          padding: 2px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dino-chat-message {
          max-width: 92%;
          padding: 9px 10px;
          border-radius: 11px;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-chat-message.user {
          align-self: flex-end;
          background: #0a0a0a;
          color: #fff;
        }

        .dino-chat-message.tutor {
          align-self: flex-start;
          background: rgba(0,0,0,.035);
          color: #4f4f4f;
        }

        .dino-chat-compose {
          margin-top: 10px;
          display: flex;
          gap: 6px;
        }

        .dino-chat-input {
          min-height: 40px;
          padding: 8px 9px;
          resize: none;
        }

        .dino-chat-send {
          min-width: 65px;
          border: 0;
          border-radius: 10px;
          background: #0a0a0a;
          color: #fff;
          font-size: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .dino-writing-task {
          padding-bottom: 18px;
        }

        .dino-prompt-label {
          display: block;
          color: #8d8d8d;
          font-size: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .03em;
        }

        .dino-writing-task h3 {
          margin: 6px 0 11px;
          color: #111;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .dino-writing-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .dino-writing-meta span {
          padding: 5px 7px;
          border-radius: 7px;
          background: rgba(0,0,0,.04);
          color: #707070;
          font-size: 8px;
        }

        .dino-writing-task-prompt {
          margin-top: 17px;
          color: #222;
          font-size: 11px;
          line-height: 1.55;
        }

        .dino-writing-answer-label {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
          color: #777;
          font-size: 9px;
        }

        .dino-criteria {
          margin: 8px 0 0;
          padding-left: 18px;
          color: #555;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-writing-grade {
          margin-top: 15px;
          padding: 15px;
          border: 1px solid rgba(0,0,0,.07);
          border-radius: 14px;
          background: rgba(0,0,0,.025);
        }

        .dino-writing-grade-score {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dino-writing-grade-score strong {
          color: #111;
          font-size: 25px;
          letter-spacing: -.06em;
        }

        .dino-writing-grade-section {
          margin-top: 13px;
        }

        .dino-writing-grade-section strong {
          color: #222;
          font-size: 9px;
        }

        .dino-writing-grade-section ul {
          margin: 5px 0 0;
          padding-left: 17px;
          color: #575757;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-writing-grade-section p {
          margin-top: 5px;
          color: #555;
          font-size: 9px;
          line-height: 1.45;
        }

        .dino-prompt-empty {
          height: 100%;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }

        .dino-prompt-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          color: #fff;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .dino-prompt-empty h3 {
          margin: 0;
          color: #222;
          font-size: 18px;
          letter-spacing: -.04em;
        }

        .dino-prompt-empty p {
          max-width: 400px;
          margin: 8px 0 0;
          color: #898989;
          font-size: 9px;
          line-height: 1.5;
        }

        .dino-markdown {
          color: inherit;
        }

        .dino-markdown h3,
        .dino-markdown h4,
        .dino-markdown h5 {
          margin: 9px 0 5px;
        }

        .dino-markdown p {
          margin: 0 0 8px;
        }

        .dino-markdown ul,
        .dino-markdown ol {
          margin: 5px 0 8px;
          padding-left: 18px;
        }

        .dino-markdown code {
          padding: 1px 4px;
          border-radius: 4px;
          background: rgba(0,0,0,.05);
          font-size: .92em;
        }

        .dino-markdown a {
          color: inherit;
        }

        .dino-coming-page {
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dino-coming-content {
          max-width: 520px;
          padding: 40px;
          text-align: center;
        }

        .dino-coming-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #0a0a0a;
          color: #fff;
        }

        .dino-coming-content h2 {
          margin: 0;
          font-size: 32px;
          letter-spacing: -.06em;
        }

        .dino-coming-content p {
          margin: 10px auto 0;
          max-width: 420px;
          color: #777;
          font-size: 10px;
          line-height: 1.5;
        }

        @media (max-width: 1080px) {
          .dino-theme-grid {
            height: auto;
            grid-template-columns: repeat(2, minmax(0,1fr));
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
            flex-wrap: wrap;
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
            grid-template-columns: 1fr;
          }

          .dino-reading-workspace,
          .dino-writing-workspace {
            grid-template-columns: 1fr;
          }

          .dino-generator-fields {
            grid-template-columns: 1fr;
          }

          .dino-field-full {
            grid-column: auto;
          }

          .dino-prompt-empty {
            min-height: 280px;
          }
        }
      `}</style>

      <AnimatedBackground className="dino-dashboard">
        <div className="dino-dashboard-shell">
          <header className="dino-dashboard-header">
            <div>
              <span className="dino-kicker">
                Dino / {language}
              </span>

              <h1 className="dino-dashboard-heading">
                Your language{' '}
                <span>
                  workspace.
                </span>
              </h1>
            </div>

            <div className="dino-header-actions">
              <span className="dino-user-email">
                {user.email}
              </span>

              <div
                className={`dino-points-badge ${
                  dinoPointsLoading
                    ? 'loading'
                    : ''
                }`}
                title={
                  dinoPointsError ||
                  'You receive 10 DinoPoints every 24 hours.'
                }
              >
                <span className="dino-points-icon">
                  D
                </span>

                <span className="dino-points-copy">
                  <small>
                    DinoPoints
                  </small>

                  <strong>
                    {dinoPointsLoading
                      ? '...'
                      : dinoPoints}
                  </strong>
                </span>
              </div>

              <button
                type="button"
                className="dino-logout-button"
                onClick={
                  handleLogout
                }
              >
                Log out
              </button>

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
                      width: `${courseProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {dinoPointsError && (
              <div className="dino-points-error">
                {dinoPointsError}
              </div>
            )}
          </header>

          <nav className="dino-tabs">
            <button
              className={
                activeTab ===
                'course'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab(
                  'course',
                )
              }
            >
              Course Outline
            </button>

            <button
              className={
                activeTab ===
                'reading'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab(
                  'reading',
                )
              }
            >
              Reading
            </button>

            <button
              className={
                activeTab ===
                'writing'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab(
                  'writing',
                )
              }
            >
              Writing
            </button>

            <button
              className={
                activeTab ===
                'coming'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() =>
                setActiveTab(
                  'coming',
                )
              }
            >
              Grammar and Sentence Structures
            </button>
          </nav>

          <main className="dino-content">
            {activeTab ===
              'course' && (
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
                      Your five IB themes and recommended topic areas in English and {language}.
                    </p>
                  </div>

                  <div className="dino-subtle-note">
                    This checklist is saved across your devices.
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
                              theme.topics
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
                                      {local}
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

            {activeTab ===
              'reading' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Reading practice
                    </span>

                    <h2 className="dino-panel-title">
                      Read. Think. <span>Answer.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Generate marked IB-style reading questions and use Dino as a tutor while you work.
                    </p>
                  </div>

                  <div className="dino-subtle-note">
                    Each generated reading set costs {DINOPOINT_READING_COST} DinoPoints.
                  </div>
                </div>

                <div className="dino-reading-workspace">
                  <div className="dino-reading-card dino-reading-controls">
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
                              event
                                .target
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

                      <div className="dino-field dino-field-full">
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
                          {
                            language
                          }
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
                                      {english} / {local}
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
                        isGeneratingQuestions ||
                        dinoPointsLoading ||
                        dinoPoints <
                          DINOPOINT_READING_COST
                      }
                      onClick={
                        generateReadingQuestions
                      }
                    >
                      {isGeneratingQuestions
                        ? 'Generating...'
                        : `Generate questions · ${DINOPOINT_READING_COST} DinoPoints →`}
                    </button>

                    {dinoPoints <
                      DINOPOINT_READING_COST &&
                      !dinoPointsLoading &&
                      !isGeneratingQuestions && (
                        <div className="dino-error">
                          You need at least {DINOPOINT_READING_COST} DinoPoints to generate a reading set.
                        </div>
                      )}

                    {isGeneratingQuestions && (
                      <div className="dino-generating">
                        Dino is building the reading set...
                      </div>
                    )}

                    {questionError && (
                      <div className="dino-error">
                        {questionError}
                      </div>
                    )}
                  </div>

                  <div className="dino-reading-card dino-reading-results">
                    {!generatedQuestions ? (
                      <div className="dino-prompt-empty">
                        <div className="dino-prompt-icon">
                          ✦
                        </div>

                        <h3>
                          Your reading set will appear here.
                        </h3>

                        <p>
                          Choose the format, difficulty, and IB course topic, then let Dino build two original questions with marks and answer guidance.
                        </p>
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
                                  question
                                    .id
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
                                      {
                                        question.id
                                      }
                                    </span>

                                    <span className="dino-question-marks">
                                      {
                                        question.marks
                                      } marks
                                    </span>
                                  </div>

                                  {question.context && (
                                    <div className="dino-question-context">
                                      {renderMarkdown(
                                        question.context,
                                      )}
                                    </div>
                                  )}

                                  <div className="dino-question-copy">
                                    {renderMarkdown(
                                      question.question,
                                    )}
                                  </div>

                                  <div className="dino-answer-label">
                                    <strong>
                                      Your answer
                                    </strong>

                                    <span>
                                      {question.marks} marks
                                    </span>
                                  </div>

                                  <textarea
                                    className="dino-answer-textarea"
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
                                    placeholder="Write your answer here..."
                                  />

                                  <div className="dino-answer-actions">
                                    <button
                                      type="button"
                                      className="dino-mark-button"
                                      disabled={
                                        !String(
                                          answerSubmission[
                                            question.id
                                          ] || '',
                                        ).trim() ||
                                        gradingQuestion ===
                                          question.id
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
                                        : 'Mark'}
                                    </button>
                                  </div>

                                  {grade && (
                                    <div className="dino-grade">
                                      <div className="dino-grade-score">
                                        {grade.score}/{grade.maxMarks}
                                      </div>

                                      <div className="dino-grade-feedback">
                                        <strong>
                                          Feedback
                                        </strong>

                                        <div style={{ marginTop: '5px' }}>
                                          {renderMarkdown(
                                            grade.feedback,
                                          )}
                                        </div>

                                        <div style={{ marginTop: '8px' }}>
                                          <strong>
                                            Next step
                                          </strong>
                                        </div>

                                        <div style={{ marginTop: '4px' }}>
                                          {grade.nextStep}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </article>
                              )
                            },
                          )}
                        </div>

                        <div className="dino-reading-summary">
                          <div>
                            <span>
                              Current score
                            </span>

                            <strong>
                              {readingEarnedMarks}/
                              {readingTotalMarks}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Generation
                            </span>

                            <strong>
                              {DINOPOINT_READING_COST}
                            </strong>
                            <span>
                              DinoPoints
                            </span>
                          </div>
                        </div>

                        <div className="dino-chat" style={{ marginTop: '18px', minHeight: '280px' }}>
                          <div className="dino-chat-title">
                            <strong>
                              Dino Tutor
                            </strong>

                            <span
                              style={{
                                color: '#888',
                                fontSize: '8px',
                              }}
                            >
                              Hints, strategy, vocabulary
                            </span>
                          </div>

                          <div className="dino-chat-messages">
                            {chatMessages.map(
                              (
                                message,
                                index,
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  className={`dino-chat-message ${message.role}`}
                                >
                                  {renderMarkdown(
                                    message.text,
                                  )}
                                </div>
                              ),
                            )}

                            {chatTyping && (
                              <div className="dino-chat-message tutor">
                                Dino is thinking...
                              </div>
                            )}
                          </div>

                          <div className="dino-chat-compose">
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
                              placeholder="Ask Dino for a hint..."
                              rows={2}
                            />

                            <button
                              type="button"
                              className="dino-chat-send"
                              disabled={
                                chatTyping ||
                                !chatInput.trim()
                              }
                              onClick={
                                sendReadingChat
                              }
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab ===
              'writing' && (
              <section className="dino-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Writing practice
                    </span>

                    <h2 className="dino-panel-title">
                      Write with <span>purpose.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Generate an original IB-style writing task and get detailed marking feedback.
                    </p>
                  </div>

                  <div className="dino-subtle-note">
                    Each generated writing task costs {DINOPOINT_WRITING_COST} DinoPoints.
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
                                  {english} / {local}
                                </option>
                              ),
                            )}
                          </optgroup>
                        ),
                      )}
                    </select>

                    <label className="dino-field-label" style={{ marginTop: '14px' }}>
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
                            {type}
                          </option>
                        ),
                      )}
                    </select>

                    <label className="dino-field-label" style={{ marginTop: '14px' }}>
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
                          event
                            .target
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
                        writingGenerating ||
                        dinoPointsLoading ||
                        dinoPoints <
                          DINOPOINT_WRITING_COST
                      }
                      onClick={
                        createPrompt
                      }
                    >
                      {writingGenerating
                        ? 'Generating...'
                        : `Generate prompt · ${DINOPOINT_WRITING_COST} DinoPoints →`}
                    </button>

                    {dinoPoints <
                      DINOPOINT_WRITING_COST &&
                      !dinoPointsLoading &&
                      !writingGenerating && (
                        <div className="dino-error">
                          You need at least {DINOPOINT_WRITING_COST} DinoPoints to generate a writing task.
                        </div>
                      )}

                    {writingGenerating && (
                      <div className="dino-generating">
                        Dino is building your task...
                      </div>
                    )}

                    {questionError &&
                      !writingTask && (
                        <div className="dino-error">
                          {questionError}
                        </div>
                      )}
                  </div>

                  <div className="dino-writing-card dino-writing-editor">
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
                              {
                                writingTask.marks
                              } marks
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
                            Criteria
                          </div>

                          <ol className="dino-criteria">
                            {writingTask.criteria.map(
                              (
                                criterion,
                                index,
                              ) => (
                                <li
                                  key={
                                    index
                                  }
                                >
                                  {
                                    criterion
                                  }
                                </li>
                              ),
                            )}
                          </ol>
                        </div>

                        <div className="dino-writing-answer-label">
                          <strong>
                            Your response
                          </strong>

                          <span>
                            {
                              writingTask.marks
                            } marks available
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
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Write your response here..."
                        />

                        <button
                          type="button"
                          className="dino-mark-button"
                          style={{
                            width:
                              '100%',
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
                                }/
                                {
                                  writingTask.marks
                                }
                              </strong>
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

                              <p>
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
                                writingGenerating ||
                                dinoPointsLoading ||
                                dinoPoints <
                                  DINOPOINT_WRITING_COST
                              }
                            >
                              Generate another task · {DINOPOINT_WRITING_COST} DinoPoints
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab ===
              'coming' && (
              <section className="dino-panel">
                <div className="dino-coming-page">
                  <div className="dino-coming-content">
                    <div className="dino-coming-icon">
                      ✦
                    </div>

                    <h2>
                      Coming Soon...
                    </h2>

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