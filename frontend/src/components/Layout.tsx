import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
      <FloatingWhatsAppButton />
      <LocalBusinessSchema />
    </div>
  );
};

export default Layout;