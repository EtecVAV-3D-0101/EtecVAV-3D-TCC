import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { likeService } from '@/services/firebase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const sportLabels = {
  futebol: 'Futebol', basquete: 'Basquete', volei: 'Vôlei',
  corrida: 'Corrida', tenis: 'Tênis', ciclismo: 'Ciclismo', outro: 'Outro',
};

export default function PostCard({ post, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  useEffect(() => {
    if (currentUser?.uid) {
      likeService.hasLiked(post.id, currentUser.uid).then(setLiked);
    }
  }, [post.id, currentUser?.uid]);

  const handleLike = async () => {
    if (!currentUser?.uid) return;
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      await likeService.unlike(post.id, currentUser.uid);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      await likeService.like(post.id, currentUser.uid);
    }
  };

  const timeAgo = post.created_at?.toDate
    ? formatDistanceToNow(post.created_at.toDate(), { addSuffix: false, locale: ptBR })
    : post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: false, locale: ptBR })
    : '';

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border">
            {post.author_photo ? (
              <img src={post.author_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                {(post.author_name || '?')[0]}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{post.author_name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">
              {timeAgo}{post.sport ? ` · ${sportLabels[post.sport] || post.sport}` : ''}
            </p>
          </div>
        </div>
        <button className="text-muted-foreground"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      {post.text && <p className="px-4 pb-3 text-sm text-foreground/90 leading-relaxed">{post.text}</p>}

      {post.image_url && (
        <div className="w-full aspect-video bg-secondary">
          <img src={post.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-5">
          <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors">
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">{likesCount}</span>
          </button>
          <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">{post.comments_count || 0}</span>
          </Link>
          <button className="text-muted-foreground"><Share2 className="w-5 h-5" /></button>
        </div>
        <button className="text-muted-foreground"><Bookmark className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
