import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signInWithGoogle } = useAuth();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError('Email ou senha inválidos. Tente novamente.');
      console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
        await signInWithGoogle();
        onClose();
    } catch (err: any) {
        console.error("Google Sign-In Error:", err);
        switch (err.code) {
          case 'auth/unauthorized-domain':
            const currentHost = window.location.hostname;
            setError(`Erro: Domínio não autorizado. Adicione EXATAMENTE "${currentHost}" à sua lista de domínios autorizados nas configurações de Autenticação do Firebase.`);
            break;
          case 'auth/operation-not-allowed':
            setError('Erro de configuração: O login com Google não está ativado no seu projeto Firebase. Por favor, ative-o na aba "Sign-in method" da seção de Autenticação do Firebase.');
            break;
          case 'auth/popup-closed-by-user':
            setError('O popup de login foi fechado antes da conclusão. Por favor, tente novamente.');
            break;
          case 'auth/popup-blocked':
            setError('O popup de login foi bloqueado pelo navegador. Por favor, habilite popups para este site e tente novamente.');
            break;
          default:
            setError(`Ocorreu um erro inesperado. Tente novamente. (Código: ${err.code})`);
            break;
        }
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-brand-gray p-6 sm:p-8 rounded-lg shadow-lg w-[95%] sm:w-full max-w-sm border border-brand-light-gray/30 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" disabled={isSubmitting}>
          <Icon name="close" className="h-6 w-6"/>
        </button>
        <h2 className="font-display text-2xl font-bold text-center text-white mb-6">Acessar Conta</h2>
        
        <div className="space-y-4">
            <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-white transition-colors duration-300 disabled:opacity-50"
            >
                <Icon name="google" className="h-5 w-5"/>
                <span>Entrar com Google</span>
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-brand-light-gray"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Ou</span>
                <div className="flex-grow border-t border-brand-light-gray"></div>
            </div>
        </div>

        <form onSubmit={handleAdminSubmit}>
           <p className="text-center text-gray-400 text-sm mb-4">Login de Administrador</p>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-dark border border-brand-light-gray rounded py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-red"
              required
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4 text-center break-words">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline uppercase transition-colors duration-300 disabled:bg-red-900 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;