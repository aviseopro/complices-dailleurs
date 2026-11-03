import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Sparkles,
  Check,
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
  Heart,
} from 'lucide-react';
import { useData, update, euro } from '../data/store.js';
import { Logo, Price, AlmaLogo } from '../components/ui.jsx';
import { createBooking, seatsLeft, amountDue } from '../lib/booking.js';
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

  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    places: 1,
    slot: e?.dates?.[0]?.id || 'general',
    paymentMethod: 'deposit_95', // 'deposit_95' | 'cash'
    consentRules: false,
    consentData: false,
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
  const [emailStatus, setEmailStatus] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!e || e.kind === 'future') {
    return (
      <section className="section">
        <div className="wrap">
          <h1>Réservation indisponible</h1>
          <Link to="/">Retour</Link>
        </div>
      </section>
    );
  }

  const preorder = e.kind === 'preorder';
  const blocked = e.status === 'soon' && !isMarrakechFemmes;
  const left = seatsLeft(e, bookings, f.slot);
  const depositAmount = (e.depositPerPlace || 95) * Number(f.places || 1);
  const fullStayAmount = (e.pricePerPerson || 450) * Number(f.places || 1);
  const total = amountDue(e, f.places);
  const paymentLink = e.paymentLink || settings.stripePaymentUrl;

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
    const shareUrl = `${window.location.origin}/paiement`;
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

    setSubmitting(true);
    update((s) => {
      s.bookings.push(res.booking);
      return s;
    });

    // Envoi automatique du mail de confirmation (à la participante + complicesdailleurs@gmail.com)
    await sendBookingConfirmationEmail({ booking: res.booking, experience: e });
    setEmailStatus('sent');
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

  // Écran Récapitulatif & Confirmation Mail après validation (Done)
  if (done) {
    if (isMarrakechFemmes) {
      const hasOptions = done.options && (done.options.hammam || done.options.soireeFestive || done.options.agafay);
      return (
        <section className="section theme-marrakech">
          <div className="wrap narrow" role="status">
            <div className="mk-done-card">
              <span className="pill open" style={{ marginBottom: '.8rem', display: 'inline-block' }}>
                ✓ Demande enregistrée &amp; confirmation envoyée par mail
              </span>
              <h1 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', color: 'var(--navy)', marginBottom: '.5rem' }}>
                Merci {done.name.split(' ')[0]}
              </h1>
              <p className="lead" style={{ color: 'var(--ink)', marginBottom: '1.4rem' }}>
                Votre demande pour <strong>Marrakech entre femmes</strong> a bien été enregistrée et transmise à Émilie et Virginie ({OFFICIAL_EMAIL}).
              </p>
              <div className="mk-done-ref-box">
                <span>Référence de votre demande :</span>
                <strong>{done.reference}</strong>
              </div>

              <div className="mk-done-section">
                <h3 className="mk-done-section-title">1. Votre séjour</h3>
                <div className="mk-done-stay-card">
                  <div className="mk-done-stay-head">
                    <strong>Marrakech — Entre femmes (4 jours / 3 nuits)</strong>
                    <span className="pill waitlist">6 à 8 participantes maximum</span>
                  </div>
                  <ul className="mk-done-stay-list">
                    <li><strong>Participante(s) :</strong> {done.places} place{done.places > 1 ? 's' : ''} ({done.name} · {done.email} · {done.phone})</li>
                    <li><strong>Accompagnement :</strong> Présence d’Émilie &amp; Virginie tout au long du séjour</li>
                    <li><strong>Inclusions comprises :</strong> Yoga quotidien avec Virginie (professeure diplômée), 1 massage bien-être par participante, atelier mosaïque (matériel &amp; création personnelle), hébergement de charme en Riad 3 nuits avec petits-déjeuners, transferts aéroport RAK</li>
                    <li>
                      <strong>Prix de travail indicatif :</strong> 790 € / participante (hors vols personnels)
                      <br />
                      <small style={{ color: 'var(--muted)' }}>Montant en attente de chiffrage définitif complet. <strong>Aucun montant n’est débité aujourd’hui (0 €).</strong></small>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mk-done-section">
                <h3 className="mk-done-section-title">2. Vos envies sélectionnées (à régler directement sur place)</h3>
                {hasOptions ? (
                  <div className="mk-done-options-card">
                    {done.options.hammam && (
                      <div className="mk-done-option-item">
                        <div className="mk-done-option-icon">🌿</div>
                        <div>
                          <strong>Une parenthèse au hammam (Mythic Oriental Spa)</strong>
                          <p>Hammam beldi traditionnel, gommage au savon noir &amp; hydratation (~40 min de soin, créneau de 1 h 30 à 2 h avec accompagnement à pied).</p>
                          <span className="mk-done-option-price">Budget indicatif : ~450 DH (environ 45 €) / personne · Payable directement au spa sur place</span>
                        </div>
                      </div>
                    )}
                    {done.options.soireeFestive && (
                      <div className="mk-done-option-item">
                        <div className="mk-done-option-icon">✨</div>
                        <div>
                          <strong>Une soirée festive à Marrakech avec le groupe</strong>
                          <p>Partager le plaisir de sortir ensemble à la nuit tombée. Proposition et budget détaillés communiqués avant confirmation.</p>
                          <span className="mk-done-option-price">Dépenses de soirée à régler directement sur place selon la formule retenue</span>
                        </div>
                      </div>
                    )}
                    {done.options.agafay && (
                      <div className="mk-done-option-item">
                        <div className="mk-done-option-icon">🐪</div>
                        <div>
                          <strong>Une échappée dans le désert d’Agafay (Agafay Pearl Camp)</strong>
                          <p>Coucher de soleil féerique et atmosphère minérale. Détails, formules et part de transport confirmés ensemble.</p>
                          <span className="mk-done-option-price">Prestation camp + part de transport A/R (base 200 € / 2 véhicules) à régler aux prestataires</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mk-done-empty-options">
                    <p>
                      Vous n’avez sélectionné aucune option facultative : vous profiterez pleinement des activités incluses et de vos moments de repos au Riad.
                    </p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/" className="btn btn-terra">Retour à l’accueil</Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    const isCash = done.paymentMethod === 'cash';
    const stripeUrl = buildStripeUrl(done.reference);
    const firstName = done.name.split(' ')[0];

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

            {/* Action immédiate selon le mode de paiement choisi */}
            {!isCash && stripeUrl ? (
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
              <span>📧 Aperçu de votre e-mail officiel de confirmation ({OFFICIAL_EMAIL})</span>
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
                      : `Acompte de réservation de ${depositAmount} € par carte bancaire (sur ${fullStayAmount} € tout compris)`}
                  </strong>
                </div>
              </div>

              <div className="vip-email-inclusions">
                <strong>Plus de 300 € de soins esthétiques &amp; de yoga inclus dans votre séjour</strong>
                <p>
                  Loft privatisé avec Spa 7 places, Sauna 4 places et piscine chauffée, pension complète gourmande, soin du visage haute technologie, massage relaxant, séance LED, atelier d’auto-massage et séances de yoga avec Virginie &amp; Émilie.
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
          <span>Lien d’inscription directe participantes confirmées</span>
          <button type="button" onClick={copyDirectLink} className="vip-copy-btn">
            <Copy size={14} />
            <span>{copiedLink ? '✓ Lien copié !' : 'Copier le lien à envoyer'}</span>
          </button>
        </div>

        {/* CARTE D'ACCUEIL TRÈS JOLIE AVEC PHOTO D'ÉMILIE & VIRGINIE + LOGO */}
        <div className="vip-invitation-card">
          <div className="vip-invitation-top">
            <Logo />
            <span className="vip-invitation-badge">Invitation &amp; Inscription Privée · 8 participantes max</span>
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
              <p className="vip-invitation-kicker">BASSIN D’ARCACHON · WEEK-END ENTRE FEMMES</p>
              <h1>Validez votre place parmi nous</h1>
              <p className="vip-invitation-lead">
                « Quel bonheur de vous accueillir pour cette parenthèse rien que pour vous ! Indiquez votre e-mail et votre numéro de téléphone ci-dessous, choisissez votre mode de règlement (<strong>95 € d’acompte</strong> ou <strong>paiement Cash</strong>), et recevez immédiatement votre belle confirmation d’inscription par mail. »
              </p>
            </div>
          </div>

          {/* Rappel élégant de ce qui est compris */}
          <div className="vip-stay-summary-strip">
            <div>
              <strong>Plus de 300 € inclus</strong>
              <span>Soins esthétiques haute technologie, massage, LED &amp; cours de yoga</span>
            </div>
            <div>
              <strong>Loft privatisé</strong>
              <span>Spa 7 places, Sauna 4 places, piscine chauffée &amp; pension complète</span>
            </div>
            <div>
              <strong>Tarif tout compris : {e.pricePerPerson || 450} €</strong>
              <span>Réservation avec {e.depositPerPlace || 95} € d’acompte ou règlement Cash</span>
            </div>
          </div>
        </div>

        {blocked ? (
          <p>
            Ce séjour n’est pas encore ouvert à la réservation. <Link to="/contact">Contactez-nous</Link> pour être prévenue.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="vip-form-card">
            <div className="vip-form-section-head">
              <span className="vip-step-num">1</span>
              <div>
                <h2>Vos coordonnées personnelles</h2>
                <p>Pour vous envoyer votre confirmation officielle par e-mail et vous joindre sur WhatsApp.</p>
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
                  <small className="vip-field-hint">Vous y recevrez immédiatement votre mail de confirmation.</small>
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
                <h3>Personnalisez votre expérience</h3>
                <p className="mk-book-options-subtitle">
                  Indiquez vos envies pour nous permettre d’organiser les créneaux et les déplacements. Nous confirmerons ensemble les disponibilités et les tarifs avant toute réservation auprès des prestataires.
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

            {/* ÉTAPE 2 : CHOIX DU MODE DE PAIEMENT (95 € DE RÉSERVATION OU CASH) */}
            {!isMarrakechFemmes && (
              <>
                <div className="vip-form-section-head" style={{ marginTop: '1.8rem' }}>
                  <span className="vip-step-num">2</span>
                  <div>
                    <h2>Choisissez votre mode de règlement</h2>
                    <p>Vous pouvez régler les <strong>{depositAmount} € de réservation</strong> maintenant par carte ou choisir de <strong>payer en Cash</strong>.</p>
                  </div>
                </div>

                <div className="vip-payment-choices" role="radiogroup" aria-label="Mode de règlement">
                  {/* Option A : 95 € de réservation en ligne */}
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
                    <h3>Régler les {depositAmount} € de réservation</h3>
                    <p>
                      Je bloque ma place immédiatement en réglant l’acompte de <strong>{depositAmount} €</strong> par carte bancaire (Stripe). Le solde du séjour sera réglé plus tard.
                    </p>
                    <div className="vip-pay-amount">
                      <span>À régler aujourd’hui :</span>
                      <strong>{depositAmount} €</strong>
                    </div>
                  </label>

                  {/* Option B : Payer Cash (Espèces) */}
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
              </>
            )}

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
              ) : isMarrakechFemmes ? (
                <span>Valider mon inscription &amp; recevoir ma confirmation par mail</span>
              ) : f.paymentMethod === 'cash' ? (
                <>
                  <span>Valider mon inscription (Paiement Cash) &amp; recevoir mon mail</span>
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
        )}
      </div>
    </section>
  );
}
