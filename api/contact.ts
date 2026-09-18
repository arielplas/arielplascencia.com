/**
 * Vercel serverless function: POST /api/contact
 * Forwards the contact form to your inbox through Resend (https://resend.com).
 *
 * Required env vars on Vercel:
 *   RESEND_API_KEY  - from the Resend dashboard
 *   CONTACT_TO      - the inbox that receives messages (e.g. imariel2d@gmail.com)
 *   CONTACT_FROM    - a verified sender, e.g. "Portfolio <hello@arielplascencia.com>"
 *
 * Without them the endpoint answers 503 and the form falls back to a mailto: link.
 */

interface ContactPayload {
  name?: string
  email?: string
  intent?: string
  message?: string
  website?: string // honeypot
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  )

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  const from = process.env.CONTACT_FROM
  if (!apiKey || !to || !from) return json(503, { error: 'Contact endpoint not configured' })

  let body: ContactPayload
  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  if (body.website) return json(200, { ok: true }) // bot filled the honeypot

  const name = (body.name ?? '').trim().slice(0, 120)
  const email = (body.email ?? '').trim().slice(0, 200)
  const intent = (body.intent ?? 'other').trim().slice(0, 40)
  const message = (body.message ?? '').trim().slice(0, 5000)

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Name, a valid email and a message are required' })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Portfolio] ${intent}: ${name}`,
      html: `<p><strong>${escape(name)}</strong> &lt;${escape(email)}&gt; · ${escape(intent)}</p><p>${escape(message).replace(/\n/g, '<br/>')}</p>`,
      text: `${name} <${email}> · ${intent}\n\n${message}`,
    }),
  })

  if (!res.ok) return json(502, { error: 'Email provider rejected the message' })
  return json(200, { ok: true })
}
