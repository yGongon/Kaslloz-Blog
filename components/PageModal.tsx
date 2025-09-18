import React, { useState, useEffect, useCallback } from 'react';
import { usePages } from '../contexts/PagesContext';
import { Page } from '../types';
import { Icon } from './Icon';

interface PageModalProps {
  pageToEdit?: Page;
  onClose: () => void;
}

const PageModal: React.FC<PageModalProps> = ({ pageToEdit, onClose }) => {
  const { addPage, updatePage } = usePages();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  
  const generateSlug = useCallback((str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[áàâãéèêíïóôõöúçñ]/g, c => 'aaaaeeeiiiooooucn'.charAt('áàâãéèêíïóôõöúçñ'.indexOf(c)))
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  }, []);

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title);
      setSlug(pageToEdit.slug);
      setContent(pageToEdit.content);
    }
  }, [pageToEdit]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      setSlug(generateSlug(newTitle));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageData = { title, slug, content };
    if (pageToEdit) {
      updatePage({ ...pageToEdit, ...pageData });
    } else {
      addPage(pageData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-gray p-4 sm:p-8 rounded-lg shadow-lg w-[95%] sm:w-full max-w-3xl border border-brand-light-gray/30 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <Icon name="close" className="h-6 w-6"/>
        </button>
        <h2 className="font-display text-2xl font-bold text-center text-white mb-6">{pageToEdit ? 'Editar Página' : 'Criar Nova Página'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="title">Título</label>
            <input id="title" type="text" value={title} onChange={handleTitleChange} className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="slug">URL (slug)</label>
            <input id="slug" type="text" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" required />
             <p className="text-xs text-gray-500 mt-1">Ex: /page/{slug}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="content">Conteúdo</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" required />
             <p className="text-xs text-gray-500 mt-1">Use linhas em branco para separar parágrafos.</p>
          </div>
          
          <div className="flex items-center justify-end pt-4 space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300">
              Cancelar
            </button>
            <button type="submit" className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300">
              {pageToEdit ? 'Atualizar Página' : 'Criar Página'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageModal;