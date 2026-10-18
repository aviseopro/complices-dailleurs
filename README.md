# Complices d’ailleurs — site web

**Stack** : React + Vite (rapide, statique, déployable partout), React Router, CSS maison (sans framework lourd), `lucide-react` pour les icônes. Contenu 100 % piloté par des données (`src/data/defaults.js`) — aucun prix ni date en dur dans les composants.

## Lancer en local
```bash
npm install
npm run dev      # prévisualisation : http://localhost:5173
npm test         # tests fonctionnels (quotas, formulaire, doublons, remboursements, CSV)
npm run build    # production → dossier dist/
```
- Admin : http://localhost:5173/admin (mot de passe démo : `demo`)

## État actuel
| Élément | État |
|---|---|
| Accueil, Notre histoire, pages séjour (Arcachon, 2× Marrakech), réservation, contact, légal, FAQ, admin | ✅ construits |
| Mode démo (aucun paiement réel, aucun email) | ✅ actif par défaut |
| Alma | « bientôt disponible » (jamais simulé) |
| Vente Marrakech | verrouillée (`salesEnabled=false`) |
| Photos fondatrices, hero réel, galeries | ⚠️ emplacements explicites « Photo à fournir » |
| Logo | recadré sans cercle depuis le logo fourni (non redessiné) |
| Stockage des données | navigateur (démo) → **back-end à brancher** pour la production |

## Ce qu’il faut me fournir (non inventable)
Photos réelles Émilie & Virginie · photos/licences hero et galeries · dates, prix finaux, capacités · lieu et hébergement confirmés · conditions des 35 € (imputation, remboursement, garantie de place) · SIRET/mentions légales/CGV/assurance/garantie voyages · identifiants du prestataire de paiement (ex. Stripe) et contrat Alma · email/Instagram réels.

## Images
`public/img/arcachon-baie.jpg` est un recadrage basse résolution d’une story : **provisoire**. Remplacer par une vraie photo (≥ 2000 px, format paysage) et changer le chemin dans Admin › Réglages › Image du hero.
