import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ToastProvider } from '../components/ui/Toast';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ConnectionProvider } from '../contexts/ConnectionContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ErrorBoundary } from '../ErrorBoundary';

// Componente de loading para Suspense
function PageLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

interface AppProvidersProps {
  children: React.ReactNode;
}

// Componente que encapsula todos os providers da aplicação
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ConnectionProvider>
              <AuthProvider>
                <Suspense fallback={<PageLoading />}>
                  {children}
                </Suspense>
              </AuthProvider>
            </ConnectionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
