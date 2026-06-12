import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { postService, commentService } from '@/services/firebase';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/feed/PostCard';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [p, c] = await Promise.all([
        postService.get(postId),
        commentService.list(postId),
      ]);
      setPost(p);
      setComments(c);
      setLoading(false);
    };
    load();
  }, [postId]);

  const handleComment = async () => {
    if (!newComment.trim() || !user?.uid) return;
    setSending(true);
    const comment = {
      post_id: postId,
      text: newComment.trim(),
      author_name: user?.full_name || 'Usuário',
      author_photo: user?.photo_url || '',
      author_id: user.uid,
    };
    const created = await commentService.create(postId, comment);
    setComments((prev) => [...prev, { ...comment, id: created.id, created_at: new Date() }]);
    setNewComment('');
    setSending(false);
  };

  const getTime = (c) => {
    const d = c.created_at?.toDate ? c.created_at.toDate() : c.created_at ? new Date(c.created_at) : null;
    return d ? formatDistanceToNow(d, { addSuffix: true, locale: ptBR }) : '';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold">Publicação</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <>
            {post && <div className="px-4"><PostCard post={post} currentUser={user} /></div>}
            <div className="px-4 mt-4">
              <h2 className="text-sm font-bold text-foreground mb-3">Comentários ({comments.length})</h2>
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {c.author_photo ? <img src={c.author_photo} alt="" className="w-full h-full object-cover" /> : (c.author_name || '?')[0]}
                    </div>
                    <div className="flex-1 bg-card rounded-2xl px-3 py-2 border border-border">
                      <p className="text-xs font-semibold text-foreground">{c.author_name}</p>
                      <p className="text-xs text-foreground/80 mt-0.5">{c.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{getTime(c)}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">Seja o primeiro a comentar!</p>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card border-t border-border px-4 py-3 flex items-center gap-2">
        <Input placeholder="Adicionar comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleComment()} className="flex-1 bg-secondary border-none rounded-full text-sm" />
        <Button size="icon" onClick={handleComment} disabled={!newComment.trim() || sending} className="rounded-full w-9 h-9">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
