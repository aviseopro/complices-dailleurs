import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import Home from './pages/Home.jsx';
import Experience from './pages/Experience.jsx';
import Booking from './pages/Booking.jsx';
import Story from './pages/Story.jsx';
import Contact from './pages/Contact.jsx';
import Legal from './pages/Legal.jsx';
import Cgv from './pages/Cgv.jsx';
import Admin from './pages/Admin.jsx';

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const admin = pathname.startsWith('/admin');
  return (
    <>
      <a className="skip" href="#main">Aller au contenu</a>
      <ScrollTop />
      {!admin && <Header />}
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notre-histoire" element={<Story />} />
          <Route path="/experiences/:slug" element={<Experience />} />
          <Route path="/reserver/:slug" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/cgv" element={<Cgv />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!admin && <Footer />}
      {!admin && <CookieBanner />}
    </>
  );
}
