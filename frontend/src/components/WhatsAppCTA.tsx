import type { JSX } from 'react';
import React from 'react';

export default function WhatsAppCTA(): JSX.Element {
  return (
    <a
      href="https://wa.me/917507008009"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-50"
      aria-label="Chat with us on WhatsApp"
    >
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.084.542 4.045 1.49 5.76L.066 23.334l5.63-1.48C7.323 22.858 9.619 23.5 12 23.5 18.627 23.5 24 18.127 24 11.5S18.627 0 12 0zm0 21.5c-2.1 0-4.09-.6-5.77-1.64l-.41-.25-4.26 1.12 1.14-4.16-.27-.43A9.438 9.438 0 012.5 11.5C2.5 6.25 6.75 2 12 2s9.5 4.25 9.5 9.5-4.25 9.5-9.5 9.5zm5.2-7.1c-.28-.14-1.67-.82-1.93-.91-.26-.1-.44-.14-.63.14-.19.28-.72.91-.88 1.1-.16.18-.33.2-.61.07-.28-.14-1.19-.44-2.27-1.4-.84-.75-1.4-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.63-1.52-.86-2.08-.23-.54-.46-.47-.63-.48H8.4c-.16 0-.43.06-.66.3-.22.24-.86.84-.86 2.06 0 1.21.88 2.38 1 2.55.13.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.24-.16-.52-.3z" />
      </svg>
    </a>
  );
}
