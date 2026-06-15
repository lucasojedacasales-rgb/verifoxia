import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const tabRoots = ['/', '/search', '/compare', '/settings'];

// Module-level map persists across renders and route changes
const lastUrls = {
  '/': '/',
  '/search': '/search',
  '/compare': '/compare',
  '/settings': '/settings',
};

function getActiveTabRoot(pathname) {
  if (pathname === '/') return '/';
  return tabRoots.slice(1).find((r) => pathname.startsWith(r)) || null;
}

export function useTabStacks() {
  const location = useLocation();

  useEffect(() => {
    const root = getActiveTabRoot(location.pathname);
    if (root) {
      lastUrls[root] = location.pathname + location.search;
    }
  }, [location.pathname, location.search]);

  return {
    getLastUrl: (tabRoot) => lastUrls[tabRoot] || tabRoot,
  };
}