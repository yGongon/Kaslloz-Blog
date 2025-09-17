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
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-brand-gray p-6 sm:p-8 rounded-lg shadow-lg w-[95%] sm:w-full max-w-sm border border-brand-light-gray/30 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <Icon name="close" className="h-6 w-6"/>
        </button>
        <h2 className="font-display text-2xl font-bold text-center text-white mb-6">Login de Administrador</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
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
