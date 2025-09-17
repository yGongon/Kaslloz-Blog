
import React, { useState, useEffect } from 'react';
// FIX: Using useNavigate for react-router-dom v6 compatibility.
import { useParams, useNavigate } from 'react-router-dom';
import { usePages } from '../contexts/PagesContext';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import PageModal from '../components/PageModal';

const GenericPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // FIX: Using useNavigate for react-router-dom v6 compatibility.
  const navigate = useNavigate();
  const { getPageBySlug, deletePage } = usePages();
  const { isLoggedIn } = useAuth();
  const [page, setPage] = useState<Page | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundPage = getPageBySlug(slug);
      if (foundPage) {
        setPage(foundPage);
      } else {
        // FIX: Using navigate for react-router-dom v6 compatibility.
        navigate('/'); // Redireciona se a página não for encontrada
      }
    }
  // FIX: Using navigate in dependency array for react-router-dom v6 compatibility.
  }, [slug, getPageBySlug, navigate]);
  
  const handleDelete = () => {
    if (page && window.confirm('Você tem certeza que deseja deletar esta página?')) {
      deletePage(page.id);
      // FIX: Using navigate for react-router-dom v6 compatibility.
      navigate('/');
    }
  }

  if (!page) {
    return <div className="text-center font-display text-2xl">Carregando Página...</div>;
  }

  return (
    <>
      <article className="max-w-4xl mx-auto bg-brand-gray p-4 sm:p-8 rounded-lg border border-brand-light-gray/30">
        <header className="mb-6 border-b-2 border-brand-red/50 pb-4">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white">{page.title}</h1>
          <p className="text-sm text-gray-500 mt-2">Última atualização em {new Date(page.createdAt).toLocaleDateString()}</p>
        </header>

        <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 prose-headings:font-display prose-headings:text-white prose-strong:text-white">
            {page.content.split('\n').map((paragraph, index) => (
                paragraph.trim() !== '' && <p key={index}>{paragraph}</p>
            ))}
        </div>
        
        <footer className="mt-8 pt-6 border-t border-brand-light-gray/30 flex justify-end items-center gap-4">
            {isLoggedIn && (
                <div className="flex space-x-4">
                    <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Editar</button>
                    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Deletar</button>
                </div>
            )}
        </footer>
      </article>
      {isEditModalOpen && <PageModal pageToEdit={page} onClose={() => setIsEditModalOpen(false)} />}
    </>
  );
};

export default GenericPage;
