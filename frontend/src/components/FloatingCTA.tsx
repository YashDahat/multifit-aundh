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
      {/* WhatsApp Icon - using a simple SVG for a chat bubble */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.96 11.96 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.05.51 4.01 1.48 5.76L.01 24l6.46-1.7c1.65.92 3.53 1.44 5.53 1.44 6.63 0 12-5.37 12-12 0-3.18-1.24-6.16-3.48-8.48zM12 22.01c-1.8 0-3.5-.49-4.99-1.35l-.36-.21-3.75 1.01 1.03-3.69-.24-.38c-.91-1.45-1.4-3.1-1.4-4.89 0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm4.5-6.49c-.25-.12-.8-.39-.92-.43-.12-.04-.2-.04-.28.04-.08.08-.31.39-.38.47-.08.08-.16.09-.28.04-.12-.04-.5-.18-.95-.58-.35-.3-.59-.5-.78-.82-.