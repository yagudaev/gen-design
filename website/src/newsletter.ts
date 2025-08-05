import { User } from '@prisma/client'
import md5 from 'md5'

const EMAIL_OCTOPUS_API_KEY = process.env.EMAIL_OCTOPUS_API_KEY
const EMAIL_OCTOPUS_LIST_ID = process.env.EMAIL_OCTOPUS_LIST_ID

export async function addToNewsletter(user: User) {
  if (!EMAIL_OCTOPUS_API_KEY || !EMAIL_OCTOPUS_LIST_ID) {
    throw new Error('Email Octopus API key or List ID not configured')
  }

  try {
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: EMAIL_OCTOPUS_API_KEY,
          email_address: user.email,
          fields: {
            FirstName: user.firstName,
            LastName: user.lastName,
            CreatedAt: user.createdAt,
            UpdatedAt: user.updatedAt,
            Plan: user.plan,
          },
          tags: [],
          status: 'SUBSCRIBED',
        }),
      },
    )

    if (response.ok) {
      console.log(`User ${user.email} successfully added to the newsletter`)
      return true
    } else {
      console.error(
        `Failed to add user ${user.email} to the newsletter`,
        response,
      )
      return false
    }
  } catch (error) {
    console.error(`Error adding user ${user.email} to the newsletter:`, error)
    return false
  }
}

export async function updateNewsletterUser(user: User) {
  if (!EMAIL_OCTOPUS_API_KEY || !EMAIL_OCTOPUS_LIST_ID) {
    throw new Error('Email Octopus API key or List ID not configured')
  }

  const emailMd5 = md5(user.email.toLowerCase())

  try {
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts/${emailMd5}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: EMAIL_OCTOPUS_API_KEY,
          email_address: user.email,
          fields: {
            FirstName: user.firstName,
            LastName: user.lastName,
            CreatedAt: user.createdAt,
            UpdatedAt: user.updatedAt,
            Plan: user.plan,
          },
        }),
      },
    )

    if (response.ok) {
      console.log(`User ${user.email} successfully updated in the newsletter`)
      return true
    } else {
      const body = await response.text()
      console.error(
        `Failed to update user ${user.email} in the newsletter`,
        response.status,
        response.statusText,
        body,
      )
      return false
    }
  } catch (error) {
    console.error(`Error updating user ${user.email} in the newsletter:`, error)
    return false
  }
}
