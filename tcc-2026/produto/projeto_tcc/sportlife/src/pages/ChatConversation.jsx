import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/firebase';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatConversation() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const otherUid = conversationId?.split('___').find((id) => id !== user?.uid) || '';

  const fetchMessages = async () => {
    if (!conversationId) return;
    const msgs = await chatService.getMessages(conversationId, 100);
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.uid) return;
    setSending(true);
    const msg = {
      sender_id: user.uid,
      sender_name: user.full_name || user.email,
      sender_photo: user.photo_url || '',
      receiver_id: otherUid,
      receiver_name: otherUid,
      receiver_photo: '',
      message: newMessage.trim(),
      conversation_id: conversationId,
    };
    const optimistic = { ...msg, id: Date.now().toString(), created_at: new Date() };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage('');
    await chatService.sendMessage(conversationId, msg);
    setSending(false);
  };

  const getTime = (msg) => {
    const d = msg.created_at?.toDate ? msg.created_at.toDate() : msg.created_at ? new Date(msg.created_at) : null;
    return d ? formatDistanceToNow(d, { addSuffix: true, locale: ptBR }) : '';
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border sticky top-0 z-40">
        <button onClick={() => navigate('/chat')} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-sm text-muted-foreground">
          {otherUid[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{otherUid}</p>
          <p className="text-[10px] text-primary">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhuma mensagem ainda</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Comece a conversa! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card border border-border text-foreground rounded-bl-md'}`}>
                  <p>{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{getTime(msg)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3 flex items-center gap-2">
        <Input placeholder="Digite uma mensagem..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} className="flex-1 bg-secondary border-none rounded-full text-sm" />
        <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || sending} className="rounded-full w-9 h-9 flex-shrink-0">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
