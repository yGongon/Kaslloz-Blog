
import React from 'react';
// FIX: Update react-router-dom imports for v6 compatibility.
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { PagesProvider } from './contexts/PagesContext';
import { CommentsProvider } from './contexts/CommentsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BuildsPage from './pages/BuildsPage';
import PatchNotesPage from './pages/PatchNotesPage';
import PostDetailPage from './pages/PostDetailPage';
import GenericPage from './pages/GenericPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <PagesProvider>
          <CommentsProvider>
            <HashRouter>
              <div className="min-h-screen flex flex-col font-sans bg-brand-dark text-gray-200">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  {/* FIX: Use Routes instead of Switch and element prop for v6 compatibility. */}
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/builds" element={<BuildsPage />} />
                    <Route path="/patch-notes" element={<PatchNotesPage />} />
                    <Route path="/page/:slug" element={<GenericPage />} />
                    <Route path="/post/:id" element={<PostDetailPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </HashRouter>
          </CommentsProvider>
        </PagesProvider>
      </PostsProvider>
    </AuthProvider>
  );
};

export default App;
