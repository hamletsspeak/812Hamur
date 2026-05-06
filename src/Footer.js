import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-5 pb-10">
      <div className="max-w-6xl mx-auto glass-card rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-600">&copy; {currentYear} hamletsspeak.</p>
        <div className="text-slate-500 text-sm">Designed with React + Tailwind</div>
      </div>
    </footer>
  );
};

export default Footer;
