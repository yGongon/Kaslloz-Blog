
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';
import { Post, Category } from '../types';
import YouTubeEmbed from '../components/YouTubeEmbed';
import SocialShareButtons from '../components/SocialShareButtons';
import PostModal from '../components/PostModal';
import CommentsSection from '../components/CommentsSection';
import { Icon } from '../components/Icon';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, deletePost } = usePosts();
  const { isLoggedIn } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/'); // Redireciona se o post não for encontrado
      }
    }
  }, [id, getPostById, navigate]);
  
  const handleDelete = () => {
    if (post && window.confirm('Você tem certeza que deseja deletar este post?')) {
      deletePost(post.id);
      navigate('/');
    }
  }

  if (!post) {
    return <div className="text-center font-display text-2xl">Carregando Post...</div>;
  }
  
  const categoryColor = post.category === Category.Builds ? 'text-blue-400' : 'text-yellow-400';
  const categoryIcon = post.category === Category.Builds ? 'build' : 'patch';
  const categoryPath = post.category === Category.Builds ? '/builds' : '/patch-notes';


  return (
    <>
      <article className="max-w-4xl mx-auto bg-brand-gray p-4 sm:p-8 rounded-lg border border-brand-light-gray/30">
        <header className="mb-6">
          <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider mb-2">
            <Icon name={categoryIcon} className={`h-5 w-5 ${categoryColor}`} />
            <span className={categoryColor}>{post.category} {post.version && ` - v${post.version}`}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white">{post.title}</h1>
          <p className="text-sm text-gray-500 mt-2">Publicado em {new Date(post.createdAt).toLocaleDateString()}</p>
        </header>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Link 
                key={index} 
                to={`${categoryPath}?tag=${encodeURIComponent(tag)}`}
                className="bg-brand-light-gray text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-brand-red transition-colors duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8" />

        <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 prose-headings:font-display prose-headings:text-white prose-strong:text-white whitespace-pre-wrap">
            {post.content}
        </div>

        {post.youtubeId && post.category === Category.Builds && (
          <div className="my-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Build em Ação</h2>
            <YouTubeEmbed embedId={post.youtubeId} />
          </div>
        )}

        <CommentsSection postId={post.id} />
        
        <footer className="mt-8 pt-6 border-t border-brand-light-gray/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <SocialShareButtons />
            {isLoggedIn && (
                <div className="flex space-x-4">
                    <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Editar</button>
                    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Deletar</button>
                </div>
            )}
        </footer>
      </article>
      {isEditModalOpen && <PostModal postToEdit={post} onClose={() => setIsEditModalOpen(false)} />}
    </>
  );
};

export default PostDetailPage;