import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { matchService } from '@/services/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const sports = [
  { key: 'futebol', emoji: '⚽', label: 'Futebol' },
  { key: 'basquete', emoji: '🏀', label: 'Basquete' },
  { key: 'volei', emoji: '🏐', label: 'Vôlei' },
  { key: 'corrida', emoji: '🏃', label: 'Corrida' },
  { key: 'tenis', emoji: '🎾', label: 'Tênis' },
  { key: 'ciclismo', emoji: '🚴', label: 'Ciclismo' },
  { key: 'futsal', emoji: '⚽', label: 'Futsal' },
  { key: 'handebol', emoji: '🤾', label: 'Handebol' },
  { key: 'outro', emoji: '🏅', label: 'Outro' },
];

export default function CreateMatch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  const [form, setForm] = useState({
    date: '',
    time: '19:00',
    location: '',
    total_slots: 10,
    description: '',
    match_type: 'amistoso',
  });

  const handleCreate = async () => {
    if (!selectedSport || !form.date || !form.location || !user?.uid) return;
    setLoading(true);
    await matchService.create({
      sport: selectedSport,
      ...form,
      organizer_name: user?.full_name || 'Usuário',
      organizer_photo: user?.photo_url || '',
    }, user.uid);
    setLoading(false);
    navigate('/explore');
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold">Criar partida</h1>
      </div>

      <div className="px-4 pb-8 space-y-6">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-3 block">Escolha o esporte</Label>
          <div className="grid grid-cols-3 gap-2">
            {sports.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelectedSport(s.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                  selectedSport === s.key ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Tipo de partida</Label>
          <Select value={form.match_type} onValueChange={(v) => setForm({ ...form, match_type: v })}>
            <SelectTrigger className="bg-card border-border rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="amistoso">Amistoso</SelectItem>
              <SelectItem value="competitivo">Competitivo</SelectItem>
              <SelectItem value="treino">Treino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">Data</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-card border-border rounded-xl" />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">Hora</Label>
            <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-card border-border rounded-xl" />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Local</Label>
          <Input placeholder="Ex: Quadra Central" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-card border-border rounded-xl" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold text-foreground">Vagas</Label>
            <span className="text-sm font-bold text-primary">{form.total_slots} vagas</span>
          </div>
          <Slider value={[form.total_slots]} onValueChange={([v]) => setForm({ ...form, total_slots: v })} min={2} max={50} step={1} className="[&_[role=slider]]:bg-primary" />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Descrição</Label>
          <Textarea placeholder="Detalhes sobre a partida..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-card border-border rounded-xl min-h-[80px]" />
        </div>

        <Button onClick={handleCreate} disabled={loading || !selectedSport || !form.date || !form.location} className="w-full rounded-xl h-12 text-sm font-bold">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Criar Partida
        </Button>
      </div>
    </div>
  );
}
