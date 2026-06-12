import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchService, tournamentService } from '@/services/firebase';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SportFilter from '@/components/explore/SportFilter';
import MatchCard from '@/components/explore/MatchCard';
import TournamentCard from '@/components/explore/TournamentCard';

export default function Explore() {
  const [selectedSport, setSelectedSport] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tournaments = [], isLoading: loadingT } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => tournamentService.list(20),
  });

  const { data: matches = [], isLoading: loadingM } = useQuery({
    queryKey: ['matches'],
    queryFn: () => matchService.list(20),
  });

  const filterBySport = (items) =>
    selectedSport === 'todos' ? items : items.filter((i) => i.sport === selectedSport);

  const filteredTournaments = filterBySport(tournaments).filter(
    (t) => !searchQuery || t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMatches = filterBySport(matches).filter(
    (m) => !searchQuery || m.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-3">Explorar</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar partidas, torneios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-none rounded-xl h-10 text-sm" />
        </div>
      </div>

      <SportFilter selected={selectedSport} onSelect={setSelectedSport} />

      {loadingT || loadingM ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="px-4 space-y-6 pb-4">
          {filteredTournaments.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold">Eventos em destaque</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
                {filteredTournaments.map((t) => (
                  <div key={t.id} className="w-[260px] flex-shrink-0"><TournamentCard tournament={t} /></div>
                ))}
              </div>
            </section>
          )}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold">Partidas próximas</h2>
            </div>
            <div className="space-y-3">
              {filteredMatches.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">Nenhuma partida encontrada</p>
              ) : (
                filteredMatches.map((m) => <MatchCard key={m.id} match={m} />)
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
