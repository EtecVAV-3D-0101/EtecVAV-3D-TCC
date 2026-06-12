import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { uploadFile } from '@/services/firebase';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const sportOptions = ['futebol', 'basquete', 'volei', 'corrida', 'tenis', 'ciclismo'];
const sportLabels = { futebol: 'Futebol', basquete: 'Basquete', volei: 'Vôlei', corrida: 'Corrida', tenis: 'Tênis', ciclismo: 'Ciclismo' };

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form, setForm] = useState({
    bio: user?.bio || '',
    city: user?.city || '',
    sports: user?.sports || [],
    photo_url: user?.photo_url || '',
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadFile(file, `avatars/${user.uid}/${Date.now()}_${file.name}`);
      setForm((prev) => ({ ...prev, photo_url: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const toggleSport = (sport) => {
    setForm((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    await updateMe(form);
    setLoading(false);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold">Editar perfil</h1>
        </div>
        <Button size="sm" onClick={handleSave} disabled={loading} className="rounded-full px-4 h-8 text-xs font-bold">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Salvar'}
        </Button>
      </div>

      <div className="px-4 pb-8 space-y-6">
        <div className="flex flex-col items-center pt-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-secondary border-2 border-primary overflow-hidden">
              {form.photo_url ? (
                <img src={form.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {(user?.full_name || '?')[0]}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer">
              {uploadingPhoto ? <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" /> : <Camera className="w-4 h-4 text-primary-foreground" />}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Toque para alterar foto</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Nome</Label>
          <Input value={user?.full_name || ''} disabled className="bg-card border-border rounded-xl opacity-60" />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Cidade</Label>
          <Input placeholder="Ex: São Paulo" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-card border-border rounded-xl" />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">Bio</Label>
          <Textarea placeholder="Fale um pouco sobre você..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-card border-border rounded-xl min-h-[80px]" />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-3 block">Esportes favoritos</Label>
          <div className="flex flex-wrap gap-2">
            {sportOptions.map((s) => (
              <button
                key={s}
                onClick={() => toggleSport(s)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  form.sports.includes(s) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {sportLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
