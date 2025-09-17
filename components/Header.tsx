import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePages } from '../contexts/PagesContext';
import LoginModal from './LoginModal';
import PostModal from './PostModal';
import PageModal from './PageModal';
import { Icon } from './Icon';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const { pages } = usePages();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState<'post' | 'page' | null>(null);

  const handleOpenModal = (modalType: 'post' | 'page') => {
    setLoadingModal(modalType);
    // Simula um pequeno atraso para a animação ser visível
    setTimeout(() => {
      if (modalType === 'post') {
        setPostModalOpen(true);
      } else if (modalType === 'page') {
        setPageModalOpen(true);
      }
      setLoadingModal(null);
    }, 300);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-display uppercase tracking-wider transition-colors duration-300 ${
      isActive ? 'text-brand-red' : 'text-gray-300 hover:text-white'
    }`;

  const adminButtons = (isMobile = false) => {
    const commonButtonClass = "text-white font-bold py-2 px-4 rounded transition duration-300 uppercase text-sm";
    const fullWidthClass = isMobile ? "w-full" : "";
    const isLoading = loadingModal !== null;

    if (isLoggedIn) {
      const isPostLoading = loadingModal === 'post';
      const isPageLoading = loadingModal === 'page';

      return (
        <>
          <button
            onClick={() => {
              handleOpenModal('post');
              if (isMobile) setMobileMenuOpen(false);
            }}
            disabled={isLoading}
            className={`bg-brand-red hover:bg-red-700 ${commonButtonClass} ${fullWidthClass} ${isPostLoading ? 'animate-pulse' : ''} disabled:opacity-75 disabled:cursor-wait`}
          >
            Novo Post
          </button>
          <button
            onClick={() => {
              handleOpenModal('page');
              if (isMobile) setMobileMenuOpen(false);
            }}
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 ${commonButtonClass} ${fullWidthClass} ${isPageLoading ? 'animate-pulse' : ''} disabled:opacity-75 disabled:cursor-wait`}
          >
            Nova Página
          </button>
          <button
            onClick={() => {
              logout();
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`bg-gray-700 hover:bg-gray-600 ${commonButtonClass} ${fullWidthClass}`}
            disabled={isLoading}
          >
            Sair
          </button>
        </>
      );
    }
    return (
      <button
        onClick={() => {
          setLoginModalOpen(true);
          if (isMobile) setMobileMenuOpen(false);
        }}
        className={`bg-gray-700 hover:bg-gray-600 ${commonButtonClass} ${fullWidthClass}`}
      >
        Login Admin
      </button>
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
              {adminButtons()}
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
                      {adminButtons(true)}
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