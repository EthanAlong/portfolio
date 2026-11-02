/**
 * POST /api/contact — the portfolio's contact form.
 *
 * Forwards a message to Ethan's inbox through Resend's REST API (no SDK, no
 * database). Reply-To is the visitor, so answering is one click in Outlook.
 *
 * Environment (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  required; without it the route answers 503 and the form
 *                   falls back to a mailto link
 *   CONTACT_TO      inbox to deliver to (default: the public address)
 *   CONTACT_FROM    sender; Resend's onboarding@resend.dev works without a
 *                   verified domain as long as CONTACT_TO is the Resend
 *                   account's own address
 *
 * Spam: a honeypot field, a minimum time on the page, and a best-effort
 * per-IP limit (in memory, so per serverless instance).
 */
export const runtime = 'nodejs'

const LIMIT = 5                 // messages per IP per window
const WINDOW_MS = 60 * 60 * 1000
const MIN_FILL_MS = 3000        // faster than this is a bot
const hits = new Map()

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function limited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) return true
  recent.push(now)
  hits.set(ip, recent)
  return false
}

const json = (body, status = 200) => Response.json(body, { status })

export async function POST(request) {
  let data
  try {
    data = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }

  const name = String(data.name || '').trim().slice(0, 120)
  const email = String(data.email || '').trim().slice(0, 200)
  const company = String(data.company || '').trim().slice(0, 160)
  const message = String(data.message || '').trim().slice(0, 5000)

  // bots: pretend success, send nothing
  if (data.website) return json({ ok: true })
  if (typeof data.t === 'number' && Date.now() - data.t < MIN_FILL_MS) return json({ ok: true })

  if (!name || !EMAIL.test(email) || message.length < 10) {
    return json({ error: 'invalid' }, 400)
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return json({ error: 'rate_limited' }, 429)

  const key = process.env.RESEND_API_KEY
  if (!key) return json({ error: 'not_configured' }, 503)

  const to = process.env.CONTACT_TO || 'Ethan_along@outlook.com'
  const from = process.env.CONTACT_FROM || 'EthanDigital <onboarding@resend.dev>'
  const text = [
    `From: ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    `Page: ${String(data.page || '').slice(0, 200)}`,
    '',
    message,
  ].filter((l) => l !== null).join('\n')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio: ${name}${company ? ` (${company})` : ''}`,
        text,
      }),
    })
    if (!res.ok) return json({ error: 'send_failed' }, 502)
    return json({ ok: true })
  } catch {
    return json({ error: 'send_failed' }, 502)
  }
}
