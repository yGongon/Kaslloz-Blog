
import React from 'react';
import { Link } from 'react-router-dom';
import { Post, Category } from '../types';
import { Icon } from './Icon';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const categoryColor = post.category === Category.Builds ? 'text-blue-400' : 'text-yellow-400';
  const categoryIcon = post.category === Category.Builds ? 'build' : 'patch';
  const categoryPath = post.category === Category.Builds ? '/builds' : '/patch-notes';

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
            <p className="text-gray-400 line-clamp-2 mb-4">{post.content}</p>
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
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 pt-4 border-t border-brand-light-gray/20">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;