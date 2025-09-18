
import React from 'react';
import { Link } from 'react-router-dom';
import { Post, Category } from '../types';
import { Icon } from './Icon';
import { usePosts } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { voteOnPost, userVotes } = usePosts();
  const { isLoggedIn } = useAuth();
  const userVote = userVotes[post.id];

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
  
  const voteScore = (post.upvotes || 0) - (post.downvotes || 0);

  const handleVoteClick = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoggedIn) {
      voteOnPost(post.id, voteType);
    } else {
      alert("Você precisa fazer login para votar.");
    }
  };
  
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  return (
    <div className="bg-brand-gray border border-brand-light-gray/30 rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-neon-red flex flex-col">
      <Link to={`/post/${post.id}`} className="block h-full flex flex-col">
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover flex-shrink-0" />
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider mb-2">
              <Icon name={categoryIcon} className={`h-5 w-5 ${categoryColor}`} />
              <span className={categoryColor}>{post.category} {post.version && ` - v${post.version}`}</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2 truncate">{post.title}</h3>
            <p className="text-gray-400 line-clamp-2 mb-4">{stripHtml(post.content)}</p>
          </div>
          <div>
             {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Link 
                    key={index} 
                    to={`${categoryPath}?tag=${encodeURIComponent(tag)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-brand-light-gray text-gray-300 text-xs font-semibold px-2 py-0.5 rounded-full hover:bg-brand-red transition-colors duration-200"
                    aria-label={`Ver todos os posts com a tag ${tag}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 pt-4 border-t border-brand-light-gray/20 flex justify-between items-center">
              <span>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(post.createdAt))}</span>
              {post.category === Category.Builds && (
                <div className="flex items-center space-x-2">
                  <button onClick={(e) => handleVoteClick(e, 'up')} disabled={!isLoggedIn} aria-label="Upvote" className={`disabled:cursor-not-allowed group`}>
                     <Icon name="arrowUp" className={`w-5 h-5 transition-colors ${userVote === 'up' ? 'text-brand-red' : 'text-gray-500 group-hover:text-white'}`}/>
                  </button>
                  <span className={`font-bold text-sm ${voteScore > 0 ? 'text-green-400' : voteScore < 0 ? 'text-red-400' : 'text-gray-400'}`}>{voteScore}</span>
                  <button onClick={(e) => handleVoteClick(e, 'down')} disabled={!isLoggedIn} aria-label="Downvote" className={`disabled:cursor-not-allowed group`}>
                     <Icon name="arrowDown" className={`w-5 h-5 transition-colors ${userVote === 'down' ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;