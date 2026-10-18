import React from 'react';
import { useData } from '../data/store.js';

// Gabarit de CGV usuel pour la vente de séjours bien-être / voyages organisés.
// À FAIRE VALIDER par un juriste ou un expert avant mise en production (les [crochets] sont à compléter).
export default function Cgv() {
  const { settings, experiences } = useData();
  const withMin = experiences.filter((e) => e.minParticipants);
  document.title = 'Conditions générales de vente — Complices d’ailleurs';
  return (
    <section className="section">
      <div className="wrap narrow legal">
        <h1>Conditions générales de vente</h1>
        <p className="notice">Gabarit à faire valider par un professionnel du droit avant mise en vente. Les éléments entre [crochets] sont à compléter. Dernière mise à jour : [date].</p>

        <h2>Article 1 — Objet et organisateur</h2>
        <p>Les présentes conditions régissent la vente des séjours et expériences proposés par Complices d’ailleurs — [raison sociale, forme juridique, SIRET, adresse, email, téléphone, n° d’immatriculation au registre des opérateurs de voyages et de séjours si applicable, garant financier, assureur de responsabilité civile professionnelle] (« l’Organisateur »), auprès de toute personne majeure (« la Participante »). Elles s’appliquent à toute pré-réservation ou réservation effectuée sur ce site.</p>

        <h2>Article 2 — Descriptif des séjours</h2>
        <p>Chaque séjour fait l’objet d’une page détaillant le programme, les prestations incluses et non incluses, le lieu, la durée, les dates et le tarif par personne. Le programme est modulable : l’Organisateur peut l’adapter (météo, contraintes locales, disponibilité des intervenantes) sans en dénaturer le contenu. Les soins proposés sont des soins de bien-être et de beauté ; ils n’ont aucune visée médicale.</p>

        <h2>Article 3 — Prix</h2>
        <p>Les prix sont indiqués en euros, par personne, toutes taxes comprises, et précisés sur la page du séjour avant toute réservation. Ils comprennent uniquement les prestations listées comme « incluses ». Sont exclus, sauf mention contraire : transport jusqu’au lieu du séjour, assurances facultatives, dépenses personnelles, options.</p>

        <h2>Article 4 — Pré-réservation et réservation</h2>
        <p><strong>Pré-réservation (Bassin d’Arcachon).</strong> La pré-réservation est un acompte de 95 € par place. Ses conditions d’imputation sur le prix final, de remboursement et de garantie de place sont précisées avant tout paiement. Tant que ces conditions ne le prévoient pas expressément, la pré-réservation ne vaut pas garantie de place.</p>
        <p><strong>Réservation.</strong> La réservation est définitive après validation du formulaire, acceptation des présentes CGV, paiement de la somme exigible et confirmation écrite par email comportant une référence unique. Les places sont attribuées dans l’ordre d’arrivée des paiements, dans la limite de la capacité du séjour ; en cas de séjour complet, une liste d’attente peut être proposée.</p>

        <h2>Article 5 — Paiement</h2>
        <p>Le paiement s’effectue en ligne par l’intermédiaire d’un prestataire de paiement sécurisé : l’Organisateur ne conserve aucune donnée de carte bancaire. Calendrier de paiement : [acompte de …% à la réservation, solde au plus tard … jours avant le départ]. Un paiement en plusieurs fois via Alma pourra être proposé, sous réserve d’éligibilité de la Participante et d’acceptation par Alma, selon ses propres conditions. {settings.almaActive ? '' : 'Ce service n’est pas encore disponible.'}</p>

        <h2>Article 6 — Nombre minimum de participantes : maintien du séjour</h2>
        <p>Chaque séjour est <strong>maintenu à partir d’un nombre minimum de participantes</strong>, fixé à :</p>
        <ul className="plain">{withMin.map((e) => <li key={e.slug}>{e.title} : <strong>{e.minParticipants} participantes</strong></li>)}</ul>
        <p>Dès que ce minimum est atteint, le séjour est confirmé et maintenu. Si le minimum n’est pas atteint au plus tard [… jours] avant le début du séjour, l’Organisateur peut l’annuler ou le reporter. Les Participantes sont informées par email dans les meilleurs délais et choisissent : (a) le remboursement intégral des sommes versées, sous [14] jours, ou (b) le report sur une autre date ou un autre séjour, sans frais. Aucune indemnité autre que ce remboursement n’est due du fait de cette annulation.</p>

        <h2>Article 7 — Annulation ou modification par la Participante</h2>
        <p>{settings.cancellationPolicy}</p>
        <p>Barème indicatif à compléter : plus de [60] jours avant le départ : [retenue de …] ; entre [60] et [30] jours : [… %] du prix ; entre [30] et [15] jours : [… %] ; moins de [15] jours ou non-présentation : [100 %]. Toute demande d’annulation doit être faite par écrit (email). La Participante peut céder sa place à une autre personne, avec l’accord de l’Organisateur et avant [… jours] du départ, sous réserve des frais éventuels. Il est recommandé de souscrire une assurance annulation.</p>

        <h2>Article 8 — Annulation ou modification par l’Organisateur</h2>
        <p>En cas de force majeure, de circonstances exceptionnelles (météo, sécurité, indisponibilité d’une intervenante ou du lieu) ou d’insuffisance du nombre de participantes (article 6), l’Organisateur peut modifier ou annuler le séjour. Il propose alors une prestation de remplacement ou le remboursement intégral, sans autre indemnité sauf obligation légale.</p>

        <h2>Article 9 — Droit de rétractation</h2>
        <p>Conformément à l’article L.221-28 12° du Code de la consommation, le droit de rétractation de 14 jours ne s’applique pas aux prestations d’hébergement, de transport ou de loisirs fournies à une date ou selon une périodicité déterminée. Les conditions d’annulation de l’article 7 s’appliquent. [À confirmer selon que le séjour constitue ou non un « forfait touristique » : dans ce cas, informations précontractuelles, droits de résolution et garanties légales applicables — à faire vérifier.]</p>

        <h2>Article 10 — Santé, aptitude et comportement</h2>
        <p>La Participante déclare être en état de santé compatible avec les activités proposées (yoga, marche, soins, jacuzzi, etc.) et informe l’Organisateur avant le séjour de toute contre-indication (grossesse, allergie, pathologie, traitement). Les pratiques sont adaptables et facultatives : chacune participe dans le respect de son choix et de ses limites. L’Organisateur peut exclure toute personne dont le comportement nuirait au groupe, sans remboursement.</p>

        <h2>Article 11 — Responsabilité et assurances</h2>
        <p>L’Organisateur est responsable de la bonne exécution des prestations vendues, dans les limites prévues par la loi. Il a souscrit une assurance de responsabilité civile professionnelle auprès de [assureur, n° de contrat]. Il n’est pas responsable des objets personnels perdus ou volés ni des dommages résultant du non-respect des consignes. La Participante est responsable de la validité de ses documents d’identité, et, pour l’étranger, de ses formalités d’entrée (passeport, visa, santé).</p>

        <h2>Article 12 — Image</h2>
        <p>Des photographies peuvent être prises pendant le séjour. Aucune image identifiable d’une Participante ne sera publiée sans son accord écrit préalable.</p>

        <h2>Article 13 — Données personnelles (RGPD)</h2>
        <p>Les données collectées (nom, email, téléphone facultatif, nombre de places) sont traitées pour gérer les réservations et la relation client, sur la base du contrat et, pour la newsletter, du consentement. Elles sont conservées [durée] puis supprimées. La Participante dispose de droits d’accès, rectification, effacement, opposition et portabilité en écrivant à {settings.contactEmail}, et peut saisir la CNIL.</p>

        <h2>Article 14 — Réclamations et médiation</h2>
        <p>Toute réclamation est à adresser par écrit à {settings.contactEmail}. À défaut de solution amiable, la Participante peut recourir gratuitement à un médiateur de la consommation : [nom et coordonnées du médiateur — à renseigner].</p>

        <h2>Article 15 — Droit applicable</h2>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, et à défaut d’accord amiable, les tribunaux compétents seront ceux déterminés conformément au Code de procédure civile.</p>
      </div>
    </section>
  );
}
