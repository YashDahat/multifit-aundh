import React from 'react';

const FloatingCTA: React.FC = () => {
  const whatsappLink = "https://wa.me/917507008009";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#DFFF00] text-black font-semibold rounded-full p-4 shadow-lg hover:bg-opacity-80 transition-all duration-200 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.96 11.96 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.05.51 4.01 1.48 5.76L.01 24l6.46-1.7c1.65.92 3.53 1.44 5.53 1.44 6.63 0 12-5.37 12-12 0-3.18-1.24-6.16-3.48-8.48zM12 22.01c-1.8 0-3.5-.49-4.99-1.35l-.36-.21-3.75 1.01 1.03-3.69-.24-.38c-.91-1.45-1.4-3.1-1.4-4.89 0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.5-7.5c-.08-.12-.28-.2-.58-.35-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41z" />
      </svg>
    </a>
  );
};

export default FloatingCTA;
