import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { postService, matchService } from '@/services/firebase';
import { LogOut, Loader2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostCard from '@/components/feed/PostCard';
import MatchCard from '@/components/explore/MatchCard';

const tabs = [
  { key: 'posts', label: 'Posts' },
  { key: 'partidas', label: 'Partidas' },
  { key: 'torneios', label: 'Torneios' },
];
const sportBadges = ['Futebol', 'Basquete', 'Vôlei', 'Corrida'];

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['user-posts', user?.uid],
    queryFn: () => user?.uid ? postService.listByUser(user.uid, 20) : [],
    enabled: !!user?.uid,
  });

  const { data: matches = [], isLoading: loadingMatches } = useQuery({
    queryKey: ['user-matches', user?.uid],
    queryFn: () => user?.uid ? matchService.listByUser(user.uid, 20) : [],
    enabled: !!user?.uid,
  });

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Perfil</h1>
        <div className="flex items-center gap-2">
          <Link to="/edit-profile" className="text-muted-foreground"><Edit className="w-5 h-5" /></Link>
          <button onClick={logout} className="text-muted-foreground"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-secondary border-2 border-primary overflow-hidden mb-3">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {(user?.full_name || '?')[0]}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground">{user?.full_name || 'Usuário'}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">@{user?.email?.split('@')[0] || 'user'}</p>
          {user?.bio && <p className="text-xs text-muted-foreground text-center mt-2 max-w-[250px]">{user.bio}</p>}
        </div>

        <div className="flex justify-center gap-8 mt-5">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{posts.length}</p>
            <p className="text-[10px] text-muted-foreground">Postagens</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{user?.followers_count || 0}</p>
            <p className="text-[10px] text-muted-foreground">Seguidores</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{user?.following_count || 0}</p>
            <p className="text-[10px] text-muted-foreground">Seguindo</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {(user?.sports?.length ? user.sports : sportBadges).map((s, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium">{s}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-xs font-semibold text-center transition-all border-b-2 ${
                activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {activeTab === 'posts' && (
          loadingPosts ? <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          : posts.length === 0 ? <p className="text-center text-muted-foreground text-sm py-8">Nenhuma postagem</p>
          : posts.map((post) => <PostCard key={post.id} post={post} currentUser={user} />)
        )}
        {activeTab === 'partidas' && (
          loadingMatches ? <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          : matches.length === 0 ? <p className="text-center text-muted-foreground text-sm py-8">Nenhuma partida</p>
          : matches.map((m) => <MatchCard key={m.id} match={m} />)
        )}
        {activeTab === 'torneios' && (
          <p className="text-center text-muted-foreground text-sm py-8">Nenhum torneio</p>
        )}
      </div>
    </div>
  );
}
