import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  // Pin to specific version of the Stripe API
  apiVersion: '2023-10-16',
  typescript: true,
})

export default stripe
