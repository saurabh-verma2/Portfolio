import nodemailer from 'nodemailer';
import { createHash } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_REQUEST_BYTES = 12_000;
const MIN_FORM_COMPLETION_MS = 1_500;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 5;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const requestLog = new Map();
const recentMessages = new Map();

function getClientId(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  );
}

function isRateLimited(clientId) {
  const now = Date.now();
  const recent = (requestLog.get(clientId) || []).filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_REQUESTS) {
    requestLog.set(clientId, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(clientId, recent);
  return false;
}

function getMessageFingerprint(clientId, email, message) {
  return createHash('sha256')
    .update(`${clientId}\0${email.toLowerCase()}\0${message}`)
    .digest('hex');
}

function isDuplicateMessage(fingerprint) {
  const now = Date.now();
  const previous = recentMessages.get(fingerprint);

  for (const [key, timestamp] of recentMessages) {
    if (now - timestamp >= DUPLICATE_WINDOW_MS) recentMessages.delete(key);
  }

  if (previous && now - previous < DUPLICATE_WINDOW_MS) return true;
  recentMessages.set(fingerprint, now);
  return false;
}

export async function POST(request) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail SMTP environment variables are missing.');
      return Response.json({ error: 'Email service is unavailable.' }, { status: 500 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return Response.json({ error: 'Expected a JSON request.' }, { status: 415 });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return Response.json({ error: 'Request is too large.' }, { status: 413 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const website = typeof body.website === 'string' ? body.website.trim() : '';
    const startedAt = Number(body.startedAt);
    const completionTime = Date.now() - startedAt;

    // Silently accept honeypot submissions so bots cannot tune around the field.
    if (website) return Response.json({ success: true });

    if (
      !name ||
      name.length > 100 ||
      /[\r\n]/.test(name) ||
      !EMAIL_PATTERN.test(email) ||
      email.length > 254 ||
      !message ||
      message.length > 5000 ||
      !Number.isFinite(startedAt) ||
      completionTime < MIN_FORM_COMPLETION_MS ||
      completionTime > MAX_FORM_AGE_MS
    ) {
      return Response.json({ error: 'Please check the submitted form fields.' }, { status: 400 });
    }

    const clientId = getClientId(request);
    if (isRateLimited(clientId)) {
      return Response.json(
        { error: 'Too many messages. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) },
        },
      );
    }

    const fingerprint = getMessageFingerprint(clientId, email, message);
    if (isDuplicateMessage(fingerprint)) {
      return Response.json({ success: true, duplicate: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO || process.env.GMAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Received: ${new Date().toISOString()}`,
        '',
        message,
      ].join('\n'),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Unable to send portfolio message:', error);
    return Response.json({ error: 'Unable to send the message.' }, { status: 500 });
  }
}
