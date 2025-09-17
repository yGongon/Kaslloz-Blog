import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';
import { Category } from '../types';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import PageTransition from '../components/PageTransition';

const OperatorGuidesPage: React.FC = () => {
  const { posts } = usePosts();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const tagFromUrl = searchParams.get('tag');

  const guidePosts = useMemo(() => {
    return posts
      .filter(p => p.category === Category.OperatorGuides)
      .filter(p => {
        // Filter by URL tag
        if (tagFromUrl && (!p.tags || !p.tags.some(t => t.toLowerCase() === tagFromUrl.toLowerCase()))) {
            return false;
        }

        // Filter by search term
        const lowerCaseSearch = searchTerm.toLowerCase();
        if (!lowerCaseSearch) return true;

        return p.title.toLowerCase().includes(lowerCaseSearch) ||
        p.content.toLowerCase().includes(lowerCaseSearch) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)));
      });
  }, [posts, searchTerm, tagFromUrl]);

  return (
    <PageTransition>
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2 mb-8">
          Guias de Operadores {tagFromUrl && <span className="text-gray-300 text-xl sm:text-2xl ml-2 sm:ml-4">/ Tag: "{tagFromUrl}"</span>}
        </h1>
        <div className="mb-8">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Buscar por operador, guia ou tag..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidePosts.length > 0 ? (
            guidePosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">Nenhum guia encontrado com sua busca.</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default OperatorGuidesPage;
