import { useSyncExternalStore } from 'react';
import { defaultData } from './defaults.js';

// Démo : persistance dans le navigateur (localStorage).
// Production : remplacer load()/save() par des appels à l'API/back-end (voir docs/DEPLOIEMENT.md).
const KEY = 'cda-data-v1';
let state;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Mise à jour de l'image de hero si elle était sur l'ancienne image basse résolution
      if (!saved.settings?.heroImage || saved.settings?.heroImage === '/img/arcachon-baie.jpg') {
        saved.settings = { ...saved.settings, heroImage: defaultData.settings.heroImage };
      }
      if (!saved.settings?.heroVideo || saved.settings?.heroVideo === '/videos/hero-arcachon.mp4') {
        saved.settings = { ...saved.settings, heroVideo: defaultData.settings.heroVideo };
      }
      if (!saved.settings?.stripePaymentUrl) {
        saved.settings = { ...saved.settings, stripePaymentUrl: defaultData.settings.stripePaymentUrl };
      }
      const have = new Map((saved.experiences || []).map((e) => [e.slug, e]));
      const exps = defaultData.experiences.map((def) => {
        const cur = have.get(def.slug);
        if (!cur) return def;
        return {
          ...def,
          ...cur,
          depositPerPlace: (!cur.depositPerPlace || cur.depositPerPlace === 35 || cur.depositPerPlace === 100) ? def.depositPerPlace : cur.depositPerPlace,
          paymentLink: (cur.paymentLink && cur.paymentLink.length > 5) ? cur.paymentLink : def.paymentLink,
          image: cur.image || def.image,
          gallery: (cur.gallery && cur.gallery[0]?.src) ? cur.gallery : def.gallery,
        };
      });
      return { ...defaultData, ...saved, experiences: exps };
    }
  } catch {
    /* ignore */
  }
  return structuredClone(defaultData);
}

state = load();

export function getState() {
  return state;
}

export function update(fn) {
  state = fn(structuredClone(state));
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function resetData() {
  localStorage.removeItem(KEY);
  state = structuredClone(defaultData);
  listeners.forEach((l) => l());
}

export function useData() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

export const euro = (n) => (n == null ? 'À confirmer' : `${n.toLocaleString('fr-FR')} €`);
