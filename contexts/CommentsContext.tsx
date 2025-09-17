import React from 'react';
import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Comment } from '../types';
import { db } from '../firebase/config';
import { ref, push, set, serverTimestamp, remove } from 'firebase/database';

interface CommentsContextType {
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  deleteComment: (id: string) => Promise<boolean>;
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

  const deleteComment = useCallback(async (id: string): Promise<boolean> => {
    try {
      await remove(ref(db, `comments/${id}`));
      return true;
    } catch (error) {
      console.error("Error deleting comment: ", error);
      return false;
    }
  }, []);
  
  const value = useMemo(() => ({ addComment, deleteComment }), [addComment, deleteComment]);


  return (
    <CommentsContext.Provider value={value}>
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