// Fonction Serverless Vercel : Envoi du mail HTML de confirmation (avec photo & logo)
// à la participante ainsi qu'à complicesdailleurs@gmail.com

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { booking, experienceTitle, html, text, officialEmail = 'complicesdailleurs@gmail.com' } = req.body || {};
    if (!booking || !booking.email) {
      return res.status(400).json({ error: 'Email manquant' });
    }

    const isCash = booking.paymentMethod === 'cash';
    const subjectParticipant = `Confirmation de votre inscription — ${experienceTitle || 'Complices d’ailleurs'} (Réf. ${booking.reference})`;
    const subjectAdmin = `Nouvelle inscription : ${booking.name} (${isCash ? 'Paiement Cash' : 'Acompte 95 €'}) — ${booking.reference}`;

    // Si une clé RESEND_API_KEY est configurée sur Vercel, envoi direct du mail HTML riche
    if (process.env.RESEND_API_KEY) {
      const fromAddress = process.env.EMAIL_FROM || 'Complices d’ailleurs <onboarding@resend.dev>';
      await fetch('https://api.resend.com/emails', {
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
      return res.status(200).json({ ok: true, provider: 'resend' });
    }

    // Relais vers complicesdailleurs@gmail.com avec auto-réponse
    await fetch(`https://formsubmit.co/ajax/${officialEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subjectAdmin,
        _replyto: booking.email,
        email: booking.email,
        _autoresponse: text,
        _template: 'box',
        Référence: booking.reference,
        Séjour: experienceTitle,
        Nom: booking.name,
        Email: booking.email,
        Téléphone: booking.phone,
        Places: booking.places,
        Règlement: isCash ? 'Paiement Cash (Espèces)' : `Acompte 95 € (${booking.amount || 95} €)`,
      }),
    });

    return res.status(200).json({ ok: true, provider: 'formsubmit' });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message });
  }
}
