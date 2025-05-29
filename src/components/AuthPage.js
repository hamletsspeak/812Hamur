import React from 'react';
import Auth from './Auth';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="w-full max-w-md">
        <Auth isOpen={true} onClose={() => {}} forcePageMode />
      </div>
    </div>
  );
};

export default AuthPage;
