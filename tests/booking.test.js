import test from 'node:test';
import assert from 'node:assert/strict';
import { createBooking, seatsLeft, setStatus, toCsv, amountDue } from '../src/lib/booking.js';
import { defaultData } from '../src/data/defaults.js';
import {
  hashPassword,
  computeEscapeRecommendations,
  registerMember,
} from '../src/lib/memberStore.js';

const arca = () => ({ ...defaultData.experiences[0], capacity: 3 });
const form = (o = {}) => ({ name: 'Anne Test', email: 'a@b.fr', places: 2, consentRules: true, consentData: true, ...o });

test('montant = 100 € × places, jamais codé en dur', () => {
  assert.equal(amountDue(arca(), 2), 200);
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

test('Espace Membre : hachage SHA-256 ne stocke jamais le mot de passe en clair', async () => {
  const raw = 'SecretComplice2026!';
  const h = await hashPassword(raw, 'test@exemple.fr');
  assert.notEqual(h, raw);
  assert.equal(h.length, 64);
});

test('Questionnaire « Quelle escapade est faite pour vous ? » recommande de vraies expériences du site', () => {
  const realSlugs = new Set(defaultData.experiences.map((e) => e.slug));
  const rec = computeEscapeRecommendations({
    q1_evasion: 'ocean',
    q2_plaisir: ['soins_relaxation', 'yoga_bien_etre'],
    q3_compagnie: 'seule',
    q4_besoin: 'reposer',
    q5_budget: '150_450',
    q6_destinations: ['arcachon'],
  });
  assert.equal(rec.recommendedSlugs[0], 'arcachon-entre-femmes');
  for (const slug of rec.recommendedSlugs) {
    assert.ok(realSlugs.has(slug), `Slug recommandé réel : ${slug}`);
  }
});

test('Inscription membre : exige les champs obligatoires et la case CGU/Confidentialité', async () => {
  const failRes = await registerMember({
    firstName: 'S',
    lastName: '',
    email: 'invalide',
    password: '123',
    confirmPassword: '456',
    acceptTerms: false,
    marketingOptIn: false,
  });
  assert.equal(failRes.ok, false);
  assert.ok(failRes.errors.firstName);
  assert.ok(failRes.errors.lastName);
  assert.ok(failRes.errors.email);
  assert.ok(failRes.errors.password);
  assert.ok(failRes.errors.confirmPassword);
  assert.ok(failRes.errors.acceptTerms);
});

