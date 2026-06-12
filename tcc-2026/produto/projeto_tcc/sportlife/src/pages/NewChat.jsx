import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, userService } from '@/services/firebase';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

export default function NewChat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => userService.list(50),
  });

  const filteredUsers = users.filter(
    (u) =>
      u.uid !== user?.uid &&
      (u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const openConversation = (otherUser) => {
    const conversationId = chatService.conversationId(user.uid, otherUser.uid);
    navigate(`/chat/${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/chat')} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold">Nova conversa</h1>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar usuário..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-none rounded-xl" />
        </div>
      </div>

      <div className="px-2">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Nenhum usuário encontrado</p>
        ) : (
          filteredUsers.map((u) => (
            <button key={u.uid || u.id} onClick={() => openConversation(u)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 transition-colors text-left">
              <div className="w-12 h-12 rounded-full bg-secondary border border-border flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-muted-foreground">
                {u.photo_url ? <img src={u.photo_url} alt="" className="w-full h-full object-cover" /> : (u.full_name || u.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{u.full_name || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
