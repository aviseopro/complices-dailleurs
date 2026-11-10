import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCommunity,
  registerMember,
  verifyMemberEmailToken,
  loginMemberOrAdmin,
  enterActiveContest,
} from '../lib/memberStore.js';

export default function Contest() {
  const { isMember, myProfile, contests, contestEntries } = useCommunity();
  const navigate = useNavigate();

  const contest = contests?.[0];
  const isContestOpen = Boolean(contest?.isActive);
  const myEntry = contestEntries?.find((e) => e.contestId === contest?.id && e.userId === myProfile?.id);

  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [acceptContestRules, setAcceptContestRules] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pendingVerify, setPendingVerify] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    acceptTerms: false,
    marketingOptIn: false, // Séparé et non précoché conformément au RGPD
    websiteUrlHoneypot: '',
  });
  const [regErrors, setRegErrors] = useState({});
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleConfirmEntryForLoggedMember = () => {
    if (!acceptContestRules) {
      setFeedback({
        type: 'error',
        text: 'Merci d’accepter le règlement du jeu-concours pour valider votre participation.',
      });
      return;
    }
    const res = enterActiveContest(myProfile.id, contest.id);
    if (!res.ok) {
      setFeedback({ type: 'error', text: res.error });
      return;
    }
    setFeedback({
      type: 'success',
      text: '🎉 Votre participation au concours Complices d’ailleurs est officiellement enregistrée !',
    });
  };

  const handleRegisterAndEnter = async (e) => {
    e.preventDefault();
    setRegErrors({});
    setFeedback(null);

    if (isContestOpen && !acceptContestRules) {
      setFeedback({
        type: 'error',
        text: 'Merci de cocher l’acceptation du règlement du jeu-concours pour valider votre participation.',
      });
      return;
    }

    setSubmitting(true);
    const res = await registerMember(regForm);
    setSubmitting(false);

    if (!res.ok) {
      if (res.errors) setRegErrors(res.errors);
      if (res.error) setFeedback({ type: 'error', text: res.error });
      return;
    }

    setPendingVerify({
      email: res.member.email,
      firstName: res.member.firstName,
      token: res.member.verificationToken,
    });
  };

  const handleVerifyAndCompleteContest = () => {
    if (!pendingVerify?.token) return;
    const verified = verifyMemberEmailToken(pendingVerify.token, pendingVerify.email);
    if (verified.ok) {
      if (isContestOpen && contest?.id) {
        enterActiveContest(verified.member.id, contest.id);
      }
      setPendingVerify(null);
      setFeedback({
        type: 'success',
        text: '✨ Adresse e-mail confirmée et participation au concours validée !',
      });
    } else {
      setFeedback({ type: 'error', text: verified.error });
    }
  };

  const handleLoginAndEnter = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    const res = await loginMemberOrAdmin(loginForm);
    setSubmitting(false);

    if (!res.ok) {
      setFeedback({ type: 'error', text: res.error });
      return;
    }
    if (res.role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <section className="section carnet-auth-section">
      <div className="wrap">
        <div className="carnet-auth-hero">
          <span className="eyebrow">Concours Complices d’ailleurs · Instagram</span>
          <h1>{contest?.title || 'Concours Complices d’ailleurs'}</h1>
          <p className="lead">
            {isContestOpen
              ? contest.prize
              : 'Notre prochain jeu-concours Instagram se prépare en coulisses avec Émilie et Virginie.'}
          </p>
        </div>

        {/* Parcours en étapes */}
        <div className="contest-steps-strip">
          <div className="contest-step-pill">
            <span>1</span> Créez votre compte Complice
          </div>
          <div className="contest-step-pill">
            <span>2</span> Confirmez votre adresse e-mail
          </div>
          <div className="contest-step-pill">
            <span>3</span> Découvrez quelle escapade est faite pour vous
          </div>
          <div className="contest-step-pill">
            <span>4</span> Recevez votre cadeau &amp; participez au tirage au sort
          </div>
        </div>

        {!isContestOpen ? (
          <div className="carnet-auth-card" style={{ maxWidth: '720px', margin: '2rem auto', textAlign: 'center' }}>
            <span className="pill soon">Concours en préparation</span>
            <h2 style={{ marginTop: '.8rem' }}>Le prochain Concours Complices d’ailleurs arrive très bientôt</h2>
            <p>
              Le règlement officiel et les dates du prochain jeu-concours Instagram sont en cours de validation par Émilie et Virginie.
              En attendant l’ouverture des participations, vous pouvez dès maintenant créer votre <strong>Carnet d’Ailleurs</strong> pour :
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.2rem 0', lineHeight: 1.8 }}>
              <li>🧭 Faire le test <strong>« Quelle escapade est faite pour vous ? »</strong></li>
              <li>🎁 Découvrir votre e-book offert <strong>« L’art de s’accorder une parenthèse »</strong></li>
              <li>🌿 Accéder à votre carnet de rituels beauté &amp; yoga</li>
            </ul>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <Link to="/mon-espace" className="btn btn-terra">
                Ouvrir mon Carnet d’Ailleurs →
              </Link>
              <Link to="/" className="btn btn-ghost">
                Découvrir nos escapades
              </Link>
            </div>
          </div>
        ) : (
          <div className="carnet-auth-grid" style={{ marginTop: '2rem' }}>
            {/* Présentation de la dotation & du règlement */}
            <aside className="carnet-auth-benefits">
              <span className="pill open">✨ Concours ouvert du {contest.startDate} au {contest.endDate}</span>
              <h3 style={{ marginTop: '1rem' }}>À gagner &amp; offert à chaque participante :</h3>
              <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--terra-dark)' }}>{contest.prize}</p>

              <div className="carnet-ritual-card" style={{ marginTop: '1.2rem' }}>
                <h4>Comment fonctionne votre participation ?</h4>
                <ol style={{ paddingLeft: '1.2rem', lineHeight: 1.65 }}>
                  <li>Inscrivez-vous ou connectez-vous à votre espace <strong>Mon Carnet d’Ailleurs</strong>.</li>
                  <li>Validez votre adresse e-mail via le lien sécurisé reçu.</li>
                  <li>Votre participation au tirage au sort est immédiatement enregistrée.</li>
                  <li>Complétez le questionnaire <em>« Quelle escapade est faite pour vous ? »</em> et accédez à votre e-book offert dans votre espace membre.</li>
                </ol>
              </div>

              <details className="adm-card" style={{ marginTop: '1rem' }}>
                <summary><strong>📜 Règlement du jeu-concours</strong></summary>
                <p style={{ fontSize: '.88rem', lineHeight: 1.6, marginTop: '.6rem', whiteSpace: 'pre-line' }}>
                  {contest.rulesText}
                </p>
              </details>
            </aside>

            {/* Zone d'inscription / validation de participation */}
            <div className="carnet-auth-card">
              {feedback && (
                <div className={`carnet-alert ${feedback.type === 'error' ? 'carnet-alert-error' : 'carnet-alert-success'}`}>
                  {feedback.text}
                </div>
              )}

              {isMember && myProfile ? (
                <div>
                  <span className="eyebrow">Connectée en tant que {myProfile.firstName} {myProfile.lastName}</span>
                  {myEntry ? (
                    <div className="carnet-verify-box" style={{ marginTop: '.8rem' }}>
                      <span className="pill open">✓ Participation enregistrée</span>
                      <h2>Vous participez au Concours Complices d’ailleurs !</h2>
                      <p>
                        Votre participation a bien été enregistrée le{' '}
                        <strong>{new Date(myEntry.createdAt).toLocaleDateString('fr-FR')}</strong> avec votre adresse vérifiée <strong>{myProfile.email}</strong>.
                      </p>
                      <p>
                        Poursuivez maintenant votre découverte dans votre Carnet d’Ailleurs :
                      </p>
                      <div className="carnet-verify-actions">
                        <Link to="/mon-espace?tab=envies" className="btn btn-terra">
                          🧭 Faire le questionnaire « Quelle escapade est faite pour vous ? » →
                        </Link>
                        <Link to="/mon-espace?tab=cadeaux" className="btn btn-ghost">
                          🎁 Accéder à mon cadeau gratuit (« L’art de s’accorder une parenthèse »)
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1rem' }}>
                      <h2>Confirmer ma participation au concours</h2>
                      <p>
                        Votre compte Complice (<strong>{myProfile.email}</strong>) est actif. Cochez simplement la case ci-dessous pour valider votre participation gratuite au tirage au sort :
                      </p>
                      <div className="carnet-consents-box" style={{ margin: '1.2rem 0' }}>
                        <label className="check">
                          <input
                            type="checkbox"
                            checked={acceptContestRules}
                            onChange={(e) => setAcceptContestRules(e.target.checked)}
                          />
                          <span>
                            Je participe au jeu-concours « {contest.title} » et j’accepte son règlement (participation gratuite, sans obligation d’abonnement à la newsletter). *
                          </span>
                        </label>
                      </div>
                      <button type="button" className="btn btn-terra" onClick={handleConfirmEntryForLoggedMember}>
                        Valider ma participation au concours ✨
                      </button>
                    </div>
                  )}
                </div>
              ) : pendingVerify ? (
                <div className="carnet-verify-box">
                  <span className="pill open">Étape 2 · Validation de votre e-mail</span>
                  <h2>Confirmez votre adresse e-mail pour valider votre participation</h2>
                  <p>
                    Un e-mail de confirmation vient d’être envoyé à <strong>{pendingVerify.email}</strong>.
                    Seuls les comptes dont l’adresse e-mail est vérifiée sont éligibles au tirage au sort.
                  </p>
                  <div className="carnet-verify-actions">
                    <button type="button" className="btn btn-terra" onClick={handleVerifyAndCompleteContest}>
                      ✓ Confirmer mon adresse e-mail &amp; valider ma participation
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="carnet-auth-tabs" role="tablist">
                    <button
                      type="button"
                      className={mode === 'register' ? 'active' : ''}
                      onClick={() => setMode('register')}
                    >
                      Créer mon compte &amp; participer
                    </button>
                    <button
                      type="button"
                      className={mode === 'login' ? 'active' : ''}
                      onClick={() => setMode('login')}
                    >
                      J’ai déjà un compte Complice
                    </button>
                  </div>

                  {mode === 'register' ? (
                    <form className="form carnet-form" onSubmit={handleRegisterAndEnter} noValidate>
                      <h2>Participer au Concours Complices d’ailleurs</h2>
                      <div className="grid2">
                        <label>
                          Prénom *
                          <input
                            type="text"
                            required
                            value={regForm.firstName}
                            onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                          />
                          {regErrors.firstName && <span className="err">{regErrors.firstName}</span>}
                        </label>
                        <label>
                          Nom *
                          <input
                            type="text"
                            required
                            value={regForm.lastName}
                            onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                          />
                          {regErrors.lastName && <span className="err">{regErrors.lastName}</span>}
                        </label>
                      </div>

                      <label>
                        Adresse e-mail *
                        <input
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        />
                        {regErrors.email && <span className="err">{regErrors.email}</span>}
                      </label>

                      <div className="grid2">
                        <label>
                          Mot de passe * (8 caractères min.)
                          <input
                            type="password"
                            required
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          />
                          {regErrors.password && <span className="err">{regErrors.password}</span>}
                        </label>
                        <label>
                          Confirmation du mot de passe *
                          <input
                            type="password"
                            required
                            value={regForm.confirmPassword}
                            onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                          />
                          {regErrors.confirmPassword && <span className="err">{regErrors.confirmPassword}</span>}
                        </label>
                      </div>

                      <label>
                        Téléphone <small>(facultatif)</small>
                        <input
                          type="tel"
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        />
                      </label>

                      {/* Cases de consentement RGPD distinctes : règlement du jeu, CGU/confidentialité, et newsletter facultative non précochée */}
                      <div className="carnet-consents-box">
                        <label className="check">
                          <input
                            type="checkbox"
                            checked={acceptContestRules}
                            onChange={(e) => setAcceptContestRules(e.target.checked)}
                          />
                          <span>
                            Je participe au concours et j’accepte le règlement du jeu-concours Complices d’ailleurs. *
                          </span>
                        </label>

                        <label className="check" style={{ marginTop: '.45rem' }}>
                          <input
                            type="checkbox"
                            checked={regForm.acceptTerms}
                            onChange={(e) => setRegForm({ ...regForm, acceptTerms: e.target.checked })}
                          />
                          <span>
                            J’accepte les <Link to="/mentions-legales" target="_blank">conditions d’utilisation</Link> et la <Link to="/mentions-legales" target="_blank">politique de confidentialité</Link>. *
                          </span>
                        </label>
                        {regErrors.acceptTerms && <span className="err">{regErrors.acceptTerms}</span>}

                        <label className="check" style={{ marginTop: '.45rem' }}>
                          <input
                            type="checkbox"
                            checked={regForm.marketingOptIn}
                            onChange={(e) => setRegForm({ ...regForm, marketingOptIn: e.target.checked })}
                          />
                          <span>
                            J’accepte de recevoir par e-mail les actualités, offres d’escapades et conseils bien-être de Complices d’ailleurs <small>(facultatif et indépendant de votre participation au concours)</small>.
                          </span>
                        </label>
                      </div>

                      <button type="submit" className="btn btn-terra" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                        {submitting ? 'Enregistrement…' : 'Valider mon inscription & participer au concours →'}
                      </button>
                    </form>
                  ) : (
                    <form className="form carnet-form" onSubmit={handleLoginAndEnter}>
                      <h2>Me connecter pour participer</h2>
                      <label>
                        Adresse e-mail *
                        <input
                          type="email"
                          required
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        />
                      </label>
                      <label>
                        Mot de passe *
                        <input
                          type="password"
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                      </label>
                      <button type="submit" className="btn btn-terra" disabled={submitting}>
                        Me connecter →
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
