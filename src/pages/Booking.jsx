import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sparkles, Info, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useData, update, euro } from '../data/store.js';
import { Price, AlmaLogo } from '../components/ui.jsx';
import { createBooking, seatsLeft, amountDue } from '../lib/booking.js';

export default function Booking() {
  const { slug } = useParams();
  const { experiences, bookings, settings } = useData();
  const e = experiences.find((x) => x.slug === slug);
  const isMarrakechFemmes = e?.slug === 'marrakech-entre-femmes';

  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    places: 1,
    slot: e?.dates?.[0]?.id || 'general',
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
  const [pay, setPay] = useState('card');

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
  const total = amountDue(e, f.places);
  const paymentLink = e.paymentLink || settings.stripePaymentUrl;
  const set = (k) => (ev) =>
    setF({ ...f, [k]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    setErr('');
    const payload = {
      ...f,
      places: Number(f.places),
      slot: f.slot,
      options: isMarrakechFemmes ? options : null,
    };
    const res = createBooking(
      e,
      JSON.parse(localStorage.getItem('cda-data-v1') || 'null')?.bookings || bookings,
      payload,
      { demo: false }
    );
    if (!res.ok) {
      setErrors(res.errors || {});
      setErr(res.error || '');
      return;
    }
    update((s) => {
      s.bookings.push(res.booking);
      return s;
    });

    // Pour Marrakech : aucun débit immédiat, affichage direct de la confirmation et transmission
    if (isMarrakechFemmes) {
      setDone(res.booking);
      return;
    }

    if (paymentLink) {
      try {
        const u = new URL(paymentLink);
        if (f.email) u.searchParams.set('prefilled_email', f.email);
        if (res.booking?.reference) u.searchParams.set('client_reference_id', res.booking.reference);
        window.location.href = u.toString();
        return;
      } catch (_) {
        window.location.href = paymentLink;
        return;
      }
    }
    setDone(res.booking);
  };

  // Écran Récapitulatif après enregistrement (Done)
  if (done) {
    if (isMarrakechFemmes) {
      const hasOptions = done.options && (done.options.hammam || done.options.soireeFestive || done.options.agafay);
      return (
        <section className="section theme-marrakech">
          <div className="wrap narrow" role="status">
            <div className="mk-done-card">
              <span className="pill open" style={{ marginBottom: '.8rem', display: 'inline-block' }}>
                ✓ Demande enregistrée avec succès
              </span>
              <h1 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', color: 'var(--navy)', marginBottom: '.5rem' }}>
                Merci {done.name.split(' ')[0]} 🌿
              </h1>
              <p className="lead" style={{ color: 'var(--ink)', marginBottom: '1.4rem' }}>
                Votre demande pour <strong>Marrakech entre femmes</strong> a bien été enregistrée et transmise à Émilie et Virginie.
              </p>
              <div className="mk-done-ref-box">
                <span>Référence de votre demande :</span>
                <strong>{done.reference}</strong>
              </div>

              {/* Séparation visuelle : 1. Séjour à réserver */}
              <div className="mk-done-section">
                <h3 className="mk-done-section-title">1. Votre séjour</h3>
                <div className="mk-done-stay-card">
                  <div className="mk-done-stay-head">
                    <strong>Marrakech — Entre femmes (4 jours / 3 nuits)</strong>
                    <span className="pill waitlist">6 à 8 participantes maximum</span>
                  </div>
                  <ul className="mk-done-stay-list">
                    <li><strong>Participante(s) :</strong> {done.places} place{done.places > 1 ? 's' : ''} ({done.name} · {done.email}{done.phone ? ` · ${done.phone}` : ''})</li>
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

              {/* Séparation visuelle : 2. Envies sélectionnées (payables sur place) */}
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
                    <p className="mk-done-disclaimer">
                      ℹ️ <em>Ces budgets indicatifs ne sont jamais ajoutés au montant du séjour et restent payables directement sur place aux prestataires si vous confirmez ces choix.</em>
                    </p>
                  </div>
                ) : (
                  <div className="mk-done-empty-options">
                    <p>
                      Vous n’avez sélectionné aucune option facultative : vous profiterez pleinement des activités incluses (yoga quotidien, massage individuel, atelier mosaïque) et de vos moments de repos en liberté au Riad.
                    </p>
                  </div>
                )}
              </div>

              <div className="mk-done-next-steps">
                <h4>Et maintenant ?</h4>
                <p>
                  Émilie et Virginie prennent connaissance de votre demande et de vos envies. Nous vous recontacterons très vite (par email ou téléphone) pour échanger avec vous de vive voix, caler les créneaux et répondre à toutes vos questions avant tout engagement formel.
                </p>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/" className="btn btn-terra">Retour à l’accueil</Link>
                <Link to="/contact" className="btn btn-light">Une question ? Écrivez-nous</Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="section">
        <div className="wrap narrow center" role="status">
          <h1>Merci {done.name.split(' ')[0]} 🌿</h1>
          <p>Votre {preorder ? 'pré-réservation' : 'réservation'} est bien enregistrée.</p>
          <p>Référence : <strong>{done.reference}</strong></p>
          <p>Montant : <strong>{euro(total)}</strong> ({f.places} place{f.places > 1 ? 's' : ''})</p>
          {paymentLink ? (
            <div style={{ margin: '2rem 0' }}>
              <p>Pour finaliser et garantir votre place, procédez au paiement sécurisé en ligne :</p>
              <a href={paymentLink} className="btn btn-blue">
                Payer maintenant avec Stripe — {euro(total)}
              </a>
            </div>
          ) : (
            <p className="small">
              Votre demande a été prise en compte. Un lien de règlement sécurisé Stripe vous sera transmis par email.
            </p>
          )}
          <div style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn btn-terra">Retour à l’accueil</Link>
          </div>
        </div>
      </section>
    );
  }

  const isArca = e.slug === 'arcachon-entre-femmes';

  return (
    <section className={`section theme-${e.theme}`}>
      <div className="wrap narrow">
        <p className="eyebrow">
          {isMarrakechFemmes
            ? 'Demande d’inscription prioritaire & Personnalisation'
            : isArca
            ? 'Inscription & Réservation de place'
            : preorder
            ? 'Pré-réservation'
            : 'Réservation officielle'}
        </p>
        <h1>{e.title}</h1>

        {/* Highlight Arcachon */}
        {isArca && (
          <div className="bk-arca-highlight" style={{ margin: '1rem 0 1.5rem' }}>
            <div className="bk-arca-dep">
              Réservez votre place pour <strong>{e.depositPerPlace || 95} € d’acompte</strong> seulement
            </div>
            <div
              className="bk-arca-total"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '.5rem',
                marginTop: '.4rem',
              }}
            >
              <span>
                Séjour tout compris : <span className="bk-old-price">{euro(e.originalPrice || 550)}</span>{' '}
                <strong className="bk-new-price" style={{ fontSize: '1.2rem' }}>
                  {euro(e.pricePerPerson || 450)}
                </strong>{' '}
                (solde plus tard)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', fontSize: '.8rem', color: 'var(--navy)' }}>
                Paiement en plusieurs fois avec <AlmaLogo height={14} />
              </span>
            </div>
          </div>
        )}

        {/* Highlight Marrakech */}
        {isMarrakechFemmes && (
          <div
            className="bk-arca-highlight"
            style={{
              margin: '1rem 0 1.5rem',
              background: 'linear-gradient(135deg, rgba(168,85,58,.1), rgba(212,143,56,.1))',
              borderColor: 'rgba(168,85,58,.3)',
            }}
          >
            <span className="bk-arca-tag" style={{ background: 'linear-gradient(135deg, #a8553a, #c75c2c)' }}>
              <Sparkles size={13} /> 4 jours / 3 nuits · 6 à 8 participantes maximum · Accompagné par Émilie &amp; Virginie
            </span>
            <div className="bk-arca-dep" style={{ color: 'var(--navy)', marginTop: '.5rem' }}>
              Hypothèse de travail : <strong>790 € / participante</strong>{' '}
              <span style={{ fontSize: '.84rem', fontWeight: 400, color: 'var(--muted)' }}>(hors vol personnel)</span>
            </div>
            <p style={{ fontSize: '.84rem', lineHeight: 1.5, color: 'var(--ink)', margin: '.4rem 0 0' }}>
              <strong>Inclus dans le séjour :</strong> Yoga quotidien avec Virginie (professeure diplômée), 1 massage bien-être par participante, l’atelier mosaïque (matériel &amp; création personnelle), Riad de charme 3 nuits avec petits-déjeuners marocains, transferts RAK et présence d’Émilie &amp; Virginie.
            </p>
            <div style={{ fontSize: '.8rem', color: 'var(--terra)', fontWeight: 600, marginTop: '.4rem' }}>
              ✓ 0 € prélevé aujourd’hui : aucun débit immédiat, enregistrement de votre demande sans engagement financier.
            </div>
          </div>
        )}

        {blocked ? (
          <p>Ce séjour n’est pas encore ouvert à la réservation. <Link to="/contact">Contactez-nous</Link> pour être prévenue.</p>
        ) : (
          <form onSubmit={submit} noValidate className="form">
            <label>
              Nom complet *
              <input value={f.name} onChange={set('name')} aria-invalid={!!errors.name} autoComplete="name" />
              {errors.name && <em>{errors.name}</em>}
            </label>
            <label>
              Email *
              <input type="email" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} autoComplete="email" />
              {errors.email && <em>{errors.email}</em>}
            </label>
            <label>
              Téléphone {isMarrakechFemmes ? '(recommandé pour échanger ensemble)' : '(optionnel)'}
              <input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />
            </label>

            {e.dates.length > 0 && (
              <label>
                Date
                <select value={f.slot} onChange={set('slot')}>
                  {e.dates.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              {isMarrakechFemmes ? 'Nombre de participantes (groupe de 6 à 8 max)' : preorder ? 'Nombre de places' : 'Nombre de participantes'}
              <input type="number" min="1" max="6" value={f.places} onChange={set('places')} />
              {errors.places && <em>{errors.places}</em>}
              {left != null && <small>{left} place(s) restante(s)</small>}
            </label>

            {/* Rubrique Personnalisez votre expérience pour Marrakech */}
            {isMarrakechFemmes && (
              <div className="mk-book-options-section">
                <h3>Personnalisez votre expérience</h3>
                <p className="mk-book-options-subtitle">
                  Indiquez vos envies pour nous permettre d’organiser les créneaux et les déplacements. Nous confirmerons ensemble les disponibilités et les tarifs avant toute réservation auprès des prestataires. Ces choix expriment un intérêt. Ils ne déclenchent ni paiement ni réservation automatique.
                </p>

                {/* Option 1 : Hammam */}
                <div className={`mk-book-option-box ${options.hammam ? 'is-active' : ''}`}>
                  <label className="mk-book-option-label">
                    <input
                      type="checkbox"
                      checked={options.hammam}
                      onChange={() => toggleOption('hammam')}
                    />
                    <div className="mk-book-option-text">
                      <strong>1. Une parenthèse au hammam (Mythic Oriental Spa)</strong>
                      <p>
                        « Envie de prolonger la douceur ? Nous vous accompagnons jusqu’au hammam pour découvrir un rituel marocain et vous offrir une pause rien qu’à vous. »
                      </p>
                      <p style={{ fontSize: '.79rem', color: 'var(--muted)', margin: '0 0 .2rem' }}>
                        Hammam beldi, gommage au savon noir et hydratation (40 min de soin). Créneau provisoire de 1 h 30 à 2 h avec accueil, change et déplacement à pied.
                      </p>
                      <small>Budget indicatif : ~450 DH (environ 45 €) / pers. · Facultatif — à régler directement au spa sur place (distinct du massage déjà inclus).</small>
                    </div>
                  </label>
                </div>

                {/* Option 2 : Soirée festive */}
                <div className={`mk-book-option-box ${options.soireeFestive ? 'is-active' : ''}`}>
                  <label className="mk-book-option-label">
                    <input
                      type="checkbox"
                      checked={options.soireeFestive}
                      onChange={() => toggleOption('soireeFestive')}
                    />
                    <div className="mk-book-option-text">
                      <strong>2. Une soirée festive à Marrakech avec le groupe</strong>
                      <p>
                        « Et si l’on découvrait aussi Marrakech à la nuit tombée ? Pour celles qui en ont envie, partageons une soirée festive et le plaisir de sortir ensemble. »
                      </p>
                      <p style={{ fontSize: '.79rem', color: 'var(--muted)', margin: '0 0 .2rem' }}>
                        Proposition et budget communiqués avant confirmation. Dépenses de soirée à régler sur place selon la formule choisie (repas, boissons, entrée et transport distingués).
                      </p>
                      <small>Option sans engagement · Dépenses à régler sur place</small>
                    </div>
                  </label>
                </div>

                {/* Option 3 : Désert d'Agafay */}
                <div className={`mk-book-option-box ${options.agafay ? 'is-active' : ''}`}>
                  <label className="mk-book-option-label">
                    <input
                      type="checkbox"
                      checked={options.agafay}
                      onChange={() => toggleOption('agafay')}
                    />
                    <div className="mk-book-option-text">
                      <strong>3. Une échappée dans le désert d’Agafay (Agafay Pearl Camp)</strong>
                      <p>
                        Échappée féerique face aux collines de pierre minérales et sous la voûte étoilée.
                      </p>
                      <p style={{ fontSize: '.79rem', color: 'var(--muted)', margin: '0 0 .2rem' }}>
                        Affichage séparé : Prestation au camp [selon formule choisie] + Transport A/R (estimation de travail de 200 € pour deux véhicules, part recalculée selon les participantes réelles).
                      </p>
                      <small>Expérience facultative, à régler sur place aux prestataires. Prix indiqués pour préparer votre budget.</small>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Récapitulatif avec séparation visuelle stricte */}
            {isMarrakechFemmes ? (
              <div className="mk-book-recap-split" aria-live="polite">
                <div className="mk-book-recap-row">
                  <div>
                    <strong>Séjour à réserver (4 jours / 3 nuits) :</strong>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                      Hypothèse de travail de 790 € / pers. (hors vol personnel) × {f.places}
                    </div>
                  </div>
                  <strong>~{790 * Number(f.places || 1)} € <span style={{ fontSize: '.78rem', fontWeight: 400, color: 'var(--muted)' }}>(indicatif)</span></strong>
                </div>

                <div className="mk-book-recap-row highlight">
                  <span><strong>À régler aujourd’hui lors de l’inscription :</strong></span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--terra)' }}>0 €</strong>
                </div>

                <div className="mk-book-recap-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '.3rem' }}>
                  <div style={{ fontSize: '.84rem', fontWeight: 600, color: 'var(--navy)' }}>
                    Vos envies sélectionnées (à régler sur place aux prestataires) :
                  </div>
                  {options.hammam || options.soireeFestive || options.agafay ? (
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '.82rem', color: 'var(--ink)' }}>
                      {options.hammam && <li>Hammam traditionnel Mythic Oriental Spa (~45 € / 450 DH à régler au spa)</li>}
                      {options.soireeFestive && <li>Soirée festive à Marrakech (budget communiqué avant confirmation, à régler sur place)</li>}
                      {options.agafay && <li>Échappée Agafay Pearl Camp (prestation camp + transport partagé, à régler aux prestataires)</li>}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                      Aucune option sélectionnée (programme avec inclusions seules).
                    </span>
                  )}
                  <p style={{ fontSize: '.76rem', color: 'var(--muted)', margin: '.3rem 0 0', lineHeight: 1.45 }}>
                    ℹ️ <em>Ces choix expriment un intérêt et ne déclenchent aucun paiement immédiat. Les budgets des options ne sont jamais ajoutés au montant du séjour.</em>
                  </p>
                </div>
              </div>
            ) : (
              <div className="recap" aria-live="polite">
                <span>
                  {preorder ? 'Pré-réservation' : 'Total'} : {f.places} ×{' '}
                  <Price value={preorder ? e.depositPerPlace : e.pricePerPerson} />
                  {preorder ? ' d’acompte' : ''}
                </span>
                <strong>{total == null ? <Price value={null} /> : `${euro(total)}${preorder ? ' d’acompte' : ''}`}</strong>
              </div>
            )}

            {!preorder && !isMarrakechFemmes && (
              <fieldset>
                <legend>Paiement</legend>
                <label className="check">
                  <input type="radio" name="pay" checked={pay === 'card'} onChange={() => setPay('card')} /> Comptant (carte, via prestataire sécurisé)
                </label>
                <label className="check disabled">
                  <input type="radio" name="pay" disabled /> Plusieurs fois avec Alma — {settings.almaActive ? 'selon éligibilité' : 'bientôt disponible'}
                </label>
              </fieldset>
            )}

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
              J’accepte le traitement de mes données pour gérer ma demande (RGPD). *
              {errors.consentData && <em> {errors.consentData}</em>}
            </label>

            {err && <p className="error" role="alert">{err}</p>}

            <button
              className={`btn btn-blue ${isArca ? 'btn-commercial-glow' : ''}`}
              type="submit"
            >
              {isMarrakechFemmes
                ? 'Transmettre ma demande & mes envies (6 à 8 places)'
                : isArca
                ? `Confirmer mon inscription — ${total ? euro(total) : '95 € d’acompte'}`
                : preorder
                ? `Régler l’acompte — ${total ? euro(total) : '95 €'}`
                : `Procéder au paiement — ${total ? euro(total) : ''}`}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
