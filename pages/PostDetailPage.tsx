import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';
import { Post, Category } from '../types';
import YouTubeEmbed from '../components/YouTubeEmbed';
import SocialShareButtons from '../components/SocialShareButtons';
import PostModal from '../components/PostModal';
import { Icon } from '../components/Icon';
import CommentsSection from '../components/CommentsSection';
import PageTransition from '../components/PageTransition';
import LoginModal from '../components/LoginModal';
import AdBanner from '../components/AdBanner';


const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, getPostById, deletePost, voteOnPost, userVotes } = usePosts();
  const { isAdmin, isLoggedIn } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (id && posts.length > 0) {
      const foundPost = getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/');
      }
    }
  }, [id, posts, getPostById, navigate]);

  const handleDelete = async () => {
    if (post && window.confirm('Você tem certeza que deseja deletar este post?')) {
      const success = await deletePost(post.id);
      if (success) {
        navigate('/');
      } else {
        alert('Falha ao deletar o post. Verifique as permissões do banco de dados ou o console para mais detalhes.');
      }
    }
  }

  if (posts.length === 0 || !post) {
    return <div className="text-center font-display text-2xl">Carregando Post...</div>;
  }
  
  const getCategoryMeta = (category: Category) => {
    switch(category) {
      case Category.Builds:
        return { color: 'text-blue-400', icon: 'build', path: '/builds' };
      case Category.PatchNotes:
        return { color: 'text-yellow-400', icon: 'patch', path: '/patch-notes' };
      case Category.OperatorGuides:
        return { color: 'text-green-400', icon: 'guide', path: '/guias' };
      default:
        return { color: 'text-gray-400', icon: 'patch', path: '/' };
    }
  }

  const { color: categoryColor, icon: categoryIcon, path: categoryPath } = getCategoryMeta(post.category);
  const userVote = userVotes[post.id];

  const handleVoteClick = (voteType: 'up' | 'down') => {
    if (isLoggedIn) {
      voteOnPost(post.id, voteType);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <PageTransition>
      <>
        <article className="max-w-4xl mx-auto bg-brand-gray p-4 sm:p-6 md:p-8 rounded-lg border border-brand-light-gray/30">
          <div className="flex gap-4">
            {post.category === Category.Builds && (
                 <div className="hidden sm:flex flex-col items-center space-y-1 pt-16">
                    <button onClick={() => handleVoteClick('up')} aria-label="Upvote" className="group p-2 rounded-full hover:bg-brand-light-gray transition-colors">
                        <Icon name="arrowUp" className={`w-7 h-7 transition-colors ${userVote?.up ? 'text-brand-red' : 'text-gray-500 group-hover:text-white'}`}/>
                    </button>
                    <span className="font-display text-xl font-bold text-gray-200">{post.upvotes || 0}</span>
                    <div className="h-4"></div>
                    <button onClick={() => handleVoteClick('down')} aria-label="Downvote" className="group p-2 rounded-full hover:bg-brand-light-gray transition-colors">
                        <Icon name="arrowDown" className={`w-7 h-7 transition-colors ${userVote?.down ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`}/>
                    </button>
                    <span className="font-display text-xl font-bold text-gray-200">{post.downvotes || 0}</span>
                 </div>
            )}
            <div className="flex-1">
                <header className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider mb-2">
                        <Icon name={categoryIcon} className={`h-5 w-5 ${categoryColor}`} />
                        <span className={categoryColor}>{post.category} {post.version && ` - v${post.version}`}</span>
                    </div>
                     {post.category === Category.Builds && (
                        <div className="sm:hidden flex items-center space-x-4">
                           <div className="flex items-center space-x-1">
                              <button onClick={() => handleVoteClick('up')} aria-label="Upvote" className="group p-1">
                                  <Icon name="arrowUp" className={`w-6 h-6 transition-colors ${userVote?.up ? 'text-brand-red' : 'text-gray-500 group-hover:text-white'}`}/>
                              </button>
                              <span className="font-display text-lg font-bold text-gray-200">{post.upvotes || 0}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                              <button onClick={() => handleVoteClick('down')} aria-label="Downvote" className="group p-1">
                                  <Icon name="arrowDown" className={`w-6 h-6 transition-colors ${userVote?.down ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`}/>
                              </button>
                              <span className="font-display text-lg font-bold text-gray-200">{post.downvotes || 0}</span>
                           </div>
                        </div>
                    )}
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-extrabold text-white">{post.title}</h1>
                  <p className="text-sm text-gray-500 mt-2">Publicado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(post.createdAt))}</p>
                </header>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`${categoryPath}?tag=${encodeURIComponent(tag)}`}
                        className="bg-brand-light-gray text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-brand-red transition-colors duration-200"
                        aria-label={`Ver todos os posts com a tag ${tag}`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8" />

                <div 
                  className="prose prose-invert lg:prose-xl max-w-none text-gray-300 prose-headings:font-display prose-headings:text-white prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.youtubeId && (
                  <div className="my-8">
                    <h2 className="font-display text-2xl font-bold text-white mb-4">Build em Ação</h2>
                    <YouTubeEmbed embedId={post.youtubeId} />
                  </div>
                )}
            </div>
          </div>
          
          <div className="my-8">
            <AdBanner />
          </div>

          <CommentsSection postId={post.id} postTitle={post.title} onLoginRequest={() => setIsLoginModalOpen(true)} />

          <footer className="mt-8 pt-6 border-t border-brand-light-gray/30 flex flex-col sm:flex-row justify-between items-center gap-4">
              <SocialShareButtons />
              {isAdmin && (
                  <div className="flex space-x-4">
                      <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Editar</button>
                      <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">Deletar</button>
                  </div>
              )}
          </footer>
        </article>
        {isEditModalOpen && <PostModal postToEdit={post} onClose={() => setIsEditModalOpen(false)} />}
        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      </>
    </PageTransition>
  );
};

export default PostDetailPage;

