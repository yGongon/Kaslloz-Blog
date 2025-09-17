import React from 'react';
import { createContext, useContext, ReactNode, useCallback } from 'react';
import { Comment } from '../types';
import { db } from '../firebase/config';
import { ref, push, set, serverTimestamp } from 'firebase/database';

interface CommentsContextType {
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const addComment = useCallback(async (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    try {
      const commentsRef = ref(db, 'comments');
      const newCommentRef = push(commentsRef);
      await set(newCommentRef, {
        ...commentData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding comment to Realtime Database: ", error);
      throw error; // Propagate the error to be handled in the component
    }
  }, []);

  return (
    <CommentsContext.Provider value={{ addComment }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = (): CommentsContextType => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
};
