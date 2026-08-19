// src/pages/oral.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  getCurrentUser,
  getGoldMembership,
} from '../api/credentials'

const LANGUAGES = [
  {
    id: 'French B',
    label: 'French B',
    code: 'fr',
    languageName: 'French',
  },
  {
    id: 'Spanish B',
    label: 'Spanish B',
    code: 'es',
    languageName: 'Spanish',
  },
  {
    id: 'Chinese B',
    label: 'Chinese B',
    code: 'zh',
    languageName: 'Chinese',
  },
  {
    id: 'English B',
    label: 'English B',
    code: 'en',
    languageName: 'English',
  },
  {
    id: 'German B',
    label: 'German B',
    code: 'de',
    languageName: 'German',
  },
  {
    id: 'Italian B',
    label: 'Italian B',
    code: 'it',
    languageName: 'Italian',
  },
  {
    id: 'Japanese B',
    label: 'Japanese B',
    code: 'ja',
    languageName: 'Japanese',
  },
]

const THEMES = [
  'Identities',
  'Experiences',
  'Human ingenuity',
  'Social organization',
  'Sharing the planet',
]

const THEME_TOPICS = {
  Identities: [
    'Lifestyles',
    'Health and wellbeing',
    'Beliefs and values',
    'Subcultures',
    'Language and identity',
  ],

  Experiences: [
    'Leisure activities',
    'Holidays and travel',
    'Life stories',
    'Rites of passage',
    'Customs and traditions',
    'Migration',
  ],

  'Human ingenuity': [
    'Entertainment',
    'Artistic expressions',
    'Communication and media',
    'Technology',
    'Scientific innovation',
  ],

  'Social organization': [
    'Social relationships',
    'Community',
    'Social engagement',
    'Education',
    'The world of work',
    'Law and order',
  ],

  'Sharing the planet': [
    'The environment',
    'Human rights',
    'Peace and conflict',
    'Equality',
    'Globalization',
    'Ethics',
    'Urban and rural environment',
  ],
}

const FALLBACK_IMAGE_NAMES = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.jpg',
  '9.jpg',
  '10.jpg',
  '11.jpg',
  '12.jpg',
  '13.jpg',
  '14.jpg',
  '15.jpg',
  '16.jpg',
  '17.jpg',
  '18.jpg',
  '19.jpg',
  '20.jpg',

  '1.png',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png',
  '9.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  '14.png',
  '15.png',
  '16.png',
  '17.png',
  '18.png',
  '19.png',
  '20.png',

  '1.webp',
  '2.webp',
  '3.webp',
  '4.webp',
  '5.webp',
  '6.webp',
  '7.webp',
  '8.webp',
  '9.webp',
  '10.webp',
  '11.webp',
  '12.webp',
  '13.webp',
  '14.webp',
  '15.webp',
  '16.webp',
  '17.webp',
  '18.webp',
  '19.webp',
  '20.webp',

  'image1.jpg',
  'image2.jpg',
  'image3.jpg',
  'image4.jpg',
  'image5.jpg',
  'image6.jpg',
  'image7.jpg',
  'image8.jpg',
  'image9.jpg',
  'image10.jpg',

  'image1.png',
  'image2.png',
  'image3.png',
  'image4.png',
  'image5.png',
  'image6.png',
  'image7.png',
  'image8.png',
  'image9.png',
  'image10.png',

  'image1.webp',
  'image2.webp',
  'image3.webp',
  'image4.webp',
  'image5.webp',
  'image6.webp',
  'image7.webp',
  'image8.webp',
  'image9.webp',
  'image10.webp',

  'io1.jpg',
  'io2.jpg',
  'io3.jpg',
  'io4.jpg',
  'io5.jpg',
  'io6.jpg',
  'io7.jpg',
  'io8.jpg',
  'io9.jpg',
  'io10.jpg',

  'io1.png',
  'io2.png',
  'io3.png',
  'io4.png',
  'io5.png',
  'io6.png',
  'io7.png',
  'io8.png',
  'io9.png',
  'io10.png',

  'visual1.jpg',
  'visual2.jpg',
  'visual3.jpg',
  'visual4.jpg',
  'visual5.jpg',
  'visual6.jpg',
  'visual7.jpg',
  'visual8.jpg',
  'visual9.jpg',
  'visual10.jpg',
]

const STORAGE_PREFIX = 'dino_oral_gold_v2'

const PARTS = {
  presentation: {
    title: 'Part 1',
    subtitle: 'Presentation',
    minutes: 4,
  },

  followUp: {
    title: 'Part 2',
    subtitle: 'Follow-up',
    minutes: 5,
  },

  general: {
    title: 'Part 3',
    subtitle: 'General discussion',
    minutes: 6,
  },
}

function getLanguageInfo(language) {
  return (
    LANGUAGES.find(
      (item) => item.id === language,
    ) ||
    LANGUAGES.find(
      (item) => item.id === 'English B',
    )
  )
}

function formatTime(seconds) {
  const safe = Math.max(
    0,
    Number(seconds) || 0,
  )

  const minutes = Math.floor(
    safe / 60,
  )

  const remainder = safe % 60

  return `${String(minutes).padStart(
    2,
    '0',
  )}:${String(remainder).padStart(
    2,
    '0',
  )}`
}

function shuffle(items) {
  return [...items].sort(
    () => Math.random() - 0.5,
  )
}

function getRecordingMimeType() {
  if (
    typeof MediaRecorder ===
    'undefined'
  ) {
    return ''
  }

  const supported = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ]

  return (
    supported.find((type) =>
      MediaRecorder.isTypeSupported?.(
        type,
      ),
    ) || ''
  )
}

function blobToBase64(blob) {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader()

      reader.onloadend = () => {
        const value = String(
          reader.result || '',
        )

        const comma =
          value.indexOf(',')

        if (comma === -1) {
          reject(
            new Error(
              'Could not encode audio recording.',
            ),
          )

          return
        }

        resolve(
          value.slice(
            comma + 1,
          ),
        )
      }

      reader.onerror = () => {
        reject(
          new Error(
            'Could not read audio recording.',
          ),
        )
      }

      reader.readAsDataURL(blob)
    },
  )
}

async function callDinoAI({
  system,
  user,
  responseFormat,
  temperature = 0.3,
  maxTokens = 1800,
}) {
  const response = await fetch(
    '/api/generate',
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        system,
        user,
        responseFormat,
        temperature,
        maxTokens,
        model:
          'openai/gpt-oss-120b',
      }),
    },
  )

  const responseText =
    await response.text()

  let data = {}

  try {
    data = responseText
      ? JSON.parse(
          responseText,
        )
      : {}
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        responseText ||
        `Dino AI request failed with status ${response.status}.`,
    )
  }

  return data?.content || ''
}

async function transcribeAudio({
  base64,
  mimeType,
  languageCode,
  prompt,
}) {
  const response = await fetch(
    '/api/generate',
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        transcription: true,
        audioBase64: base64,
        mimeType,
        language:
          languageCode,
        prompt,
        model:
          'whisper-large-v3-turbo',
      }),
    },
  )

  const responseText =
    await response.text()

  let data = {}

  try {
    data = responseText
      ? JSON.parse(
          responseText,
        )
      : {}
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        responseText ||
        `Transcription failed with status ${response.status}.`,
    )
  }

  return data?.text || ''
}

function Oral() {
  const [gold, setGold] =
    useState(false)

  const [goldLoading, setGoldLoading] =
    useState(true)

  const [expanded, setExpanded] =
    useState(false)

  const [language, setLanguage] =
    useState(
      () =>
        localStorage.getItem(
          `${STORAGE_PREFIX}_language`,
        ) ||
        'English B',
    )

  const [level, setLevel] =
    useState(
      () =>
        localStorage.getItem(
          `${STORAGE_PREFIX}_level`,
        ) || 'SL',
    )

  const [theme, setTheme] =
    useState('Identities')

  const [topic, setTopic] =
    useState('Lifestyles')

  const [images, setImages] =
    useState([])

  const [imageIndex, setImageIndex] =
    useState(0)

  const [imageBroken, setImageBroken] =
    useState(false)

  const [imageLoading, setImageLoading] =
    useState(true)

  const [
    preparationMinutes,
    setPreparationMinutes,
  ] = useState(15)

  const [
    preparationSeconds,
    setPreparationSeconds,
  ] = useState(15 * 60)

  const [preparing, setPreparing] =
    useState(false)

  const [
    preparationFinished,
    setPreparationFinished,
  ] = useState(false)

  const [preparationSkipped, setPreparationSkipped] =
    useState(false)

  const [notes, setNotes] =
    useState(
      Array.from(
        { length: 10 },
        () => '',
      ),
    )

  const [part, setPart] =
    useState('presentation')

  const [recording, setRecording] =
    useState(false)

  const [
    recordingSeconds,
    setRecordingSeconds,
  ] = useState(0)

  const [
    recordedBlob,
    setRecordedBlob,
  ] = useState(null)

  const [
    recordedAudioUrl,
    setRecordedAudioUrl,
  ] = useState('')

  const [transcribing, setTranscribing] =
    useState(false)

  const [
    answerTranscribing,
    setAnswerTranscribing,
  ] = useState(false)

  const [transcript, setTranscript] =
    useState('')

  const [
    answerTranscript,
    setAnswerTranscript,
  ] = useState('')

  const [
    presentationGrade,
    setPresentationGrade,
  ] = useState(null)

  const [
    conversationGrade,
    setConversationGrade,
  ] = useState(null)

  const [questions, setQuestions] =
    useState([])

  const [questionIndex, setQuestionIndex] =
    useState(0)

  const [
    generalQuestions,
    setGeneralQuestions,
  ] = useState([])

  const [
    generalQuestionIndex,
    setGeneralQuestionIndex,
  ] = useState(0)

  const [messages, setMessages] =
    useState([
      {
        role: 'assistant',
        content:
          'Your examiner is ready. Complete the preparation period, then begin your presentation.',
      },
    ])

  const [processing, setProcessing] =
    useState(false)

  const [aiQuestionLoading, setAiQuestionLoading] =
    useState(false)

  const [overallResult, setOverallResult] =
    useState(false)

  const [error, setError] =
    useState('')

  const [copied, setCopied] =
    useState(false)

  const mediaRecorderRef =
    useRef(null)

  const mediaStreamRef =
    useRef(null)

  const recorderChunksRef =
    useRef([])

  const recordingTimerRef =
    useRef(null)

  const preparationTimerRef =
    useRef(null)

  const oralShellRef =
    useRef(null)

  const previousStylesRef =
    useRef(null)

  const currentLanguage =
    useMemo(
      () =>
        getLanguageInfo(
          language,
        ),
      [language],
    )

  const currentImage =
    images[imageIndex] || ''

  const currentQuestion =
    useMemo(() => {
      if (
        part === 'followUp'
      ) {
        return (
          questions[
            questionIndex
          ] || ''
        )
      }

      if (
        part === 'general'
      ) {
        return (
          generalQuestions[
            generalQuestionIndex
          ] || ''
        )
      }

      return ''
    }, [
      part,
      questions,
      questionIndex,
      generalQuestions,
      generalQuestionIndex,
    ])

  const activePart =
    PARTS[part]

  /*
   * Gold membership
   */

  useEffect(() => {
    let mounted = true

    async function checkGold() {
      try {
        if (
          window.__dinoIsGoldMember ===
          true
        ) {
          if (mounted) {
            setGold(true)
            setGoldLoading(false)
          }

          return
        }

        const user =
          await getCurrentUser()

        if (!user) {
          if (mounted) {
            setGold(false)
            setGoldLoading(false)
          }

          return
        }

        const isGold =
          await getGoldMembership(
            user.id,
          )

        window.__dinoIsGoldMember =
          Boolean(isGold)

        if (mounted) {
          setGold(
            Boolean(isGold),
          )

          setGoldLoading(false)
        }

        window.dispatchEvent(
          new CustomEvent(
            'dino-gold-membership-check',
          ),
        )
      } catch (goldError) {
        console.error(
          'Gold membership check failed:',
          goldError,
        )

        if (mounted) {
          setGold(false)
          setGoldLoading(false)
        }
      }
    }

    checkGold()

    const handleGoldEvent =
      () => {
        if (!mounted) return

        setGold(
          window.__dinoIsGoldMember ===
            true,
        )

        setGoldLoading(false)
      }

    window.addEventListener(
      'dino-gold-membership-check',
      handleGoldEvent,
    )

    return () => {
      mounted = false

      window.removeEventListener(
        'dino-gold-membership-check',
        handleGoldEvent,
      )
    }
  }, [])

  /*
   * Enable real page scrolling for Oral.
   */

  useEffect(() => {
    if (
      typeof document ===
      'undefined'
    ) {
      return undefined
    }

    const html =
      document.documentElement

    const body =
      document.body

    const root =
      document.getElementById(
        'root',
      )

    const app =
      document.querySelector(
        '.app',
      )

    const pageContainer =
      document.querySelector(
        '.page-container',
      )

    const animatedPage =
      document.querySelector(
        '.animated-page',
      )

    const dashboardPage =
      document.querySelector(
        '.dashboard-page',
      )

    const dashboardWorkspace =
      document.querySelector(
        '.dashboard-workspace',
      )

    const dashboardPanel =
      document.querySelector(
        '.dashboard-panel',
      )

    const dashboardContent =
      document.querySelector(
        '.dashboard-content',
      )

    const elements = [
      html,
      body,
      root,
      app,
      pageContainer,
      animatedPage,
      dashboardPage,
      dashboardWorkspace,
      dashboardPanel,
      dashboardContent,
    ].filter(Boolean)

    previousStylesRef.current =
      elements.map(
        (element) => ({
          element,
          styles: {
            height:
              element.style.height,
            minHeight:
              element.style
                .minHeight,
            maxHeight:
              element.style
                .maxHeight,
            overflow:
              element.style
                .overflow,
            overflowY:
              element.style
                .overflowY,
            overflowX:
              element.style
                .overflowX,
          },
        }),
      )

    html.style.overflowY =
      'auto'

    html.style.overflowX =
      'hidden'

    body.style.height = 'auto'
    body.style.minHeight = '100vh'
    body.style.overflowY =
      'auto'
    body.style.overflowX =
      'hidden'

    for (const element of [
      root,
      app,
      pageContainer,
      animatedPage,
      dashboardPage,
      dashboardWorkspace,
      dashboardPanel,
      dashboardContent,
    ]) {
      if (!element) continue

      element.style.height =
        'auto'

      element.style.minHeight =
        '0'

      element.style.maxHeight =
        'none'

      element.style.overflow =
        'visible'
    }

    if (animatedPage) {
      animatedPage.style.minHeight =
        '100vh'

      animatedPage.style.alignItems =
        'flex-start'
    }

    if (dashboardPage) {
      dashboardPage.style.minHeight =
        '100vh'
    }

    if (dashboardWorkspace) {
      dashboardWorkspace.style.minHeight =
        '100vh'
    }

    if (root) {
      root.style.minHeight =
        '100vh'
    }

    if (app) {
      app.style.minHeight =
        '100vh'
    }

    if (pageContainer) {
      pageContainer.style.minHeight =
        '100vh'
    }

    return () => {
      if (
        !previousStylesRef.current
      ) {
        return
      }

      previousStylesRef.current.forEach(
        ({
          element,
          styles,
        }) => {
          element.style.height =
            styles.height

          element.style.minHeight =
            styles.minHeight

          element.style.maxHeight =
            styles.maxHeight

          element.style.overflow =
            styles.overflow

          element.style.overflowY =
            styles.overflowY

          element.style.overflowX =
            styles.overflowX
        },
      )

      previousStylesRef.current =
        null
    }
  }, [])

  /*
   * Expand workspace.
   */

  const toggleExpanded =
    async () => {
      const element =
        oralShellRef.current

      if (!element) {
        return
      }

      try {
        if (
          document.fullscreenElement
        ) {
          await document.exitFullscreen?.()
          setExpanded(false)
          return
        }

        if (
          element.requestFullscreen
        ) {
          await element.requestFullscreen()
          setExpanded(true)
          return
        }
      } catch (fullscreenError) {
        console.error(
          'Fullscreen failed:',
          fullscreenError,
        )
      }

      setExpanded(
        (current) => !current,
      )
    }

  useEffect(() => {
    const handleFullscreen =
      () => {
        setExpanded(
          document.fullscreenElement ===
            oralShellRef.current,
        )
      }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreen,
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreen,
      )
    }
  }, [])

  /*
   * Images.
   */

  useEffect(() => {
    let alive = true

    async function discoverImages() {
      setImageLoading(true)

      let discovered = []

      const manifests = [
        '/assets/io_images/manifest.json',
        '/assets/io_images/images.json',
      ]

      for (
        const manifest of manifests
      ) {
        try {
          const response =
            await fetch(
              manifest,
              {
                cache: 'no-store',
              },
            )

          if (!response.ok) {
            continue
          }

          const data =
            await response.json()

          if (
            Array.isArray(data)
          ) {
            discovered = data
          } else if (
            Array.isArray(
              data?.images,
            )
          ) {
            discovered =
              data.images
          }

          if (
            discovered.length
          ) {
            break
          }
        } catch {
          // Continue.
        }
      }

      if (
        !discovered.length
      ) {
        discovered =
          FALLBACK_IMAGE_NAMES
      }

      const normalised =
        discovered
          .map((entry) => {
            const raw =
              typeof entry ===
              'string'
                ? entry
                : entry?.src ||
                  entry?.path ||
                  entry?.file

            if (!raw) {
              return ''
            }

            return raw.startsWith(
              '/',
            )
              ? raw
              : `/assets/io_images/${raw}`
          })
          .filter(Boolean)

      const unique =
        [
          ...new Set(
            normalised,
          ),
        ]

      if (!alive) {
        return
      }

      setImages(unique)

      if (unique.length) {
        setImageIndex(
          Math.floor(
            Math.random() *
              unique.length,
          ),
        )
      }

      setImageBroken(false)
      setImageLoading(false)
    }

    discoverImages()

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    setImageBroken(false)
  }, [currentImage])

  useEffect(() => {
    localStorage.setItem(
      `${STORAGE_PREFIX}_language`,
      language,
    )
  }, [language])

  useEffect(() => {
    localStorage.setItem(
      `${STORAGE_PREFIX}_level`,
      level,
    )
  }, [level])

  /*
   * Cleanup.
   */

  useEffect(() => {
    return () => {
      if (
        preparationTimerRef.current
      ) {
        clearInterval(
          preparationTimerRef.current,
        )
      }

      if (
        recordingTimerRef.current
      ) {
        clearInterval(
          recordingTimerRef.current,
        )
      }

      mediaStreamRef.current
        ?.getTracks()
        ?.forEach(
          (track) =>
            track.stop(),
        )

      if (
        recordedAudioUrl
      ) {
        URL.revokeObjectURL(
          recordedAudioUrl,
        )
      }
    }
  }, [recordedAudioUrl])

  /*
   * Keep topic valid.
   */

  useEffect(() => {
    const topics =
      THEME_TOPICS[theme] ||
      []

    if (
      !topics.includes(topic)
    ) {
      setTopic(
        topics[0] ||
          'Lifestyles',
      )
    }
  }, [theme, topic])

  /*
   * Preparation timer.
   */

  useEffect(() => {
    if (
      !preparing ||
      preparationFinished
    ) {
      return undefined
    }

    preparationTimerRef.current =
      setInterval(() => {
        setPreparationSeconds(
          (current) => {
            if (current <= 1) {
              clearInterval(
                preparationTimerRef.current,
              )

              preparationTimerRef.current =
                null

              setPreparing(false)
              setPreparationFinished(
                true,
              )

              setPreparationSkipped(
                false,
              )

              return 0
            }

            return current - 1
          },
        )
      }, 1000)

    return () => {
      if (
        preparationTimerRef.current
      ) {
        clearInterval(
          preparationTimerRef.current,
        )

        preparationTimerRef.current =
          null
      }
    }
  }, [
    preparing,
    preparationFinished,
  ])

  /*
   * Preparation controls.
   */

  const resetPreparation =
    useCallback(() => {
      if (
        preparationTimerRef.current
      ) {
        clearInterval(
          preparationTimerRef.current,
        )

        preparationTimerRef.current =
          null
      }

      const minutes =
        level === 'HL'
          ? 20
          : 15

      setPreparationMinutes(
        minutes,
      )

      setPreparationSeconds(
        minutes * 60,
      )

      setPreparing(false)

      setPreparationFinished(
        false,
      )

      setPreparationSkipped(
        false,
      )
    }, [level])

  const startPreparation =
    () => {
      setError('')
      setPreparationSkipped(
        false,
      )
      setPreparationFinished(
        false,
      )

      setPreparationSeconds(
        preparationMinutes * 60,
      )

      setPreparing(true)
    }

  const skipPreparation =
    () => {
      if (
        preparationTimerRef.current
      ) {
        clearInterval(
          preparationTimerRef.current,
        )

        preparationTimerRef.current =
          null
      }

      setPreparing(false)
      setPreparationSeconds(0)
      setPreparationFinished(
        true,
      )

      setPreparationSkipped(
        true,
      )

      setPart('presentation')
      setError('')
    }

  /*
   * Recording cleanup.
   */

  const stopMedia =
    useCallback(() => {
      if (
        recordingTimerRef.current
      ) {
        clearInterval(
          recordingTimerRef.current,
        )

        recordingTimerRef.current =
          null
      }

      mediaStreamRef.current
        ?.getTracks()
        ?.forEach(
          (track) =>
            track.stop(),
        )

      mediaStreamRef.current =
        null

      mediaRecorderRef.current =
        null

      setRecording(false)
    }, [])

  /*
   * Recording.
   */

  const startRecording =
    async (
      targetPart = part,
    ) => {
      setError('')

      if (
        typeof navigator ===
          'undefined' ||
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        setError(
          'Your browser does not support microphone recording.',
        )

        return
      }

      if (recording) {
        return
      }

      if (recordedAudioUrl) {
        URL.revokeObjectURL(
          recordedAudioUrl,
        )
      }

      setRecordedAudioUrl('')
      setRecordedBlob(null)
      setTranscript('')

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: {
                echoCancellation:
                  true,
                noiseSuppression:
                  true,
                autoGainControl:
                  true,
              },
            },
          )

        const mimeType =
          getRecordingMimeType()

        const recorder =
          new MediaRecorder(
            stream,
            mimeType
              ? {
                  mimeType,
                }
              : undefined,
          )

        mediaStreamRef.current =
          stream

        mediaRecorderRef.current =
          recorder

        recorderChunksRef.current =
          []

        recorder.ondataavailable =
          (event) => {
            if (
              event.data &&
              event.data.size
            ) {
              recorderChunksRef.current.push(
                event.data,
              )
            }
          }

        recorder.onstop = () => {
          const finalType =
            recorder.mimeType ||
            mimeType ||
            'audio/webm'

          const blob =
            new Blob(
              recorderChunksRef.current,
              {
                type:
                  finalType,
              },
            )

          if (
            recordedAudioUrl
          ) {
            URL.revokeObjectURL(
              recordedAudioUrl,
            )
          }

          setRecordedBlob(blob)

          setRecordedAudioUrl(
            URL.createObjectURL(
              blob,
            ),
          )

          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop(),
            )

          mediaStreamRef.current =
            null

          mediaRecorderRef.current =
            null

          setRecording(false)
        }

        recorder.start(1000)

        setPart(targetPart)
        setRecording(true)
        setRecordingSeconds(0)

        recordingTimerRef.current =
          setInterval(() => {
            setRecordingSeconds(
              (current) => {
                const next =
                  current + 1

                const maxSeconds =
                  targetPart ===
                  'presentation'
                    ? 4 * 60
                    : targetPart ===
                        'followUp'
                      ? 5 * 60
                      : 6 * 60

                if (
                  next >=
                  maxSeconds
                ) {
                  setTimeout(
                    () => {
                      if (
                        mediaRecorderRef.current
                          ?.state ===
                        'recording'
                      ) {
                        mediaRecorderRef.current.stop()
                      }
                    },
                    0,
                  )
                }

                return next
              },
            )
          }, 1000)
      } catch (recordError) {
        console.error(
          'Microphone recording failed:',
          recordError,
        )

        setError(
          'Microphone access was blocked or unavailable. Allow microphone access and try again.',
        )
      }
    }

  const stopRecording =
    () => {
      if (
        recordingTimerRef.current
      ) {
        clearInterval(
          recordingTimerRef.current,
        )

        recordingTimerRef.current =
          null
      }

      if (
        mediaRecorderRef.current
          ?.state ===
        'recording'
      ) {
        mediaRecorderRef.current.stop()
      } else {
        stopMedia()
      }
    }

  /*
   * Transcription.
   */

  const transcribeRecording =
    async (
      blob = recordedBlob,
      targetPart = part,
    ) => {
      if (!blob) {
        setError(
          'Record a response before transcribing it.',
        )

        return ''
      }

      setTranscribing(true)
      setError('')

      try {
        const base64 =
          await blobToBase64(
            blob,
          )

        const prompt = `
IB Language B individual oral practice.

Level: ${level}
Target language: ${currentLanguage.languageName}
Theme: ${theme}
Topic: ${topic}
Part: ${
          PARTS[targetPart]?.subtitle ||
          targetPart
        }

Transcribe the student in the target language.
Do not translate.
Do not invent words.
Preserve the student's actual wording.
`

        const text =
          await transcribeAudio({
            base64,
            mimeType:
              blob.type ||
              'audio/webm',
            languageCode:
              currentLanguage.code,
            prompt,
          })

        setTranscript(text)

        return text
      } catch (transcriptionError) {
        console.error(
          'Groq transcription failed:',
          transcriptionError,
        )

        setError(
          transcriptionError?.message ||
            'Could not transcribe the recording.',
        )

        return ''
      } finally {
        setTranscribing(
          false,
        )
      }
    }

  /*
   * Presentation grading.
   */

  const gradePresentation =
    async (
      presentationText,
    ) => {
      if (
        !presentationText?.trim()
      ) {
        return null
      }

      const schema = {
        type: 'json_schema',
        json_schema: {
          name:
            'ib_oral_presentation_feedback',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              language: {
                type: 'number',
                minimum: 0,
                maximum: 12,
              },

              message: {
                type: 'number',
                minimum: 0,
                maximum: 6,
              },

              feedback: {
                type: 'string',
              },

              strengths: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              improvements: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },

            required: [
              'language',
              'message',
              'feedback',
              'strengths',
              'improvements',
            ],

            additionalProperties: false,
          },
        },
      }

      try {
        const content =
          await callDinoAI({
            system: `
You are an expert IB Language B individual oral examiner.

Student language:
${currentLanguage.languageName}

Level:
${level}

Evaluate Part 1 of an IB Language B individual oral.

Criterion A Language:
0-12

Criterion B1 Message - Presentation:
0-6

For SL:
Evaluate engagement with the visual stimulus,
the theme, implications and target culture.

For HL:
Evaluate engagement with the literary extract,
events, ideas and messages.

Judge the transcript conservatively.
Do not invent pronunciation errors that cannot
be established from text.
Give practical formative feedback.
            `,

            user: `
Theme:
${theme}

Topic:
${topic}

Stimulus:
${currentImage}

Student transcript:
${presentationText}

Preparation notes:
${notes
  .filter(
    (item) =>
      item.trim(),
  )
  .join('\n')}

Grade this practice performance.
            `,

            responseFormat:
              schema,

            temperature:
              0.2,

            maxTokens:
              1400,
          })

        const parsed =
          JSON.parse(content)

        setPresentationGrade(
          parsed,
        )

        return parsed
      } catch (gradeError) {
        console.error(
          'Presentation grading failed:',
          gradeError,
        )

        return null
      }
    }

  /*
   * Follow-up questions.
   */

  const generateFollowUpQuestions =
    async (
      presentationText,
    ) => {
      setAiQuestionLoading(
        true,
      )

      try {
        const schema = {
          type: 'json_schema',
          json_schema: {
            name:
              'ib_oral_followup_questions',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  minItems: 5,
                  maxItems: 8,
                  items: {
                    type: 'string',
                  },
                },
              },

              required: [
                'questions',
              ],

              additionalProperties: false,
            },
          },
        }

        const content =
          await callDinoAI({
            system: `
You are an experienced IB Language B examiner.

Create realistic Part 2 follow-up questions.

Student language:
${currentLanguage.languageName}

Level:
${level}

Theme:
${theme}

Topic:
${topic}

Questions must:
- be entirely in the target language
- develop from the student's presentation
- explore perspectives, implications and cultural context
- become progressively more probing
- avoid grammar-test questions
- avoid yes/no questions

For SL, remain connected to the visual stimulus,
the theme and target culture.

For HL, remain connected to the literary extract,
its events, ideas and messages.
            `,

            user: `
Student presentation:

${presentationText}

Generate the follow-up questions.
            `,

            responseFormat:
              schema,

            temperature:
              0.45,

            maxTokens:
              1200,
          })

        const parsed =
          JSON.parse(content)

        const nextQuestions =
          Array.isArray(
            parsed?.questions,
          )
            ? parsed.questions
            : []

        setQuestions(
          nextQuestions,
        )

        setQuestionIndex(0)

        return nextQuestions
      } catch (questionError) {
        console.error(
          'Follow-up generation failed:',
          questionError,
        )

        const fallback = [
          `Why is this issue important in today's world?`,
          `What are the advantages and disadvantages of this situation?`,
          `How can this issue affect young people?`,
          `How could this situation be different in another culture?`,
          `What changes could improve this situation?`,
        ]

        setQuestions(
          fallback,
        )

        setQuestionIndex(0)

        return fallback
      } finally {
        setAiQuestionLoading(
          false,
        )
      }
    }

  /*
   * General discussion.
   */

  const generateGeneralQuestions =
    async () => {
      setAiQuestionLoading(
        true,
      )

      try {
        const availableThemes =
          shuffle(
            THEMES.filter(
              (item) =>
                item !== theme,
            ),
          )

        const selectedTheme =
          availableThemes[0] ||
          'Experiences'

        const schema = {
          type: 'json_schema',
          json_schema: {
            name:
              'ib_oral_general_questions',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  minItems: 5,
                  maxItems: 7,
                  items: {
                    type: 'string',
                  },
                },
              },

              required: [
                'questions',
              ],

              additionalProperties: false,
            },
          },
        }

        const content =
          await callDinoAI({
            system: `
You are an IB Language B examiner.

Create Part 3 general discussion questions.

Target language:
${currentLanguage.languageName}

Level:
${level}

Theme already used:
${theme}

New theme:
${selectedTheme}

Topic areas:
${(
  THEME_TOPICS[
    selectedTheme
  ] || []
).join(', ')}

Write only target-language questions.

Questions should:
- be open-ended
- encourage explanation and evaluation
- encourage cultural comparison
- fit IB Language B
- avoid grammar exercises
- avoid trivial factual questions
            `,

            user:
              'Generate the Part 3 questions now.',

            responseFormat:
              schema,

            temperature:
              0.45,

            maxTokens:
              1200,
          })

        const parsed =
          JSON.parse(content)

        return Array.isArray(
          parsed?.questions,
        )
          ? parsed.questions
          : []
      } catch (generalError) {
        console.error(
          'General discussion generation failed:',
          generalError,
        )

        return [
          `What role can young people play in this issue?`,
          `Why is this issue important for society?`,
          `How is this situation different in your country?`,
          `What are the advantages and disadvantages of this situation?`,
          `How might this situation change in the future?`,
        ]
      } finally {
        setAiQuestionLoading(
          false,
        )
      }
    }

  /*
   * Conversation grading.
   */

  const gradeConversation =
    async ({
      followUpTranscript,
      generalTranscript,
    }) => {
      const schema = {
        type: 'json_schema',
        json_schema: {
          name:
            'ib_oral_conversation_feedback',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              messageConversation: {
                type: 'number',
                minimum: 0,
                maximum: 6,
              },

              interactiveSkills: {
                type: 'number',
                minimum: 0,
                maximum: 6,
              },

              feedback: {
                type: 'string',
              },

              strengths: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              improvements: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },

            required: [
              'messageConversation',
              'interactiveSkills',
              'feedback',
              'strengths',
              'improvements',
            ],

            additionalProperties: false,
          },
        },
      }

      try {
        const content =
          await callDinoAI({
            system: `
You are grading an IB Language B individual oral practice conversation.

Target language:
${currentLanguage.languageName}

Level:
${level}

Criterion B2 Message - Conversation:
0-6

Criterion C Interactive Skills - Communication:
0-6

Evaluate:
- relevance
- depth
- development of ideas
- ability to sustain interaction
- independent contributions
- response to examiner questions
- effectiveness of communication

Do not invent pronunciation errors from a transcript.
            `,

            user: `
Follow-up discussion:

${followUpTranscript}

General discussion:

${generalTranscript}

Give formative feedback.
            `,

            responseFormat:
              schema,

            temperature:
              0.2,

            maxTokens:
              1400,
          })

        const parsed =
          JSON.parse(content)

        setConversationGrade(
          parsed,
        )

        return parsed
      } catch (conversationError) {
        console.error(
          'Conversation grading failed:',
          conversationError,
        )

        return null
      }
    }

  /*
   * Submit presentation.
   */

  const submitPresentation =
    async () => {
      if (!recordedBlob) {
        setError(
          'Record your presentation first.',
        )

        return
      }

      setProcessing(true)
      setError('')

      try {
        const text =
          await transcribeRecording(
            recordedBlob,
            'presentation',
          )

        if (!text) {
          return
        }

        await gradePresentation(
          text,
        )

        const generatedQuestions =
          await generateFollowUpQuestions(
            text,
          )

        const firstQuestion =
          generatedQuestions[0] ||
          'Why is this issue important in your target culture?'

        setMessages([
          {
            role: 'assistant',
            content:
              'Your presentation is complete. We will now move into the follow-up discussion.',
          },
          {
            role: 'assistant',
            content:
              firstQuestion,
          },
        ])

        setQuestionIndex(0)
        setPart('followUp')
        setRecordedBlob(null)
        setRecordedAudioUrl('')
        setTranscript('')
      } finally {
        setProcessing(false)
      }
    }

  /*
   * Submit conversation.
   */

  const submitConversation =
    async () => {
      if (
        !recordedBlob &&
        !answerTranscript.trim()
      ) {
        setError(
          'Record your answer before submitting it.',
        )

        return
      }

      setAnswerTranscribing(
        true,
      )

      setError('')

      try {
        let answer =
          answerTranscript.trim()

        if (recordedBlob) {
          answer =
            (await transcribeRecording(
              recordedBlob,
              part,
            )) || answer
        }

        if (!answer) {
          setError(
            'No spoken response was detected.',
          )

          return
        }

        setMessages(
          (current) => [
            ...current,
            {
              role: 'user',
              content:
                answer,
            },
          ],
        )

        if (
          part === 'followUp'
        ) {
          const nextIndex =
            questionIndex + 1

          if (
            nextIndex <
            questions.length
          ) {
            const nextQuestion =
              questions[
                nextIndex
              ]

            setQuestionIndex(
              nextIndex,
            )

            setMessages(
              (current) => [
                ...current,
                {
                  role: 'assistant',
                  content:
                    nextQuestion,
                },
              ],
            )

            setRecordedBlob(null)
            setRecordedAudioUrl('')
            setAnswerTranscript(
              '',
            )

            return
          }

          const generated =
            await generateGeneralQuestions()

          const first =
            generated[0] ||
            'Let us move to another IB theme.'

          setGeneralQuestions(
            generated,
          )

          setGeneralQuestionIndex(
            0,
          )

          setPart('general')

          setMessages(
            (current) => [
              ...current,
              {
                role: 'assistant',
                content:
                  'We will now move to the general discussion.',
              },
              {
                role: 'assistant',
                content:
                  first,
              },
            ],
          )

          setRecordedBlob(null)
          setRecordedAudioUrl('')
          setAnswerTranscript(
            '',
          )

          return
        }

        const nextGeneral =
          generalQuestionIndex +
          1

        if (
          nextGeneral <
          generalQuestions.length
        ) {
          const nextQuestion =
            generalQuestions[
              nextGeneral
            ]

          setGeneralQuestionIndex(
            nextGeneral,
          )

          setMessages(
            (current) => [
              ...current,
              {
                role: 'assistant',
                content:
                  nextQuestion,
              },
            ],
          )

          setRecordedBlob(null)
          setRecordedAudioUrl('')
          setAnswerTranscript(
            '',
          )

          return
        }

        const conversationText =
          messages
            .map(
              (message) =>
                `${message.role}: ${message.content}`,
            )
            .join('\n\n')

        setOverallResult(true)

        await gradeConversation({
          followUpTranscript:
            conversationText,
          generalTranscript:
            answer,
        })

        setRecordedBlob(null)
        setRecordedAudioUrl('')
        setAnswerTranscript('')
      } finally {
        setAnswerTranscribing(
          false,
        )
      }
    }

  /*
   * Copy transcript.
   */

  const copyTranscript =
    async () => {
      if (!transcript) {
        return
      }

      try {
        await navigator.clipboard.writeText(
          transcript,
        )

        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 1500)
      } catch {
        setError(
          'Could not copy transcript.',
        )
      }
    }

  /*
   * Reset everything.
   */

  const resetPractice =
    useCallback(() => {
      stopMedia()

      setRecordedBlob(null)
      setTranscript('')
      setAnswerTranscript('')
      setPresentationGrade(null)
      setConversationGrade(null)
      setQuestions([])
      setQuestionIndex(0)
      setGeneralQuestions([])
      setGeneralQuestionIndex(0)

      setMessages([
        {
          role: 'assistant',
          content:
            'Your examiner is ready. Complete the preparation period, then begin your presentation.',
        },
      ])

      setOverallResult(false)
      setError('')
      setCopied(false)
      setPart('presentation')

      resetPreparation()
    }, [
      resetPreparation,
      stopMedia,
    ])

  const chooseNewImage =
    () => {
      if (images.length <= 1) {
        return
      }

      let next = imageIndex

      while (
        next === imageIndex
      ) {
        next =
          Math.floor(
            Math.random() *
              images.length,
          )
      }

      setImageIndex(next)
      setImageBroken(false)
    }

  const totalScore =
    presentationGrade &&
    conversationGrade
      ? Number(
          presentationGrade.language ||
            0,
        ) +
        Number(
          presentationGrade.message ||
            0,
        ) +
        Number(
          conversationGrade.messageConversation ||
            0,
        ) +
        Number(
          conversationGrade.interactiveSkills ||
            0,
        )
      : null

  /*
   * Gold gate.
   */

  if (goldLoading) {
    return (
      <div
        style={{
          minHeight:
            '460px',
          display: 'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          color: '#777',
          fontSize: '11px',
        }}
      >
        Checking Gold membership...
      </div>
    )
  }

  if (!gold) {
    return (
      <div className="dino-coming-page">
        <div className="dino-coming-content">
          <div className="dino-coming-icon">
            ✦
          </div>

          <h2>
            Gold only.
          </h2>

          <p>
            Individual Oral practice,
            AI discussion, recording,
            image stimuli and Groq
            transcription are available
            to Dino Gold members.
          </p>

          <button
            type="button"
            className="dino-upgrade-button"
            onClick={() => {
              window.location.href =
                '/upgrade'
            }}
          >
            ✦ Upgrade to Gold
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>
        {`
          body:has(.dino-oral-shell),
          html:has(.dino-oral-shell) {
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }

          #root:has(.dino-oral-shell),
          .app:has(.dino-oral-shell),
          .page-container:has(.dino-oral-shell) {
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .animated-page:has(.dino-oral-shell),
          .dashboard-page:has(.dino-oral-shell),
          .dashboard-workspace:has(.dino-oral-shell),
          .dashboard-panel:has(.dino-oral-shell),
          .dashboard-content:has(.dino-oral-shell) {
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .dino-oral-shell {
            position: relative;
            width: 100%;
            min-height: 100%;
            height: auto;
            overflow: visible;
            padding: 2px;
            box-sizing: border-box;
          }

          .dino-oral-shell.dino-oral-expanded {
            position: fixed;
            inset: 0;
            z-index: 9999;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            min-height: 100dvh;
            max-height: none;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 30px 32px 40px;
            background:
              linear-gradient(
                180deg,
                #f8f8f8 0%,
                #ffffff 100%
              );
          }

          .dino-oral-shell:fullscreen {
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            min-height: 100dvh;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 30px 32px 40px;
            background: #ffffff;
          }

          .dino-oral-topbar {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 16px;
          }

          .dino-oral-kicker {
            display: block;
            margin-bottom: 7px;
            color: #888;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .06em;
          }

          .dino-oral-title {
            margin: 0;
            color: #0a0a0a;
            font-size: clamp(28px, 4vw, 44px);
            line-height: .92;
            font-weight: 600;
            letter-spacing: -.07em;
          }

          .dino-oral-description {
            max-width: 690px;
            margin: 10px 0 0;
            color: #777;
            font-size: 11px;
            line-height: 1.55;
          }

          .dino-oral-top-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
            flex-wrap: wrap;
          }

          .dino-oral-controls {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            gap: 8px;
          }

          .dino-oral-select {
            min-height: 38px;
            padding: 0 12px;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 10px;
            outline: none;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 10px;
          }

          .dino-oral-expand-button {
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 10px;
            background: rgba(255,255,255,.82);
            color: #111;
            font-size: 17px;
            cursor: pointer;
            transition:
              transform .16s ease,
              background .16s ease,
              box-shadow .16s ease;
          }

          .dino-oral-expand-button:hover {
            transform: translateY(-1px);
            background: #fff;
            box-shadow: 0 7px 18px rgba(0,0,0,.07);
          }

          .dino-oral-workspace {
            display: grid;
            grid-template-columns:
              minmax(0, 1.15fr)
              minmax(330px, .85fr);
            gap: 14px;
            align-items: stretch;
          }

          .dino-oral-card {
            min-width: 0;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.78);
            backdrop-filter: blur(18px);
            box-shadow:
              0 18px 50px rgba(0,0,0,.035);
          }

          .dino-oral-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 15px 16px;
            border-bottom: 1px solid rgba(0,0,0,.06);
          }

          .dino-oral-card-header strong {
            font-size: 11px;
          }

          .dino-oral-pill {
            display: inline-flex;
            align-items: center;
            min-height: 24px;
            padding: 0 9px;
            border-radius: 999px;
            background: rgba(0,0,0,.045);
            color: #666;
            font-size: 8px;
            font-weight: 700;
          }

          .dino-oral-stimulus {
            padding: 16px;
          }

          .dino-oral-image-wrap {
            position: relative;
            overflow: hidden;
            min-height: 370px;
            border: 1px solid rgba(0,0,0,.07);
            border-radius: 15px;
            background:
              linear-gradient(
                135deg,
                rgba(255,255,255,.96),
                rgba(245,245,245,.9)
              );
          }

          .dino-oral-image {
            width: 100%;
            min-height: 370px;
            height: 100%;
            display: block;
            object-fit: cover;
          }

          .dino-oral-image-empty {
            min-height: 370px;
            padding: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #8a8a8a;
            font-size: 10px;
            line-height: 1.5;
          }

          .dino-oral-stimulus-tag {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 6px 9px;
            border: 1px solid rgba(0,0,0,.07);
            border-radius: 999px;
            background: rgba(255,255,255,.87);
            color: #555;
            backdrop-filter: blur(10px);
            font-size: 8px;
            font-weight: 700;
          }

          .dino-oral-stimulus-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
          }

          .dino-oral-info-box {
            min-width: 0;
            padding: 11px;
            border: 1px solid rgba(0,0,0,.07);
            border-radius: 12px;
            background: rgba(255,255,255,.68);
          }

          .dino-oral-info-label {
            margin-bottom: 5px;
            color: #909090;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .dino-oral-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }

          .dino-oral-button {
            min-height: 37px;
            padding: 0 13px;
            border: 0;
            border-radius: 10px;
            background: #0a0a0a;
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            cursor: pointer;
            transition:
              transform .15s ease,
              opacity .15s ease;
          }

          .dino-oral-button.secondary {
            background: rgba(0,0,0,.05);
            color: #222;
          }

          .dino-oral-button.danger {
            background: #7b2525;
          }

          .dino-oral-button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .dino-oral-button:disabled {
            opacity: .42;
            cursor: not-allowed;
          }

          .dino-oral-timer {
            margin: 16px;
            padding: 18px;
            border: 1px solid rgba(0,0,0,.07);
            border-radius: 15px;
            background: #fff;
          }

          .dino-oral-timer-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .dino-oral-timer-time {
            color: #0a0a0a;
            font-size: clamp(32px, 6vw, 56px);
            font-weight: 600;
            letter-spacing: -.08em;
            line-height: .9;
          }

          .dino-oral-timer-meta {
            text-align: right;
          }

          .dino-oral-timer-meta strong {
            display: block;
            color: #111;
            font-size: 10px;
          }

          .dino-oral-timer-meta span {
            display: block;
            margin-top: 4px;
            color: #909090;
            font-size: 8px;
          }

          .dino-oral-progress {
            width: 100%;
            height: 5px;
            margin-top: 14px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(0,0,0,.05);
          }

          .dino-oral-progress > div {
            height: 100%;
            border-radius: inherit;
            background: #111;
            transition: width .25s ease;
          }

          .dino-oral-prep {
            padding: 16px;
            border-top: 1px solid rgba(0,0,0,.06);
          }

          .dino-oral-section-title {
            margin: 0;
            color: #111;
            font-size: 12px;
            font-weight: 700;
          }

          .dino-oral-section-description {
            margin: 6px 0 12px;
            color: #777;
            font-size: 9px;
            line-height: 1.5;
          }

          .dino-oral-notes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px;
          }

          .dino-oral-note {
            width: 100%;
            min-height: 48px;
            box-sizing: border-box;
            padding: 9px 10px;
            border: 1px solid rgba(0,0,0,.07);
            border-radius: 10px;
            outline: none;
            resize: vertical;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 9px;
            line-height: 1.4;
          }

          .dino-oral-note:focus {
            border-color: rgba(0,0,0,.2);
            box-shadow: 0 0 0 3px rgba(0,0,0,.035);
          }

          .dino-oral-note-counter {
            margin-top: 8px;
            color: #8a8a8a;
            font-size: 8px;
          }

          .dino-oral-right {
            display: flex;
            min-height: 0;
            flex-direction: column;
          }

          .dino-oral-phase-tabs {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            padding: 10px;
            border-bottom: 1px solid rgba(0,0,0,.06);
          }

          .dino-oral-phase-tab {
            min-height: 47px;
            padding: 6px 8px;
            border: 0;
            border-radius: 10px;
            background: rgba(0,0,0,.035);
            color: #777;
            text-align: left;
            cursor: pointer;
          }

          .dino-oral-phase-tab.active {
            background: #0a0a0a;
            color: #fff;
          }

          .dino-oral-phase-tab strong {
            display: block;
            font-size: 8px;
          }

          .dino-oral-phase-tab span {
            display: block;
            margin-top: 3px;
            font-size: 7px;
            opacity: .78;
          }

          .dino-oral-chat {
            display: flex;
            min-height: 520px;
            flex: 1;
            flex-direction: column;
          }

          .dino-oral-chat-body {
            flex: 1;
            min-height: 280px;
            padding: 15px;
            overflow-y: auto;
          }

          .dino-oral-message {
            display: flex;
            margin-bottom: 10px;
          }

          .dino-oral-message.user {
            justify-content: flex-end;
          }

          .dino-oral-message-bubble {
            max-width: 85%;
            padding: 10px 12px;
            border-radius: 12px;
            background: rgba(0,0,0,.04);
            color: #353535;
            font-size: 9px;
            line-height: 1.55;
          }

          .dino-oral-message.user
            .dino-oral-message-bubble {
            background: #0a0a0a;
            color: #fff;
          }

          .dino-oral-question-box {
            margin: 0 15px 12px;
            padding: 13px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 13px;
            background: #fff;
          }

          .dino-oral-question-label {
            margin-bottom: 7px;
            color: #8b8b8b;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .dino-oral-question {
            color: #111;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.45;
          }

          .dino-oral-recording-panel {
            padding: 12px 15px 15px;
            border-top: 1px solid rgba(0,0,0,.06);
            background: rgba(255,255,255,.8);
          }

          .dino-oral-recording-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .dino-oral-recording-indicator {
            width: 8px;
            height: 8px;
            flex: 0 0 auto;
            border-radius: 50%;
            background: #bbb;
          }

          .dino-oral-recording-indicator.active {
            background: #b72d2d;
            box-shadow: 0 0 0 5px rgba(183,45,45,.08);
          }

          .dino-oral-recording-text {
            color: #666;
            font-size: 8px;
          }

          .dino-oral-recording-time {
            margin-left: auto;
            color: #111;
            font-size: 9px;
            font-weight: 700;
          }

          .dino-oral-audio {
            width: 100%;
            margin-top: 10px;
          }

          .dino-oral-transcript {
            max-height: 200px;
            margin-top: 10px;
            padding: 11px;
            overflow-y: auto;
            border: 1px solid rgba(0,0,0,.06);
            border-radius: 11px;
            background: #fafafa;
            color: #444;
            font-size: 9px;
            line-height: 1.6;
            white-space: pre-wrap;
          }

          .dino-oral-grade {
            margin: 14px 15px;
            padding: 14px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 14px;
            background: #fff;
          }

          .dino-oral-grade-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .dino-oral-grade-list {
            margin: 10px 0 0;
            padding-left: 17px;
          }

          .dino-oral-grade-list li {
            margin: 4px 0;
            color: #555;
            font-size: 9px;
            line-height: 1.5;
          }

          .dino-oral-result {
            margin-top: 14px;
            padding: 16px;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 14px;
            background: rgba(255,255,255,.85);
          }

          .dino-oral-result-score {
            margin-top: 4px;
            color: #0a0a0a;
            font-size: 38px;
            font-weight: 700;
            letter-spacing: -.06em;
          }

          .dino-oral-error {
            margin: 12px 0 0;
            padding: 10px 12px;
            border: 1px solid rgba(140,60,60,.14);
            border-radius: 10px;
            background: rgba(140,60,60,.05);
            color: #7e4747;
            font-size: 9px;
            line-height: 1.5;
          }

          @media (max-width: 1050px) {
            .dino-oral-workspace {
              grid-template-columns: 1fr;
            }

            .dino-oral-chat {
              min-height: 470px;
            }
          }

          @media (max-width: 700px) {
            .dino-oral-shell {
              padding-left: 16px;
              padding-right: 16px;
            }

            .dino-oral-shell.dino-oral-expanded {
              padding: 22px 16px 30px;
            }

            .dino-oral-topbar {
              flex-direction: column;
            }

            .dino-oral-top-actions,
            .dino-oral-controls {
              justify-content: flex-start;
            }

            .dino-oral-stimulus-info,
            .dino-oral-notes {
              grid-template-columns: 1fr;
            }

            .dino-oral-image-wrap,
            .dino-oral-image {
              min-height: 260px;
            }

            .dino-oral-chat {
              min-height: 500px;
            }
          }
        `}
      </style>

      <div
        ref={oralShellRef}
        className={
          expanded
            ? 'dino-oral-shell dino-oral-expanded'
            : 'dino-oral-shell'
        }
      >
        <div className="dino-oral-topbar">
          <div>
            <span className="dino-oral-kicker">
              IB Language B · Individual Oral
            </span>

            <h2 className="dino-oral-title">
              Oral practice.
            </h2>

            <p className="dino-oral-description">
              Full oral practice with
              preparation, stimulus presentation,
              follow-up discussion, general
              discussion, recording and Groq
              transcription.
            </p>
          </div>

          <div className="dino-oral-top-actions">
            <div className="dino-oral-controls">
              <select
                className="dino-oral-select"
                value={language}
                onChange={(event) => {
                  setLanguage(
                    event.target.value,
                  )

                  setTranscript('')
                  setPresentationGrade(
                    null,
                  )

                  setConversationGrade(
                    null,
                  )
                }}
              >
                {LANGUAGES.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.label}
                    </option>
                  ),
                )}
              </select>

              <select
                className="dino-oral-select"
                value={level}
                onChange={(event) => {
                  setLevel(
                    event.target.value,
                  )

                  resetPreparation()
                }}
              >
                <option value="SL">
                  Standard Level
                </option>

                <option value="HL">
                  Higher Level
                </option>
              </select>
            </div>

            <button
              type="button"
              className="dino-oral-expand-button"
              aria-label={
                expanded
                  ? 'Collapse oral workspace'
                  : 'Expand oral workspace'
              }
              title={
                expanded
                  ? 'Collapse'
                  : 'Expand'
              }
              onClick={
                toggleExpanded
              }
            >
              {expanded
                ? '×'
                : '⛶'}
            </button>
          </div>
        </div>

        <div className="dino-oral-workspace">
          <div className="dino-oral-card">
            <div className="dino-oral-card-header">
              <strong>
                Visual stimulus
              </strong>

              <span className="dino-oral-pill">
                {level} · Gold
              </span>
            </div>

            <div className="dino-oral-stimulus">
              <div className="dino-oral-image-wrap">
                {imageLoading ? (
                  <div className="dino-oral-image-empty">
                    Loading IO stimulus images...
                  </div>
                ) : currentImage &&
                  !imageBroken ? (
                  <>
                    <img
                      className="dino-oral-image"
                      src={currentImage}
                      alt={`IB Language B oral stimulus for ${theme}`}
                      onError={() =>
                        setImageBroken(
                          true,
                        )
                      }
                    />

                    <div className="dino-oral-stimulus-tag">
                      {theme}
                    </div>
                  </>
                ) : (
                  <div className="dino-oral-image-empty">
                    No compatible image was found in
                    <br />
                    <strong>
                      public/assets/io_images
                    </strong>
                  </div>
                )}
              </div>

              <div className="dino-oral-stimulus-info">
                <div className="dino-oral-info-box">
                  <div className="dino-oral-info-label">
                    Theme
                  </div>

                  <select
                    className="dino-oral-select"
                    style={{
                      width:
                        '100%',
                    }}
                    value={theme}
                    onChange={(
                      event,
                    ) =>
                      setTheme(
                        event.target.value,
                      )
                    }
                    disabled={
                      preparing ||
                      recording
                    }
                  >
                    {THEMES.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="dino-oral-info-box">
                  <div className="dino-oral-info-label">
                    Topic
                  </div>

                  <select
                    className="dino-oral-select"
                    style={{
                      width:
                        '100%',
                    }}
                    value={topic}
                    onChange={(
                      event,
                    ) =>
                      setTopic(
                        event.target.value,
                      )
                    }
                    disabled={
                      preparing ||
                      recording
                    }
                  >
                    {(
                      THEME_TOPICS[
                        theme
                      ] || []
                    ).map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="dino-oral-actions">
                <button
                  type="button"
                  className="dino-oral-button secondary"
                  onClick={
                    chooseNewImage
                  }
                  disabled={
                    preparing ||
                    recording ||
                    preparationFinished ||
                    images.length <
                      2
                  }
                >
                  New stimulus
                </button>

                {!preparing &&
                  !preparationFinished &&
                  !recording && (
                    <button
                      type="button"
                      className="dino-oral-button"
                      onClick={
                        startPreparation
                      }
                    >
                      Start preparation →
                    </button>
                  )}
              </div>
            </div>

            <div className="dino-oral-timer">
              <div className="dino-oral-timer-row">
                <div className="dino-oral-timer-time">
                  {preparing
                    ? formatTime(
                        preparationSeconds,
                      )
                    : recording
                      ? formatTime(
                          recordingSeconds,
                        )
                      : preparationFinished
                        ? preparationSkipped
                          ? 'SKIPPED'
                          : 'READY'
                        : formatTime(
                            preparationMinutes *
                              60,
                          )}
                </div>

                <div className="dino-oral-timer-meta">
                  <strong>
                    {preparing
                      ? 'Preparation'
                      : recording
                        ? activePart.subtitle
                        : preparationFinished
                          ? preparationSkipped
                            ? 'Preparation skipped'
                            : 'Begin the oral'
                          : 'Preparation time'}
                  </strong>

                  <span>
                    {preparing
                      ? `${preparationMinutes} minutes`
                      : recording
                        ? `${activePart.minutes} minute maximum`
                        : level ===
                            'HL'
                          ? '20 minutes'
                          : '15 minutes'}
                  </span>
                </div>
              </div>

              <div className="dino-oral-progress">
                <div
                  style={{
                    width: `${
                      preparing
                        ? Math.max(
                            0,
                            Math.min(
                              100,
                              (1 -
                                preparationSeconds /
                                  (preparationMinutes *
                                    60)) *
                                100,
                            ),
                          )
                        : recording
                          ? Math.min(
                              100,
                              (recordingSeconds /
                                (activePart.minutes *
                                  60)) *
                                100,
                            )
                          : preparationFinished
                            ? 100
                            : 0
                    }%`,
                  }}
                />
              </div>

              {preparing && (
                <div className="dino-oral-actions">
                  <button
                    type="button"
                    className="dino-oral-button secondary"
                    onClick={() => {
                      if (
                        preparationTimerRef.current
                      ) {
                        clearInterval(
                          preparationTimerRef.current,
                        )

                        preparationTimerRef.current =
                          null
                      }

                      setPreparing(
                        false,
                      )
                    }}
                  >
                    Pause preparation
                  </button>

                  <button
                    type="button"
                    className="dino-oral-button"
                    onClick={
                      skipPreparation
                    }
                  >
                    Skip preparation →
                  </button>
                </div>
              )}

              {!preparing &&
                !preparationFinished && (
                  <div className="dino-oral-actions">
                    <button
                      type="button"
                      className="dino-oral-button"
                      onClick={
                        skipPreparation
                      }
                    >
                      Skip preparation →
                    </button>
                  </div>
                )}

              {preparationFinished &&
                !recording && (
                  <div className="dino-oral-actions">
                    <button
                      type="button"
                      className="dino-oral-button"
                      onClick={() =>
                        startRecording(
                          'presentation',
                        )
                      }
                    >
                      Start presentation →
                    </button>

                    <button
                      type="button"
                      className="dino-oral-button secondary"
                      onClick={
                        resetPractice
                      }
                    >
                      Reset
                    </button>
                  </div>
                )}
            </div>

            <div className="dino-oral-prep">
              <h3 className="dino-oral-section-title">
                Working notes
              </h3>

              <p className="dino-oral-section-description">
                Use brief prompts rather than a
                memorised script.
              </p>

              <div className="dino-oral-notes">
                {notes.map(
                  (
                    value,
                    index,
                  ) => (
                    <textarea
                      key={index}
                      className="dino-oral-note"
                      value={value}
                      maxLength={180}
                      placeholder={`Point ${index + 1}`}
                      onChange={(
                        event,
                      ) => {
                        const next =
                          [
                            ...notes,
                          ]

                        next[index] =
                          event.target.value

                        setNotes(
                          next,
                        )
                      }}
                    />
                  ),
                )}
              </div>

              <div className="dino-oral-note-counter">
                {
                  notes.filter(
                    (item) =>
                      item.trim(),
                  ).length
                }
                /10 note points used
              </div>
            </div>
          </div>

          <div className="dino-oral-card dino-oral-right">
            <div className="dino-oral-card-header">
              <strong>
                Simulated examiner
              </strong>

              <span className="dino-oral-pill">
                {
                  currentLanguage.languageName
                }
              </span>
            </div>

            <div className="dino-oral-phase-tabs">
              {Object.entries(
                PARTS,
              ).map(
                ([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    className={
                      part === key
                        ? 'dino-oral-phase-tab active'
                        : 'dino-oral-phase-tab'
                    }
                    onClick={() =>
                      setPart(key)
                    }
                    disabled={
                      recording ||
                      !preparationFinished
                    }
                  >
                    <strong>
                      {info.title}
                    </strong>

                    <span>
                      {info.subtitle}
                    </span>
                  </button>
                ),
              )}
            </div>

            <div className="dino-oral-chat">
              <div className="dino-oral-chat-body">
                {messages.map(
                  (
                    message,
                    index,
                  ) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={
                        message.role ===
                        'user'
                          ? 'dino-oral-message user'
                          : 'dino-oral-message'
                      }
                    >
                      <div className="dino-oral-message-bubble">
                        {
                          message.content
                        }
                      </div>
                    </div>
                  ),
                )}
              </div>

              {currentQuestion &&
                part !==
                  'presentation' && (
                  <div className="dino-oral-question-box">
                    <div className="dino-oral-question-label">
                      Examiner question
                    </div>

                    <div className="dino-oral-question">
                      {
                        currentQuestion
                      }
                    </div>
                  </div>
                )}

              <div className="dino-oral-recording-panel">
                <div className="dino-oral-recording-row">
                  <div
                    className={
                      recording
                        ? 'dino-oral-recording-indicator active'
                        : 'dino-oral-recording-indicator'
                    }
                  />

                  <span className="dino-oral-recording-text">
                    {recording
                      ? 'Recording'
                      : transcribing ||
                          answerTranscribing
                        ? 'Transcribing with Groq'
                        : processing
                          ? 'Preparing AI feedback'
                          : 'Microphone ready'}
                  </span>

                  <span className="dino-oral-recording-time">
                    {formatTime(
                      recordingSeconds,
                    )}
                  </span>
                </div>

                {recordedAudioUrl && (
                  <audio
                    className="dino-oral-audio"
                    src={
                      recordedAudioUrl
                    }
                    controls
                  />
                )}

                <div className="dino-oral-actions">
                  {!recording &&
                    preparationFinished &&
                    part !==
                      'presentation' && (
                      <button
                        type="button"
                        className="dino-oral-button"
                        onClick={() =>
                          startRecording(
                            part,
                          )
                        }
                        disabled={
                          transcribing ||
                          answerTranscribing ||
                          processing
                        }
                      >
                        Record answer
                      </button>
                    )}

                  {recording && (
                    <button
                      type="button"
                      className="dino-oral-button danger"
                      onClick={
                        stopRecording
                      }
                    >
                      Stop recording
                    </button>
                  )}

                  {!recording &&
                    recordedBlob &&
                    part ===
                      'presentation' && (
                      <button
                        type="button"
                        className="dino-oral-button secondary"
                        onClick={
                          submitPresentation
                        }
                        disabled={
                          transcribing ||
                          processing ||
                          aiQuestionLoading
                        }
                      >
                        {transcribing
                          ? 'Transcribing...'
                          : processing
                            ? 'Preparing...'
                            : 'Submit presentation →'}
                      </button>
                    )}

                  {!recording &&
                    recordedBlob &&
                    part !==
                      'presentation' && (
                      <button
                        type="button"
                        className="dino-oral-button secondary"
                        onClick={
                          submitConversation
                        }
                        disabled={
                          transcribing ||
                          answerTranscribing ||
                          aiQuestionLoading
                        }
                      >
                        {answerTranscribing ||
                        aiQuestionLoading
                          ? 'Processing...'
                          : 'Send answer →'}
                      </button>
                    )}
                </div>

                {transcript && (
                  <>
                    <div className="dino-oral-transcript">
                      {transcript}
                    </div>

                    <button
                      type="button"
                      className="dino-oral-button secondary"
                      style={{
                        marginTop:
                          '7px',
                      }}
                      onClick={
                        copyTranscript
                      }
                    >
                      {copied
                        ? 'Copied'
                        : 'Copy transcript'}
                    </button>
                  </>
                )}
              </div>

              {presentationGrade && (
                <div className="dino-oral-grade">
                  <div className="dino-oral-grade-header">
                    <strong>
                      Presentation feedback
                    </strong>

                    <span className="dino-oral-pill">
                      {
                        presentationGrade.language
                      }
                      /12 language ·{' '}
                      {
                        presentationGrade.message
                      }
                      /6 message
                    </span>
                  </div>

                  <p
                    style={{
                      margin:
                        '10px 0 0',
                      color: '#555',
                      fontSize:
                        '9px',
                      lineHeight:
                        1.55,
                    }}
                  >
                    {
                      presentationGrade.feedback
                    }
                  </p>

                  <ul className="dino-oral-grade-list">
                    {(
                      presentationGrade.strengths ||
                      []
                    ).map(
                      (
                        item,
                        index,
                      ) => (
                        <li
                          key={`strength-${index}`}
                        >
                          <strong>
                            Strength:
                          </strong>{' '}
                          {item}
                        </li>
                      ),
                    )}

                    {(
                      presentationGrade.improvements ||
                      []
                    ).map(
                      (
                        item,
                        index,
                      ) => (
                        <li
                          key={`improve-${index}`}
                        >
                          <strong>
                            Improve:
                          </strong>{' '}
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {conversationGrade && (
                <div className="dino-oral-grade">
                  <div className="dino-oral-grade-header">
                    <strong>
                      Conversation feedback
                    </strong>

                    <span className="dino-oral-pill">
                      {
                        conversationGrade.messageConversation
                      }
                      /6 message ·{' '}
                      {
                        conversationGrade.interactiveSkills
                      }
                      /6 interaction
                    </span>
                  </div>

                  <p
                    style={{
                      margin:
                        '10px 0 0',
                      color: '#555',
                      fontSize:
                        '9px',
                      lineHeight:
                        1.55,
                    }}
                  >
                    {
                      conversationGrade.feedback
                    }
                  </p>

                  <ul className="dino-oral-grade-list">
                    {(
                      conversationGrade.strengths ||
                      []
                    ).map(
                      (
                        item,
                        index,
                      ) => (
                        <li
                          key={`conversation-strength-${index}`}
                        >
                          <strong>
                            Strength:
                          </strong>{' '}
                          {item}
                        </li>
                      ),
                    )}

                    {(
                      conversationGrade.improvements ||
                      []
                    ).map(
                      (
                        item,
                        index,
                      ) => (
                        <li
                          key={`conversation-improve-${index}`}
                        >
                          <strong>
                            Improve:
                          </strong>{' '}
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {overallResult && (
          <div className="dino-oral-result">
            <span className="dino-oral-kicker">
              Oral complete
            </span>

            <h3
              style={{
                margin: 0,
                fontSize: '16px',
              }}
            >
              Practice result
            </h3>

            <div className="dino-oral-result-score">
              {totalScore !== null
                ? `${totalScore}/30`
                : '—'}
            </div>

            <p
              style={{
                maxWidth:
                  '700px',
                margin:
                  '8px 0 0',
                color:
                  '#777',
                fontSize:
                  '10px',
                lineHeight:
                  1.5,
              }}
            >
              This is formative AI
              feedback for practice,
              not an official IB result.
            </p>

            <div className="dino-oral-actions">
              <button
                type="button"
                className="dino-oral-button"
                onClick={
                  resetPractice
                }
              >
                Practise again
              </button>

              <button
                type="button"
                className="dino-oral-button secondary"
                onClick={() => {
                  chooseNewImage()
                  resetPractice()
                }}
              >
                New stimulus
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="dino-oral-error">
            {error}
          </div>
        )}
      </div>
    </>
  )
}

export default Oral