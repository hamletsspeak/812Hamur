import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';

const routeCache = new Map();

export const CachedRoute = ({ children }) => {
  const location = useLocation();

  // Кэшируем компонент для текущего маршрута
  if (!routeCache.has(location.pathname)) {
    routeCache.set(location.pathname, children);
  }

  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden bg-[#eef2f7] flex items-center justify-center px-5">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-100/80 blur-3xl" />
          <div className="absolute top-[22%] right-[-120px] h-[360px] w-[360px] rounded-full bg-violet-100/70 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[380px] w-[380px] rounded-full bg-amber-50/80 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent" />
        </div>
        <div className="w-full max-w-[640px] animate-pulse">
          <div className="mx-auto h-10 w-[86%] rounded-xl bg-gradient-to-r from-slate-300/80 via-slate-200/70 to-slate-300/80" />
          <div className="mx-auto mt-5 h-6 w-[62%] rounded-lg bg-gradient-to-r from-slate-300/70 via-slate-200/65 to-slate-300/70" />
          <div className="mx-auto mt-4 h-6 w-[42%] rounded-lg bg-gradient-to-r from-slate-300/65 via-slate-200/60 to-slate-300/65" />
        </div>
      </div>
    }>
      {routeCache.get(location.pathname)}
    </Suspense>
  );
};

export default CachedRoute;
