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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-4">
          <div className="h-8 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      {routeCache.get(location.pathname)}
    </Suspense>
  );
};

export default CachedRoute;