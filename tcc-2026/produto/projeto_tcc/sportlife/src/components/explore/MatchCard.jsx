import { MapPin, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const sportEmojis = {
  futebol: '⚽', basquete: '🏀', volei: '🏐', corrida: '🏃',
  tenis: '🎾', ciclismo: '🚴', futsal: '⚽', handebol: '🤾', outro: '🏅'
};

export default function MatchCard({ match }) {
  const dateStr = match.date
    ? format(new Date(match.date), 'dd/MM', { locale: ptBR })
    : '';

  return (
    <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
        {sportEmojis[match.sport] || '🏅'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground capitalize">
          {match.sport?.replace(/_/g, ' ')} {match.total_slots ? `${match.total_slots}` : ''}
        </h3>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">{match.location}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{dateStr} · {match.time || ''}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{match.filled_slots || 0}/{match.total_slots}</span>
        </div>
        <span className={`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${
          match.status === 'aberta' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
        }`}>
          {match.status === 'aberta' ? 'Aberta' : 'Fechada'}
        </span>
      </div>
    </div>
  );
}