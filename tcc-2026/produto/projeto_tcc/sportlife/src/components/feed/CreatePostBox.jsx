import { useState } from 'react';
import { Image, Send, X, Loader2 } from 'lucide-react';
import { postService, uploadFile } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sports = [
  { key: 'futebol', label: '⚽ Futebol' },
  { key: 'basquete', label: '🏀 Basquete' },
  { key: 'volei', label: '🏐 Vôlei' },
  { key: 'corrida', label: '🏃 Corrida' },
  { key: 'tenis', label: '🎾 Tênis' },
  { key: 'ciclismo', label: '🚴 Ciclismo' },
  { key: 'outro', label: '🏅 Outro' },
];

export default function CreatePostBox({ user, onPostCreated }) {
  const [text, setText] = useState('');
  const [sport, setSport] = useState('outro');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await uploadFile(file, `posts/${user?.uid}/${Date.now()}_${file.name}`);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() || !user?.uid) return;
    setLoading(true);
    await postService.create({
      text,
      sport,
      image_url: imageUrl,
      author_name: user?.full_name || 'Usuário',
      author_photo: user?.photo_url || '',
    }, user.uid);
    setText('');
    setImageUrl('');
    setSport('outro');
    setLoading(false);
    onPostCreated?.();
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 mx-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex-shrink-0 overflow-hidden">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
              {(user?.full_name || '?')[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que você está pensando?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[40px]"
            rows={2}
          />
          {imageUrl && (
            <div className="relative mt-2 rounded-xl overflow-hidden">
              <img src={imageUrl} alt="" className="w-full max-h-48 object-cover" />
              <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                {uploadingImg ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Image className="w-5 h-5" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className="h-7 text-xs border-none bg-secondary rounded-full px-2 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((s) => (
                    <SelectItem key={s.key} value={s.key} className="text-xs">{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={!text.trim() || loading} className="rounded-full px-4 h-8 text-xs font-semibold">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1" />Publicar</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
