import { useEffect, useMemo, useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'

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

function getCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))

  return match
    ? decodeURIComponent(match.split('=').slice(1).join('='))
    : ''
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('course')

  const [language, setLanguage] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])

  const [writingTopic, setWritingTopic] = useState('')
  const [writingType, setWritingType] = useState('Article')
  const [generatedPrompt, setGeneratedPrompt] = useState('')

  const [chatInput, setChatInput] = useState('')

  const [chatMessages, setChatMessages] = useState([
    {
      role: 'tutor',
      text: 'Hi! I’m your Dino tutor. When your tutor adds reading questions, I’ll help you work through them.',
    },
  ])

  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    document.body.dataset.page = 'dashboard'

    return () => {
      delete document.body.dataset.page
    }
  }, [])

  useEffect(() => {
    const savedLanguage = getCookie('dino_language')

    setLanguage(savedLanguage || 'English B')

    try {
      const savedTopics = localStorage.getItem(
        'dino_completed_topics',
      )

      if (savedTopics) {
        const parsed = JSON.parse(savedTopics)

        if (Array.isArray(parsed)) {
          setSelectedTopics(parsed)
        }
      }
    } catch {
      setSelectedTopics([])
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'reading') {
      return
    }

    const interval = setInterval(() => {
      setIsTyping((value) => !value)
    }, 1500)

    return () => clearInterval(interval)
  }, [activeTab])

  const course = useMemo(() => {
    return COURSE[language] || COURSE['English B']
  }, [language])

  const allTopics = useMemo(() => {
    return course.themes.flatMap((theme) =>
      theme.topics.map((topic) => ({
        theme: theme.en,
        topic: topic[0],
        local: topic[1],
      })),
    )
  }, [course])

  const completedCount = selectedTopics.length
  const totalCount = allTopics.length

  const progress =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0

  const toggleTopic = (themeName, topicEnglish) => {
    const id = `${themeName}::${topicEnglish}`

    setSelectedTopics((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]

      localStorage.setItem(
        'dino_completed_topics',
        JSON.stringify(next),
      )

      return next
    })
  }

  const isCompleted = (themeName, topicEnglish) => {
    return selectedTopics.includes(
      `${themeName}::${topicEnglish}`,
    )
  }

  const sendMessage = () => {
    const text = chatInput.trim()

    if (!text) {
      return
    }

    setChatMessages((current) => [
      ...current,
      {
        role: 'user',
        text,
      },
    ])

    setChatInput('')

    setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        {
          role: 'tutor',
          text:
            'This is a placeholder tutor response. Connect your AI backend here later.',
        },
      ])
    }, 600)
  }

  const handleChatKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendMessage()
    }
  }

  const createPrompt = () => {
    if (!writingTopic) {
      return
    }

    const selected = allTopics.find(
      (item) => item.topic === writingTopic,
    )

    if (!selected) {
      return
    }

    const prompt = `Write a ${writingType.toLowerCase()} about ${selected.topic.toLowerCase()} (${selected.local}) within the theme "${selected.theme}". Develop a clear perspective, support your ideas with relevant examples, and use language appropriate for an IB Language B audience.`

    setGeneratedPrompt(prompt)
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

        /* COURSE */

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

        /* READING */

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

        .dino-question-card {
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

        .dino-question-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .dino-question-empty-inner {
          max-width: 330px;
        }

        .dino-question-icon {
          width: 46px;
          height: 46px;
          margin: 0 auto 15px;
          border: 1px solid rgba(0,0,0,.09);
          border-radius: 14px;
          background: rgba(255,255,255,.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #858585;
          font-size: 18px;
          box-shadow: 0 8px 20px rgba(0,0,0,.035);
        }

        .dino-question-empty h3 {
          margin: 0;
          font-size: 18px;
          line-height: 1.05;
          font-weight: 600;
          letter-spacing: -.05em;
        }

        .dino-question-empty p {
          margin: 9px auto 0;
          color: #858585;
          font-size: 10px;
          line-height: 1.5;
        }

        .dino-question-footer {
          min-height: 65px;
          padding: 11px 15px;
          border-top: 1px solid rgba(0,0,0,.06);
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dino-question-footer-skeleton {
          flex: 1;
          height: 32px;
          border-radius: 10px;
          background: rgba(0,0,0,.035);
        }

        .dino-question-footer-button {
          width: 75px;
          height: 32px;
          border-radius: 10px;
          background: rgba(0,0,0,.045);
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
          max-width: 84%;
          padding: 9px 10px;
          border-radius: 12px;
          font-size: 9px;
          line-height: 1.45;
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

        .dino-field-label {
          margin-bottom: 6px;
          color: #808080;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .dino-select {
          width: 100%;
          min-height: 42px;
          margin-bottom: 17px;
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
          min-height: 42px;
          margin-top: auto;
          border: 0;
          border-radius: 11px;
          background: #0a0a0a;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .dino-generate:disabled {
          opacity: .25;
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
          font-size: clamp(48px, 7vw, 82px);
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
            min-height: 480px;
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

          {/* HEADER */}

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
                  {completedCount}/{totalCount}
                </strong>
              </div>

              <div className="dino-progress-track">
                <div
                  className="dino-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </header>

          {/* TABS */}

          <nav className="dino-tabs">
            <button
              type="button"
              className={
                activeTab === 'course'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() => setActiveTab('course')}
            >
              Course Outline
            </button>

            <button
              type="button"
              className={
                activeTab === 'reading'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() => setActiveTab('reading')}
            >
              Reading Questionbank
            </button>

            <button
              type="button"
              className={
                activeTab === 'writing'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() => setActiveTab('writing')}
            >
              Writing Practice
            </button>

            <button
              type="button"
              className={
                activeTab === 'coming'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() => setActiveTab('coming')}
            >
              Grammar and Sentence Structures
            </button>

            <button
              type="button"
              className={
                activeTab === 'vocab'
                  ? 'dino-tab active'
                  : 'dino-tab'
              }
              onClick={() => setActiveTab('vocab')}
            >
              Personal Vocab and Settings
            </button>
          </nav>

          <main className="dino-content">

            {/* COURSE OUTLINE */}

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
                    Tick a topic after you've finished it.
                  </div>
                </div>

                <div className="dino-theme-grid">
                  {course.themes.map((theme, index) => (
                    <article
                      className="dino-theme"
                      key={theme.en}
                    >
                      <div className="dino-theme-top">
                        <span className="dino-theme-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="dino-theme-count">
                          {
                            theme.topics.filter((topic) =>
                              isCompleted(
                                theme.en,
                                topic[0],
                              ),
                            ).length
                          }
                          /{theme.topics.length}
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
                          ([english, local]) => {
                            const complete =
                              isCompleted(
                                theme.en,
                                english,
                              )

                            return (
                              <label
                                key={english}
                                className={
                                  complete
                                    ? 'dino-topic completed'
                                    : 'dino-topic'
                                }
                                title="Mark this topic complete"
                              >
                                <input
                                  type="checkbox"
                                  checked={complete}
                                  onChange={() =>
                                    toggleTopic(
                                      theme.en,
                                      english,
                                    )
                                  }
                                />

                                <span className="dino-check">
                                  {complete ? '✓' : ''}
                                </span>

                                <span className="dino-topic-copy">
                                  <strong>
                                    {english}
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
                  ))}
                </div>
              </section>
            )}

            {/* READING */}

            {activeTab === 'reading' && (
              <section className="dino-panel dino-reading-panel">
                <div className="dino-panel-heading">
                  <div>
                    <span className="dino-kicker">
                      Reading
                    </span>

                    <h2 className="dino-panel-title">
                      Reading
                      <span> questionbank.</span>
                    </h2>

                    <p className="dino-panel-description">
                      Your tutor adds reading questions on the
                      left. Your tutor stays beside you on the
                      right.
                    </p>
                  </div>
                </div>

                <div className="dino-reading-workspace">

                  <div className="dino-reading-card dino-question-card">
                    <div className="dino-card-topbar">
                      <span className="dino-card-label">
                        Questionbank
                      </span>

                      <span className="dino-card-status">
                        Waiting for tutor
                      </span>
                    </div>

                    <div className="dino-question-empty">
                      <div className="dino-question-empty-inner">
                        <div className="dino-question-icon">
                          ?
                        </div>

                        <h3>
                          Questions will show up here
                        </h3>

                        <p>
                          When your tutor adds reading
                          questions, your questionbank will
                          appear here ready to work through.
                        </p>
                      </div>
                    </div>

                    <div className="dino-question-footer">
                      <div className="dino-question-footer-skeleton" />
                      <div className="dino-question-footer-button" />
                    </div>
                  </div>

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
                        Online
                      </div>
                    </div>

                    <div className="dino-chat-area">
                      {chatMessages.map(
                        (message, index) => (
                          <div
                            key={index}
                            className={
                              message.role === 'user'
                                ? 'dino-chat-message user'
                                : 'dino-chat-message tutor'
                            }
                          >
                            {message.text}
                          </div>
                        ),
                      )}

                      {isTyping && (
                        <div className="dino-typing">
                          <span className="dino-typing-dot" />
                          <span className="dino-typing-dot" />
                          <span className="dino-typing-dot" />
                        </div>
                      )}
                    </div>

                    <div className="dino-chat-bottom">
                      <input
                        className="dino-chat-input"
                        value={chatInput}
                        onChange={(event) =>
                          setChatInput(event.target.value)
                        }
                        onKeyDown={handleChatKeyDown}
                        placeholder="Ask your tutor..."
                      />

                      <button
                        type="button"
                        className="dino-chat-send"
                        onClick={sendMessage}
                      >
                        ↑
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* WRITING */}

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
                      value={writingTopic}
                      onChange={(event) =>
                        setWritingTopic(
                          event.target.value,
                        )
                      }
                    >
                      <option value="">
                        Select a course topic
                      </option>

                      {course.themes.map((theme) => (
                        <optgroup
                          key={theme.en}
                          label={`${theme.en} / ${theme.local}`}
                        >
                          {theme.topics.map(
                            ([english, local]) => (
                              <option
                                value={english}
                                key={english}
                              >
                                {english} / {local}
                              </option>
                            ),
                          )}
                        </optgroup>
                      ))}
                    </select>

                    <label className="dino-field-label">
                      Text type
                    </label>

                    <select
                      className="dino-select"
                      value={writingType}
                      onChange={(event) =>
                        setWritingType(
                          event.target.value,
                        )
                      }
                    >
                      {writingTypes.map((type) => (
                        <option
                          value={type}
                          key={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="dino-generate"
                      disabled={!writingTopic}
                      onClick={createPrompt}
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

            {/* GRAMMAR + SENTENCE STRUCTURES */}

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

            {/* VOCABULARY + SETTINGS */}

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