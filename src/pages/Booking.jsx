import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  User,
  CreditCard,
  Banknote,
  Copy,
  Printer,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useData, update } from '../data/store.js';
import { Logo, AlmaLogo } from '../components/ui.jsx';
import { createBooking, seatsLeft } from '../lib/booking.js';
import {
  OFFICIAL_EMAIL,
  OFFICIAL_PHONE,
  buildConfirmationEmailHtml,
  buildGmailComposeUrl,
  sendBookingConfirmationEmail,
} from '../lib/emailTemplate.js';

export default function Booking() {
  const { slug: paramSlug } = useParams();
  const slug = paramSlug || 'arcachon-entre-femmes';
  const { experiences, bookings, settings } = useData();
  const e = experiences.find((x) => x.slug === slug) || experiences[0];
  const isMarrakechFemmes = e?.slug === 'marrakech-entre-femmes';

  const [f, setF] = useState(() => {
    let initialPay = 'deposit_95';
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('pay');
      if (p === 'klarna' || p === 'alma') initialPay = 'klarna';
      else if (p === 'full' || p === 'full_450' || p === 'once') initialPay = 'full_450';
      else if (p === 'deposit_95') initialPay = 'deposit_95';
    }
    return {
      name: '',
      email: '',
      phone: '',
      places: 1,
      slot: e?.dates?.[0]?.id || 'general',
      paymentMethod: initialPay, // 'deposit_95' | 'klarna' | 'full_450'
      consentRules: false,
      consentData: false,
    };
  });

  // Options « Personnalisez votre expérience » pour Marrakech
  const [options, setOptions] = useState(() => {
    if (typeof window === 'undefined') return { hammam: false, soireeFestive: false, agafay: false };
    const p = new URLSearchParams(window.location.search);
    return {
      hammam: p.get('hammam') === '1',
      soireeFestive: p.get('soiree') === '1',
      agafay: p.get('agafay') === '1',
    };
  });

  const toggleOption = (k) => setOptions((prev) => ({ ...prev, [k]: !prev[k] }));

  const [errors, setErrors] = useState({});
  const [err, setErr] = useState('');
  const [awaitingPayment, setAwaitingPayment] = useState(null);
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingPay, setConfirmingPay] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!e) {
    return (
      <section className="section">
        <div className="wrap">
          <h1>Réservation indisponible</h1>
          <Link to="/">Retour</Link>
        </div>
      </section>
    );
  }

  const left = seatsLeft(e, bookings, f.slot);
  const unitDeposit = e.depositPerPlace || 150;
  const depositAmount = unitDeposit * Number(f.places || 1);
  const unitPrice = e.pricePerPerson || (isMarrakechFemmes ? 790 : 450);
  const fullStayAmount = unitPrice * Number(f.places || 1);
  const remainingAmount = Math.max(0, fullStayAmount - depositAmount);
  const klarna3x = Math.round((fullStayAmount / 3) * 100) / 100;
  // Lien 1 : Acompte de 150 € (payable en 1 fois)
  const depositLink = e.paymentLink || settings.stripePaymentUrl || 'https://buy.stripe.com/5kQaEZb38efo3Nh8x6afS00';
  // Lien 2 : Paiement en 3 × 150 € (150 € d'acompte aujourd'hui + 2 mensualités automatiques de 150 € sur Stripe)
  const klarnaLink =
    (e.almaPaymentLink && !e.almaPaymentLink.includes('almapay.com') ? e.almaPaymentLink : null) ||
    (settings.almaPaymentUrl && !settings.almaPaymentUrl.includes('almapay.com') ? settings.almaPaymentUrl : null) ||
    depositLink;
  // Lien 3 : Montant total (450 €) en une seule fois
  const fullLink = e.fullPaymentLink || settings.fullPaymentUrl || klarnaLink || depositLink;

  const set = (k) => (ev) =>
    setF({ ...f, [k]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value });

  const getPaymentUrlForMethod = (method) => {
    if (method === 'klarna' || method === 'alma') return klarnaLink;
    if (method === 'full_450' || method === 'full') return fullLink;
    return depositLink;
  };

  // Finalise le règlement une fois payé : envoie le mail de confirmation et affiche le message de bienvenue
  const finalizePaidBooking = async (bookingObj) => {
    if (!bookingObj) return;
    setConfirmingPay(true);
    const paidBooking = {
      ...bookingObj,
      status: 'paid',
      emailSent: true,
    };

    update((s) => {
      const idx = s.bookings.findIndex((b) => b.reference === paidBooking.reference);
      if (idx >= 0) {
        s.bookings[idx] = {
          ...s.bookings[idx],
          status: 'paid',
          emailSent: true,
          log: [
            ...(s.bookings[idx].log || []),
            { at: new Date().toISOString(), status: 'paid', note: 'Règlement effectué & mail envoyé' },
          ],
        };
      } else {
        s.bookings.push(paidBooking);
      }
      return s;
    });

    if (!bookingObj.emailSent) {
      await sendBookingConfirmationEmail({ booking: paidBooking, experience: e, settings });
    }

    try {
      localStorage.removeItem('cda-pending-booking-v1');
    } catch (_) {}

    setConfirmingPay(false);
    setAwaitingPayment(null);
    setDone(paidBooking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Détection automatique du retour depuis Stripe / Alma (?paid=1 ou ?success=1)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const isPaidReturn =
      params.get('paid') === '1' ||
      params.get('success') === '1' ||
      params.get('payment') === 'success';
    const refParam = params.get('ref') || params.get('client_reference_id');

    try {
      const rawPending = localStorage.getItem('cda-pending-booking-v1');
      const pending = rawPending ? JSON.parse(rawPending) : null;

      if (isPaidReturn) {
        const target =
          pending ||
          (refParam ? bookings.find((b) => b.reference === refParam) : bookings[bookings.length - 1]);
        if (target && !done) {
          finalizePaidBooking(target);
        } else if (!target && !done) {
          setDone({
            reference: refParam || 'CDA-CONFIRME',
            name: 'Chère complice',
            email: params.get('email') || OFFICIAL_EMAIL,
            phone: OFFICIAL_PHONE,
            places: 1,
            amount: depositAmount,
            paymentMethod: 'deposit_95',
            status: 'paid',
            emailSent: true,
          });
        }
      } else if (pending && pending.exp === e?.slug && !done && !awaitingPayment) {
        setAwaitingPayment(pending);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyDirectLink = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (_) {
      window.prompt('Copiez ce lien direct à envoyer aux participantes :', shareUrl);
    }
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setErr('');
    setErrors({});

    const payload = {
      ...f,
      places: Number(f.places),
      slot: f.slot,
      paymentMethod: f.paymentMethod,
      options: isMarrakechFemmes ? options : null,
    };

    const res = createBooking(
      e,
      JSON.parse(localStorage.getItem('cda-data-v1') || 'null')?.bookings || bookings,
      payload,
      { demo: false, requirePhone: true }
    );

    if (!res.ok) {
      setErrors(res.errors || {});
      setErr(res.error || '');
      return;
    }

    // Montant selon le mode choisi : 95 € pour l'acompte, ou 450 € pour le montant total (en 1 fois ou en plusieurs fois avec Klarna)
    const isFullAmount = f.paymentMethod === 'klarna' || f.paymentMethod === 'alma' || f.paymentMethod === 'full_450';
    res.booking.amount = isFullAmount ? fullStayAmount : depositAmount;
    res.booking.emailSent = false;

    setSubmitting(true);
    update((s) => {
      const existingIdx = s.bookings.findIndex((b) => b.reference === res.booking.reference);
      if (existingIdx >= 0) {
        s.bookings[existingIdx] = res.booking;
      } else {
        s.bookings.push(res.booking);
      }
      return s;
    });

    // Règlement en ligne (1. Acompte 95 €, 2. Montant total 450 € en plusieurs fois avec Klarna, ou 3. Montant total 450 € en une fois)
    // On N'AFFICHE PAS le message de bienvenue et on N'ENVOIE PAS le mail tant que le règlement n'est pas effectué !
    try {
      localStorage.setItem('cda-pending-booking-v1', JSON.stringify(res.booking));
    } catch (_) {}

    const targetPaymentUrl = getPaymentUrlForMethod(f.paymentMethod);

    if (targetPaymentUrl) {
      window.location.href = targetPaymentUrl;
      return;
    }
  };

  const selectMethodAndScroll = (method) => {
    setF((prev) => ({ ...prev, paymentMethod: method }));
    const el = document.getElementById('vip-form-start');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const printConfirmationMail = (bookingObj) => {
    const html = buildConfirmationEmailHtml({
      booking: bookingObj,
      experience: e,
      origin: window.location.origin,
    });
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 400);
    }
  };

  // Écran intermédiaire sobre pendant le règlement en ligne :
  // AUCUN message « Bienvenue » et AUCUN envoi de mail tant que le règlement n'est pas effectué.
  if (awaitingPayment && !done) {
    const isKlarnaPay = awaitingPayment.paymentMethod === 'klarna' || awaitingPayment.paymentMethod === 'alma';
    const isFullOncePay = awaitingPayment.paymentMethod === 'full_450';
    const targetPayUrl = getPaymentUrlForMethod(awaitingPayment.paymentMethod);

    return (
      <section className="section vip-booking-page">
        <div className="wrap narrow" role="status">
          <div className="vip-done-banner" style={{ textAlign: 'center', padding: '2.2rem 1.8rem' }}>
            <span className={`vip-step-pill ${isKlarnaPay ? 'alma' : ''}`} style={{ alignSelf: 'center', marginBottom: '.85rem' }}>
              {isKlarnaPay
                ? `Paiement en 3 × ${klarna3x} € (${depositAmount} € aujourd’hui + 2 × ${klarna3x} €) en cours`
                : isFullOncePay
                ? `Règlement en une fois de ${fullStayAmount} € en cours`
                : `Règlement de l’acompte de ${depositAmount} € en cours`}
            </span>
            <h2 style={{ margin: '0 0 .6rem', color: '#2a2420' }}>
              Finalisez votre règlement pour valider votre inscription
            </h2>
            <p style={{ maxWidth: '52ch', margin: '0 auto 1.4rem', color: '#4a3f38', fontSize: '.95rem', lineHeight: 1.6 }}>
              La page de paiement sécurisée est prête pour régler votre réservation.{' '}
              <strong>Une fois votre règlement effectué</strong>, cliquez sur le bouton ci-dessous pour afficher votre message de bienvenue et recevoir votre lettre de confirmation par e-mail de la part de <strong>{OFFICIAL_EMAIL}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.85rem' }}>
              <button
                type="button"
                className="btn btn-terra"
                style={{ fontWeight: 600, padding: '1rem 1.8rem', fontSize: '1rem' }}
                disabled={confirmingPay}
                onClick={() => finalizePaidBooking(awaitingPayment)}
              >
                <CheckCircle2 size={19} />
                <span>
                  {confirmingPay
                    ? 'Validation & envoi de votre mail de confirmation…'
                    : `✓ Mon règlement est effectué — Voir ma confirmation & recevoir mon mail`}
                </span>
              </button>

              {targetPayUrl && (
                <a
                  href={targetPayUrl}
                  className="btn btn-sm btn-ghost"
                >
                  <ExternalLink size={14} />{' '}
                  {isKlarnaPay
                    ? `Aller sur la page de paiement 3 × ${klarna3x} €`
                    : isFullOncePay
                    ? `Aller sur la page de paiement en une fois (${fullStayAmount} €)`
                    : `Aller sur la page de paiement de l’acompte (${depositAmount} €)`}
                </a>
              )}

              <button
                type="button"
                className="btn btn-sm btn-ghost"
                style={{ border: 0, fontSize: '.8rem', color: 'var(--muted)' }}
                onClick={() => {
                  try {
                    localStorage.removeItem('cda-pending-booking-v1');
                  } catch (_) {}
                  setAwaitingPayment(null);
                }}
              >
                ← Modifier mes informations avant de payer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Écran Récapitulatif, Message de Bienvenue & Lettre de Confirmation (affiché UNIQUEMENT une fois le règlement effectué)
  if (done) {
    const isFullOnce = done.paymentMethod === 'full_450' || done.paymentMethod === 'cash';
    const isAlma = done.paymentMethod === 'klarna' || done.paymentMethod === 'alma';
    const firstName = done.name.split(' ')[0];
    const hasOptions = done.options && (done.options.hammam || done.options.soireeFestive || done.options.agafay);

    return (
      <section className="section vip-booking-page">
        <div className="wrap narrow" role="status">
          {/* Bandeau d'état en haut : confirme que le règlement et l'envoi du mail sont effectués */}
          <div className="vip-done-banner">
            <div className="vip-done-status" style={{ borderBottom: 0, marginBottom: 0, paddingBottom: 0 }}>
              <CheckCircle2 size={24} />
              <div>
                <strong>
                  {isFullOnce
                    ? `Règlement intégral de ${fullStayAmount} € confirmé — Lettre de bienvenue envoyée par e-mail à ${done.email}`
                    : isAlma
                    ? `Échéancier 3 × ${klarna3x} € (${depositAmount} € d’acompte + 2 × ${klarna3x} €) confirmé — Lettre de bienvenue envoyée à ${done.email}`
                    : `Règlement de l’acompte de ${depositAmount} € confirmé — Lettre de bienvenue envoyée par e-mail à ${done.email}`}
                </strong>
                <span>Une copie a également été transmise à Émilie &amp; Virginie ({OFFICIAL_EMAIL})</span>
              </div>
            </div>
          </div>

          {/* APERÇU DU BEAU MAIL DE CONFIRMATION (AVEC LOGO & PHOTO D'ÉMILIE ET VIRGINIE) */}
          <div className="vip-email-preview-wrap">
            <div className="vip-email-preview-toolbar">
              <span>📧 Votre e-mail officiel de confirmation ({OFFICIAL_EMAIL})</span>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                <a
                  href={buildGmailComposeUrl({ booking: done, experience: e })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                >
                  <Mail size={14} /> Recevoir / Ouvrir dans Gmail
                </a>
                <button type="button" onClick={() => printConfirmationMail(done)} className="btn btn-sm btn-ghost">
                  <Printer size={14} /> Imprimer / Enregistrer mon invitation (PDF)
                </button>
              </div>
            </div>

            <div className="vip-email-card">
              <div className="vip-email-header">
                <Logo />
                <p className="vip-email-sub">Confirmation officielle d’inscription · {OFFICIAL_EMAIL}</p>
              </div>

              <div className="vip-email-founders">
                <img
                  src="/img/emilie-virginie-marrakech.jpg"
                  alt="Émilie et Virginie — Complices d’ailleurs"
                  className="vip-email-photo"
                />
                <span className="vip-email-ref-pill">✓ Inscription confirmée · Réf. {done.reference}</span>
                <h2>Chère {firstName}, bienvenue parmi nous !</h2>
                <p>
                  Quel bonheur de vous compter parmi nos participantes pour notre parenthèse{' '}
                  <strong>{e.title}</strong>
                  {e.dates?.[0]?.label ? <> (<strong>{e.dates[0].label}</strong>)</> : null}. Toutes les deux esthéticiennes diplômées, nous avons hâte de vous accueillir, de réaliser vos soins du visage et vos massages, et de partager avec vous les séances de yoga guidées par Virginie et l’atelier créatif animé par Émilie.
                </p>
                <p style={{ marginTop: '.65rem' }}>
                  {isFullOnce ? (
                    <>
                      Nous vous confirmons la bonne prise en compte de votre <strong>règlement intégral en une fois de {fullStayAmount} €</strong>. Votre place est officiellement réservée sous la référence <strong>{done.reference}</strong>.
                    </>
                  ) : isAlma ? (
                    <>
                      Nous vous confirmons la bonne prise en compte de votre <strong>paiement en 3 × {klarna3x} €</strong> (<strong>{depositAmount} € d’acompte aujourd’hui</strong> puis <strong>2 mensualités automatiques de {klarna3x} €</strong>, soit {fullStayAmount} € tout compris). Votre place est officiellement réservée sous la référence <strong>{done.reference}</strong>.
                    </>
                  ) : (
                    <>
                      Nous vous confirmons la bonne prise en compte de votre <strong>acompte de réservation de {depositAmount} €</strong>. Le solde de votre séjour (<strong>{remainingAmount} €</strong> sur un total tout compris de <strong>{fullStayAmount} €</strong>) sera réglé ultérieurement.
                    </>
                  )}
                </p>
              </div>

              <div className="vip-email-details-box">
                <div className="vip-email-details-title">Récapitulatif de votre inscription</div>
                <div className="vip-email-details-grid">
                  <div>
                    <small>Référence dossier</small>
                    <strong>{done.reference}</strong>
                  </div>
                  <div>
                    <small>Participante</small>
                    <strong>{done.name} ({done.places} place{done.places > 1 ? 's' : ''})</strong>
                  </div>
                  <div>
                    <small>Adresse e-mail</small>
                    <strong>{done.email}</strong>
                  </div>
                  <div>
                    <small>Téléphone</small>
                    <strong>{done.phone}</strong>
                  </div>
                </div>

                <div className="vip-email-payment-summary">
                  <small>Mode de règlement choisi</small>
                  <strong>
                    {isFullOnce
                      ? `Paiement en une fois (${fullStayAmount} € — Carte bancaire / Apple Pay)`
                      : isAlma
                      ? `Paiement en 3 × ${klarna3x} € (${depositAmount} € d’acompte aujourd’hui + 2 mensualités automatiques de ${klarna3x} €)`
                      : `Acompte de réservation de ${depositAmount} € (solde de ${remainingAmount} € à régler ultérieurement)`}
                  </strong>
                </div>

                {hasOptions && (
                  <div className="vip-email-payment-summary" style={{ marginTop: '.75rem' }}>
                    <small>Vos envies sélectionnées (à régler sur place)</small>
                    <ul style={{ margin: '.3rem 0 0', paddingLeft: '1.1rem', fontSize: '.86rem', color: '#2a2420' }}>
                      {done.options.hammam && <li>Parenthèse au hammam (Mythic Oriental Spa · ~45 € sur place)</li>}
                      {done.options.soireeFestive && <li>Soirée festive à Marrakech avec le groupe</li>}
                      {done.options.agafay && <li>Échappée dans le désert d’Agafay (Agafay Pearl Camp)</li>}
                    </ul>
                  </div>
                )}
              </div>

              <div className="vip-email-inclusions">
                <strong>Plus de 300 € de soins esthétiques &amp; de yoga inclus dans votre séjour</strong>
                <p>
                  {e.slug === 'corse'
                    ? 'Séances de Yoga Aérien (avec tissus) et yoga plage avec Virginie, soins esthétiques et massages par Émilie & Virginie, bain sonore et découvertes en Corse du Sud.'
                    : isMarrakechFemmes
                    ? 'Séances de yoga avec Virginie, massage individuel inclus, atelier mosaïque créatif, Riad de charme avec petits-déjeuners et accompagnement par Émilie & Virginie.'
                    : 'Loft privatisé avec Spa 7 places, Sauna 4 places et piscine chauffée, pension complète gourmande, soin du visage haute technologie, massage relaxant, séance LED, atelier d’auto-massage et séances de yoga avec Virginie & Émilie.'}
                </p>
              </div>

              <div className="vip-email-footer">
                <p className="vip-email-quote">
                  « Nous vous recontactons très vite au {done.phone} pour préparer votre arrivée. »
                </p>
                <p className="vip-email-sign">Avec toute notre affection, Émilie &amp; Virginie</p>
                <div className="vip-email-contact-line">
                  <span>📧 <a href={`mailto:${OFFICIAL_EMAIL}`}>{OFFICIAL_EMAIL}</a></span>
                  <span>·</span>
                  <span>📞 WhatsApp / Tél : <strong>{OFFICIAL_PHONE}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/" className="btn btn-ghost">← Retour à la page d’accueil</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section vip-booking-page theme-${e.theme}`}>
      <div className="wrap narrow">
        {/* Barre supérieure pour copier facilement le lien direct */}
        <div className="vip-share-bar">
          <span>Lien direct d’inscription &amp; de paiement à envoyer aux participantes</span>
          <button type="button" onClick={copyDirectLink} className="vip-copy-btn">
            <Copy size={14} />
            <span>{copiedLink ? '✓ Lien copié !' : 'Copier ce lien à envoyer'}</span>
          </button>
        </div>

        {/* CARTE D'ACCUEIL TRÈS JOLIE AVEC PHOTO D'ÉMILIE & VIRGINIE + LOGO */}
        <div className="vip-invitation-card">
          <div className="vip-invitation-top">
            <Logo />
            <span className="vip-invitation-badge">Invitation &amp; Inscription · 8 participantes max</span>
          </div>

          <div className="vip-invitation-hero">
            <div className="vip-invitation-photo-wrap">
              <img
                src="/img/emilie-virginie-marrakech.jpg"
                alt="Émilie et Virginie — Fondatrices de Complices d’ailleurs"
                className="vip-invitation-photo"
              />
              <span className="vip-invitation-names">Émilie &amp; Virginie</span>
            </div>

            <div className="vip-invitation-text">
              <p className="vip-invitation-kicker">{e.title.toUpperCase()}</p>
              <h1>Réservez votre place parmi nous</h1>
              <p className="vip-invitation-lead">
                « Quel bonheur de vous accueillir pour cette parenthèse rien que pour vous ! Indiquez votre e-mail et votre numéro de téléphone ci-dessous, choisissez votre mode de règlement (<strong>acompte de {unitDeposit} €</strong>, <strong>paiement en 3 × {klarna3x} € ({unitDeposit} € d’acompte aujourd’hui + 2 mensualités automatiques de {klarna3x} €)</strong>, ou <strong>paiement en une fois de {unitPrice} €</strong>), et recevez votre belle confirmation d’inscription par mail dès votre règlement effectué. »
              </p>
            </div>
          </div>

          {/* MODES DE RÈGLEMENT EN HAUT DE PAGE : ENTRE LE TEXTE ET LE TABLEAU "PLUS DE 300 € INCLUS" */}
          <div className="vip-top-payment-banner" aria-label="Modes de règlement disponibles dès le début de la page">
            <div className="vip-top-payment-header">
              <span className="vip-top-payment-eyebrow">3 modes de règlement au choix · Cliquez pour sélectionner</span>
              <span className="vip-top-payment-total">Séjour tout compris : <strong>{unitPrice} € / pers.</strong></span>
            </div>

            <div className="vip-top-payment-grid">
              {/* Rectangle 1 : Acompte de 150 € */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => selectMethodAndScroll('deposit_95')}
                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && selectMethodAndScroll('deposit_95')}
                className={`vip-top-pay-pill ${f.paymentMethod === 'deposit_95' ? 'active' : ''}`}
              >
                <div className="vip-top-pay-pill-head">
                  <span className="vip-top-pay-icon"><CreditCard size={16} /></span>
                  <strong>1. Régler l’acompte de {depositAmount} €</strong>
                </div>
                <p>
                  Bloquez votre place aujourd’hui en réglant uniquement l’acompte de <strong>{depositAmount} €</strong> en 1 fois (solde de {remainingAmount} € à régler plus tard).
                </p>
                <a
                  href={depositLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setF((prev) => ({ ...prev, paymentMethod: 'deposit_95' }));
                  }}
                  className="vip-top-pay-link"
                >
                  <span>Payer l’acompte de {depositAmount} €</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Rectangle 2 : 3 × 150 € (150 € d'acompte aujourd'hui + 2 mensualités automatiques de 150 €) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => selectMethodAndScroll('klarna')}
                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && selectMethodAndScroll('klarna')}
                className={`vip-top-pay-pill alma ${f.paymentMethod === 'klarna' || f.paymentMethod === 'alma' ? 'active' : ''}`}
              >
                <div className="vip-top-pay-pill-head">
                  <span className="vip-top-pay-icon"><CreditCard size={16} /></span>
                  <strong>2. Payer en 3 × {klarna3x} € (automatique)</strong>
                </div>
                <p>
                  <strong>{depositAmount} € d’acompte aujourd’hui</strong> + les <strong>{remainingAmount} € restants</strong> prélevés automatiquement en <strong>2 mensualités de {klarna3x} €</strong> sur Stripe.
                </p>
                <a
                  href={klarnaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setF((prev) => ({ ...prev, paymentMethod: 'klarna' }));
                  }}
                  className="vip-top-pay-link klarna"
                >
                  <span>Payer en 3 × {klarna3x} € ({depositAmount} € aujourd’hui)</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Rectangle 3 : Payer en une fois (450 €) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => selectMethodAndScroll('full_450')}
                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && selectMethodAndScroll('full_450')}
                className={`vip-top-pay-pill full ${f.paymentMethod === 'full_450' ? 'active' : ''}`}
              >
                <div className="vip-top-pay-pill-head">
                  <span className="vip-top-pay-icon full"><Banknote size={16} /></span>
                  <strong>3. Payer en une fois ({fullStayAmount} €)</strong>
                </div>
                <p>
                  Réglez la totalité de votre séjour tout compris (<strong>{fullStayAmount} €</strong>) directement en une seule fois (Carte bancaire ou Apple Pay).
                </p>
                <a
                  href={fullLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setF((prev) => ({ ...prev, paymentMethod: 'full_450' }));
                  }}
                  className="vip-top-pay-link full"
                >
                  <span>Payer {fullStayAmount} € en une fois</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Rappel élégant de ce qui est compris ("Plus de 300 € inclus") */}
          <div className="vip-stay-summary-strip">
            <div>
              <strong>Plus de 300 € inclus</strong>
              <span>
                {e.slug === 'corse'
                  ? 'Soins esthétiques, massages & cours de Yoga Aérien (avec tissus)'
                  : 'Soins esthétiques professionnels, massage & séances de yoga'}
              </span>
            </div>
            <div>
              <strong>{e.lodging ? 'Cadre privilégié' : 'Expérience intimiste'}</strong>
              <span>{e.lodging || e.location}</span>
            </div>
            <div>
              <strong>Acompte {unitDeposit} €, 3 × {klarna3x} € ou 1 fois</strong>
              <span>Tarif du séjour : {unitPrice} € / pers. · Confirmation par mail après règlement</span>
            </div>
          </div>
        </div>

        <form id="vip-form-start" onSubmit={submit} noValidate className="vip-form-card">
          <div className="vip-form-section-head">
            <span className="vip-step-num">1</span>
            <div>
              <h2>Vos coordonnées personnelles</h2>
              <p>Pour vous envoyer votre confirmation officielle par e-mail ({OFFICIAL_EMAIL}) et vous joindre par téléphone.</p>
            </div>
          </div>

          <div className="vip-fields-grid">
            <label className="vip-field">
              <span><User size={15} /> Prénom &amp; Nom complet *</span>
              <input
                value={f.name}
                onChange={set('name')}
                placeholder="Ex : Sophie Martin"
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {errors.name && <em>{errors.name}</em>}
            </label>

            <div className="vip-fields-row2">
              <label className="vip-field">
                <span><Mail size={15} /> Votre adresse e-mail *</span>
                <input
                  type="email"
                  value={f.email}
                  onChange={set('email')}
                  placeholder="Ex : sophie.martin@gmail.com"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                />
                <small className="vip-field-hint">Vous y recevrez immédiatement votre mail de confirmation avec notre photo et logo.</small>
                {errors.email && <em>{errors.email}</em>}
              </label>

              <label className="vip-field">
                <span><Phone size={15} /> Votre numéro de téléphone *</span>
                <input
                  type="tel"
                  value={f.phone}
                  onChange={set('phone')}
                  placeholder="Ex : 06 12 34 56 78"
                  aria-invalid={!!errors.phone}
                  autoComplete="tel"
                />
                <small className="vip-field-hint">Indispensable pour qu’Émilie &amp; Virginie préparent votre arrivée.</small>
                {errors.phone && <em>{errors.phone}</em>}
              </label>
            </div>

            <div className="vip-fields-row2">
              <label className="vip-field">
                <span>Nombre de places réservées</span>
                <select value={f.places} onChange={set('places')}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} participante{n > 1 ? 's' : ''} ({n === 1 ? '1 place' : `${n} places`})
                    </option>
                  ))}
                </select>
                {errors.places && <em>{errors.places}</em>}
                {left != null && <small>{left} place(s) restante(s)</small>}
              </label>

              {e.dates.length > 0 && (
                <label className="vip-field">
                  <span>Date du séjour</span>
                  <select value={f.slot} onChange={set('slot')}>
                    {e.dates.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </div>

          {/* Rubrique Personnalisez votre expérience pour Marrakech */}
          {isMarrakechFemmes && (
            <div className="mk-book-options-section">
              <h3>Personnalisez votre expérience à Marrakech (facultatif)</h3>
              <p className="mk-book-options-subtitle">
                Indiquez vos envies pour nous permettre d’organiser les créneaux et les déplacements. Ces options facultatives se règlent directement sur place aux prestataires.
              </p>

              <div className={`mk-book-option-box ${options.hammam ? 'is-active' : ''}`}>
                <label className="mk-book-option-label">
                  <input type="checkbox" checked={options.hammam} onChange={() => toggleOption('hammam')} />
                  <div className="mk-book-option-text">
                    <strong>1. Une parenthèse au hammam (Mythic Oriental Spa)</strong>
                    <p>Hammam beldi, gommage au savon noir et hydratation (40 min de soin).</p>
                    <small>Budget indicatif : ~450 DH (environ 45 €) / pers. · À régler sur place</small>
                  </div>
                </label>
              </div>

              <div className={`mk-book-option-box ${options.soireeFestive ? 'is-active' : ''}`}>
                <label className="mk-book-option-label">
                  <input type="checkbox" checked={options.soireeFestive} onChange={() => toggleOption('soireeFestive')} />
                  <div className="mk-book-option-text">
                    <strong>2. Une soirée festive à Marrakech avec le groupe</strong>
                    <p>Proposition et budget communiqués avant confirmation.</p>
                    <small>Option sans engagement · Dépenses à régler sur place</small>
                  </div>
                </label>
              </div>

              <div className={`mk-book-option-box ${options.agafay ? 'is-active' : ''}`}>
                <label className="mk-book-option-label">
                  <input type="checkbox" checked={options.agafay} onChange={() => toggleOption('agafay')} />
                  <div className="mk-book-option-text">
                    <strong>3. Une échappée dans le désert d’Agafay (Agafay Pearl Camp)</strong>
                    <p>Prestation au camp + Transport A/R partagé.</p>
                    <small>Expérience facultative, à régler sur place aux prestataires.</small>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : CHOIX DU MODE DE PAIEMENT (ACOMPTE 150 €, PAIEMENT EN 3 × 150 € AUTOMATIQUE, OU PAYER EN UNE FOIS 450 €) */}
          <div className="vip-form-section-head" style={{ marginTop: '1.8rem' }}>
            <span className="vip-step-num">2</span>
            <div>
              <h2>Choisissez votre mode de règlement</h2>
              <p>
                Réglez l’<strong>acompte de {depositAmount} €</strong> aujourd’hui, optez pour le <strong>paiement en 3 × {klarna3x} € ({depositAmount} € d’acompte + 2 mensualités automatiques de {klarna3x} €)</strong>, ou choisissez de <strong>payer en une fois ({fullStayAmount} €)</strong>.
              </p>
            </div>
          </div>

          <div className="vip-payment-choices" role="radiogroup" aria-label="Mode de règlement">
            {/* Option 1 : 150 € d'acompte en ligne */}
            <label
              className={`vip-pay-card ${f.paymentMethod === 'deposit_95' ? 'selected' : ''}`}
              onClick={() => setF({ ...f, paymentMethod: 'deposit_95' })}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="deposit_95"
                checked={f.paymentMethod === 'deposit_95'}
                onChange={() => setF({ ...f, paymentMethod: 'deposit_95' })}
              />
              <div className="vip-pay-card-top">
                <span className="vip-pay-icon"><CreditCard size={20} /></span>
                <span className="vip-pay-badge">Acompte · Carte ou Apple Pay</span>
              </div>
              <h3>1. Régler l’acompte de {depositAmount} €</h3>
              <p>
                Je bloque ma place immédiatement en réglant l’acompte de <strong>{depositAmount} €</strong> en 1 fois (Carte bancaire ou Apple Pay). Le solde ({remainingAmount} €) sera réglé plus tard.
              </p>
              <div className="vip-pay-alma-link-row">
                <a
                  href={depositLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setF({ ...f, paymentMethod: 'deposit_95' });
                  }}
                  className="vip-card-alma-link"
                >
                  <span>Payer l’acompte de {depositAmount} €</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="vip-pay-amount">
                <span>Acompte aujourd’hui :</span>
                <strong>{depositAmount} €</strong>
              </div>
            </label>

            {/* Option 2 : Paiement en 3 × 150 € (150 € d'acompte aujourd'hui + 2 mensualités automatiques de 150 €) */}
            <label
              className={`vip-pay-card alma ${f.paymentMethod === 'klarna' || f.paymentMethod === 'alma' ? 'selected' : ''}`}
              onClick={() => setF({ ...f, paymentMethod: 'klarna' })}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="klarna"
                checked={f.paymentMethod === 'klarna' || f.paymentMethod === 'alma'}
                onChange={() => setF({ ...f, paymentMethod: 'klarna' })}
              />
              <div className="vip-pay-card-top">
                <span className="vip-pay-icon"><CreditCard size={20} /></span>
                <span className="vip-pay-badge alma">3 × {klarna3x} € · Sans frais</span>
              </div>
              <h3>2. Payer en 3 × {klarna3x} € (automatique)</h3>
              <p>
                <strong>{depositAmount} € d’acompte aujourd’hui</strong>, puis les <strong>{remainingAmount} € restants</strong> prélevés automatiquement en <strong>2 mensualités de {klarna3x} €</strong> par Carte bancaire sur Stripe.
              </p>
              <div className="vip-pay-alma-link-row">
                <a
                  href={klarnaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setF({ ...f, paymentMethod: 'klarna' });
                  }}
                  className="vip-card-alma-link klarna"
                >
                  <span>Payer en 3 × {klarna3x} € ({depositAmount} € aujourd’hui)</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="vip-pay-amount">
                <span>Échéancier automatique :</span>
                <strong>3 × {klarna3x} €</strong>
              </div>
            </label>

            {/* Option 3 : Payer en une fois (450 €) */}
            <label
              className={`vip-pay-card full ${f.paymentMethod === 'full_450' ? 'selected' : ''}`}
              onClick={() => setF({ ...f, paymentMethod: 'full_450' })}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="full_450"
                checked={f.paymentMethod === 'full_450'}
                onChange={() => setF({ ...f, paymentMethod: 'full_450' })}
              />
              <div className="vip-pay-card-top">
                <span className="vip-pay-icon full"><Banknote size={20} /></span>
                <span className="vip-pay-badge full">Séjour complet · 1 fois</span>
              </div>
              <h3>3. Payer en une fois ({fullStayAmount} €)</h3>
              <p>
                Je règle dès aujourd’hui la totalité de mon séjour tout compris (<strong>{fullStayAmount} €</strong>) en une seule fois par Carte bancaire ou Apple Pay.
              </p>
              <div className="vip-pay-alma-link-row">
                <a
                  href={fullLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setF({ ...f, paymentMethod: 'full_450' });
                  }}
                  className="vip-card-alma-link full"
                >
                  <span>Payer {fullStayAmount} € en une fois</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="vip-pay-amount">
                <span>Total en 1 fois :</span>
                <strong>{fullStayAmount} €</strong>
              </div>
            </label>
          </div>

          {/* Consentements */}
          <div className="vip-consents">
            <label className="check">
              <input type="checkbox" checked={f.consentRules} onChange={set('consentRules')} />
              <span>
                J’ai lu et j’accepte les <Link to="/cgv" target="_blank">conditions générales</Link>
                {e.minParticipants ? `, dont le départ maintenu dès ${e.minParticipants} participantes` : ''}. *
                {errors.consentRules && <em> {errors.consentRules}</em>}
              </span>
            </label>
            <label className="check">
              <input type="checkbox" checked={f.consentData} onChange={set('consentData')} />
              <span>
                J’accepte de recevoir ma confirmation d’inscription par e-mail de la part de <strong>{OFFICIAL_EMAIL}</strong> et d’être recontactée par Émilie &amp; Virginie. *
                {errors.consentData && <em> {errors.consentData}</em>}
              </span>
            </label>
          </div>

          {err && <p className="error" role="alert">{err}</p>}

          <button
            className="btn btn-terra vip-submit-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <span>Ouverture du règlement sécurisé…</span>
            ) : f.paymentMethod === 'full_450' ? (
              <>
                <span>Procéder au paiement en une fois de {fullStayAmount} €</span>
                <ArrowRight size={18} />
              </>
            ) : f.paymentMethod === 'klarna' || f.paymentMethod === 'alma' ? (
              <>
                <span>Procéder au paiement en 3 × {klarna3x} € ({depositAmount} € aujourd’hui)</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Procéder au règlement de l’acompte de {depositAmount} €</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="vip-form-footer-note">
            <span><ShieldCheck size={15} /> Lettre de bienvenue envoyée par mail dès votre règlement effectué</span>
            <span>·</span>
            <span>Contact officiel : <a href={`mailto:${OFFICIAL_EMAIL}`}>{OFFICIAL_EMAIL}</a></span>
          </div>
        </form>
      </div>
    </section>
  );
}
