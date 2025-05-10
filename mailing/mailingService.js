import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const frontendURL = process.env.FRONTEND_URL

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `http://${frontendURL}/verify?token=${token}`

  try {
    const data = await resend.emails.send({
      from: 'Pampa Tokens <soporte@pampatokens.com.ar>',
      to: email,
      subject: 'Verifique su dirección de correo electrónico',
      html: `
        <h2>Bienvenido!</h2>
        <p>Haga click abajo para verificar su correo electrónico:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `
    })

    return data
  } catch (err) {
    console.error('Failed to send email:', err)
    throw err
  }
}
