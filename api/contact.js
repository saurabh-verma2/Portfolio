import nodemailer from 'nodemailer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (
      !name ||
      name.length > 100 ||
      !EMAIL_PATTERN.test(email) ||
      email.length > 254 ||
      !message ||
      message.length > 5000
    ) {
      return Response.json({ error: 'Please check the submitted form fields.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
