import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Comment } from '../types';
import PageTransition from '../components/PageTransition';
import { Icon } from '../components/Icon';

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    if (user) {
      setIsLoading(true);
      const commentsRef = ref(db, 'comments');
      const userCommentsQuery = query(
        commentsRef,
        orderByChild('userId'),
        equalTo(user.uid)
      );

      const unsubscribe = onValue(userCommentsQuery, (snapshot) => {
        const commentsData: Comment[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((doc) => {
            commentsData.push({ id: doc.key!, ...doc.val() });
          });
        }
        setComments(commentsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, isLoggedIn, navigate]);
  
  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center gap-6 mb-12 p-6 bg-brand-gray rounded-lg border border-brand-light-gray/20">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=1F2937&color=fff`}
            alt={user.displayName || 'User Avatar'}
            className="w-24 h-24 rounded-full border-4 border-brand-red"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-display text-3xl font-bold text-white text-center sm:text-left">{user.displayName}</h1>
            <p className="text-gray-400 text-center sm:text-left">{user.email}</p>
          </div>
        </header>

        <section>
          <h2 className="font-display text-2xl font-bold text-brand-red border-b-2 border-brand-red/50 pb-2 mb-6">
            Minha Atividade de Comentários ({comments.length})
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-400">Carregando atividade...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
                  <p className="text-gray-300 mb-2">"{comment.comment}"</p>
                  <div className="text-xs text-gray-500">
                    Comentado em <Link to={`/post/${comment.postId}`} className="font-semibold text-blue-400 hover:underline">{comment.postTitle || 'um post'}</Link>
                    {' - '}
                    {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(comment.createdAt))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Você ainda não fez nenhum comentário.</p>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
