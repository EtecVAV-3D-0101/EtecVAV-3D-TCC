import { useState } from 'react';

const sports = [
  { emoji: '⚽', name: 'Futebol', key: 'futebol', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&h=100&fit=crop' },
  { emoji: '🏀', name: 'Basquete', key: 'basquete', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop' },
  { emoji: '🏐', name: 'Vôlei', key: 'volei', img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=100&h=100&fit=crop' },
  { emoji: '🏃', name: 'Corrida', key: 'corrida', img: 'https://images.unsplash.com/photo-1461896836934-bd45ba74b912?w=100&h=100&fit=crop' },
  { emoji: '🎾', name: 'Tênis', key: 'tenis', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100&h=100&fit=crop' },
  { emoji: '🚴', name: 'Ciclismo', key: 'ciclismo', img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=100&h=100&fit=crop' },
];

export default function SportStories({ selectedSport, onSelectSport }) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 no-scrollbar">
      <button
        onClick={() => onSelectSport(null)}
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
          !selectedSport ? 'border-primary bg-primary/20' : 'border-border bg-secondary'
        }`}>
          <span className="text-xl">➕</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">Seu story</span>
      </button>
      {sports.map((sport) => (
        <button
          key={sport.key}
          onClick={() => onSelectSport(sport.key === selectedSport ? null : sport.key)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
            selectedSport === sport.key ? 'border-primary' : 'border-border'
          }`}>
            <img
              src={sport.img}
              alt={sport.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{sport.name}</span>
        </button>
      ))}
    </div>
  );
}