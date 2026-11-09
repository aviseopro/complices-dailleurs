// Fonction Serverless Vercel : Envoi du mail HTML de confirmation (avec photo & logo)
// à la cliente (booking.email) ainsi qu'en copie à complicesdailleurs@gmail.com
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      booking,
      experienceTitle,
      html,
      text,
      officialEmail = 'complicesdailleurs@gmail.com',
      googleScriptUrl,
      gmailAppPassword,
    } = req.body || {};

    if (!booking || !booking.email) {
      return res.status(400).json({ error: 'Email de la participante manquant' });
    }

    const isFullOnce = booking.paymentMethod === 'full_450' || booking.paymentMethod === 'cash';
    const isKlarna = booking.paymentMethod === 'klarna' || booking.paymentMethod === 'alma';
    const paymentLabel = isFullOnce
      ? `Paiement en une fois (${booking.amount || 450} €)`
      : isKlarna
      ? `Paiement en 3 × 150 € (150 € d’acompte + 2 × 150 €)`
      : `Acompte 150 € en 1 fois`;

    const subjectParticipant = `Confirmation de votre inscription — ${experienceTitle || 'Complices d’ailleurs'} (Réf. ${booking.reference})`;
    const subjectAdmin = `✨ Nouvelle inscription : ${booking.name} (${paymentLabel}) — ${booking.reference}`;

    // 1. Envoi direct via Gmail SMTP (nodemailer) depuis complicesdailleurs@gmail.com
    const appPassword = (process.env.GMAIL_APP_PASSWORD || gmailAppPassword || '').replace(/\s+/g, '');
    if (appPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || officialEmail,
          pass: appPassword,
        },
      });

      await transporter.sendMail({
        from: `"Complices d’ailleurs — Émilie & Virginie" <${process.env.GMAIL_USER || officialEmail}>`,
        to: booking.email,
        bcc: officialEmail,
        replyTo: officialEmail,
        subject: subjectParticipant,
        text,
        html,
      });

      return res.status(200).json({ ok: true, provider: 'gmail_smtp' });
    }

    // 2. Envoi direct via Google Apps Script connecté au compte Gmail complicesdailleurs@gmail.com
    const DEFAULT_GOOGLE_SCRIPT_URL =
      'https://script.google.com/macros/s/AKfycbww9COYgKZyElF4jeaiy9uIoFGrqkF4iZgMdCi8_BqnJqDkZL13Sv_DKogxBj0nFGq_/exec';
    const scriptUrl =
      process.env.GOOGLE_SCRIPT_URL ||
      process.env.VITE_GOOGLE_SCRIPT_URL ||
      googleScriptUrl ||
      DEFAULT_GOOGLE_SCRIPT_URL;
    if (scriptUrl && scriptUrl.startsWith('https://script.google.com/')) {
      const gsRes = await fetch(scriptUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          to: booking.email,
          bcc: officialEmail,
          replyTo: officialEmail,
          subject: subjectParticipant,
          adminSubject: subjectAdmin,
          text,
          html,
          booking,
        }),
      });
      if (gsRes.ok || gsRes.status === 302) {
        return res.status(200).json({ ok: true, provider: 'google_script' });
      }
    }

    // 3. Envoi via Resend API si RESEND_API_KEY est configurée
    if (process.env.RESEND_API_KEY) {
      const fromAddress = process.env.EMAIL_FROM || 'Complices d’ailleurs <onboarding@resend.dev>';
      const rRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [booking.email],
          bcc: [officialEmail],
          reply_to: officialEmail,
          subject: subjectParticipant,
          html,
          text,
        }),
      });
      if (rRes.ok) {
        return res.status(200).json({ ok: true, provider: 'resend' });
      }
    }

    return res.status(200).json({
      ok: false,
      provider: 'none',
      reason: 'missing_email_credentials',
    });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message });
  }
}
