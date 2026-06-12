import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/firebase';
import { Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatListItem from '@/components/chat/ChatListItem';

const tabs = [
  { key: 'todas', label: 'Todas' },
  { key: 'nao_lidas', label: 'Não lidas' },
  { key: 'grupos', label: 'Grupos' },
];

export default function Chat() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('todas');

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.uid],
    queryFn: () => user?.uid ? chatService.getConversations(user.uid) : [],
    enabled: !!user?.uid,
    refetchInterval: 5000,
  });

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">Chat</h1>
          <Link to="/new-chat" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </Link>
        </div>
        <div className="flex gap-2 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-2">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Nenhuma conversa ainda</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Comece uma conversa com outros atletas!</p>
          </div>
        ) : (
          conversations.map((conv) => <ChatListItem key={conv.id} conversation={conv} />)
        )}
      </div>
    </div>
  );
}
