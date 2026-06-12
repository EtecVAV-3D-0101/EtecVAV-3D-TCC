import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// App pages
import Feed from '@/pages/Feed';
import Explore from '@/pages/Explore';
import CreateMatch from '@/pages/CreateMatch';
import Chat from '@/pages/Chat';
import ChatConversation from '@/pages/ChatConversation';
import NewChat from '@/pages/NewChat';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import Tournaments from '@/pages/Tournaments';
import PostDetail from '@/pages/PostDetail';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Feed />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/create-match" element={<CreateMatch />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:conversationId" element={<ChatConversation />} />
                <Route path="/new-chat" element={<NewChat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/post/:postId" element={<PostDetail />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
