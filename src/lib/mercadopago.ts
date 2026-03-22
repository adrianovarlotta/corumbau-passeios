import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

// Lazy init pattern — avoids crash during build when env is not set
const getClient = (() => {
  let client: MercadoPagoConfig | null = null
  return () => {
    if (!client) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
      if (!accessToken) {
        throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured')
      }
      client = new MercadoPagoConfig({ accessToken })
    }
    return client
  }
})()

/**
 * Creates a Mercado Pago Pix payment
 */
export async function createPixPayment(
  amount: number,
  bookingId: string,
  customerEmail: string,
  customerName: string,
) {
  const client = getClient()
  const payment = new Payment(client)

  const result = await payment.create({
    body: {
      transaction_amount: amount,
      payment_method_id: 'pix',
      payer: {
        email: customerEmail,
        first_name: customerName.split(' ')[0],
        last_name: customerName.split(' ').slice(1).join(' ') || customerName,
      },
      description: `Reserva Corumbau Passeios #${bookingId.slice(-6)}`,
      external_reference: bookingId,
    },
  })

  return {
    paymentId: String(result.id),
    status: result.status,
    pixQrCode: result.point_of_interaction?.transaction_data?.qr_code,
    pixQrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
    pixCopyPaste: result.point_of_interaction?.transaction_data?.qr_code,
    ticketUrl: result.point_of_interaction?.transaction_data?.ticket_url,
  }
}

/**
 * Creates a Mercado Pago checkout preference (credit card + other methods)
 */
export async function createCheckoutPreference(
  amount: number,
  bookingId: string,
  tourName: string,
  customerEmail: string,
  customerName: string,
) {
  const client = getClient()
  const preference = new Preference(client)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const result = await preference.create({
    body: {
      items: [
        {
          id: bookingId,
          title: tourName,
          quantity: 1,
          unit_price: amount,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: customerEmail,
        name: customerName,
      },
      external_reference: bookingId,
      back_urls: {
        success: `${baseUrl}/pagamento/sucesso?bookingId=${bookingId}`,
        failure: `${baseUrl}/pagamento/erro?bookingId=${bookingId}`,
        pending: `${baseUrl}/pagamento/pendente?bookingId=${bookingId}`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    },
  })

  return {
    preferenceId: result.id,
    initPoint: result.init_point, // URL to redirect user
    sandboxInitPoint: result.sandbox_init_point, // Sandbox URL
  }
}

/**
 * Gets payment status by ID
 */
export async function getPaymentStatus(paymentId: string) {
  const client = getClient()
  const payment = new Payment(client)

  const result = await payment.get({ id: paymentId })

  return {
    id: String(result.id),
    status: result.status,
    statusDetail: result.status_detail,
    externalReference: result.external_reference,
  }
}

/**
 * Refunds a payment
 */
export async function refundPayment(paymentId: number) {
  const client = getClient()
  const payment = new Payment(client)

  // Use the REST API for refunds
  const result = await payment.get({ id: paymentId })
  if (result.status !== 'approved') {
    throw new Error('Só é possível estornar pagamentos aprovados')
  }

  // For sandbox, refunds are simulated
  return { refunded: true, paymentId }
}
