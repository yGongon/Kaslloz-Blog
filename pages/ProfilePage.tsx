import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Comment } from '../types';
import PageTransition from '../components/PageTransition';
import { Icon } from '../components/Icon';

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    if (user) {
      setDisplayName(user.displayName || '');
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
  
  const handleSaveProfile = async () => {
    if (!user || displayName.trim() === '') return;
    setIsSaving(true);
    try {
      await updateUserProfile(displayName);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert("Não foi possível atualizar o perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!user) {
    return null; // ou um spinner de carregamento
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center gap-6 mb-12 p-6 bg-brand-gray rounded-lg border border-brand-light-gray/20">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=1F2937&color=fff`}
            alt={displayName || 'User Avatar'}
            className="w-24 h-24 rounded-full border-4 border-brand-red"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full sm:w-auto bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red text-2xl font-bold"
                />
                <button onClick={handleSaveProfile} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50">
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
                <h1 className="font-display text-3xl font-bold text-white">{displayName}</h1>
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-white hover:bg-brand-light-gray rounded-full transition-colors">
                  <Icon name="edit" className="w-5 h-5" />
                </button>
              </div>
            )}
            <p className="text-gray-400">{user.email}</p>
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
