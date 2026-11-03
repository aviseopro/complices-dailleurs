import React, { useState } from 'react';
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
      if (p === 'alma' || p === 'cash' || p === 'deposit_95') initialPay = p;
    }
    return {
      name: '',
      email: '',
      phone: '',
      places: 1,
      slot: e?.dates?.[0]?.id || 'general',
      paymentMethod: initialPay, // 'deposit_95' | 'alma' | 'cash'
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
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
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
  const unitDeposit = e.depositPerPlace || 95;
  const depositAmount = unitDeposit * Number(f.places || 1);
  const unitPrice = e.pricePerPerson || (isMarrakechFemmes ? 790 : 450);
  const fullStayAmount = unitPrice * Number(f.places || 1);
  const alma3x = Math.round((fullStayAmount / 3) * 100) / 100;
  const alma4x = Math.round((fullStayAmount / 4) * 100) / 100;
  const paymentLink = e.paymentLink || settings.stripePaymentUrl;
  const almaLink = e.almaPaymentLink || settings.almaPaymentUrl || 'https://almapay.com/fr-FR';

  const set = (k) => (ev) =>
    setF({ ...f, [k]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value });

  const buildStripeUrl = (bookingRef) => {
    if (!paymentLink) return null;
    try {
      const u = new URL(paymentLink);
      if (f.email) u.searchParams.set('prefilled_email', f.email.trim());
      if (bookingRef) u.searchParams.set('client_reference_id', bookingRef);
      return u.toString();
    } catch (_) {
      return paymentLink;
    }
  };

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

    // S'assure que le montant d'acompte est bien renseigné sur la réservation
    res.booking.amount = depositAmount;

    setSubmitting(true);
    update((s) => {
      s.bookings.push(res.booking);
      return s;
    });

    // Envoi automatique du mail de confirmation (à la participante + complicesdailleurs@gmail.com)
    await sendBookingConfirmationEmail({ booking: res.booking, experience: e });
    setSubmitting(false);
    setDone(res.booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Écran Récapitulatif & Confirmation Mail après validation (Done) — identique sur toutes les réservations
  if (done) {
    const isCash = done.paymentMethod === 'cash';
    const isAlma = done.paymentMethod === 'alma';
    const stripeUrl = buildStripeUrl(done.reference);
    const firstName = done.name.split(' ')[0];
    const hasOptions = done.options && (done.options.hammam || done.options.soireeFestive || done.options.agafay);

    return (
      <section className="section vip-booking-page">
        <div className="wrap narrow" role="status">
          {/* Bandeau d'état en haut */}
          <div className="vip-done-banner">
            <div className="vip-done-status">
              <CheckCircle2 size={22} />
              <div>
                <strong>Inscription enregistrée — Confirmation envoyée par e-mail à {done.email}</strong>
                <span>Une copie a également été transmise à Émilie &amp; Virginie ({OFFICIAL_EMAIL})</span>
              </div>
            </div>

            {/* Action immédiate selon le mode de paiement choisi (95 € en ligne, Alma 3x/4x ou Cash) */}
            {isAlma ? (
              <div className="vip-alma-step-box">
                <div className="vip-stripe-step-text">
                  <span className="vip-step-pill alma">
                    <AlmaLogo height={13} /> Paiement en 2x, 3x ou 4x avec Alma
                  </span>
                  <h3>Réglez votre séjour en 3 fois ({alma3x} €) ou 4 fois ({alma4x} €)</h3>
                  <p>
                    Cliquez sur le bouton ci-dessous pour finaliser votre règlement échelonné sécurisé avec <strong>Alma</strong> (en 2, 3 ou 4 échéances par carte bancaire pour un total de <strong>{fullStayAmount} €</strong>) :
                  </p>
                </div>
                <a
                  href={almaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn vip-alma-cta"
                >
                  <AlmaLogo height={16} />
                  <span>Payer en 3x ({alma3x} €) ou 4x ({alma4x} €) sur Alma</span>
                  <ExternalLink size={17} />
                </a>
              </div>
            ) : !isCash && stripeUrl ? (
              <div className="vip-stripe-step-box">
                <div className="vip-stripe-step-text">
                  <span className="vip-step-pill">Dernière étape · Règlement sécurisé de l’acompte</span>
                  <h3>Finalisez votre réservation de {depositAmount} €</h3>
                  <p>
                    Cliquez sur le bouton ci-dessous pour régler votre acompte de <strong>{depositAmount} €</strong> par carte bancaire sécurisée Stripe (votre email <em>{done.email}</em> est déjà pré-rempli) :
                  </p>
                </div>
                <a href={stripeUrl} className="btn btn-terra vip-stripe-cta">
                  <CreditCard size={18} />
                  <span>Régler mes {depositAmount} € de réservation maintenant</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            ) : (
              <div className="vip-cash-step-box">
                <span className="vip-step-pill cash">✓ Option Paiement Cash enregistrée</span>
                <h3>Votre place est réservée avec règlement en espèces (Cash)</h3>
                <p>
                  Émilie et Virginie ont bien reçu vos coordonnées (<strong>{done.phone}</strong> · <strong>{done.email}</strong>) et vous recontactent très vite pour convenir du règlement en espèces.
                </p>
              </div>
            )}
          </div>

          {/* APERÇU DU BEAU MAIL DE CONFIRMATION (AVEC LOGO & PHOTO D'ÉMILIE ET VIRGINIE) */}
          <div className="vip-email-preview-wrap">
            <div className="vip-email-preview-toolbar">
              <span>📧 Votre e-mail officiel de confirmation ({OFFICIAL_EMAIL})</span>
              <button type="button" onClick={() => printConfirmationMail(done)} className="btn btn-sm btn-ghost">
                <Printer size={14} /> Imprimer / Enregistrer mon invitation (PDF)
              </button>
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
                <h2>Bienvenue parmi nous, {firstName} !</h2>
                <p>
                  Quel bonheur de vous compter parmi nos participantes pour notre parenthèse{' '}
                  <strong>{e.title}</strong>. Nous avons tellement hâte de prendre soin de vous et de partager ces moments précieux à vos côtés.
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
                    {isCash
                      ? 'Paiement en espèces (Cash) directement auprès d’Émilie & Virginie'
                      : isAlma
                      ? `Paiement en 3x (${alma3x} €) ou 4x (${alma4x} €) avec Alma (sur ${fullStayAmount} €)`
                      : `Acompte de réservation de ${depositAmount} € par carte bancaire (sur ${fullStayAmount} €)`}
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
                « Quel bonheur de vous accueillir pour cette parenthèse rien que pour vous ! Indiquez votre e-mail et votre numéro de téléphone ci-dessous, choisissez votre mode de règlement (<strong>{unitDeposit} € de réservation</strong>, <strong>paiement en 3x ou 4x avec Alma</strong>, ou <strong>paiement Cash</strong>), et recevez immédiatement votre belle confirmation d’inscription par mail. »
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
              {/* Moyen 1 : 95 € de réservation */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setF({ ...f, paymentMethod: 'deposit_95' })}
                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && setF({ ...f, paymentMethod: 'deposit_95' })}
                className={`vip-top-pay-pill ${f.paymentMethod === 'deposit_95' ? 'active' : ''}`}
              >
                <div className="vip-top-pay-pill-head">
                  <span className="vip-top-pay-icon"><CreditCard size={16} /></span>
                  <strong>1. Donner les {depositAmount} € de réservation</strong>
                </div>
                <p>Bloquez votre place aujourd’hui par carte bancaire sécurisée (Stripe).</p>
              </div>

              {/* Moyen 2 : Paiement en 2x, 3x ou 4x avec Alma + Lien direct */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setF({ ...f, paymentMethod: 'alma' })}
                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && setF({ ...f, paymentMethod: 'alma' })}
                className={`vip-top-pay-pill alma ${f.paymentMethod === 'alma' ? 'active' : ''}`}
              >
                <div className="vip-top-pay-pill-head">
                  <AlmaLogo height={16} />
                  <strong>2. Paiement en 3x ou 4x avec Alma</strong>
                </div>
                <p>
                  Réglez en <strong>3 × {alma3x} €</strong> ou <strong>4 × {alma4x} €</strong> par carte (aussi disponible en 2x).
                </p>
                <a
                  href={almaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => ev.stopPropagation()}
                  className="vip-top-alma-link"
                >
                  <span>Accéder au paiement Alma (3x / 4x)</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Moyen 3 : Paiement Cash */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setF({ ...f, paymentMethod: 'cash' })}
                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && setF({ ...f, paymentMethod: 'cash' })}
                className={`vip-top-pay-pill cash ${f.paymentMethod === 'cash' ? 'active' : ''}`}
              >
                <div className="vip-top-pay-pill-head">
                  <span className="vip-top-pay-icon cash"><Banknote size={16} /></span>
                  <strong>3. Payer en Cash (Espèces)</strong>
                </div>
                <p>Confirmez votre place maintenant et réglez en espèces auprès d’Émilie &amp; Virginie.</p>
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
              <strong>{unitDeposit} €, Alma 3x/4x ou Cash</strong>
              <span>Tarif du séjour : {unitPrice} € / pers. · Confirmation immédiate par mail</span>
            </div>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="vip-form-card">
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

          {/* ÉTAPE 2 : CHOIX DU MODE DE PAIEMENT (95 € DE RÉSERVATION, ALMA 3x/4x OU CASH) SUR TOUTES LES PAGES DE RÉSERVATION */}
          <div className="vip-form-section-head" style={{ marginTop: '1.8rem' }}>
            <span className="vip-step-num">2</span>
            <div>
              <h2>Choisissez votre mode de règlement</h2>
              <p>
                Vous pouvez donner les <strong>{depositAmount} € de réservation</strong> maintenant, régler en <strong>3x ou 4x avec Alma</strong>, ou choisir de <strong>payer en Cash</strong>.
              </p>
            </div>
          </div>

          <div className="vip-payment-choices" role="radiogroup" aria-label="Mode de règlement">
            {/* Option 1 : 95 € de réservation en ligne */}
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
                <span className="vip-pay-badge">Paiement en ligne sécurisé</span>
              </div>
              <h3>Donner les {depositAmount} € de réservation</h3>
              <p>
                Je bloque ma place immédiatement en réglant l’acompte de <strong>{depositAmount} €</strong> par carte bancaire (Stripe). Le solde du séjour sera réglé plus tard.
              </p>
              <div className="vip-pay-amount">
                <span>À régler aujourd’hui :</span>
                <strong>{depositAmount} €</strong>
              </div>
            </label>

            {/* Option 2 : Paiement en 2x, 3x ou 4x avec Alma */}
            <label
              className={`vip-pay-card alma ${f.paymentMethod === 'alma' ? 'selected' : ''}`}
              onClick={() => setF({ ...f, paymentMethod: 'alma' })}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="alma"
                checked={f.paymentMethod === 'alma'}
                onChange={() => setF({ ...f, paymentMethod: 'alma' })}
              />
              <div className="vip-pay-card-top">
                <span className="vip-pay-icon alma"><AlmaLogo height={16} /></span>
                <span className="vip-pay-badge alma">2x · 3x · 4x par carte</span>
              </div>
              <h3>Payer en 3x ou 4x avec Alma</h3>
              <p>
                Échelonnez le règlement de votre séjour ({fullStayAmount} €) en <strong>3 × {alma3x} €</strong> ou <strong>4 × {alma4x} €</strong> par carte bancaire avec Alma.
              </p>
              <div className="vip-pay-alma-link-row">
                <a
                  href={almaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => ev.stopPropagation()}
                  className="vip-card-alma-link"
                >
                  <span>Lien de paiement Alma (3x / 4x)</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="vip-pay-amount">
                <span>Mensualités Alma :</span>
                <strong>3 × {alma3x} € ou 4 × {alma4x} €</strong>
              </div>
            </label>

            {/* Option 3 : Payer Cash (Espèces) */}
            <label
              className={`vip-pay-card ${f.paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => setF({ ...f, paymentMethod: 'cash' })}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={f.paymentMethod === 'cash'}
                onChange={() => setF({ ...f, paymentMethod: 'cash' })}
              />
              <div className="vip-pay-card-top">
                <span className="vip-pay-icon cash"><Banknote size={20} /></span>
                <span className="vip-pay-badge cash">Règlement en main propre</span>
              </div>
              <h3>Payer en Cash (Espèces)</h3>
              <p>
                Je confirme définitivement ma participation aujourd’hui et je règle en espèces (Cash) directement auprès d’Émilie et Virginie.
              </p>
              <div className="vip-pay-amount">
                <span>Mode choisi :</span>
                <strong>Paiement Cash</strong>
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
              <span>Enregistrement &amp; envoi de votre confirmation…</span>
            ) : f.paymentMethod === 'cash' ? (
              <>
                <span>Valider mon inscription (Paiement Cash) &amp; recevoir mon mail</span>
                <ArrowRight size={18} />
              </>
            ) : f.paymentMethod === 'alma' ? (
              <>
                <span>Valider mon inscription — Payer en 3x ({alma3x} €) ou 4x ({alma4x} €) avec Alma</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Valider mon inscription — Régler les {depositAmount} € de réservation</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="vip-form-footer-note">
            <span><ShieldCheck size={15} /> Confirmation immédiate par mail avec notre photo &amp; logo</span>
            <span>·</span>
            <span>Contact officiel : <a href={`mailto:${OFFICIAL_EMAIL}`}>{OFFICIAL_EMAIL}</a></span>
          </div>
        </form>
      </div>
    </section>
  );
}
