import test from 'node:test';
import assert from 'node:assert/strict';
import { createBooking, seatsLeft, setStatus, toCsv, amountDue } from '../src/lib/booking.js';
import { defaultData } from '../src/data/defaults.js';

const arca = () => ({ ...defaultData.experiences[0], capacity: 3 });
const form = (o = {}) => ({ name: 'Anne Test', email: 'a@b.fr', places: 2, consentRules: true, consentData: true, ...o });

test('montant = 35 € × places, jamais codé en dur', () => {
  assert.equal(amountDue(arca(), 2), 70);
  assert.equal(amountDue({ ...arca(), depositPerPlace: 40 }, 2), 80);
  assert.equal(amountDue({ kind: 'booking', pricePerPerson: null }, 2), null);
});

test('formulaire invalide refusé', () => {
  const r = createBooking(arca(), [], form({ email: 'x', consentData: false }));
  assert.equal(r.ok, false);
  assert.ok(r.errors.email && r.errors.consentData);
});

test('quota : refuse au-delà de la capacité', () => {
  const e = arca();
  const r1 = createBooking(e, [], form());
  assert.ok(r1.ok);
  assert.equal(seatsLeft(e, [r1.booking]), 1);
  const r2 = createBooking(e, [r1.booking], form({ email: 'c@d.fr', places: 2 }));
  assert.equal(r2.ok, false);
});

test('anti-double-réservation (même email, même séjour)', () => {
  const e = arca();
  const r1 = createBooking(e, [], form({ places: 1 }));
  const r2 = createBooking(e, [r1.booking], form({ places: 1 }));
  assert.equal(r2.ok, false);
});

test('annulation libère les places + journal des statuts', () => {
  const e = arca();
  const r1 = createBooking(e, [], form());
  const after = setStatus([r1.booking], r1.booking.reference, 'refunded', 'Remboursement admin');
  assert.equal(seatsLeft(e, after), 3);
  assert.equal(after[0].log.length, 2);
});

test('export CSV', () => {
  const r1 = createBooking(arca(), [], form());
  assert.match(toCsv([r1.booking]), /CDA-/);
});
