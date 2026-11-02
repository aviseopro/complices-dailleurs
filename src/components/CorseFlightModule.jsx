import React from 'react';
import { Plane, ExternalLink, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CorseFlightModule({ className = '' }) {
  return (
    <div className={`mk-flight-module corse-flight-module ${className}`} aria-label="Réservation des vols pour la Corse du Sud">
      <div className="mk-flight-header">
        <span className="mk-flight-badge corse-flight-badge">
          <Plane size={14} className="mk-plane-icon" /> Vols aller-retour · Réservation directe ou coordonnée
        </span>
        <h3>Réservez vos billets d’avion vers la Corse en direct avec easyJet ou Volotea</h3>
        <p>
          Pour rejoindre notre parenthèse en Corse du Sud depuis votre ville de départ (Bordeaux, Paris, Lyon, Nantes, Toulouse, Lille, Strasbourg…), vous pouvez <strong>réserver directement votre vol</strong> auprès des compagnies qui desservent Figari ou Ajaccio, ou coordonner vos horaires avec nous avant de valider votre billet :
        </p>
      </div>

      <div className="mk-airline-grid">
        {/* Carte EasyJet */}
        <div className="mk-airline-card easyjet-card">
          <div className="mk-airline-top">
            <div className="mk-brand-lockup easyjet-lockup">
              <span className="easyjet-logo-txt">easyJet</span>
            </div>
            <span className="mk-airline-tag">Vols directs vers la Corse</span>
          </div>
          <h4>easyJet — Vols vers Figari (FSC) &amp; Ajaccio (AJA)</h4>
          <p>
            Liaisons directes et fréquentes vers la Corse du Sud au meilleur tarif. Idéal pour choisir vos horaires et options de bagages en quelques clics.
          </p>
          <ul className="mk-airline-points">
            <li><CheckCircle2 size={13} /> Vols directs vers Figari Sud-Corse &amp; Ajaccio</li>
            <li><CheckCircle2 size={13} /> Réservation simple et tarifs avantageux</li>
          </ul>
          <a
            href="https://www.easyjet.com/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-airline btn-easyjet"
            aria-label="Basculer sur le site easyJet pour réserver votre vol pour la Corse"
          >
            <span>Réserver mon vol sur easyJet</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Carte Volotea */}
        <div className="mk-airline-card volotea-card">
          <div className="mk-airline-top">
            <div className="mk-brand-lockup volotea-lockup">
              <span className="volotea-logo-txt">VOLOTEA</span>
            </div>
            <span className="mk-airline-tag volotea-tag">Spécialiste Régions &amp; Corse</span>
          </div>
          <h4>Volotea — Vols directs depuis les régions françaises</h4>
          <p>
            La compagnie de référence pour relier directement Bordeaux, Nantes, Lyon, Toulouse, Lille ou Strasbourg à Figari Sud-Corse et Ajaccio sans escale.
          </p>
          <ul className="mk-airline-points">
            <li><CheckCircle2 size={13} /> Nombreux départs directs depuis la province (dont Bordeaux)</li>
            <li><CheckCircle2 size={13} /> Arrivée directe au cœur de la Corse du Sud</li>
          </ul>
          <a
            href="https://www.volotea.com/fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-airline btn-volotea"
            aria-label="Basculer sur le site Volotea pour réserver votre vol pour la Corse"
          >
            <span>Réserver mon vol sur Volotea</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="mk-flight-tips">
        <div className="mk-tip-item">
          <MapPin size={16} className="mk-tip-icon" />
          <div>
            <strong>Aéroports d’arrivée :</strong> Figari Sud-Corse (<code>FSC</code>) ou Ajaccio Napoléon-Bonaparte (<code>AJA</code>), où nous venons vous récupérer.
          </div>
        </div>
        <div className="mk-tip-item">
          <Clock size={16} className="mk-tip-icon" />
          <div>
            <strong>Accueil &amp; Transfert :</strong> Dès vos billets réservés, communiquez-nous vos horaires d’arrivée afin que nous organisions votre prise en charge à l’aéroport.
          </div>
        </div>
        <div className="mk-tip-item">
          <Sparkles size={16} className="mk-tip-icon" />
          <div>
            <strong>Conseil &amp; Réservation groupée :</strong> Émilie &amp; Virginie vous accompagnent pour synchroniser les créneaux de vol avec le groupe.
          </div>
        </div>
      </div>
    </div>
  );
}
