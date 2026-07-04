import React from 'react';

const FloatingWhatsAppButton = (): React.ReactElement => {
  return (
    <a
      href="https://wa.me/917507008009"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M12.04 2C7.34 2 3.56 5.78 3.56 10.48c0 1.56.41 3.06 1.19 4.39L2 22l7.39-2.02c1.26.68 2.68 1.04 4.09 1.04 4.7 0 8.48-3.78 8.48-8.48S16.74 2 12.04 2zm3.89 13.82c-.19.31-.76.6-.99.63-.23.03-.49.04-.76-.09-.27-.13-1.05-.4-1.29-.68-.24-.28-.5-.67-.28-1.05.22-.38.49-.6.66-.78.17-.18.37-.4.25-.6-.12-.2-.76-1.82-1.04-2.48-.28-.66-.56-.55-.76-.55-.19 0-.42-.03-.66-.03-.24 0-.63.09-.9.37-.27.28-1.05 1.02-1.05 2.48 0 1.46 1.08 2.87 1.23 3.06.15.19 2.1 3.2 5.09 4.47 2.99 1.27 2.99.85 3.53.8.54-.05 1.05-.43 1.22-.85.17-.42.17-.78.12-.85-.05-.07-.19-.13-.4-.25z"/>
      </svg>
    </a>
  );
};

export default FloatingWhatsAppButton;
