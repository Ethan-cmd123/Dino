export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured on the server.',
    })
  }

  try {
    const {
      system,
      user,
      responseFormat,
      temperature = 0.3,
      maxTokens = 1800,
      model = 'openai/gpt-oss-120b',
    } = req.body || {}

    if (!user) {
      return res.status(400).json({
        error: 'Missing user prompt.',
      })
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature,
          max_completion_tokens: maxTokens,
          messages: [
            {
              role: 'system',
              content: system || '',
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
      },
    )

    const data = await groqResponse.json()

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error:
          data?.error?.message ||
          `Groq request failed with status ${groqResponse.status}.`,
      })
    }

    return res.status(200).json({
      content:
        data?.choices?.[0]?.message?.content || '',
    })
  } catch (error) {
    console.error('Groq proxy error:', error)

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Internal server error.',
    })
  }
}