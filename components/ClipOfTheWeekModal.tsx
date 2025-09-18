import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { Icon } from './Icon';

interface ClipOfTheWeekModalProps {
  onClose: () => void;
}

const ClipOfTheWeekModal: React.FC<ClipOfTheWeekModalProps> = ({ onClose }) => {
  const { siteConfig, updateSiteConfig } = useSiteConfig();
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (siteConfig) {
      setTitle(siteConfig.clipOfTheWeek.title);
      setYoutubeId(siteConfig.clipOfTheWeek.youtubeId);
    }
  }, [siteConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateSiteConfig({
      clipOfTheWeek: {
        title,
        youtubeId,
      },
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-gray p-8 rounded-lg shadow-lg w-full max-w-lg border border-brand-light-gray/30 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" disabled={isSubmitting}>
          <Icon name="close" className="h-6 w-6"/>
        </button>
        <h2 className="font-display text-2xl font-bold text-center text-white mb-6">Editar Clipe da Semana</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="title">Título da Seção</label>
            <input 
              id="title" 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="youtubeId">ID do Vídeo do YouTube</label>
            <input 
              id="youtubeId" 
              type="text" 
              value={youtubeId} 
              onChange={(e) => setYoutubeId(e.target.value)} 
              className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" 
              required 
              disabled={isSubmitting}
              placeholder="Ex: v3hM4i32Y4I"
            />
            <p className="text-xs text-gray-500 mt-1">Coloque apenas o ID do vídeo, não a URL completa.</p>
          </div>
          <div className="flex items-center justify-end pt-4 space-x-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300 disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClipOfTheWeekModal;
