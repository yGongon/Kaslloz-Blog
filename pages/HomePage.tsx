import React, { useState } from 'react';
import { usePosts } from '../contexts/PostsContext';
import { Post, Category } from '../types';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import YouTubeEmbed from '../components/YouTubeEmbed';
import AdBanner from '../components/AdBanner';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '../components/Icon';
import ClipOfTheWeekModal from '../components/ClipOfTheWeekModal';

const HomePage: React.FC = () => {
  const { posts } = usePosts();
  const { siteConfig, loading: configLoading } = useSiteConfig();
  const { isAdmin } = useAuth();
  const [isClipModalOpen, setClipModalOpen] = useState(false);

  const latestBuilds = posts.filter(p => p.category === Category.Builds).slice(0, 3);
  const latestPatchNotes = posts.filter(p => p.category === Category.PatchNotes).slice(0, 2);
  const latestGuides = posts.filter(p => p.category === Category.OperatorGuides).slice(0, 3);

  return (
    <PageTransition>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center bg-brand-gray p-8 md:p-12 rounded-lg border-2 border-brand-light-gray/20 shadow-lg" style={{backgroundImage: `url('https://i.postimg.cc/hvcsrt4p/Banner.png')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="bg-black/60 p-6 rounded-md">
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-widest">Ouroboros Kingdom</h1>
              <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">Sua fonte #1 para builds de armas, guias, notas de patch e as últimas informações sobre Delta Force.</p>
          </div>
        </section>

        {/* Latest Builds */}
        <section>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2 mb-6">Últimas Builds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestBuilds.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {latestBuilds.length === 0 && <p className="text-gray-400">Nenhuma build de arma postada ainda. Fique ligado!</p>}
          <div className="text-center mt-8">
              <Link to="/builds" className="bg-brand-gray hover:bg-brand-light-gray text-white font-bold py-2 px-6 rounded transition duration-300 uppercase border border-brand-light-gray">Ver Todas as Builds</Link>
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner />

        {/* Clip of the Week */}
        <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2">
                {configLoading ? 'Carregando...' : siteConfig.clipOfTheWeek.title}
              </h2>
              {isAdmin && (
                <button 
                  onClick={() => setClipModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-brand-light-gray rounded-full transition-colors"
                  aria-label="Editar Clipe da Semana"
                >
                  <Icon name="edit" className="w-5 h-5" />
                </button>
              )}
            </div>
            {!configLoading && (
              <div className="max-w-lg mx-auto rounded-lg overflow-hidden border-2 border-brand-light-gray/20 shadow-lg">
                  <YouTubeEmbed embedId={siteConfig.clipOfTheWeek.youtubeId} />
              </div>
            )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Latest Guides */}
          <section className="lg:col-span-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2 mb-6">Guias Recentes</h2>
            <div className="grid grid-cols-1 gap-8">
              {latestGuides.slice(0, 1).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {latestGuides.length === 0 && <p className="text-gray-400">Nenhum guia disponível no momento.</p>}
            <div className="text-center mt-8">
                <Link to="/guias" className="bg-brand-gray hover:bg-brand-light-gray text-white font-bold py-2 px-6 rounded transition duration-300 uppercase border border-brand-light-gray">Ver Todos os Guias</Link>
            </div>
          </section>

          {/* Latest Patch Notes */}
          <section className="lg:col-span-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2 mb-6">Notas de Patch</h2>
            <div className="space-y-8">
              {latestPatchNotes.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {latestPatchNotes.length === 0 && <p className="text-gray-400">Nenhuma nota de patch disponível no momento.</p>}
            <div className="text-center mt-8">
                <Link to="/patch-notes" className="bg-brand-gray hover:bg-brand-light-gray text-white font-bold py-2 px-6 rounded transition duration-300 uppercase border border-brand-light-gray">Ver Todas as Notas</Link>
            </div>
          </section>
        </div>
      </div>
      {isClipModalOpen && <ClipOfTheWeekModal onClose={() => setClipModalOpen(false)} />}
    </PageTransition>
  );
};

export default HomePage;