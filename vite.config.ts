import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

function anthropicProxyPlugin(apiKey: string): Plugin {
  return {
    name: 'anthropic-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai/generate', (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.statusCode = 501
          res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { prompt } = JSON.parse(body)
            if (!prompt || typeof prompt !== 'string') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Missing or invalid "prompt" field' }))
              return
            }

            const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
              },
              body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 512,
                system: `You are a gig listing assistant for Alumable, a platform connecting employers with university students.

Given the employer's description, generate:
1. "title" — Jobs-to-be-Done headline, 3-5 words, starts with action verb
2. "description" — bullet list using "•", max 150 words, concrete actionable tasks, no vague language

Return ONLY valid JSON: {"title": "...", "description": "• Task one.\\n• Task two."}`,
                messages: [{ role: 'user', content: prompt }],
              }),
            })

            if (!anthropicRes.ok) {
              const errText = await anthropicRes.text()
              console.error('[anthropic-proxy] API error:', anthropicRes.status, errText)
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Claude API error' }))
              return
            }

            const data = await anthropicRes.json()
            let text = data.content?.[0]?.text ?? ''

            // Strip markdown fences if present
            text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

            const parsed = JSON.parse(text)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ title: parsed.title, description: parsed.description }))
          } catch (err) {
            console.error('[anthropic-proxy] Error:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to process AI response' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const anthropicKey = env.ANTHROPIC_API_KEY ?? ''

  return {
    base: '/employer-web/',
    plugins: [react(), tailwindcss(), anthropicProxyPlugin(anthropicKey)],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 5174,
      strictPort: false,
      watch: {
        ignored: ['!**/node_modules/@sicaho-collab/**'],
      },
    },
  }
})
