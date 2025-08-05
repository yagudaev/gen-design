import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import Stripe from 'stripe'

import { prisma } from '@/lib/db'
import stripe from '@/lib/stripe'
import { updateNewsletterUser } from '@/newsletter'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const headers = req.headers
  const body = await req.text()

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers.get('stripe-signature') ?? '',
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    )

    console.info(`StripeEvent: ${stripeEvent.type}`)

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        // First payment is successful and a subscription is created
        const object = stripeEvent.data.object
        if (!('customer' in object && object.customer)) {
          throw new Error('Customer ID is missing')
        }

        const customerId = object.customer.toString()

        // if the customer doesn't yet have an account, we will need to create one
        const customer = await stripe.customers.retrieve(customerId)

        if (!('email' in customer && customer.email)) {
          throw new Error('Customer email is missing')
        }
        const email = customer.email

        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          user = await prisma.user.create({
            data: { email },
          })
          upgradeUser(customer)
        } else {
          upgradeUser(customer)
        }

        break
      }
      case 'invoice.payment_succeeded': {
        // If a payment succeeded we update stored subscription status to "active"
        // in case it was previously "trialing" or "past_due".

        const object = stripeEvent.data.object
        if (!object.subscription) {
          throw new Error('Subscription ID is missing')
        }

        const subscriptionId = object.subscription.toString()
        updateSubscription(subscriptionId)

        break
      }
      case 'invoice.payment_failed': {
        const object = stripeEvent.data.object
        if (!object.subscription) {
          throw new Error('Subscription ID is missing')
        }

        const subscriptionId = object.subscription.toString()
        updateSubscription(subscriptionId)

        break
      }

      // ignore for now
      case 'customer.subscription.updated': {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance

        // const object = stripeEvent.data.object

        // if (!('customer' in object && object.customer)) {
        //   throw new Error('Customer ID is missing')
        // }
        // if (!('items' in object && object.items)) {
        //   throw new Error('Subscription items are missing')
        // }

        // await updateUserByCustomerId(object.customer.toString(), {
        //   stripePriceId: object.items.data[0].price.id,
        //   stripeSubscriptionStatus: object.status,
        // })

        // 💡 You could also read "cancel_at_period_end" if you'd like to email user and learn why they cancelled
        // or convince them to renew before their subscription is deleted at end of payment period.
        break
      }

      case 'customer.subscription.deleted': {
        // If a subscription was deleted update stored subscription status to "canceled".
        // Keep in mind this won't be called right away if "Cancel at end of billing period" is selected
        // in Billing Portal settings (https://dashboard.stripe.com/settings/billing/portal). Instead you'll
        // get a "customer.subscription.updated" event with a cancel_at_period_end value.

        const object = stripeEvent.data.object
        updateCustomer(object.customer.toString(), 'deleted')

        break
      }

      // ignore for now
      case 'customer.subscription.trial_will_end': {
        // This event happens 3 days before a trial ends
        // 💡 You could email user letting them know their trial will end or you can have Stripe do that
        // automatically 7 days in advance: https://dashboard.stripe.com/settings/billing/automatic

        break
      }

      // no default
    }

    return Response.json({ status: 'success' })
  } catch (error: any) {
    return Response.json(
      {
        status: 'error',
        code: error.code,
        message: error.message,
      },
      { status: 400 },
    )
  }
}

async function updateSubscription(subscriptionId: string) {
  // always get the latest subscription data from stripe, this is important
  // if webhooks are delayed or come out of order, this guarantees we have the latest data
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  if (!subscription.customer) {
    throw new Error('Customer ID is missing')
  }
  const customerId = subscription.customer.toString()
  await updateCustomer(customerId, subscription.status)
}

async function updateCustomer(
  customerId: string,
  subscriptionStatus: Stripe.Subscription.Status | 'deleted',
) {
  const customer = await stripe.customers.retrieve(customerId)

  let user
  if (
    (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') &&
    !customer.deleted
  ) {
    user = await upgradeUser(customer)
  } else {
    user = await downgradeUser(customer)
  }
}

const CREDITS_IN_PLAN = 600_000

async function upgradeUser(customer: Stripe.Customer) {
  if (customer.email === null) {
    throw new Error('Customer email is missing')
  }

  console.log('Upgrade user:', customer.email)

  const user = await prisma.user.findUnique({
    where: { email: customer.email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser = await prisma.user.update({
    where: { email: customer.email },
    data: {
      plan: 'pro',
      stripeCustomerId: customer.id,
      totalCredits: user?.totalCredits + CREDITS_IN_PLAN,
    },
  })

  console.log('User upgraded:', updatedUser)
  updateNewsletterUser(updatedUser)

  return updatedUser
}

async function downgradeUser(
  customer: Stripe.Customer | Stripe.DeletedCustomer,
) {
  console.log('Downgrade stripe user:', customer.id, (customer as any).email)

  let user
  try {
    user = await prisma.user.update({
      where: { stripeCustomerId: customer.id },
      data: { plan: 'free' },
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      console.log('No user found to downgrade')
    } else {
      throw error
    }
  }

  console.log('User downgraded:', user)
  updateNewsletterUser(user as User)

  return user
}
