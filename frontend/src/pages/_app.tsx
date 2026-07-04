import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css'; // Assuming a global CSS file exists

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;