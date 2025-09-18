import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePages } from '../contexts/PagesContext';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import PageModal from '../components/PageModal';
import PageTransition from '../components/PageTransition';

const GenericPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { pages, getPageBySlug, deletePage } = usePages();
  const { isAdmin } = useAuth();
  const [page, setPage] = useState<Page | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Wait until pages are loaded before trying to find the page.
    if (slug && pages.length > 0) {
      const foundPage = getPageBySlug(slug);
      if (foundPage) {
        setPage(foundPage);
      } else {
        // If pages are loaded but the page is not found, redirect.
        navigate('/'); 
      }
    }
  }, [slug, pages, getPageBySlug, navigate]);
  
  const handleDelete = async () => {
    if (page && window.confirm('Você tem certeza que deseja deletar esta página?')) {
      const success = await deletePage(page.id);
      if (success) {
        navigate('/');
      } else {
        alert('Falha ao deletar a página. Verifique as permissões do banco de dados ou o console para mais detalhes.');
      }
    }
  }

  // Display a loading message while pages are being fetched or the specific page is being identified.
  if (pages.length === 0 || !page) {
    return <div className="text-center font-display text-2xl">Carregando Página...</div>;
  }

  return (
    <PageTransition>
      <>
        <article className="max-w-4xl mx-auto bg-brand-gray p-4 sm:p-6 md:p-8 rounded-lg border border-brand-light-gray/30">
          <header className="mb-6 border-b-2 border-brand-red/50 pb-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-extrabold text-white">{page.title}</h1>
            <p className="text-sm text-gray-500 mt-2">Última atualização em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(page.createdAt))}</p>
          </header>

          <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 prose-headings:font-display prose-headings:text-white prose-strong:text-white">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {page.content}
              </ReactMarkdown>
          </div>
          
          <footer className="mt-8 pt-6 border-t border-brand-light-gray/30 flex justify-end items-center gap-4">
              {isAdmin && (
                  <div className="flex space-x-4">
                      <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Editar</button>
                      <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Deletar</button>
                  </div>
              )}
          </footer>
        </article>
        {isEditModalOpen && <PageModal pageToEdit={page} onClose={() => setIsEditModalOpen(false)} />}
      </>
    </PageTransition>
  );
};

export default GenericPage;