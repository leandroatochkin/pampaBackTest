import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db/db.js';
import { transporter } from '../../mailing/transport.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: 'Email is required.' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email.' });
    }

    // Generate token and store it
    const resetToken = uuidv4();
    await db.execute('UPDATE users SET resetToken = ? WHERE id = ?', [resetToken, user.id]);

    // Send reset email
    try {
  // Make sure transporter is ready BEFORE trying to send
  await transporter.verify();
  console.log('✅ Transporter is ready to send mail');

  await transporter.sendMail({
    from: '"PampaTokens" <soporte@pampatokens.com.ar>',
    to: email,
    subject: 'Recuperación de clave',
    html: `
      <h3>Recupere su clave</h3>
      <p>Haga click en el link debajo para recuperar su clave:</p>
      <a href="${process.env.FRONTEND_URL_A}/reset-password?token=${resetToken}">Restablecer contraseña</a>
    `,
  });

  
  return res.status(200).json({ message: 'Password reset email sent successfully' });

    } catch (error) {
    console.error('❌ Error sending mail:', error);
    return res.status(500).json({ error: 'Failed to send email' });
    }

  } catch (err) {
    console.error('Error sending reset email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
