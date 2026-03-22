import Stripe from 'stripe'

// Lazy init pattern — avoids crash during build when env is not set
const getStripe = (() => {
  let client: Stripe | null = null
  return () => {
    if (!client) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not configured')
      }
      client = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      })
    }
    return client
  }
})()

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop]
  },
})

/**
 * Creates a Stripe Payment Intent for Pix payment
 */
export async function createPixPaymentIntent(
  amount: number,
  bookingId: string,
  customerEmail: string,
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // cents
    currency: 'brl',
    payment_method_types: ['pix'],
    metadata: {
      bookingId,
      customerEmail,
    },
  })

  return paymentIntent
}

/**
 * Creates a Stripe Payment Intent for card payment
 */
export async function createCardPaymentIntent(
  amount: number,
  bookingId: string,
  customerEmail: string,
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'brl',
    payment_method_types: ['card'],
    metadata: {
      bookingId,
      customerEmail,
    },
  })

  return paymentIntent
}

/**
 * Refunds a payment
 */
export async function refundPayment(paymentIntentId: string) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
  })
}
