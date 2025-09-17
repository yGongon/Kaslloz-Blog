import React from 'react';
import { usePosts } from '../contexts/PostsContext';
import { Post, Category } from '../types';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const HomePage: React.FC = () => {
  const { posts } = usePosts();

  const latestBuilds = posts.filter(p => p.category === Category.Builds).slice(0, 3);
  const latestPatchNotes = posts.filter(p => p.category === Category.PatchNotes).slice(0, 2);

  return (
    <PageTransition>
      <div className="space-y-16">
        {/* Seção Hero */}
        <section className="text-center bg-brand-gray p-8 md:p-12 rounded-lg border-2 border-brand-light-gray/20 shadow-lg" style={{backgroundImage: `url('https://picsum.photos/seed/deltaforcehero/1200/400')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="bg-black/60 p-6 rounded-md">
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-widest">Ouroboros Kingdom</h1>
              <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">Sua fonte #1 para builds de armas, notas de patch e as últimas informações sobre Delta Force.</p>
          </div>
        </section>

        {/* Últimas Builds */}
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

        {/* Últimas Notas de Patch */}
        <section>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2 mb-6">Notas de Patch Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestPatchNotes.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {latestPatchNotes.length === 0 && <p className="text-gray-400">Nenhuma nota de patch disponível no momento.</p>}
          <div className="text-center mt-8">
              <Link to="/patch-notes" className="bg-brand-gray hover:bg-brand-light-gray text-white font-bold py-2 px-6 rounded transition duration-300 uppercase border border-brand-light-gray">Ver Todas as Notas de Patch</Link>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;