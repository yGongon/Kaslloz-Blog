import React from 'react';
import { Icon } from './Icon';

const SocialShareButtons: React.FC = () => {
  const socialLinks = [
    { name: 'YouTube', icon: 'youtube', href: 'https://youtube.com/@kaslloz' },
    { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com/kaslloz' },
    { name: 'Discord', icon: 'discord', href: 'https://discord.gg/enQVTHqFC8' }, // Replace with your actual Discord invite link
  ];

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-400 font-bold">Siga-nos:</span>
      {socialLinks.map(link => (
        <a 
          key={link.name} 
          href={link.href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-brand-red transition-colors duration-300"
          aria-label={`Siga-nos no ${link.name}`}
        >
          <Icon name={link.icon as any} className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
};

export default SocialShareButtons;