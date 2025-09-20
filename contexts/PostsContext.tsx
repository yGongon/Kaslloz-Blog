import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Post } from '../types';
import { INITIAL_POSTS } from '../constants';
import { db, auth } from '../firebase/config';
import { ref, onValue, push, set, update, remove, get, serverTimestamp, query, orderByChild, runTransaction } from 'firebase/database';
import { onAuthStateChanged, User } from 'firebase/auth';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: string) => Promise<boolean>;
  getPostById: (id: string) => Post | undefined;
  voteOnPost: (postId: string, voteType: 'up' | 'down') => Promise<void>;
  userVotes: { [postId: string]: 'up' | 'down' };
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
        setUserVotes({}); // Clear votes on logout
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
      // Also remove associated votes
      // This part is tricky as it would require iterating all users.
      // A better approach is handling this via security rules or a cloud function.
      // For now, we leave the user_votes entries, they will be orphaned but won't affect the app.
      return true;
    } catch (error) {
      console.error("Error deleting post: ", error);
      return false;
    }
  }, []);
  
  const voteOnPost = useCallback(async (postId: string, voteType: 'up' | 'down') => {
    if (!user) {
      // Idealmente, isso deveria abrir o modal de login
      alert("Você precisa estar logado para votar.");
      return;
    }
    const userId = user.uid;
    const postRef = ref(db, `posts/${postId}`);
    const userVoteRef = ref(db, `user_votes/${userId}/${postId}`);
    
    const currentVote = userVotes[postId];

    await runTransaction(postRef, (post) => {
      if (post) {
        // Garante que os contadores de votos existam e sejam números antes de modificar
        post.upvotes = post.upvotes || 0;
        post.downvotes = post.downvotes || 0;

        if (currentVote === voteType) { // Desfazendo o voto
          if (voteType === 'up') post.upvotes--;
          else post.downvotes--;
          remove(userVoteRef);
        } else {
          if (currentVote) { // Trocando o voto
            if (currentVote === 'up') post.upvotes--;
            else post.downvotes--;
          }
          // Aplicando o novo voto
          if (voteType === 'up') post.upvotes++;
          else post.downvotes++;
          set(userVoteRef, voteType);
        }
      }
      return post;
    });
  }, [user, userVotes]);


  const getPostById = useCallback((id: string): Post | undefined => {
    return posts.find(p => p.id === id);
  }, [posts]);

  const value = useMemo(() => ({ posts, addPost, updatePost, deletePost, getPostById, voteOnPost, userVotes }), [posts, addPost, updatePost, deletePost, getPostById, voteOnPost, userVotes]);

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
