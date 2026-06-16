import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import BottomTabBar from './components/BottomTabBar';
import AppHeader from './components/AppHeader';
import DisclaimerBanner from './components/DisclaimerBanner';
import { useTabStacks } from './hooks/useTabStacks';
import { trackPageView } from './lib/analytics';
// Auth pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Compare = lazy(() => import('./pages/Compare'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SearchConsole = lazy(() => import('./pages/SearchConsole'));
const WorkflowAgent = lazy(() => import('./pages/WorkflowAgent'));
const SearchHistoryAgent = lazy(() => import('./pages/SearchHistoryAgent'));
const StoreRedirect = lazy(() => import('./pages/StoreRedirect'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PageNotFound = lazy(() => import('./lib/PageNotFound'));
const UserNotRegisteredError = lazy(() => import('./components/UserNotRegisteredError'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, checkAppState } = useAuth();
  useTabStacks();
  const location = useLocation();
  useEffect(() => { trackPageView(location.pathname + location.search); }, [location]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return (
        <Suspense fallback={null}>
          <UserNotRegisteredError />
        </Suspense>
      );
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    } else {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 gap-4 px-6 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <p className="text-white font-semibold text-lg">No se pudo cargar la app</p>
          <p className="text-slate-400 text-sm">{authError.message || 'Comprueba tu conexión a internet'}</p>
          <button
            onClick={checkAppState}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl min-h-[44px] transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
  }

  return (
    <Routes>
      {/* Public auth routes — no header/tabbar */}
      <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={null}><Register /></Suspense>} />
      <Route path="/forgot-password" element={<Suspense fallback={null}><ForgotPassword /></Suspense>} />
      <Route path="/reset-password" element={<Suspense fallback={null}><ResetPassword /></Suspense>} />

      {/* App routes */}
      <Route path="*" element={
        <>
          <AppHeader />
          <Routes>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
            <Route path="/search" element={<Suspense fallback={<PageLoader />}><SearchResults /></Suspense>} />
            <Route path="/compare" element={<Suspense fallback={<PageLoader />}><Compare /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
            <Route path="/search-console" element={<Suspense fallback={<PageLoader />}><SearchConsole /></Suspense>} />
            <Route path="/workflow-agent" element={<Suspense fallback={<PageLoader />}><WorkflowAgent /></Suspense>} />
            <Route path="/history-agent" element={<Suspense fallback={<PageLoader />}><SearchHistoryAgent /></Suspense>} />
            <Route path="/store" element={<Suspense fallback={<PageLoader />}><StoreRedirect /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<PageLoader />}><PageNotFound /></Suspense>} />
          </Routes>
          <BottomTabBar />
          <DisclaimerBanner />
        </>
      } />
    </Routes>
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