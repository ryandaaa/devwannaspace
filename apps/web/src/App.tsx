import { AppShell } from './components/layout/AppShell';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginView } from './components/views/LoginView';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <LoginView />;
  return <AppShell />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
