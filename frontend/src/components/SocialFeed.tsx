import React from 'react';

const SocialFeed: React.FC = () => {
  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/multifit_aundh/' },
    { name: 'Facebook', url: 'https://www.facebook.com/multifit.aundh/' },
    { name: 'Twitter', url: 'https://twitter.com/multifit_aundh' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-[#333333] text-[#DFFF00] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-opacity-80 transition-all duration-200 text-lg font-semibold shadow-lg"
        >
          {/* No specific icon library provided in dependencies, using text as visual representation */}
          <span>{link.name}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialFeed;