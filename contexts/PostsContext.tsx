import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Post } from '../types';
import { INITIAL_POSTS } from '../constants';
import { db } from '../firebase/config';
import { ref, onValue, push, set, update, remove, get, serverTimestamp, query, orderByChild } from 'firebase/database';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: string) => Promise<boolean>;
  getPostById: (id: string) => Post | undefined;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Function to populate Realtime Database with initial data if empty
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
            createdAt: new Date(rest.createdAt).getTime(), // Store as timestamp for sorting
        });
    }
    console.log("Initial posts added successfully.");
  }
};


export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    populateInitialData();

    const postsRef = ref(db, 'posts');
    const q = query(postsRef, orderByChild('createdAt'));

    const unsubscribe = onValue(q, (snapshot) => {
      const postsData: Post[] = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const id = childSnapshot.key;
          const data = childSnapshot.val();
          postsData.push({
            id: id!,
            ...data,
            createdAt: new Date(data.createdAt).toISOString(),
          });
        });
      }
      setPosts(postsData.reverse()); // Reverse for descending order
    }, (error) => {
      console.error("Error fetching posts from Realtime Database: ", error);
    });

    return () => unsubscribe(); // Detach the listener
  }, []);

  const addPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt'>) => {
    try {
      const postsRef = ref(db, 'posts');
      const newPostRef = push(postsRef);
      await set(newPostRef, {
        ...postData,
        createdAt: serverTimestamp(),
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
      return true;
    } catch (error) {
      console.error("Error deleting post: ", error);
      return false;
    }
  }, []);

  const getPostById = useCallback((id: string): Post | undefined => {
    return posts.find(p => p.id === id);
  }, [posts]);

  const value = useMemo(() => ({ posts, addPost, updatePost, deletePost, getPostById }), [posts, addPost, updatePost, deletePost, getPostById]);

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