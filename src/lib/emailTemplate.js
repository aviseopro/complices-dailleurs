// Générateur de l'email de confirmation d'inscription (HTML riche avec Logo + Photo d'Émilie & Virginie)
// Adresse officielle : complicesdailleurs@gmail.com

export const OFFICIAL_EMAIL = 'complicesdailleurs@gmail.com';
export const OFFICIAL_PHONE = '06 29 84 96 53';
export const SITE_URL = 'https://complices-dailleurs.vercel.app';

export function buildConfirmationEmailHtml({ booking, experience, origin = SITE_URL }) {
  const firstName = (booking?.name || 'Chère complice').split(' ')[0];
  const isCash = booking?.paymentMethod === 'cash';
  const depositUnit = experience?.depositPerPlace || 95;
  const priceUnit = experience?.pricePerPerson || 450;
  const places = Number(booking?.places || 1);
  const depositTotal = depositUnit * places;
  const stayTotal = priceUnit * places;
  const photoUrl = `${origin}/img/emilie-virginie-marrakech.jpg`;

  const paymentBadge = isCash
    ? 'Paiement en espèces (Cash) auprès d’Émilie & Virginie'
    : `Acompte de réservation de ${depositTotal} € (${places > 1 ? `${places} × ${depositUnit} €` : `${depositUnit} €`})`;

  const paymentExplanation = isCash
    ? `Vous avez choisi de régler votre participation en espèces (Cash). Votre place est réservée sous la référence ${booking?.reference} ; le règlement s’effectuera directement en main propre auprès d’Émilie et Virginie.`
    : `Vous avez choisi de bloquer votre place avec l’acompte de ${depositTotal} € par carte bancaire sécurisée. Le solde du séjour (${stayTotal - depositTotal} € sur un total de ${stayTotal} €) sera réglé ultérieurement.`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation d’inscription — Complices d’ailleurs</title>
</head>
<body style="margin:0;padding:0;background-color:#f4ece1;font-family:'Jost',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2a2420;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4ece1;padding:32px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#faf6ef;border-radius:22px;overflow:hidden;border:1px solid #e2d3be;box-shadow:0 16px 40px rgba(42,36,32,0.10);">
          
          <!-- EN-TÊTE LOGO COMPLICES D'AILLEURS -->
          <tr>
            <td align="center" style="padding:28px 24px 20px;background:linear-gradient(180deg,#fffaf3 0%,#f5ebdc 100%);border-bottom:1px solid #e8d8c3;">
              <div style="font-family:Georgia,'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#2a2420;letter-spacing:-0.01em;line-height:1.1;">
                Complice<span style="font-size:30px;">S</span> <span style="font-family:'Brush Script MT','Snell Roundhand',cursive;color:#a8553a;font-weight:400;font-size:31px;">d’ailleurs</span>
              </div>
              <div style="font-size:10px;letter-spacing:0.26em;text-transform:uppercase;color:#6d625a;margin-top:6px;">
                Voyages &amp; Parenthèses Bien-Être au Féminin
              </div>
            </td>
          </tr>

          <!-- PHOTO D'ÉMILIE & VIRGINIE + MESSAGE DE BIENVENUE -->
          <tr>
            <td style="padding:28px 28px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <img src="${photoUrl}" alt="Émilie et Virginie — Complices d’ailleurs" width="150" height="150" style="width:150px;height:150px;border-radius:50%;object-fit:cover;object-position:50% 25%;border:4px solid #ffffff;box-shadow:0 8px 24px rgba(42,36,32,0.15);display:block;" />
                    <div style="margin-top:10px;display:inline-block;background-color:#d7ebd5;color:#1d4d2b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;padding:5px 14px;border-radius:999px;">
                      ✓ Inscription confirmée · Réf. ${booking?.reference || 'CDA'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:14px;">
                    <h1 style="font-family:Georgia,'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:#2a2420;margin:0 0 10px;line-height:1.2;">
                      Bienvenue parmi nous, ${firstName} !
                    </h1>
                    <p style="font-size:15px;line-height:1.65;color:#4a3f38;margin:0;">
                      Quel bonheur de vous compter parmi nos participantes pour notre parenthèse <strong>${experience?.title || 'Bassin d’Arcachon — Entre femmes'}</strong>. Nous avons tellement hâte de prendre soin de vous et de partager ces moments précieux à vos côtés.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RÉCAPITULATIF DE L'INSCRIPTION -->
          <tr>
            <td style="padding:10px 28px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border:1px solid #e6d7c3;border-radius:16px;padding:20px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:1px solid #f1e7d8;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a8553a;font-weight:600;">
                      Récapitulatif de votre inscription
                    </div>
                    <div style="font-family:Georgia,'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#2a2420;margin-top:3px;">
                      ${experience?.title || 'Bassin d’Arcachon — Entre femmes'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;font-size:14px;line-height:1.7;color:#2a2420;">
                    <div><strong>Référence dossier :</strong> <span style="color:#a8553a;font-weight:600;">${booking?.reference || ''}</span></div>
                    <div><strong>Participante :</strong> ${booking?.name || ''} (${places} place${places > 1 ? 's' : ''})</div>
                    <div><strong>Email :</strong> ${booking?.email || ''}</div>
                    <div><strong>Téléphone :</strong> ${booking?.phone || ''}</div>
                    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #e6d7c3;">
                      <strong>Mode de règlement choisi :</strong><br />
                      <span style="color:#a8553a;font-weight:600;">${paymentBadge}</span>
                    </div>
                    <div style="margin-top:6px;font-size:13px;color:#5c5048;line-height:1.55;">
                      ${paymentExplanation}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CE QUI VOUS ATTEND (VALEUR INCLUSE) -->
          <tr>
            <td style="padding:0 28px 22px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5ece0;border-left:4px solid #a8553a;border-radius:0 14px 14px 0;padding:16px 18px;">
                <tr>
                  <td>
                    <div style="font-family:Georgia,'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#2a2420;margin-bottom:6px;">
                      Plus de 300 € de soins esthétiques &amp; de yoga inclus dans votre séjour
                    </div>
                    <p style="font-size:13.5px;line-height:1.6;color:#4a3f38;margin:0;">
                      Hébergement en loft privatisé avec Spa 7 places, Sauna 4 places et piscine chauffée, pension complète gourmande, soin du visage haute technologie, massage relaxant, séance LED, atelier d’auto-massage et séances de yoga avec Virginie &amp; Émilie.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SIGNATURE & CONTACT OFFICIEL -->
          <tr>
            <td style="padding:20px 28px 28px;background-color:#f1e7d8;border-top:1px solid #e2d3be;text-align:center;">
              <p style="font-family:Georgia,'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:#2a2420;margin:0 0 8px;">
                « Nous vous recontactons très vite sur votre téléphone pour préparer votre arrivée. »
              </p>
              <p style="font-size:14px;font-weight:600;color:#a8553a;margin:0 0 12px;">
                Avec toute notre affection, Émilie &amp; Virginie
              </p>
              <div style="font-size:13px;color:#4a3f38;line-height:1.6;">
                📧 Email officiel : <a href="mailto:${OFFICIAL_EMAIL}" style="color:#a8553a;font-weight:600;text-decoration:underline;">${OFFICIAL_EMAIL}</a><br />
                📞 WhatsApp / Téléphone : <strong>${OFFICIAL_PHONE}</strong><br />
                🌐 <a href="${origin}" style="color:#2a2420;text-decoration:underline;">complices-dailleurs.vercel.app</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildConfirmationPlainText({ booking, experience }) {
  const firstName = (booking?.name || '').split(' ')[0] || 'Chère complice';
  const isCash = booking?.paymentMethod === 'cash';
  const depositUnit = experience?.depositPerPlace || 95;
  const priceUnit = experience?.pricePerPerson || 450;
  const places = Number(booking?.places || 1);
  const depositTotal = depositUnit * places;
  const stayTotal = priceUnit * places;

  return `Bonjour ${firstName},

Votre inscription au séjour « ${experience?.title || 'Bassin d’Arcachon — Entre femmes'} » avec Complices d’ailleurs est bien enregistrée !

RÉCAPITULATIF DE VOTRE INSCRIPTION :
- Référence : ${booking?.reference}
- Participante : ${booking?.name} (${places} place${places > 1 ? 's' : ''})
- Email : ${booking?.email}
- Téléphone : ${booking?.phone}
- Mode de règlement : ${
    isCash
      ? 'Paiement en espèces (Cash) directement auprès d’Émilie et Virginie'
      : `Acompte de ${depositTotal} € en ligne (sur un total de ${stayTotal} € tout compris)`
  }

RAPPEL DE VOTRE SÉJOUR :
Plus de 300 € de soins esthétiques et de yoga sont inclus dans votre séjour (soin du visage haute technologie, massage relaxant, séance LED, atelier d’auto-massage, séances de yoga, hébergement en loft privatisé avec spa et sauna, et pension complète).

Nous vous recontactons très vite pour préparer votre venue !

Avec toute notre complicité,
Émilie & Virginie — Complices d’ailleurs
Email : ${OFFICIAL_EMAIL}
Téléphone / WhatsApp : ${OFFICIAL_PHONE}
Site : ${SITE_URL}`;
}

export async function sendBookingConfirmationEmail({ booking, experience }) {
  const html = buildConfirmationEmailHtml({
    booking,
    experience,
    origin: typeof window !== 'undefined' ? window.location.origin : SITE_URL,
  });
  const text = buildConfirmationPlainText({ booking, experience });
  const isCash = booking?.paymentMethod === 'cash';

  const results = { apiSent: false, formSubmitSent: false };

  // 1. Appel de notre endpoint serverless Vercel (/api/send-confirmation)
  try {
    const res = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking,
        experienceTitle: experience?.title || 'Bassin d’Arcachon — Entre femmes',
        html,
        text,
        officialEmail: OFFICIAL_EMAIL,
      }),
    });
    if (res.ok) {
      results.apiSent = true;
    }
  } catch (_) {
    // Fallback silencieux si hors-ligne
  }

  // 2. Notification directe vers complicesdailleurs@gmail.com + auto-réponse participante via FormSubmit AJAX
  try {
    const resFs = await fetch(`https://formsubmit.co/ajax/${OFFICIAL_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `✨ Nouvelle inscription ${experience?.title || 'Arcachon'} — ${booking?.name} (${isCash ? 'Paiement CASH' : 'Acompte 95 €'}) [${booking?.reference}]`,
        _replyto: booking?.email,
        email: booking?.email,
        _autoresponse: text,
        _template: 'box',
        Référence: booking?.reference,
        Séjour: experience?.title || 'Bassin d’Arcachon — Entre femmes',
        Participante: booking?.name,
        Email_Participante: booking?.email,
        Téléphone: booking?.phone,
        Nombre_de_places: booking?.places,
        Mode_de_paiement: isCash
          ? 'Paiement en espèces (CASH) auprès d’Émilie & Virginie'
          : `Acompte de ${booking?.amount || 95} € en ligne (Stripe)`,
      }),
    });
    if (resFs.ok) {
      results.formSubmitSent = true;
    }
  } catch (_) {
    // Ignore network error
  }

  return results;
}
