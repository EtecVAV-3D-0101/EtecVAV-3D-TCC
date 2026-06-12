import { MapPin, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

export default function TournamentCard({ tournament }) {
  const dateStr = tournament.start_date
    ? format(new Date(tournament.start_date), "dd 'de' MMMM", { locale: ptBR })
    : '';
  const endStr = tournament.end_date
    ? format(new Date(tournament.end_date), "dd 'de' MMMM", { locale: ptBR })
    : '';

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {tournament.image_url && (
        <div className="w-full h-36 bg-secondary">
          <img src={tournament.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-base font-bold text-foreground">{tournament.name}</h3>
        <p className="text-xs text-primary font-medium capitalize mt-0.5">
          {tournament.sport?.replace(/_/g, ' ')}
        </p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{dateStr}{endStr ? ` a ${endStr}` : ''}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{tournament.location}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{tournament.total_teams} equipes</span>
        </div>
        <Button className="w-full mt-3 rounded-xl h-9 text-xs font-semibold">
          Ver detalhes
        </Button>
      </div>
    </div>
  );
}