// Logique métier pure (testable sans navigateur) : quotas, anti-double-réservation, références.

export const ACTIVE = ['pending', 'paid', 'paid_demo'];

export function slotKey(slotId) {
  return slotId || 'general';
}

export function slotCapacity(exp, slotId) {
  if (slotId && slotId !== 'general') {
    const d = (exp.dates || []).find((x) => x.id === slotId);
    return d && d.capacity != null ? d.capacity : null;
  }
  return exp.capacity ?? null;
}

export function seatsTaken(bookings, expSlug, slotId) {
  return bookings
    .filter((b) => b.exp === expSlug && slotKey(b.slot) === slotKey(slotId) && ACTIVE.includes(b.status))
    .reduce((n, b) => n + b.places, 0);
}

export function seatsLeft(exp, bookings, slotId) {
  const cap = slotCapacity(exp, slotId);
  if (cap == null) return null; // illimité / non communiqué
  return Math.max(0, cap - seatsTaken(bookings, exp.slug, slotId));
}

export function makeReference(rand = Math.random) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(rand() * chars.length)];
  return `CDA-${s}`;
}

export function amountDue(exp, places) {
  const unit = exp.kind === 'preorder' ? exp.depositPerPlace : exp.pricePerPerson;
  if (unit == null) return null;
  return unit * places;
}

export function validate(form) {
  const errors = {};
  if (!form.name || form.name.trim().length < 2) errors.name = 'Merci d’indiquer votre nom.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || '')) errors.email = 'Adresse email invalide.';
  if (!Number.isInteger(form.places) || form.places < 1 || form.places > 6) errors.places = 'Entre 1 et 6 places.';
  if (!form.consentRules) errors.consentRules = 'Ce consentement est nécessaire.';
  if (!form.consentData) errors.consentData = 'Ce consentement est nécessaire.';
  return errors;
}

// Retourne { ok, booking? , error? } — ne modifie pas la liste d'entrée.
export function createBooking(exp, bookings, form, { demo = true, now = new Date().toISOString(), rand = Math.random } = {}) {
  const errors = validate(form);
  if (Object.keys(errors).length) return { ok: false, errors };
  const left = seatsLeft(exp, bookings, form.slot);
  if (left != null && form.places > left) {
    return { ok: false, error: left === 0 ? 'Complet : rejoignez la liste d’attente.' : `Il ne reste que ${left} place(s).` };
  }
  const dup = bookings.find(
    (b) => b.exp === exp.slug && slotKey(b.slot) === slotKey(form.slot) && b.email.toLowerCase() === form.email.toLowerCase() && ACTIVE.includes(b.status),
  );
  if (dup) return { ok: false, error: `Une réservation existe déjà avec cet email (réf. ${dup.reference}).` };
  const existing = new Set(bookings.map((b) => b.reference));
  let reference = makeReference(rand);
  while (existing.has(reference)) reference = makeReference(rand);
  const status = demo ? 'paid_demo' : 'pending';
  return {
    ok: true,
    booking: {
      reference,
      exp: exp.slug,
      slot: form.slot || 'general',
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone || '',
      places: form.places,
      amount: amountDue(exp, form.places),
      status,
      createdAt: now,
      log: [{ at: now, status, note: demo ? 'Mode démo — aucun paiement réel' : 'Création' }],
    },
  };
}

export function setStatus(bookings, reference, status, note = '', now = new Date().toISOString()) {
  return bookings.map((b) => (b.reference === reference ? { ...b, status, log: [...b.log, { at: now, status, note }] } : b));
}

export function toCsv(bookings) {
  const head = ['reference', 'experience', 'date', 'nom', 'email', 'telephone', 'places', 'montant', 'statut', 'cree_le'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = bookings.map((b) => [b.reference, b.exp, b.slot, b.name, b.email, b.phone, b.places, b.amount, b.status, b.createdAt]);
  return [head, ...rows].map((r) => r.map(esc).join(';')).join('\n');
}
