import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Post } from '../types';
import { INITIAL_POSTS } from '../constants';
import { db, auth } from '../firebase/config';
import { ref, onValue, push, set, update, remove, get, serverTimestamp, query, orderByChild } from 'firebase/database';
import { onAuthStateChanged, User } from 'firebase/auth';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: string) => Promise<boolean>;
  getPostById: (id: string) => Post | undefined;
  voteOnPost: (postId: string, voteType: 'up' | 'down') => Promise<void>;
  userVotes: { [postId: string]: 'up' | 'down' };
  resetAllVotes: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const populateInitialData = async () => {
  const postsRef = ref(db, "posts");
  const snapshot = await get(postsRef);
  if (!snapshot.exists()) {
    console.log("No posts found. Populating with initial data...");
    for (const post of INITIAL_POSTS) {
        const { id, ...rest } = post;
        const newPostRef = push(postsRef);
        await set(newPostRef, {
            ...rest,
            upvotes: 0, // Garantir que o campo exista
            downvotes: 0, // Garantir que o campo exista
            createdAt: new Date(rest.createdAt).getTime(),
        });
    }
    console.log("Initial posts added successfully.");
  }
};

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userVotes, setUserVotes] = useState<{ [postId: string]: 'up' | 'down' }>({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserVotes({}); // Limpar votos ao fazer logout
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    populateInitialData();

    const postsRef = ref(db, 'posts');
    const q = query(postsRef, orderByChild('createdAt'));

    const unsubscribePosts = onValue(q, (snapshot) => {
      const postsData: Post[] = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const id = childSnapshot.key;
          const data = childSnapshot.val();
          postsData.push({
            id: id!,
            ...data,
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            createdAt: new Date(data.createdAt).toISOString(),
          });
        });
      }
      setPosts(postsData.reverse());
    }, (error) => {
      console.error("Error fetching posts from Realtime Database: ", error);
    });

    return () => unsubscribePosts();
  }, []);

  useEffect(() => {
    if (user && posts.length > 0) {
      const votesRef = ref(db, `user_votes/${user.uid}`);
      const unsubscribeVotes = onValue(votesRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserVotes(snapshot.val());
        } else {
          setUserVotes({});
        }
      });
      return () => unsubscribeVotes();
    }
  }, [user, posts]);

  const addPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => {
    try {
      const postsRef = ref(db, 'posts');
      const newPostRef = push(postsRef);
      await set(newPostRef, {
        ...postData,
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
      });
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  }, []);

  const updatePost = useCallback(async (updatedPost: Post) => {
    try {
      const postRef = ref(db, `posts/${updatedPost.id}`);
      const { id, createdAt, ...dataToUpdate } = updatedPost;
      await update(postRef, dataToUpdate);
    } catch (error)
      {
      console.error("Error updating post: ", error);
    }
  }, []);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    try {
      await remove(ref(db, `posts/${id}`));
      // Também remover votos associados
      await remove(ref(db, `user_votes/${user?.uid}/${id}`));
      return true;
    } catch (error) {
      console.error("Error deleting post: ", error);
      return false;
    }
  }, [user]);
  
  const voteOnPost = useCallback(async (postId: string, voteType: 'up' | 'down') => {
    if (!user) {
      alert("Você precisa estar logado para votar.");
      return;
    }
    const userId = user.uid;
    const currentVote = userVotes[postId];
    
    const postRef = ref(db, `posts/${postId}`);
    const postSnapshot = await get(postRef);
    if (!postSnapshot.exists()) {
        console.error("Post não encontrado para votação.");
        return;
    };
    const postData = postSnapshot.val();
    
    const updates: { [key: string]: any } = {};
    
    let newUpvotes = postData.upvotes || 0;
    let newDownvotes = postData.downvotes || 0;

    // Caso A: O usuário está desfazendo o voto atual
    if (currentVote === voteType) {
        updates[`/user_votes/${userId}/${postId}`] = null; // Remove o voto do usuário
        if (voteType === 'up') {
            newUpvotes = Math.max(0, newUpvotes - 1);
        } else {
            newDownvotes = Math.max(0, newDownvotes - 1);
        }
    } 
    // Caso B: O usuário está votando pela primeira vez ou mudando o voto
    else {
        updates[`/user_votes/${userId}/${postId}`] = voteType; // Define ou altera o voto do usuário
        // Se estiver mudando de voto, diminui o contador antigo
        if (currentVote === 'up') {
            newUpvotes = Math.max(0, newUpvotes - 1);
        }
        if (currentVote === 'down') {
            newDownvotes = Math.max(0, newDownvotes - 1);
        }
        // Aumenta o contador novo
        if (voteType === 'up') {
            newUpvotes++;
        } else {
            newDownvotes++;
        }
    }

    updates[`/posts/${postId}/upvotes`] = newUpvotes;
    updates[`/posts/${postId}/downvotes`] = newDownvotes;

    // Executa a atualização atômica em múltiplos caminhos
    try {
        await update(ref(db), updates);
    } catch (error) {
        console.error("Falha ao atualizar os votos:", error);
    }
  }, [user, userVotes]);

  const resetAllVotes = useCallback(async () => {
    if (!window.confirm('TEM CERTEZA? Esta ação irá zerar permanentemente TODOS os votos de TODOS os posts e não pode ser desfeita.')) {
      return;
    }

    console.log("Iniciando a redefinição de todos os votos...");
    try {
      const postsRef = ref(db, 'posts');
      const postsSnapshot = await get(postsRef);
      
      const updates: { [key: string]: any } = {};

      // Marcar toda a árvore de user_votes para exclusão
      updates['/user_votes'] = null;

      // Percorrer todos os posts e zerar os contadores
      if (postsSnapshot.exists()) {
        postsSnapshot.forEach(postSnapshot => {
          const postId = postSnapshot.key;
          if (postId) {
            updates[`/posts/${postId}/upvotes`] = 0;
            updates[`/posts/${postId}/downvotes`] = 0;
          }
        });
      }

      // Executar a atualização atômica
      await update(ref(db), updates);
      
      alert('Todos os votos foram zerados com sucesso!');
      console.log("Todos os votos foram redefinidos.");
    } catch (error) {
      console.error("Erro ao zerar os votos:", error);
      alert('Ocorreu um erro ao zerar os votos. Verifique o console.');
    }
  }, []);


  const getPostById = useCallback((id: string): Post | undefined => {
    return posts.find(p => p.id === id);
  }, [posts]);

  const value = useMemo(() => ({ posts, addPost, updatePost, deletePost, getPostById, voteOnPost, userVotes, resetAllVotes }), [posts, addPost, updatePost, deletePost, getPostById, voteOnPost, userVotes, resetAllVotes]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
