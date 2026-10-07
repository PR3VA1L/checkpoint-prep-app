import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ParentLayout from './components/ParentLayout';
import ParentDashboard from './pages/ParentDashboard';
import Dashboard from './pages/Dashboard';
import MCQPractice from './pages/MCQPractice';
import WrittenPractice from './pages/WrittenPractice';
import ExamSimulator from './pages/ExamSimulator';
import Auth from './pages/Auth';
import History from './pages/History';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'student' | 'parent' }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  if (!user) return <Navigate to="/auth" />;
  
  if (allowedRole && profile) {
    if (allowedRole === 'student' && profile.role === 'parent') {
      return <Navigate to="/parent/dashboard" replace />;
    }
    if (allowedRole === 'parent' && profile.role === 'student') {
      return <Navigate to="/" replace />;
    }
  }
  
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
              <ProtectedRoute allowedRole="student">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="history" element={
              <ProtectedRoute allowedRole="student">
                <History />
              </ProtectedRoute>
            } />
            <Route path="practice/mcq/:subject" element={
              <ProtectedRoute allowedRole="student">
                <MCQPractice />
              </ProtectedRoute>
            } />
            <Route path="practice/written/:subject" element={
              <ProtectedRoute allowedRole="student">
                <WrittenPractice />
              </ProtectedRoute>
            } />
            <Route path="practice/exam/:subject" element={
              <ProtectedRoute allowedRole="student">
                <ExamSimulator />
              </ProtectedRoute>
            } />
            <Route path="practice/mcq" element={<Navigate to="english" replace />} />
            <Route path="practice/written" element={<Navigate to="english" replace />} />
            <Route path="practice/exam" element={<Navigate to="english" replace />} />
          </Route>

          <Route path="/parent" element={<ParentLayout />}>
            <Route path="dashboard" element={
              <ProtectedRoute allowedRole="parent">
                <ParentDashboard />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
