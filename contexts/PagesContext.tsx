import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Page } from '../types';
import { INITIAL_PAGES } from '../constants';
import { db } from '../firebase/config';
import { ref, onValue, push, set, update, remove, get, serverTimestamp, query, orderByChild } from 'firebase/database';

interface PagesContextType {
  pages: Page[];
  addPage: (page: Omit<Page, 'id' | 'createdAt'>) => Promise<void>;
  updatePage: (page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<boolean>;
  getPageBySlug: (slug: string) => Page | undefined;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

// Function to populate Realtime Database with initial data if empty
const populateInitialData = async () => {
    const pagesRef = ref(db, "pages");
    const snapshot = await get(pagesRef);
    if (!snapshot.exists()) {
      console.log("No pages found. Populating with initial data...");
      for (const page of INITIAL_PAGES) {
        const { id, ...rest } = page;
        const newPageRef = push(pagesRef);
        await set(newPageRef, {
            ...rest,
            createdAt: new Date(rest.createdAt).getTime(),
        });
      }
      console.log("Initial pages added successfully.");
    }
  };

export const PagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    populateInitialData();

    const pagesRef = ref(db, 'pages');
    const q = query(pagesRef, orderByChild('createdAt'));

    const unsubscribe = onValue(q, (snapshot) => {
        const pagesData: Page[] = [];
        if(snapshot.exists()) {
          snapshot.forEach(childSnapshot => {
            const id = childSnapshot.key;
            const data = childSnapshot.val();
            pagesData.push({
              id: id!,
              ...data,
              createdAt: new Date(data.createdAt).toISOString(),
            });
          });
        }
        setPages(pagesData); // Ordered ascending by default
      }, (error) => {
        console.error("Error fetching pages from Realtime Database: ", error);
      });
  
      return () => unsubscribe();
  }, []);

  const addPage = useCallback(async (pageData: Omit<Page, 'id' | 'createdAt'>) => {
    try {
        const pagesRef = ref(db, 'pages');
        const newPageRef = push(pagesRef);
        await set(newPageRef, {
            ...pageData,
            createdAt: serverTimestamp(),
        });
    } catch(error) {
        console.error("Error adding page:", error)
    }
  }, []);

  const updatePage = useCallback(async (updatedPage: Page) => {
    try {
        const pageRef = ref(db, `pages/${updatedPage.id}`);
        const { id, createdAt, ...dataToUpdate } = updatedPage;
        await update(pageRef, dataToUpdate);
    } catch(error) {
        console.error("Error updating page:", error)
    }
  }, []);

  const deletePage = useCallback(async (id: string): Promise<boolean> => {
    try {
        await remove(ref(db, `pages/${id}`));
        return true;
    } catch(error) {
        console.error("Error deleting page:", error)
        return false;
    }
  }, []);

  const getPageBySlug = useCallback((slug: string): Page | undefined => {
    return pages.find(p => p.slug === slug);
  }, [pages]);

  const value = useMemo(() => ({ pages, addPage, updatePage, deletePage, getPageBySlug }), [pages, addPage, updatePage, deletePage, getPageBySlug]);


  return (
    <PagesContext.Provider value={value}>
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = (): PagesContextType => {
  const context = useContext(PagesContext);
  if (!context) {
    throw new Error('usePages must be used within a PagesProvider');
  }
  return context;
};