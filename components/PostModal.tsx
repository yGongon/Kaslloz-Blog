import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { usePosts } from '../contexts/PostsContext';
import { Post, Category, WeaponType } from '../types';
import { generatePostIdea } from '../services/geminiService';
import { Icon } from './Icon';

interface PostModalProps {
  postToEdit?: Post;
  onClose: () => void;
}

const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  // Regular expressions to match different YouTube URL formats
  const regexes = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If no match found, return empty string or the original string if it might be an ID
  return url.length === 11 ? url : '';
};


const PostModal: React.FC<PostModalProps> = ({ postToEdit, onClose }) => {
  const { addPost, updatePost } = usePosts();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.Builds);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [version, setVersion] = useState('');
  const [weaponType, setWeaponType] = useState<WeaponType>(WeaponType.AssaultRifle);
  const [tags, setTags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category);
      setContent(postToEdit.content);
      setImageUrl(postToEdit.imageUrl);
      setYoutubeUrl(postToEdit.youtubeId ? `https://www.youtube.com/watch?v=${postToEdit.youtubeId}` : '');
      setVersion(postToEdit.version || '');
      if (postToEdit.weaponType) {
        setWeaponType(postToEdit.weaponType);
      }
      if (postToEdit.tags) {
        setTags(postToEdit.tags.join(', '));
      }
    }
  }, [postToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeId = extractYouTubeId(youtubeUrl);
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const postData = { 
        title, 
        category, 
        content, 
        imageUrl, 
        youtubeId, 
        version, 
        weaponType: category === Category.Builds ? weaponType : undefined,
        tags: tagsArray,
    };

    if (postToEdit) {
      // Retain original vote counts when updating
      const fullPostData = {
          ...postToEdit,
          ...postData
      };
      updatePost(fullPostData);
    } else {
      addPost(postData);
    }
    onClose();
  };
  
  const handleGenerateIdea = useCallback(async () => {
    setIsGenerating(true);
    const idea = await generatePostIdea(category);
    const titleMatch = idea.match(/Title: (.*)/);
    const contentMatch = idea.match(/Content: (.*)/);

    if (titleMatch && titleMatch[1]) {
        setTitle(titleMatch[1].trim());
    }
    if (contentMatch && contentMatch[1]) {
        setContent(`<p>${contentMatch[1].trim()}</p>`);
    }
    setIsGenerating(false);
  }, [category]);
  
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-gray p-4 sm:p-8 rounded-lg shadow-lg w-[95%] sm:w-full max-w-5xl border border-brand-light-gray/30 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <Icon name="close" className="h-6 w-6"/>
        </button>
        <h2 className="font-display text-2xl font-bold text-center text-white mb-6">{postToEdit ? 'Editar Post' : 'Criar Novo Post'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red">
              <option value={Category.Builds}>Builds</option>
              <option value={Category.PatchNotes}>Notas de Patch</option>
              <option value={Category.OperatorGuides}>Guias</option>
            </select>
          </div>
           <div>
            <button type="button" onClick={handleGenerateIdea} disabled={isGenerating} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-gray-500">
              <Icon name="gemini" className="w-5 h-5" />
              <span>{isGenerating ? 'Gerando...' : 'Gerar Ideia com IA'}</span>
            </button>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="title">Título</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Conteúdo</label>
             <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              modules={quillModules}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="tags">Tags</label>
            <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex: Baixo Recuo, Mobilidade, Agressivo" className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" />
            <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgulas.</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="imageUrl">URL da Imagem</label>
            <input id="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://picsum.photos/800/450" className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" required />
          </div>
          {category === Category.Builds && (
             <>
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="weaponType">Tipo de Arma</label>
                    <select id="weaponType" value={weaponType} onChange={(e) => setWeaponType(e.target.value as WeaponType)} className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red">
                        {Object.values(WeaponType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="youtubeUrl">URL do Vídeo do YouTube</label>
                    <input id="youtubeUrl" type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" />
                </div>
             </>
          )}
          {category === Category.PatchNotes && (
             <div>
                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="version">Versão</label>
                <input id="version" type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="ex: 1.2.5" className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
          )}
          <div className="flex items-center justify-end pt-4 space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300">
              Cancelar
            </button>
            <button type="submit" className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300">
              {postToEdit ? 'Atualizar Post' : 'Criar Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;