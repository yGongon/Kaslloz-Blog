import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useComments } from '../contexts/CommentsContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Comment } from '../types';
import { Icon } from './Icon';

interface CommentsSectionProps {
  postId: string;
  postTitle: string;
  onLoginRequest: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, postTitle, onLoginRequest }) => {
  const { addComment, deleteComment } = useComments();
  const { user, isLoggedIn, isAdmin } = useAuth();
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
          if (data.createdAt) {
            commentsData.push({
              id: doc.key!,
              ...data,
              createdAt: new Date(data.createdAt).toISOString(),
            });
          }
        });
      }
      commentsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(commentsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching comments: ", err);
      setError("Não foi possível carregar os comentários.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      setError('Você precisa estar logado para comentar.');
      return;
    }
    if (!comment.trim()) {
      setError('O comentário não pode estar vazio.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const commentData = {
        postId,
        userId: user.uid,
        name: user.displayName || 'Usuário Anônimo',
        photoURL: user.photoURL || undefined,
        comment,
        postTitle,
      };

      await addComment(commentData);
      setComment('');
    } catch (err) {
      setError('Ocorreu um erro ao enviar seu comentário. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Você tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita.')) {
      const success = await deleteComment(commentId);
      if (!success) {
        alert('Falha ao deletar o comentário.');
      }
    }
  };

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6 border-b-2 border-brand-red/30 pb-2">Comentários ({comments.length})</h2>
      
      <div className="bg-brand-gray p-6 rounded-lg border border-brand-light-gray/30 mb-8">
        {isLoggedIn && user ? (
          <>
            <h3 className="font-display text-xl font-bold text-white mb-4">Deixe um comentário</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3 p-2 bg-brand-dark rounded-md">
                  <img src={user.photoURL || ''} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  <p className="text-white font-semibold">Comentando como {user.displayName}</p>
              </div>
              <div>
                <label htmlFor="comment" className="sr-only">Comentário</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red"
                  required
                  disabled={isSubmitting}
                  placeholder={`O que você acha, ${user?.displayName?.split(' ')[0]}?`}
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
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 mb-4">Você precisa fazer login para deixar um comentário.</p>
            <button
              onClick={onLoginRequest}
              className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300"
            >
              Login / Criar Conta
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
            <p className="text-gray-400 text-center">Carregando comentários...</p>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex items-start bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
               {c.photoURL ? (
                    <img src={c.photoURL} alt={c.name} className="w-10 h-10 rounded-full mr-4 flex-shrink-0" referrerPolicy="no-referrer" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-light-gray flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon name="user" className="h-6 w-6 text-gray-400" />
                    </div>
                )}
              <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-xs text-gray-500">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(c.createdAt))}</p>
                    </div>
                    {(isAdmin || (user && user.uid === c.userId)) && ( // Allow user to delete their own comment
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-gray-500 hover:text-brand-red transition-colors duration-200"
                        aria-label="Deletar comentário"
                      >
                        <Icon name="trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {c.comment}
                    </ReactMarkdown>
                  </div>
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