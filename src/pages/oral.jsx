// pages/oral.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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

const LANGUAGES = [
  {
    id: 'French B',
    label: 'French B',
    code: 'fr',
    languageName: 'French',
    targetCulture: 'francophone',
  },
  {
    id: 'Spanish B',
    label: 'Spanish B',
    code: 'es',
    languageName: 'Spanish',
    targetCulture: 'Spanish-speaking',
  },
  {
    id: 'Chinese B',
    label: 'Chinese B',
    code: 'zh',
    languageName: 'Chinese',
    targetCulture: 'Chinese-speaking',
  },
  {
    id: 'English B',
    label: 'English B',
    code: 'en',
    languageName: 'English',
    targetCulture: 'English-speaking',
  },
  {
    id: 'German B',
    label: 'German B',
    code: 'de',
    languageName: 'German',
    targetCulture: 'German-speaking',
  },
  {
    id: 'Italian B',
    label: 'Italian B',
    code: 'it',
    languageName: 'Italian',
    targetCulture: 'Italian-speaking',
  },
  {
    id: 'Japanese B',
    label: 'Japanese B',
    code: 'ja',
    languageName: 'Japanese',
    targetCulture: 'Japanese-speaking',
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

const STORAGE_PREFIX = 'dino_oral_gold_session_v1'

const PARTS = {
  presentation: {
    title: 'Part 1',
    subtitle: 'Presentation',
    minutes: 4,
  },
  followUp: {
    title: 'Part 2',
    subtitle: 'Follow-up discussion',
    minutes: 5,
  },
  general: {
    title: 'Part 3',
    subtitle: 'General discussion',
    minutes: 6,
  },
}

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content:
      'Your oral practice starts here. Complete the preparation period, then begin your presentation when you are ready.',
  },
]

function languageInfo(language) {
  return (
    LANGUAGES.find((item) => item.id === language) ||
    LANGUAGES.find((item) => item.id === 'English B')
  )
}

function formatSeconds(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`
}

function randomItem(items) {
  if (!items?.length) return null
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function getSupportedRecordingMimeType() {
  if (typeof MediaRecorder === 'undefined') {
    return ''
  }

  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ]

  return (
    types.find((type) => MediaRecorder.isTypeSupported?.(type)) || ''
  )
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      try {
        const result = String(reader.result || '')
        const commaIndex = result.indexOf(',')

        if (commaIndex === -1) {
          reject(new Error('Could not encode audio recording.'))
          return
        }

        resolve(result.slice(commaIndex + 1))
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Could not read the audio recording.'))
    }

    reader.readAsDataURL(blob)
  })
}

async function callDinoAI({
  system,
  user,
  responseFormat,
  temperature = 0.3,
  maxTokens = 1800,
}) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system,
      user,
      responseFormat,
      temperature,
      maxTokens,
      model: 'openai/gpt-oss-120b',
    }),
  })

  const text = await response.text()

  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        text ||
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
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcription: true,
      audioBase64: base64,
      mimeType,
      language: languageCode,
      prompt,
      model: 'whisper-large-v3-turbo',
    }),
  })

  const text = await response.text()

  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        text ||
        `Transcription failed with status ${response.status}.`,
    )
  }

  return data?.text || ''
}

function Oral() {
  const [gold, setGold] = useState(
    typeof window !== 'undefined' &&
      window.__dinoIsGoldMember === true,
  )
  const [goldLoading, setGoldLoading] = useState(true)

  const [language, setLanguage] = useState(
    () =>
      localStorage.getItem(`${STORAGE_PREFIX}_language`) ||
      'English B',
  )
  const [level, setLevel] = useState(
    () =>
      localStorage.getItem(`${STORAGE_PREFIX}_level`) ||
      'SL',
  )

  const [imageList, setImageList] = useState([])
  const [imageLoading, setImageLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [imageBroken, setImageBroken] = useState(false)

  const [theme, setTheme] = useState('Identities')
  const [topic, setTopic] = useState('Lifestyles')

  const [preparationMinutes, setPreparationMinutes] = useState(15)
  const [preparationSeconds, setPreparationSeconds] = useState(15 * 60)
  const [preparing, setPreparing] = useState(false)
  const [preparationFinished, setPreparationFinished] =
    useState(false)

  const [notes, setNotes] = useState(
    Array.from({ length: 10 }, () => ''),
  )

  const [part, setPart] = useState('presentation')
  const [recording, setRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('')
  const [transcribing, setTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [presentationGrade, setPresentationGrade] = useState(null)
  const [conversationGrade, setConversationGrade] = useState(null)

  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [aiQuestionLoading, setAiQuestionLoading] = useState(false)
  const [aiMessages, setAiMessages] = useState(
    INITIAL_MESSAGES,
  )
  const [answerRecording, setAnswerRecording] = useState(false)
  const [answerTranscript, setAnswerTranscript] =
    useState('')
  const [answerTranscribing, setAnswerTranscribing] =
    useState(false)

  const [generalTheme, setGeneralTheme] = useState(
    'Experiences',
  )
  const [generalQuestions, setGeneralQuestions] =
    useState([])
  const [generalQuestionIndex, setGeneralQuestionIndex] =
    useState(0)

  const [overallResult, setOverallResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const recorderChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const preparationTimerRef = useRef(null)
  const autoStartPresentationRef = useRef(false)

  const currentLanguage = useMemo(
    () => languageInfo(language),
    [language],
  )

  const currentImage = imageList[imageIndex] || ''

  const currentQuestion = useMemo(() => {
    if (part === 'followUp') {
      return questions[questionIndex] || ''
    }

    if (part === 'general') {
      return generalQuestions[generalQuestionIndex] || ''
    }

    return ''
  }, [
    generalQuestionIndex,
    generalQuestions,
    part,
    questionIndex,
    questions,
  ])

  const activePart = PARTS[part]

  const oralDurationSeconds = 15 * 60

  const progressSeconds =
    part === 'presentation'
      ? 0
      : part === 'followUp'
        ? 4 * 60
        : 9 * 60

  const timerProgress =
    part === 'presentation'
      ? recordingSeconds / (3.5 * 60)
      : 0

  const preparationProgress =
    preparationMinutes > 0
      ? 1 -
        preparationSeconds /
          (preparationMinutes * 60)
      : 1

  const usedNotes = notes.filter(
    (item) => item.trim().length > 0,
  ).length

  const loadGoldStatus = useCallback(async () => {
    if (typeof window === 'undefined') {
      setGoldLoading(false)
      return
    }

    if (window.__dinoIsGoldMember === true) {
      setGold(true)
      setGoldLoading(false)
      return
    }

    try {
      const user = await getCurrentUser()

      if (!user) {
        setGold(false)
        setGoldLoading(false)
        return
      }

      const isGold = await getGoldMembership(user.id)

      window.__dinoIsGoldMember = Boolean(isGold)
      setGold(Boolean(isGold))

      window.dispatchEvent(
        new CustomEvent(
          'dino-gold-membership-check',
        ),
      )
    } catch (membershipError) {
      console.error(
        'Failed to check Gold membership:',
        membershipError,
      )
      setGold(false)
    } finally {
      setGoldLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGoldStatus()

    const onGoldMembershipCheck = () => {
      setGold(
        window.__dinoIsGoldMember === true,
      )
      setGoldLoading(false)
    }

    window.addEventListener(
      'dino-gold-membership-check',
      onGoldMembershipCheck,
    )

    return () => {
      window.removeEventListener(
        'dino-gold-membership-check',
        onGoldMembershipCheck,
      )
    }
  }, [loadGoldStatus])

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

  useEffect(() => {
    let alive = true

    async function loadImages() {
      setImageLoading(true)

      const candidates = [
        '/assets/io_images/manifest.json',
        '/assets/io_images/images.json',
      ]

      let discovered = []

      for (const manifestUrl of candidates) {
        try {
          const response = await fetch(manifestUrl, {
            cache: 'no-store',
          })

          if (!response.ok) continue

          const data = await response.json()

          if (Array.isArray(data)) {
            discovered = data
          } else if (Array.isArray(data?.images)) {
            discovered = data.images
          }

          if (discovered.length) break
        } catch {
          // Fall back to common filenames below.
        }
      }

      if (!discovered.length) {
        discovered = FALLBACK_IMAGE_NAMES
      }

      const normalized = discovered
        .map((item) => {
          const raw =
            typeof item === 'string'
              ? item
              : item?.src || item?.path || item?.file

          if (!raw) return ''

          return raw.startsWith('/')
            ? raw
            : `/assets/io_images/${raw}`
        })
        .filter(Boolean)

      const unique = [
        ...new Set(normalized),
      ]

      if (alive) {
        setImageList(unique)
        setImageIndex(
          Math.floor(
            Math.random() * Math.max(unique.length, 1),
          ),
        )
        setImageBroken(false)
        setImageLoading(false)
      }
    }

    loadImages()

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    setImageBroken(false)
  }, [currentImage])

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl)
      }
    }
  }, [recordedAudioUrl])

  useEffect(() => {
    return () => {
      if (preparationTimerRef.current) {
        clearInterval(
          preparationTimerRef.current,
        )
      }

      if (recordingTimerRef.current) {
        clearInterval(
          recordingTimerRef.current,
        )
      }

      mediaStreamRef.current
        ?.getTracks()
        ?.forEach((track) => track.stop())

      mediaRecorderRef.current = null
    }
  }, [])

  useEffect(() => {
    if (topic && !THEME_TOPICS[theme]?.includes(topic)) {
      setTopic(
        THEME_TOPICS[theme]?.[0] ||
          'Lifestyles',
      )
    }
  }, [theme, topic])

  useEffect(() => {
    if (
      !preparing ||
      preparationFinished ||
      preparationSeconds <= 0
    ) {
      return
    }

    preparationTimerRef.current = setInterval(() => {
      setPreparationSeconds(
        (current) => {
          if (current <= 1) {
            clearInterval(
              preparationTimerRef.current,
            )
            preparationTimerRef.current = null
            setPreparing(false)
            setPreparationFinished(true)
            autoStartPresentationRef.current = true
            return 0
          }

          return current - 1
        },
      )
    }, 1000)

    return () => {
      if (preparationTimerRef.current) {
        clearInterval(
          preparationTimerRef.current,
        )
        preparationTimerRef.current = null
      }
    }
  }, [
    preparationFinished,
    preparationSeconds,
    preparing,
  ])

  useEffect(() => {
    if (
      preparationFinished &&
      autoStartPresentationRef.current
    ) {
      autoStartPresentationRef.current = false
      setPart('presentation')
      setTimeout(() => {
        startRecording('presentation')
      }, 250)
    }
  }, [preparationFinished])

  const resetPreparation = useCallback(() => {
    if (preparationTimerRef.current) {
      clearInterval(
        preparationTimerRef.current,
      )
      preparationTimerRef.current = null
    }

    const minutes =
      level === 'HL' ? 20 : 15

    setPreparationMinutes(minutes)
    setPreparationSeconds(minutes * 60)
    setPreparing(false)
    setPreparationFinished(false)
  }, [level])

  const resetRecordingState = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(
        recordingTimerRef.current,
      )
      recordingTimerRef.current = null
    }

    mediaRecorderRef.current?.stop?.()

    mediaStreamRef.current
      ?.getTracks()
      ?.forEach((track) => track.stop())

    mediaRecorderRef.current = null
    mediaStreamRef.current = null
    recorderChunksRef.current = []

    setRecording(false)
    setRecordingSeconds(0)
  }, [])

  const startPreparation = () => {
    setError('')
    setPreparationFinished(false)
    setPreparationSeconds(
      preparationMinutes * 60,
    )
    setPreparing(true)
  }

  const chooseNewStimulus = () => {
    if (imageList.length <= 1) return

    let nextIndex = imageIndex

    while (nextIndex === imageIndex) {
      nextIndex = Math.floor(
        Math.random() * imageList.length,
      )
    }

    setImageIndex(nextIndex)
    setImageBroken(false)
  }

  const startRecording = async (targetPart = part) => {
    setError('')

    if (
      recording ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          'Your browser does not support microphone recording.',
        )
      }
      return
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })

      const mimeType =
        getSupportedRecordingMimeType()

      const recorder = new MediaRecorder(
        stream,
        mimeType
          ? {
              mimeType,
            }
          : undefined,
      )

      mediaStreamRef.current = stream
      mediaRecorderRef.current = recorder
      recorderChunksRef.current = []

      recorder.ondataavailable = (
        event,
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          recorderChunksRef.current.push(
            event.data,
          )
        }
      }

      recorder.onstop = () => {
        const actualMimeType =
          recorder.mimeType ||
          mimeType ||
          'audio/webm'

        const blob = new Blob(
          recorderChunksRef.current,
          {
            type: actualMimeType,
          },
        )

        if (recordedAudioUrl) {
          URL.revokeObjectURL(
            recordedAudioUrl,
          )
        }

        setRecordedBlob(blob)
        setRecordedAudioUrl(
          URL.createObjectURL(blob),
        )

        stream
          .getTracks()
          .forEach((track) =>
            track.stop(),
          )

        setRecording(false)
      }

      recorder.start(1000)

      setRecording(true)
      setRecordingSeconds(0)
      setPart(targetPart)

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingSeconds(
            (current) => {
              const next = current + 1

              const targetLimit =
                targetPart ===
                'presentation'
                  ? 4 * 60
                  : targetPart ===
                      'followUp'
                    ? 5 * 60
                    : 6 * 60

              if (next >= targetLimit) {
                setTimeout(() => {
                  if (
                    mediaRecorderRef.current
                      ?.state === 'recording'
                  ) {
                    mediaRecorderRef.current.stop()
                  }
                }, 0)
              }

              return next
            },
          )
        }, 1000)
    } catch (recordingError) {
      console.error(
        'Microphone access failed:',
        recordingError,
      )

      setError(
        'Microphone access was blocked or unavailable. Allow microphone access and try again.',
      )
    }
  }

  const stopRecording = () => {
    if (
      mediaRecorderRef.current?.state ===
      'recording'
    ) {
      mediaRecorderRef.current.stop()
    }

    if (recordingTimerRef.current) {
      clearInterval(
        recordingTimerRef.current,
      )
      recordingTimerRef.current = null
    }

    mediaStreamRef.current
      ?.getTracks()
      ?.forEach((track) => track.stop())

    setRecording(false)
  }

  const transcribeCurrentRecording =
    async ({
      targetPart = part,
      targetBlob = recordedBlob,
    } = {}) => {
      if (!targetBlob) {
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
            targetBlob,
          )

        const prompt = [
          `IB Language B ${level}`,
          `Target language: ${currentLanguage.languageName}.`,
          `Theme: ${theme}.`,
          `Topic: ${topic}.`,
          `Part: ${PARTS[targetPart]?.subtitle || targetPart}.`,
          'Transcribe the student accurately in the spoken target language.',
          'Preserve pauses only when useful for interpretation.',
          'Do not translate.',
        ].join(' ')

        const result =
          await transcribeAudio({
            base64,
            mimeType:
              targetBlob.type ||
              'audio/webm',
            languageCode:
              currentLanguage.code,
            prompt,
          })

        setTranscript(result)

        return result
      } catch (transcriptionError) {
        console.error(
          'Oral transcription failed:',
          transcriptionError,
        )

        setError(
          transcriptionError?.message ||
            'Could not transcribe the recording.',
        )

        return ''
      } finally {
        setTranscribing(false)
      }
    }

  const generateFollowUpQuestions =
    async (presentationText) => {
      setAiQuestionLoading(true)
      setError('')

      try {
        const schema = {
          type: 'json_schema',
          json_schema: {
            name: 'oral_followup_questions',
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
              required: ['questions'],
              additionalProperties: false,
            },
          },
        }

        const content =
          await callDinoAI({
            system: `
You are an expert IB Language B ${level} oral examiner.

Create authentic follow-up discussion questions for Part 2 of the
IB Language B individual oral.

The student is speaking ${currentLanguage.languageName}.
The stimulus theme is "${theme}" and the topic is "${topic}".

For SL, the discussion must stay connected to the visual stimulus,
the theme, target culture(s), and ideas raised by the student.

For HL, the discussion must stay connected to the literary extract,
its ideas, events, messages and the student's observations.

Questions should become progressively more probing.
Do not ask irrelevant factual trivia.
Do not turn the discussion into a grammar quiz.
Write questions in the target language only.
        `,
            user: `
Here is the student's presentation transcript:

${presentationText || '(No transcript available.)'}

Generate the follow-up discussion questions now.
        `,
            responseFormat: schema,
            temperature: 0.5,
            maxTokens: 1200,
          })

        const parsed =
          JSON.parse(content)

        setQuestions(
          Array.isArray(parsed?.questions)
            ? parsed.questions
            : [],
        )

        setQuestionIndex(0)

        setAiMessages([
          INITIAL_MESSAGES[0],
          {
            role: 'assistant',
            content:
              parsed?.questions?.[0] ||
              'Let us continue with the follow-up discussion.',
          },
        ])
      } catch (questionError) {
        console.error(
          'Follow-up question generation failed:',
          questionError,
        )

        const fallbackQuestions = [
          `Pourquoi cette question est-elle importante dans ${currentLanguage.targetCulture} ?`,
          `Quels sont les avantages et les inconvénients de cette situation ?`,
          `Comment cette situation peut-elle affecter les jeunes ?`,
          `Pouvez-vous comparer cette situation avec votre propre contexte culturel ?`,
          `Quels changements pourraient améliorer cette situation ?`,
        ]

        setQuestions(
          fallbackQuestions,
        )
        setQuestionIndex(0)

        setAiMessages([
          INITIAL_MESSAGES[0],
          {
            role: 'assistant',
            content:
              fallbackQuestions[0],
          },
        ])
      } finally {
        setAiQuestionLoading(false)
      }
    }

  const gradePresentation = async (
    presentationText,
  ) => {
    if (!presentationText?.trim()) {
      return
    }

    const schema = {
      type: 'json_schema',
      json_schema: {
        name: 'oral_presentation_grade',
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
You are grading an IB Language B individual oral practice performance.

Target language: ${currentLanguage.languageName}
Level: ${level}
Theme: ${theme}
Topic: ${topic}

For SL Part 1, evaluate:
- spoken language quality, range, accuracy, pronunciation/flow as evidenced by the transcript
- engagement with the visual stimulus
- relevance and explicit connection to target culture(s)

For HL Part 1, evaluate:
- spoken language quality, range and accuracy
- quality and relevance of the student's engagement with the literary extract
- treatment of events, ideas and messages in the extract

Do not invent pronunciation errors that cannot be established from the transcript.

The official oral criteria include:
Criterion A Language: 12 marks.
Criterion B1 Message - Presentation: 6 marks.

Give a practical formative grade, not a falsely precise official result.
        `,
          user: `
Visual/theme context:
${theme}
${topic}

Stimulus:
${currentImage}

Student presentation transcript:
${presentationText}

Preparation notes:
${notes.filter(Boolean).join('\n')}

Assess this performance.
        `,
          responseFormat: schema,
          temperature: 0.2,
          maxTokens: 1400,
        })

      const parsed =
        JSON.parse(content)

      setPresentationGrade(parsed)
      return parsed
    } catch (gradeError) {
      console.error(
        'Presentation grading failed:',
        gradeError,
      )
      return null
    }
  }

  const gradeConversation =
    async ({
      followUpTranscript,
      generalTranscript,
    }) => {
      const schema = {
        type: 'json_schema',
        json_schema: {
          name: 'oral_conversation_grade',
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
You are an IB Language B individual oral examiner grading a practice conversation.

Target language: ${currentLanguage.languageName}
Level: ${level}

Criterion B2 Message - Conversation: 6 marks.
Criterion C Interactive skills - Communication: 6 marks.

Judge:
- relevance and depth of responses
- ability to sustain and develop conversation
- comprehension as shown by responses
- independent contributions
- appropriateness and effectiveness of communication

Do not grade subject-matter knowledge.
Do not punish a student for having opinions you disagree with.
Do not invent audio-only pronunciation faults from text.
        `,
          user: `
Part 2 follow-up transcript:
${followUpTranscript || '(No transcript.)'}

Part 3 general discussion transcript:
${generalTranscript || '(No transcript.)'}

Give a realistic formative assessment.
        `,
          responseFormat: schema,
          temperature: 0.2,
          maxTokens: 1400,
        })

        const parsed =
          JSON.parse(content)

        setConversationGrade(parsed)
        return parsed
      } catch (conversationError) {
        console.error(
          'Conversation grading failed:',
          conversationError,
        )
        return null
      }
    }

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
          await transcribeCurrentRecording(
            {
              targetPart:
                'presentation',
              targetBlob:
                recordedBlob,
            },
          )

        if (!text) return

        await gradePresentation(text)

        await generateFollowUpQuestions(
          text,
        )

        setPart('followUp')
        setAnswerTranscript('')
        setAiMessages([
          {
            role: 'assistant',
            content:
              'Your presentation is recorded. I will now ask follow-up questions about the stimulus and your ideas.',
          },
          {
            role: 'assistant',
            content:
              questions[0] ||
              'Why is this issue important in your target culture?',
          },
        ])
      } finally {
        setProcessing(false)
      }
    }

  const submitConversationAnswer =
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

      setAnswerTranscribing(true)
      setError('')

      try {
        let text =
          answerTranscript.trim()

        if (recordedBlob) {
          text =
            (await transcribeCurrentRecording(
              {
                targetPart: part,
                targetBlob:
                  recordedBlob,
              },
            )) || text
        }

        if (!text) {
          setError(
            'No spoken response was detected.',
          )
          return
        }

        const currentQuestionText =
          currentQuestion ||
          'Continue the discussion.'

        setAiMessages(
          (current) => [
            ...current,
            {
              role: 'user',
              content: text,
            },
          ],
        )

        if (part === 'followUp') {
          if (
            questionIndex <
            questions.length - 1
          ) {
            const nextQuestion =
              questions[
                questionIndex + 1
              ]

            setQuestionIndex(
              (current) =>
                current + 1,
            )

            setAiMessages(
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
            setAnswerTranscript('')
            return
          }

          const general =
            await generateGeneralQuestions()

          setGeneralQuestions(
            general,
          )
          setGeneralQuestionIndex(0)
          setPart('general')
          setRecordedBlob(null)
          setAnswerTranscript('')

          setAiMessages(
            (current) => [
              ...current,
              {
                role: 'assistant',
                content:
                  general[0] ||
                  'Let us move to a different theme.',
              },
            ],
          )

          return
        }

        if (part === 'general') {
          const nextIndex =
            generalQuestionIndex + 1

          if (
            nextIndex <
            generalQuestions.length
          ) {
            const nextQuestion =
              generalQuestions[
                nextIndex
              ]

            setGeneralQuestionIndex(
              nextIndex,
            )

            setAiMessages(
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
            setAnswerTranscript('')
            return
          }

          const priorConversation =
            aiMessages
              .map(
                (message) =>
                  `${message.role}: ${message.content}`,
              )
              .join('\n\n')

          setOverallResult({
            completed: true,
            transcript,
            finalConversation:
              `${priorConversation}\n\nassistant: ${currentQuestionText}\n\nstudent: ${text}`,
          })

          await gradeConversation({
            followUpTranscript:
              priorConversation,
            generalTranscript:
              `${currentQuestionText}\n${text}`,
          })

          setRecordedBlob(null)
          setAnswerTranscript('')
        }
      } finally {
        setAnswerTranscribing(false)
      }
    }

  const generateGeneralQuestions =
    async () => {
      setAiQuestionLoading(true)

      try {
        const schema = {
          type: 'json_schema',
          json_schema: {
            name: 'oral_general_discussion_questions',
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
              required: ['questions'],
              additionalProperties: false,
            },
          },
        }

        const otherThemes =
          shuffle(
            THEMES.filter(
              (item) =>
                item !== theme,
            ),
          )

        const selectedTheme =
          otherThemes[0] ||
          generalTheme

        setGeneralTheme(
          selectedTheme,
        )

        const content =
          await callDinoAI({
            system: `
You are an expert IB Language B examiner.

Create Part 3 general discussion questions for a ${level} individual oral.

The student speaks ${currentLanguage.languageName}.
Use the IB Language B five-theme framework.

Part 3 should be a genuine general discussion on at least one additional syllabus theme.
Do not return grammar exercises.
Do not ask yes/no questions.
Create progressively more developed questions.
Write everything in the target language.
        `,
            user: `
Primary theme from Part 1:
${theme}

Additional theme for Part 3:
${selectedTheme}

Suggested topic areas:
${THEME_TOPICS[selectedTheme].join(', ')}

Generate questions now.
        `,
            responseFormat: schema,
            temperature: 0.5,
            maxTokens: 1200,
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
          `Quels changements aimeriez-vous voir dans cette société ?`,
          `Quel rôle les jeunes peuvent-ils jouer dans cette question ?`,
          `Comment cette question est-elle différente dans votre pays ?`,
          `Quels sont les avantages et les inconvénients de cette situation ?`,
          `Comment cette situation pourrait-elle évoluer à l'avenir ?`,
        ]
      } finally {
        setAiQuestionLoading(false)
      }
    }

  const resetPractice = () => {
    resetRecordingState()

    setRecordedBlob(null)

    if (recordedAudioUrl) {
      URL.revokeObjectURL(
        recordedAudioUrl,
      )
    }

    setRecordedAudioUrl('')
    setTranscript('')
    setPresentationGrade(null)
    setConversationGrade(null)
    setQuestions([])
    setQuestionIndex(0)
    setGeneralQuestions([])
    setGeneralQuestionIndex(0)
    setAnswerTranscript('')
    setAiMessages(
      INITIAL_MESSAGES,
    )
    setOverallResult(null)
    setError('')
    setCopied(false)

    resetPreparation()
    setPart('presentation')
  }

  const nextStimulus = () => {
    chooseNewStimulus()
    resetPractice()
  }

  const copyTranscript = async () => {
    if (!transcript) return

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
        'Could not copy the transcript.',
      )
    }
  }

  const totalGrade =
    presentationGrade &&
    conversationGrade
      ? Number(
          presentationGrade.language || 0,
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

  if (goldLoading) {
    return (
      <div
        style={{
          minHeight: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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

          <h2>Gold only.</h2>

          <p>
            Individual Oral practice, AI
            conversation, image stimuli,
            recording and transcription are
            available to Dino Gold members.
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
          .dino-oral-shell {
            width: 100%;
            min-height: 100%;
            padding: 2px;
            box-sizing: border-box;
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
            max-width: 650px;
            margin: 10px 0 0;
            color: #777;
            font-size: 11px;
            line-height: 1.55;
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

          .dino-oral-workspace {
            display: grid;
            grid-template-columns: minmax(0, 1.18fr) minmax(320px, .82fr);
            gap: 14px;
            align-items: stretch;
          }

          .dino-oral-card {
            min-width: 0;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.78);
            backdrop-filter: blur(18px);
            box-shadow: 0 18px 50px rgba(0,0,0,.035);
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
            height: 100%;
            min-height: 370px;
            display: block;
            object-fit: cover;
          }

          .dino-oral-image-empty {
            min-height: 370px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            text-align: center;
            color: #8a8a8a;
            font-size: 10px;
            line-height: 1.5;
          }

          .dino-oral-stimulus-tag {
            position: absolute;
            left: 12px;
            top: 12px;
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

          .dino-oral-info-value {
            color: #161616;
            font-size: 10px;
            line-height: 1.4;
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
            box-sizing: border-box;
            min-height: 48px;
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
            margin-top: 10px;
            padding: 11px;
            max-height: 190px;
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

          .dino-oral-grade-score {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -.04em;
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
            .dino-oral-topbar {
              flex-direction: column;
            }

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
          }
        `}
      </style>

      <div className="dino-oral-shell">
        <div className="dino-oral-topbar">
          <div>
            <span className="dino-oral-kicker">
              IB Language B · Individual Oral
            </span>

            <h2 className="dino-oral-title">
              Oral practice.
            </h2>

            <p className="dino-oral-description">
              A full simulated IB Language B individual
              oral with preparation, stimulus
              presentation, follow-up discussion,
              general discussion, recording,
              multilingual transcription and AI
              formative feedback.
            </p>
          </div>

          <div className="dino-oral-controls">
            <select
              className="dino-oral-select"
              value={language}
              onChange={(event) => {
                setLanguage(
                  event.target.value,
                )
                setTranscript('')
                setPresentationGrade(null)
                setConversationGrade(null)
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
        </div>

        <div className="dino-oral-workspace">
          <div className="dino-oral-card">
            <div className="dino-oral-card-header">
              <strong>
                {level === 'SL'
                  ? 'Visual stimulus'
                  : 'Oral stimulus workspace'}
              </strong>

              <span className="dino-oral-pill">
                {level === 'SL'
                  ? '15 min preparation'
                  : '20 min preparation'}
              </span>
            </div>

            <div className="dino-oral-stimulus">
              <div className="dino-oral-image-wrap">
                {imageLoading ? (
                  <div className="dino-oral-image-empty">
                    Loading IO visual stimuli...
                  </div>
                ) : currentImage &&
                  !imageBroken ? (
                  <>
                    <img
                      className="dino-oral-image"
                      src={currentImage}
                      alt={`IB Language B oral stimulus for ${theme}`}
                      onError={() => {
                        setImageBroken(
                          true,
                        )
                      }}
                    />

                    <div className="dino-oral-stimulus-tag">
                      {theme}
                    </div>
                  </>
                ) : (
                  <div className="dino-oral-image-empty">
                    No compatible image was loaded
                    from public/assets/io_images.
                    <br />
                    Add the IO stimulus images to that
                    folder or provide an images.json
                    manifest there.
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
                      width: '100%',
                    }}
                    value={theme}
                    onChange={(event) => {
                      setTheme(
                        event.target.value,
                      )
                    }}
                    disabled={
                      preparing ||
                      recording ||
                      preparationFinished
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
                      width: '100%',
                    }}
                    value={topic}
                    onChange={(event) =>
                      setTopic(
                        event.target.value,
                      )
                    }
                    disabled={
                      preparing ||
                      recording ||
                      preparationFinished
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
                    chooseNewStimulus
                  }
                  disabled={
                    preparing ||
                    recording ||
                    preparationFinished ||
                    imageList.length < 2
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
                    ? formatSeconds(
                        preparationSeconds,
                      )
                    : recording
                      ? formatSeconds(
                          recordingSeconds,
                        )
                      : preparationFinished
                        ? 'READY'
                        : formatSeconds(
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
                          ? 'Begin the oral'
                          : 'Preparation time'}
                  </strong>

                  <span>
                    {preparing
                      ? `${preparationMinutes} minutes`
                      : recording
                        ? `${activePart.minutes} minute target`
                        : level === 'HL'
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
                        ? Math.min(
                            100,
                            preparationProgress *
                              100,
                          )
                        : recording
                          ? Math.min(
                              100,
                              timerProgress *
                                100,
                            )
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

                      setPreparing(false)
                    }}
                  >
                    Pause preparation
                  </button>
                </div>
              )}
            </div>

            <div className="dino-oral-prep">
              <h3 className="dino-oral-section-title">
                Working notes
              </h3>

              <p className="dino-oral-section-description">
                Use brief prompts only. The IB
                examination allows approximately ten
                short points, not a scripted speech.
              </p>

              <div className="dino-oral-notes">
                {notes.map(
                  (value, index) => (
                    <textarea
                      key={index}
                      className="dino-oral-note"
                      value={value}
                      maxLength={180}
                      placeholder={`Point ${index + 1}`}
                      onChange={(event) => {
                        const next =
                          [...notes]

                        next[index] =
                          event.target.value

                        setNotes(next)
                      }}
                      disabled={
                        preparationFinished &&
                        !preparing
                      }
                    />
                  ),
                )}
              </div>

              <div className="dino-oral-note-counter">
                {usedNotes}/10 note points used
              </div>
            </div>
          </div>

          <div className="dino-oral-card dino-oral-right">
            <div className="dino-oral-card-header">
              <strong>
                Simulated examiner
              </strong>

              <span className="dino-oral-pill">
                {level} · {currentLanguage.languageName}
              </span>
            </div>

            <div className="dino-oral-phase-tabs">
              {Object.entries(
                PARTS,
              ).map(
                ([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    className={
                      part === key
                        ? 'dino-oral-phase-tab active'
                        : 'dino-oral-phase-tab'
                    }
                    onClick={() => {
                      if (
                        preparationFinished &&
                        !recording
                      ) {
                        setPart(key)
                      }
                    }}
                    disabled={
                      recording ||
                      !preparationFinished
                    }
                  >
                    <strong>
                      {value.title}
                    </strong>
                    <span>
                      {value.subtitle}
                    </span>
                  </button>
                ),
              )}
            </div>

            <div className="dino-oral-chat">
              <div className="dino-oral-chat-body">
                {aiMessages.map(
                  (message, index) => (
                    <div
                      key={`${index}-${message.role}`}
                      className={
                        message.role ===
                        'user'
                          ? 'dino-oral-message user'
                          : 'dino-oral-message'
                      }
                    >
                      <div className="dino-oral-message-bubble">
                        {message.content}
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
                      Current examiner question
                    </div>

                    <div className="dino-oral-question">
                      {currentQuestion}
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
                      ? 'Recording your response'
                      : transcribing ||
                          answerTranscribing
                        ? 'Transcribing with Groq'
                        : processing
                          ? 'Preparing examiner feedback'
                          : 'Microphone ready'}
                  </span>

                  <span className="dino-oral-recording-time">
                    {formatSeconds(
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
                    preparationFinished && (
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
                          processing ||
                          aiQuestionLoading
                        }
                      >
                        {part ===
                        'presentation'
                          ? 'Start presentation recording'
                          : 'Record answer'}
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
                          submitConversationAnswer
                        }
                        disabled={
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
                  <div>
                    <div className="dino-oral-transcript">
                      {transcript}
                    </div>

                    {part ===
                      'presentation' && (
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
                    )}
                  </div>
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
                          key={`s-${index}`}
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
                          key={`i-${index}`}
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
                          key={`cs-${index}`}
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
                          key={`ci-${index}`}
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

        {overallResult?.completed && (
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
              {totalGrade !== null
                ? `${totalGrade}/30`
                : '—'}
            </div>

            <p
              style={{
                margin:
                  '8px 0 0',
                maxWidth:
                  '650px',
                color:
                  '#777',
                fontSize:
                  '10px',
                lineHeight:
                  1.5,
              }}
            >
              This is formative AI feedback for
              practice. Your official IB result is
              determined by your teacher/examiner using
              the IB assessment criteria.
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
                onClick={
                  nextStimulus
                }
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