import sgMail from '@sendgrid/mail'

import config from '@/config'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendEmail(email: {
  to: string
  subject: string
  html: string
}) {
  if (config.isDevelopment) {
    console.log('Email options:', email)
    return
  }

  try {
    const msg = {
      to: email.to,
      from: 'michael@vibeflow.com',
      subject: email.subject,
      html: email.html,
    }

    await sgMail.send(msg)
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
