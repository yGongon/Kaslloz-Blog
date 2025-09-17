import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useComments } from '../contexts/CommentsContext';
import { db } from '../firebase/config';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Comment } from '../types';

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { addComment } = useComments();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;

    setIsLoading(true);
    const commentsRef = ref(db, 'comments');
    const q = query(
      commentsRef, 
      orderByChild('postId'),
      equalTo(postId)
    );

    const unsubscribe = onValue(q, (snapshot) => {
      const commentsData: Comment[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((doc) => {
          const data = doc.val();
          if (data.createdAt) { // Ensure the comment has a timestamp
            commentsData.push({
              id: doc.key!,
              postId: data.postId,
              name: data.name,
              comment: data.comment,
              createdAt: new Date(data.createdAt).toISOString(),
            });
          }
        });
      }
      // Sort client-side because RTDB can't filter and sort on different keys
      commentsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(commentsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching comments: ", err);
      setError("Não foi possível carregar os comentários.");
      setIsLoading(false);
    });

    // Detach the listener when the component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Nome e comentário são obrigatórios.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await addComment({ postId, name, comment });
      setName('');
      setComment('');
    } catch (err) {
      setError('Ocorreu um erro ao enviar seu comentário. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6 border-b-2 border-brand-red/30 pb-2">Comentários ({comments.length})</h2>
      
      <div className="bg-brand-gray p-6 rounded-lg border border-brand-light-gray/30 mb-8">
        <h3 className="font-display text-xl font-bold text-white mb-4">Deixe um comentário</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-2">Seu Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="comment" className="block text-gray-400 text-sm font-bold mb-2">Comentário</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Você pode usar <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Markdown</a> para formatação.
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300 disabled:bg-red-900 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {isLoading ? (
            <p className="text-gray-400 text-center">Carregando comentários...</p>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-white">{c.name}</p>
                <p className="text-xs text-gray-500">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(c.createdAt))}</p>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {c.comment}
                </ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          !error && <p className="text-gray-400 text-center">Seja o primeiro a comentar!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
