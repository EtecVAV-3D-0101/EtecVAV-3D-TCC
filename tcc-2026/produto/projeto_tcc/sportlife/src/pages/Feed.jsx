import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/services/firebase';
import SportStories from '@/components/feed/SportStories';
import CreatePostBox from '@/components/feed/CreatePostBox';
import PostCard from '@/components/feed/PostCard';
import { Loader2 } from 'lucide-react';

export default function Feed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSport, setSelectedSport] = useState(null);
  const [tab, setTab] = useState('para_voce');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.list(50),
  });

  const filteredPosts = selectedSport ? posts.filter((p) => p.sport === selectedSport) : posts;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">
          Sport<span className="text-primary">Life</span>
        </h1>
      </div>

      <SportStories selectedSport={selectedSport} onSelectSport={setSelectedSport} />

      <div className="flex gap-2 px-4 mb-4">
        {['para_voce', 'seguindo'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            {t === 'para_voce' ? 'Para você' : 'Seguindo'}
          </button>
        ))}
      </div>

      <CreatePostBox user={user} onPostCreated={() => queryClient.invalidateQueries({ queryKey: ['posts'] })} />

      <div className="space-y-4 p-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhuma postagem ainda</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Seja o primeiro a publicar!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={user} />
          ))
        )}
      </div>
    </div>
  );
}
