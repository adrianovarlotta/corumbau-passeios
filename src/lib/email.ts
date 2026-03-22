import { Resend } from 'resend'

const getResend = (() => {
  let client: Resend | null = null
  return () => {
    if (!client) {
      client = new Resend(process.env.RESEND_API_KEY)
    }
    return client
  }
})()

interface VoucherEmailData {
  to: string
  customerName: string
  tourName: string
  date: string
  time: string
  adults: number
  children: number
  voucherCode: string
  totalAmount: number
  bookingId: string
}

/**
 * Sends voucher email after payment confirmation
 */
export async function sendVoucherEmail(data: VoucherEmailData) {
  const resend = getResend()

  const { error } = await resend.emails.send({
    from: 'Corumbau Passeios <noreply@corumbaupasseios.com.br>',
    to: data.to,
    subject: `✅ Reserva confirmada — ${data.tourName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #0B6E8E; margin-bottom: 8px;">Reserva Confirmada!</h1>
        <p>Olá, <strong>${data.customerName}</strong>!</p>

        <div style="background: #F8F9FA; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h2 style="margin-top: 0; font-size: 18px;">${data.tourName}</h2>
          <p>📅 <strong>${data.date}</strong> às <strong>${data.time}</strong></p>
          <p>👤 ${data.adults} adulto${data.adults > 1 ? 's' : ''}${data.children > 0 ? ` · ${data.children} criança${data.children > 1 ? 's' : ''}` : ''}</p>
          <p>💰 Total: <strong>R$ ${data.totalAmount.toFixed(2).replace('.', ',')}</strong></p>
        </div>

        <div style="background: #0B6E8E; color: white; border-radius: 12px; padding: 32px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px;">Seu código de voucher</p>
          <p style="margin: 0; font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 8px;">
            ${data.voucherCode}
          </p>
        </div>

        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/confirmacao/${data.bookingId}"
             style="display: inline-block; background: #0B6E8E; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Ver Voucher Completo
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />

        <p style="font-size: 12px; color: #94A3B8;">
          Apresente este voucher (QR Code ou código) no dia do embarque.
          Válido somente para a data indicada.
        </p>
        <p style="font-size: 12px; color: #94A3B8;">
          Dúvidas? <a href="https://wa.me/557399775402" style="color: #0B6E8E;">WhatsApp (73) 9977-5402</a>
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send voucher email:', error)
    throw error
  }
}

/**
 * Sends cancellation email
 */
export async function sendCancellationEmail(
  to: string,
  customerName: string,
  tourName: string,
  date: string,
  reason: string,
) {
  const resend = getResend()

  await resend.emails.send({
    from: 'Corumbau Passeios <noreply@corumbaupasseios.com.br>',
    to,
    subject: `⚠️ Passeio cancelado — ${tourName} (${date})`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #EF4444;">Passeio Cancelado</h1>
        <p>Olá, <strong>${customerName}</strong>,</p>
        <p>Infelizmente, o passeio <strong>${tourName}</strong> do dia <strong>${date}</strong> foi cancelado.</p>
        <p><strong>Motivo:</strong> ${reason}</p>
        <div style="background: #FEF3C7; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0;">O estorno do valor será processado automaticamente em até 5 dias úteis.</p>
        </div>
        <p>Pedimos desculpas pelo inconveniente. Entre em contato pelo nosso
          <a href="https://wa.me/557399775402" style="color: #0B6E8E;">WhatsApp</a> para reagendar.</p>
      </div>
    `,
  })
}
