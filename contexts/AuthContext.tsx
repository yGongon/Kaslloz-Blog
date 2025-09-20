import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth, db } from '../firebase/config'; // Import db
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { ref, query, orderByChild, equalTo, get, update } from 'firebase/database'; // Import database functions

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista de e-mails autorizados como administradores
const ADMIN_EMAILS = ['wevelleytwich@gmail.com', 'emanuelcarlos534@gmail.com'];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Verificação de admin baseada na lista de e-mails
      const adminCheck = !!currentUser && ADMIN_EMAILS.includes(currentUser.email || '');
      setIsAdmin(adminCheck);
      setIsLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };
  
  const updateUserProfile = async (displayName: string): Promise<void> => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // 1. Atualiza o perfil no Firebase Auth
      await updateProfile(currentUser, { displayName });

      // 2. Procura e atualiza o nome em todos os comentários do usuário
      const commentsRef = ref(db, 'comments');
      const userCommentsQuery = query(commentsRef, orderByChild('userId'), equalTo(currentUser.uid));
      const snapshot = await get(userCommentsQuery);

      if (snapshot.exists()) {
        const updates: { [key: string]: any } = {};
        snapshot.forEach((childSnapshot) => {
          const commentId = childSnapshot.key;
          // Prepara a atualização para o campo 'name' de cada comentário encontrado
          if (commentId) {
            updates[`/comments/${commentId}/name`] = displayName;
          }
        });
        // Executa todas as atualizações de uma só vez
        await update(ref(db), updates);
      }

      // 3. Força a atualização do estado do usuário na aplicação para refletir a mudança imediatamente
      setUser({ ...currentUser });
    } else {
      throw new Error("Nenhum usuário logado para atualizar.");
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin,
    login,
    signInWithGoogle,
    logout,
    updateUserProfile,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
