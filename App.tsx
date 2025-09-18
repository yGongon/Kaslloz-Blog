
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { PagesProvider } from './contexts/PagesContext';
import { CommentsProvider } from './contexts/CommentsContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BuildsPage from './pages/BuildsPage';
import PatchNotesPage from './pages/PatchNotesPage';
import OperatorGuidesPage from './pages/OperatorGuidesPage';
import PostDetailPage from './pages/PostDetailPage';
import GenericPage from './pages/GenericPage';
import { AnimatePresence } from 'framer-motion';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ProfilePage from './pages/ProfilePage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builds" element={<BuildsPage />} />
        <Route path="/patch-notes" element={<PatchNotesPage />} />
        <Route path="/guias" element={<OperatorGuidesPage />} />
        <Route path="/page/:slug" element={<GenericPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <PagesProvider>
          <CommentsProvider>
            <SiteConfigProvider>
              <HashRouter>
                <div className="min-h-screen flex flex-col font-sans bg-brand-dark text-gray-200">
                  <Header />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                </div>
              </HashRouter>
            </SiteConfigProvider>
          </CommentsProvider>
        </PagesProvider>
      </PostsProvider>
    </AuthProvider>
  );
};

export default App;