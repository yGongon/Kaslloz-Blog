import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';
import { Category, WeaponType } from '../types';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import PageTransition from '../components/PageTransition';

const BuildsPage: React.FC = () => {
  const { posts } = usePosts();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<WeaponType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'votes'>('createdAt');


  const tagFromUrl = searchParams.get('tag');

  const buildPosts = useMemo(() => {
    return posts
      .filter(p => p.category === Category.Builds)
      .filter(p => {
        if (selectedType === 'all') return true;
        return p.weaponType === selectedType;
      })
      .filter(p => {
        if (tagFromUrl && (!p.tags || !p.tags.some(t => t.toLowerCase() === tagFromUrl.toLowerCase()))) {
            return false;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        if (!lowerCaseSearch) return true;

        return p.title.toLowerCase().includes(lowerCaseSearch) ||
        p.content.toLowerCase().includes(lowerCaseSearch) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)));
      })
      .sort((a, b) => {
          if(sortBy === 'votes') {
            const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
            const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
            return scoreB - scoreA;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [posts, searchTerm, selectedType, tagFromUrl, sortBy]);

  return (
    <PageTransition>
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-brand-red border-b-2 border-brand-red/50 pb-2 mb-8">
          Builds de Armas {tagFromUrl && <span className="text-gray-300 text-xl sm:text-2xl ml-2 sm:ml-4">/ Tag: "{tagFromUrl}"</span>}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Buscar por arma, build ou tag..." />
          </div>
          <div className="flex gap-4">
              <select 
                  id="sortBy"
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value as 'createdAt' | 'votes')}
                  className="w-full h-full bg-brand-gray border-2 border-brand-light-gray/30 rounded-full py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              >
                  <option value="createdAt">Mais Recentes</option>
                  <option value="votes">Mais Votados</option>
              </select>
              <select 
                  id="weaponTypeFilter"
                  value={selectedType} 
                  onChange={e => setSelectedType(e.target.value as WeaponType | 'all')}
                  className="w-full h-full bg-brand-gray border-2 border-brand-light-gray/30 rounded-full py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              >
                  <option value="all">Todos os Tipos</option>
                  {Object.values(WeaponType).map(type => (
                      <option key={type} value={type}>{type}</option>
                  ))}
              </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildPosts.length > 0 ? (
            buildPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">Nenhuma build encontrada com sua busca. Tente outro termo!</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BuildsPage;
