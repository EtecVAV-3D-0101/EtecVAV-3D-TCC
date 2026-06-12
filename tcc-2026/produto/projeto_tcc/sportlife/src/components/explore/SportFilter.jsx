const categories = [
  { key: 'todos', label: 'Todos' },
  { key: 'futebol', label: 'Futebol' },
  { key: 'basquete', label: 'Basquete' },
  { key: 'volei', label: 'Vôlei' },
  { key: 'corrida', label: 'Corrida' },
  { key: 'tenis', label: 'Tênis' },
];

export default function SportFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selected === cat.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}