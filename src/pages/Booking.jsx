import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData, update, euro } from '../data/store.js';
import { Price } from '../components/ui.jsx';
import { createBooking, seatsLeft, amountDue } from '../lib/booking.js';

export default function Booking() {
  const { slug } = useParams();
  const { experiences, bookings, settings } = useData();
  const e = experiences.find((x) => x.slug === slug);
  const [f, setF] = useState({ name: '', email: '', phone: '', places: 1, slot: e?.dates?.[0]?.id || 'general', consentRules: false, consentData: false });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const [pay, setPay] = useState('card');

  if (!e || e.kind === 'future') return <section className="section"><div className="wrap"><h1>Réservation indisponible</h1><Link to="/">Retour</Link></div></section>;

  const preorder = e.kind === 'preorder';
  const blocked = e.status === 'soon';
  const left = seatsLeft(e, bookings, f.slot);
  const total = amountDue(e, f.places);
  const paymentLink = e.paymentLink || settings.stripePaymentUrl;
  const set = (k) => (ev) => setF({ ...f, [k]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    setErr('');
    const res = createBooking(e, JSON.parse(localStorage.getItem('cda-data-v1') || 'null')?.bookings || bookings, { ...f, places: Number(f.places), slot: f.slot }, { demo: false });
    if (!res.ok) { setErrors(res.errors || {}); setErr(res.error || ''); return; }
    update((s) => { s.bookings.push(res.booking); return s; });

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

  if (done)
    return (
      <section className="section"><div className="wrap narrow center" role="status">
        <h1>Merci {done.name.split(' ')[0]} 🌿</h1>
        <p>Votre {preorder ? 'pré-réservation' : 'réservation'} est bien enregistrée.</p>
        <p>Référence : <strong>{done.reference}</strong></p>
        <p>Montant : <strong>{euro(total)}</strong> ({f.places} place{f.places > 1 ? 's' : ''})</p>
        {paymentLink ? (
          <div style={{ margin: '2rem 0' }}>
            <p>Pour finaliser et garantir votre place, procédez au paiement sécurisé en ligne :</p>
            <a href={paymentLink} className="btn btn-blue">Payer maintenant avec Stripe — {euro(total)}</a>
          </div>
        ) : (
          <p className="small">Votre demande a été prise en compte. Un lien de règlement sécurisé Stripe vous sera transmis par email.</p>
        )}
        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-terra">Retour à l’accueil</Link>
        </div>
      </div></section>
    );

  return (
    <section className={`section theme-${e.theme}`}><div className="wrap narrow">
      <p className="eyebrow">{preorder ? 'Pré-réservation' : 'Réservation officielle'}</p>
      <h1>{e.title}</h1>
      {blocked ? (
        <p>Ce séjour n’est pas encore ouvert à la réservation. <Link to="/contact">Contactez-nous</Link> pour être prévenue.</p>
      ) : (
        <form onSubmit={submit} noValidate className="form">
          <label>Nom complet *<input value={f.name} onChange={set('name')} aria-invalid={!!errors.name} autoComplete="name" />{errors.name && <em>{errors.name}</em>}</label>
          <label>Email *<input type="email" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} autoComplete="email" />{errors.email && <em>{errors.email}</em>}</label>
          <label>Téléphone (optionnel)<input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
          {e.dates.length > 0 && (
            <label>Date<select value={f.slot} onChange={set('slot')}>{e.dates.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}</select></label>
          )}
          <label>{preorder ? 'Nombre de places' : 'Nombre de participantes'}
            <input type="number" min="1" max="6" value={f.places} onChange={set('places')} />{errors.places && <em>{errors.places}</em>}
            {left != null && <small>{left} place(s) restante(s)</small>}
          </label>

          <div className="recap" aria-live="polite">
            <span>{preorder ? 'Pré-réservation' : 'Total'} : {f.places} × <Price value={preorder ? e.depositPerPlace : e.pricePerPerson} /></span>
            <strong>{total == null ? <Price value={null} /> : euro(total)}</strong>
          </div>

          {!preorder && (
            <fieldset>
              <legend>Paiement</legend>
              <label className="check"><input type="radio" name="pay" checked={pay === 'card'} onChange={() => setPay('card')} /> Comptant (carte, via prestataire sécurisé)</label>
              <label className="check disabled"><input type="radio" name="pay" disabled /> Plusieurs fois avec Alma — {settings.almaActive ? 'selon éligibilité' : 'bientôt disponible'}</label>
            </fieldset>
          )}

          <label className="check"><input type="checkbox" checked={f.consentRules} onChange={set('consentRules')} /> <span>J’ai lu et j’accepte les <Link to="/cgv" target="_blank">conditions générales de vente</Link>{e.minParticipants ? `, dont le maintien du séjour à partir de ${e.minParticipants} participantes` : ''}. *{errors.consentRules && <em> {errors.consentRules}</em>}</span></label>
          <label className="check"><input type="checkbox" checked={f.consentData} onChange={set('consentData')} /> J’accepte le traitement de mes données pour gérer ma réservation (RGPD). *{errors.consentData && <em> {errors.consentData}</em>}</label>
          <p className="small">Paiement 100 % sécurisé par carte bancaire ou Apple Pay via Stripe. Aucune donnée bancaire n’est stockée sur ce site.</p>
          {err && <p className="error" role="alert">{err}</p>}
          <button className="btn btn-blue" type="submit" disabled={total == null}>{preorder ? `Procéder au paiement — ${total ? euro(total) : '95 €'}` : `Procéder au paiement — ${total ? euro(total) : ''}`}</button>
        </form>
      )}
    </div></section>
  );
}
