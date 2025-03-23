import React from 'react';
import Header from './Header';
import './index.css'; // если не подключено
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import Navbar from './Navbar';
import Footer from './Footer';
import CursorLight from './CursorLight';

function App() {
  return (
    <>
      <CursorLight />
      <Navbar />
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
        <Header />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

export default App;
