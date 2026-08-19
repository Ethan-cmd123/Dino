// api/generate.js

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      ok: true,
    })
  }

  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error:
        'GROQ_API_KEY is not configured on the server.',
    })
  }

  /*
   * --------------------------------------------------------------------------
   * IMAGE MANIFEST
   * --------------------------------------------------------------------------
   *
   * Optional:
   *
   * public/assets/io_images/manifest.json
   *
   * can contain:
   *
   * [
   *   "1.jpg",
   *   "2.jpg",
   *   "3.jpg"
   * ]
   *
   * or:
   *
   * {
   *   "images": [
   *     "1.jpg",
   *     "2.jpg"
   *   ]
   * }
   *
   * This endpoint attempts to read that manifest.
   */
  if (
    req.method === 'GET' &&
    (req.query?.mode === 'io-images' ||
      req.query?.images === 'true')
  ) {
    try {
      const fs = await import('fs/promises')
      const path = await import('path')

      const manifestPaths = [
        path.join(
          process.cwd(),
          'public',
          'assets',
          'io_images',
          'manifest.json',
        ),
        path.join(
          process.cwd(),
          'public',
          'assets',
          'io_images',
          'images.json',
        ),
      ]

      for (const manifestPath of manifestPaths) {
        try {
          const raw =
            await fs.readFile(
              manifestPath,
              'utf8',
            )

          const parsed =
            JSON.parse(raw)

          const images =
            Array.isArray(parsed)
              ? parsed
              : Array.isArray(
                    parsed?.images,
                  )
                ? parsed.images
                : []

          return res.status(200).json({
            images,
          })
        } catch {
          // Continue to the next possible manifest.
        }
      }

      return res.status(200).json({
        images: [],
      })
    } catch (error) {
      console.error(
        'IO image manifest lookup failed:',
        error,
      )

      return res.status(200).json({
        images: [],
      })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: `Method ${req.method} not allowed. Use POST.`,
    })
  }

  try {
    let body = req.body

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        return res.status(400).json({
          error: 'Invalid JSON request body.',
        })
      }
    }

    /*
     * ------------------------------------------------------------------------
     * GROQ SPEECH TO TEXT
     * ------------------------------------------------------------------------
     *
     * Client sends:
     *
     * {
     *   transcription: true,
     *   audioBase64: "...",
     *   mimeType: "audio/webm",
     *   language: "fr",
     *   prompt: "..."
     * }
     *
     * The browser does not receive GROQ_API_KEY.
     */
    if (body?.transcription === true) {
      const {
        audioBase64,
        mimeType = 'audio/webm',
        language,
        prompt = '',
        model = 'whisper-large-v3-turbo',
      } = body

      if (!audioBase64) {
        return res.status(400).json({
          error:
            'Missing audioBase64 for transcription.',
        })
      }

      if (
        typeof audioBase64 !==
        'string'
      ) {
        return res.status(400).json({
          error:
            'audioBase64 must be a string.',
        })
      }

      const cleanBase64 =
        audioBase64
          .replace(/^data:.*?;base64,/, '')
          .trim()

      let audioBuffer

      try {
        audioBuffer =
          Buffer.from(
            cleanBase64,
            'base64',
          )
      } catch {
        return res.status(400).json({
          error:
            'Could not decode audio data.',
        })
      }

      if (!audioBuffer.length) {
        return res.status(400).json({
          error:
            'Audio recording was empty.',
        })
      }

      /*
       * Groq currently accepts common browser/audio
       * formats including webm, wav, mp3, m4a,
       * ogg and mp4.
       */
      const extensionMap = {
        'audio/webm':
          'webm',
        'audio/webm;codecs=opus':
          'webm',
        'audio/ogg':
          'ogg',
        'audio/ogg;codecs=opus':
          'ogg',
        'audio/mp4':
          'mp4',
        'audio/mpeg':
          'mp3',
        'audio/mp3':
          'mp3',
        'audio/wav':
          'wav',
        'audio/x-wav':
          'wav',
        'audio/m4a':
          'm4a',
      }

      const extension =
        extensionMap[
          mimeType
        ] || 'webm'

      const fileBlob =
        new Blob(
          [audioBuffer],
          {
            type: mimeType,
          },
        )

      const formData =
        new FormData()

      formData.append(
        'file',
        fileBlob,
        `dino-oral.${extension}`,
      )

      formData.append(
        'model',
        model ||
          'whisper-large-v3-turbo',
      )

      formData.append(
        'response_format',
        'json',
      )

      formData.append(
        'temperature',
        '0',
      )

      if (language) {
        formData.append(
          'language',
          language,
        )
      }

      if (prompt) {
        formData.append(
          'prompt',
          String(prompt).slice(
            0,
            1000,
          ),
        )
      }

      const groqResponse =
        await fetch(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
          },
        )

      const responseText =
        await groqResponse.text()

      let data = {}

      if (responseText) {
        try {
          data =
            JSON.parse(
              responseText,
            )
        } catch {
          data = {
            error:
              responseText,
          }
        }
      }

      if (!groqResponse.ok) {
        return res.status(
          groqResponse.status,
        ).json({
          error:
            data?.error?.message ||
            data?.error ||
            `Groq transcription failed with status ${groqResponse.status}.`,
        })
      }

      return res.status(200).json({
        text:
          data?.text || '',
      })
    }

    /*
     * ------------------------------------------------------------------------
     * CHAT COMPLETIONS
     * ------------------------------------------------------------------------
     */

    const {
      system = '',
      user = '',
      responseFormat,
      temperature = 0.3,
      maxTokens = 1800,
      model = 'openai/gpt-oss-120b',
    } = body || {}

    if (!user) {
      return res.status(400).json({
        error:
          'Missing user prompt.',
      })
    }

    const groqResponse =
      await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature,
            max_completion_tokens:
              maxTokens,
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
                  response_format:
                    responseFormat,
                }
              : {}),
          }),
        },
      )

    const responseText =
      await groqResponse.text()

    let data = {}

    if (responseText) {
      try {
        data =
          JSON.parse(
            responseText,
          )
      } catch {
        data = {
          error:
            responseText,
        }
      }
    }

    if (!groqResponse.ok) {
      return res.status(
        groqResponse.status,
      ).json({
        error:
          data?.error?.message ||
          data?.error ||
          `Groq request failed with status ${groqResponse.status}.`,
      })
    }

    const content =
      data?.choices?.[0]
        ?.message?.content || ''

    return res.status(200).json({
      content,
    })
  } catch (error) {
    console.error(
      'Groq proxy error:',
      error,
    )

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Internal server error.',
    })
  }
}