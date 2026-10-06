import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MCQPractice from './pages/MCQPractice';
import WrittenPractice from './pages/WrittenPractice';
import ExamSimulator from './pages/ExamSimulator';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="practice/mcq/:subject" element={
              <ProtectedRoute>
                <MCQPractice />
              </ProtectedRoute>
            } />
            <Route path="practice/written/:subject" element={
              <ProtectedRoute>
                <WrittenPractice />
              </ProtectedRoute>
            } />
            <Route path="practice/exam/:subject" element={
              <ProtectedRoute>
                <ExamSimulator />
              </ProtectedRoute>
            } />
            <Route path="practice/mcq" element={<Navigate to="english" replace />} />
            <Route path="practice/written" element={<Navigate to="english" replace />} />
            <Route path="practice/exam" element={<Navigate to="english" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
