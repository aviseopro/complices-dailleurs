// Générateur de l'email de confirmation d'inscription (HTML riche avec Logo + Photo d'Émilie & Virginie)
// Adresse officielle : complicesdailleurs@gmail.com

export const OFFICIAL_EMAIL = 'complicesdailleurs@gmail.com';
export const OFFICIAL_PHONE = '06 29 84 96 53';
export const SITE_URL = 'https://complices-dailleurs.vercel.app';
export const DEFAULT_GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbww9COYgKZyElF4jeaiy9uIoFGrqkF4iZgMdCi8_BqnJqDkZL13Sv_DKogxBj0nFGq_/exec';

// Code Google Apps Script clé-en-main à coller sur script.google.com (connecté à complicesdailleurs@gmail.com)
export const GOOGLE_APPS_SCRIPT_SNIPPET = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  MailApp.sendEmail({
    to: data.to,
    bcc: "${OFFICIAL_EMAIL}",
    replyTo: "${OFFICIAL_EMAIL}",
    name: "Complices d'ailleurs — Émilie & Virginie",
    subject: data.subject,
    body: data.text,
    htmlBody: data.html
  });
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export function buildConfirmationEmailHtml({ booking, experience, origin = SITE_URL }) {
  const firstName = (booking?.name || 'Chère complice').split(' ')[0];
  const isCash = booking?.paymentMethod === 'cash';
  const isAlma = booking?.paymentMethod === 'alma';
  const depositUnit = experience?.depositPerPlace || 95;
  const priceUnit = experience?.pricePerPerson || 450;
  const places = Number(booking?.places || 1);
  const depositTotal = depositUnit * places;
  const stayTotal = priceUnit * places;
  const alma3x = Math.round((stayTotal / 3) * 100) / 100;
  const alma4x = Math.round((stayTotal / 4) * 100) / 100;
  const safeOrigin = !origin || origin.includes('localhost') || origin.includes('127.0.0.1') ? SITE_URL : origin;
  const photoUrl = `${safeOrigin}/img/emilie-virginie-marrakech.jpg`;
  const dateLabel =
    experience?.dates?.[0]?.label ||
    (experience?.slug === 'arcachon-entre-femmes' ? 'Du vendredi 29 au dimanche 31 janvier 2027' : 'Dates communiquées par Émilie & Virginie');
  const stripeUrl = experience?.paymentLink || 'https://buy.stripe.com/5kQaEZb38efo3Nh8x6afS00';
  const almaUrl = experience?.almaPaymentLink || 'https://almapay.com/fr-FR';

  const paymentBadge = isCash
    ? 'Paiement en espèces (Cash) auprès d’Émilie & Virginie'
    : isAlma
    ? `Règlement échelonné 2x, 3x ou 4x avec Alma confirmé (3 × ${alma3x} € ou 4 × ${alma4x} €)`
    : `Acompte de réservation de ${depositTotal} € réglé (${places > 1 ? `${places} × ${depositUnit} €` : `${depositUnit} €`})`;

  const letterParagraphByMethod = isCash
    ? `Nous avons bien noté votre choix de <strong>régler en espèces (Cash)</strong>. Votre place est officiellement réservée sous la référence <strong>${booking?.reference}</strong> pour un montant total tout compris de <strong>${stayTotal} €</strong>, que nous réglerons ensemble directement en main propre.`
    : isAlma
    ? `Nous vous confirmons la bonne prise en compte de votre <strong>règlement en plusieurs fois avec Alma</strong> (en <strong>3 × ${alma3x} €</strong> ou <strong>4 × ${alma4x} €</strong> par carte bancaire, soit <strong>${stayTotal} €</strong> tout compris). Votre place est officiellement réservée sous la référence <strong>${booking?.reference}</strong>.`
    : `Nous vous confirmons la bonne prise en compte de votre <strong>acompte de réservation de ${depositTotal} € par carte bancaire</strong>. Votre place est officiellement réservée sous la référence <strong>${booking?.reference}</strong> (le solde de <strong>${stayTotal - depositTotal} €</strong> sur un total tout compris de <strong>${stayTotal} €</strong> sera réglé ultérieurement).`;

  const paymentActionButtonHtml = '';

  const paymentExplanation = isCash
    ? `Vous avez choisi de régler votre participation en espèces (Cash). Votre place est réservée sous la référence ${booking?.reference} ; le règlement s’effectuera directement en main propre auprès d’Émilie et Virginie.`
    : isAlma
    ? `Votre règlement échelonné avec Alma (en 2x, 3x ou 4x par carte bancaire sur un total de ${stayTotal} €) est bien enregistré sous la référence ${booking?.reference}.`
    : `Votre acompte de ${depositTotal} € par carte bancaire sécurisée est bien enregistré. Le solde du séjour (${stayTotal - depositTotal} € sur un total de ${stayTotal} €) sera réglé ultérieurement.`;

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
                  <td align="left" style="padding:8px 8px 16px;">
                    <h1 style="font-family:Georgia,'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:#2a2420;margin:0 0 12px;line-height:1.2;text-align:center;">
                      Chère ${firstName}, bienvenue parmi nous !
                    </h1>
                    <p style="font-size:15px;line-height:1.7;color:#3d332c;margin:0 0 12px;">
                      Quel bonheur de vous compter parmi nos participantes pour notre parenthèse <strong>${experience?.title || 'Bassin d’Arcachon — Entre femmes'}</strong> (<strong>${dateLabel}</strong>). Toutes les deux esthéticiennes diplômées, nous avons hâte de vous accueillir dans notre loft privatisé, de réaliser vos soins du visage et vos massages, et de partager avec vous les séances de yoga guidées par Virginie et l’atelier créatif animé par Émilie.
                    </p>
                    <p style="font-size:15px;line-height:1.7;color:#3d332c;margin:0;">
                      ${letterParagraphByMethod}
                    </p>
                    ${paymentActionButtonHtml}
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
                    <div><strong>Dates du séjour :</strong> ${dateLabel}</div>
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
  const isAlma = booking?.paymentMethod === 'alma';
  const depositUnit = experience?.depositPerPlace || 95;
  const priceUnit = experience?.pricePerPerson || 450;
  const places = Number(booking?.places || 1);
  const depositTotal = depositUnit * places;
  const stayTotal = priceUnit * places;
  const alma3x = Math.round((stayTotal / 3) * 100) / 100;
  const alma4x = Math.round((stayTotal / 4) * 100) / 100;

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
      : isAlma
      ? `Paiement en 3x ou 4x avec Alma (3 × ${alma3x} € ou 4 × ${alma4x} € — total ${stayTotal} €)`
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

export function buildGmailComposeUrl({ booking, experience }) {
  const subject = `Confirmation de votre inscription — ${experience?.title || 'Complices d’ailleurs'} (Réf. ${booking?.reference})`;
  const body = buildConfirmationPlainText({ booking, experience });
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: booking?.email || '',
    bcc: OFFICIAL_EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export async function sendBookingConfirmationEmail({ booking, experience, settings }) {
  const html = buildConfirmationEmailHtml({
    booking,
    experience,
    origin: SITE_URL,
  });
  const text = buildConfirmationPlainText({ booking, experience });
  const subjectParticipant = `Confirmation de votre inscription — ${experience?.title || 'Complices d’ailleurs'} (Réf. ${booking?.reference})`;
  const googleScriptUrl =
    settings?.googleScriptUrl ||
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GOOGLE_SCRIPT_URL : '') ||
    DEFAULT_GOOGLE_SCRIPT_URL;
  const gmailAppPassword = settings?.gmailAppPassword || '';

  const results = { sent: false, provider: null, reason: null };

  // 1. Appel de notre endpoint serverless (/api/send-confirmation) — supporte Gmail SMTP, Google Apps Script et Resend
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
        googleScriptUrl,
        gmailAppPassword,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok) {
        results.sent = true;
        results.provider = data.provider;
        return results;
      }
      results.reason = data?.reason || data?.error || null;
    }
  } catch (_) {
    // Continue vers le relais Google Script direct si disponible
  }

  // 2. Relais direct navigateur -> Google Apps Script (si configuré)
  if (googleScriptUrl && googleScriptUrl.startsWith('https://script.google.com/')) {
    try {
      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          to: booking?.email,
          bcc: OFFICIAL_EMAIL,
          replyTo: OFFICIAL_EMAIL,
          subject: subjectParticipant,
          text,
          html,
          booking,
        }),
      });
      results.sent = true;
      results.provider = 'google_script_direct';
      return results;
    } catch (_) {
      // Ignore network error
    }
  }

  return results;
}
