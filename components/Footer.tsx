
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-gray border-t border-brand-light-gray/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} Ouroboros Kingdom. Todos os Direitos Reservados. <br/>
              Este é um site feito por fãs e não é afiliado à Delta Force ou seus desenvolvedores.
            </p>
            <Link to="/privacy-policy" className="hover:text-white underline transition-colors duration-300">
              Política de Privacidade
            </Link>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.youtube.com/@kaslloz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-red transition-colors duration-300"><Icon name="youtube" className="h-6 w-6" /></a>
            <a href="https://www.instagram.com/kasllos/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-red transition-colors duration-300"><Icon name="instagram" className="h-6 w-6" /></a>
            <a href="https://discord.gg/enQVTHqFC8" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-red transition-colors duration-300"><Icon name="discord" className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;