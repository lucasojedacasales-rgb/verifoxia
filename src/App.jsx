import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import BottomTabBar from './components/BottomTabBar';
import PageTransition from './components/PageTransition';
import AppHeader from './components/AppHeader';
import { useTabStacks } from './hooks/useTabStacks';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Compare = lazy(() => import('./pages/Compare'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PageNotFound = lazy(() => import('./lib/PageNotFound'));
const UserNotRegisteredError = lazy(() => import('./components/UserNotRegisteredError'));

// Loading fallback component
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  useTabStacks(); // Track last URL per tab stack

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return (
        <Suspense fallback={<PageLoader />}>
          <UserNotRegisteredError />
        </Suspense>
      );
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
      <AppHeader />
      <PageTransition>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <BottomTabBar />
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App