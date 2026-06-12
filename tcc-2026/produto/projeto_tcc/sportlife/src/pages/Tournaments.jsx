import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tournamentService } from '@/services/firebase';
import { Loader2 } from 'lucide-react';
import TournamentCard from '@/components/explore/TournamentCard';

const tabs = [
  { key: 'descobrir', label: 'Descobrir' },
  { key: 'inscricoes', label: 'Inscrições' },
  { key: 'meus', label: 'Meus torneios' },
];

export default function Tournaments() {
  const [activeTab, setActiveTab] = useState('descobrir');

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => tournamentService.list(30),
  });

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-3">Torneios</h1>
        <div className="flex gap-2">
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
      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : tournaments.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">Nenhum torneio disponível</p>
        ) : (
          tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)
        )}
      </div>
    </div>
  );
}
