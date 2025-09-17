import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePages } from '../contexts/PagesContext';
import LoginModal from './LoginModal';
import PostModal from './PostModal';
import PageModal from './PageModal';
import { Icon } from './Icon';

const Header: React.FC = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { pages } = usePages();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-display uppercase tracking-wider transition-colors duration-300 ${
      isActive ? 'text-brand-red' : 'text-gray-300 hover:text-white'
    }`;

  const renderAuthControls = (isMobile = false) => {
    const commonButtonClass = "text-white font-bold py-2 px-4 rounded transition duration-300 uppercase text-sm";
    const fullWidthClass = isMobile ? "w-full text-center" : "";

    if (!isLoggedIn) {
      return (
        <button
          onClick={() => {
            setLoginModalOpen(true);
            if (isMobile) setMobileMenuOpen(false);
          }}
          className={`bg-brand-red hover:bg-red-700 ${commonButtonClass} ${fullWidthClass}`}
        >
          Login / Criar Conta
        </button>
      );
    }

    if (isAdmin) {
      return (
        <>
          <button
            onClick={() => {
              setPostModalOpen(true);
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`bg-brand-red hover:bg-red-700 ${commonButtonClass} ${fullWidthClass}`}
          >
            Novo Post
          </button>
          <button
            onClick={() => {
              setPageModalOpen(true);
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`bg-blue-600 hover:bg-blue-700 ${commonButtonClass} ${fullWidthClass}`}
          >
            Nova Página
          </button>
          <button
            onClick={() => {
              logout();
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`bg-gray-700 hover:bg-gray-600 ${commonButtonClass} ${fullWidthClass}`}
          >
            Sair
          </button>
        </>
      );
    }
    
    // Regular User
    return (
       <div className="relative">
        <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2">
            <img src={user?.photoURL || ''} alt={user?.displayName || 'User Avatar'} className="w-8 h-8 rounded-full border-2 border-brand-red" referrerPolicy="no-referrer" />
        </button>
        <AnimatePresence>
        {isUserMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-brand-gray rounded-md shadow-lg z-20 border border-brand-light-gray/30"
            >
                <div className="p-2">
                    <p className="px-2 py-1 text-white font-semibold truncate">{user?.displayName}</p>
                    <div className="my-1 border-t border-brand-light-gray/20"></div>
                    <button 
                        onClick={() => { logout(); setUserMenuOpen(false); if (isMobile) setMobileMenuOpen(false); }} 
                        className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-brand-red hover:text-white rounded"
                    >
                        Sair
                    </button>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
       </div>
    );

  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-gray/80 backdrop-blur-sm border-b border-brand-light-gray/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <NavLink to="/" className="flex items-center space-x-2">
              <Icon name="logo" className="h-8 w-8 text-brand-red" />
              <span className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                Ouroboros <span className="text-brand-red">Kingdom</span>
              </span>
            </NavLink>
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/" className={navLinkClass}>Início</NavLink>
              <NavLink to="/builds" className={navLinkClass}>Builds</NavLink>
              <NavLink to="/patch-notes" className={navLinkClass}>Notas de Patch</NavLink>
              {pages.map(page => (
                <NavLink key={page.id} to={`/page/${page.slug}`} className={navLinkClass}>{page.title}</NavLink>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-2">
              {renderAuthControls()}
            </div>
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                    <Icon name={isMobileMenuOpen ? "close" : "menu"} className="h-6 w-6 text-white" />
                </button>
            </div>
          </div>
          {isMobileMenuOpen && (
              <div className="md:hidden pb-4">
                 <nav className="flex flex-col items-center space-y-4">
                    <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Início</NavLink>
                    <NavLink to="/builds" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Builds</NavLink>
                    <NavLink to="/patch-notes" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Notas de Patch</NavLink>
                    {pages.map(page => (
                      <NavLink key={page.id} to={`/page/${page.slug}`} className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>{page.title}</NavLink>
                    ))}
                     <div className="flex flex-col items-center space-y-4 mt-4 w-full">
                      {isAdmin ? renderAuthControls(true) : (
                          <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300 uppercase text-sm w-full">
                              Sair
                          </button>
                      )}
                      {!isLoggedIn && renderAuthControls(true)}
                    </div>
                </nav>
              </div>
          )}
        </div>
      </header>
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
      {isPostModalOpen && <PostModal onClose={() => setPostModalOpen(false)} />}
      {isPageModalOpen && <PageModal onClose={() => setPageModalOpen(false)} />}
    </>
  );
};

export default Header;
