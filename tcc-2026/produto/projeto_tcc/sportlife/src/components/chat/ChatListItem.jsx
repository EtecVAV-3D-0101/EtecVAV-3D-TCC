import { Link } from 'react-router-dom';

export default function ChatListItem({ conversation }) {
  return (
    <Link
      to={`/chat/${conversation.id}`}
      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-secondary border border-border flex-shrink-0 overflow-hidden">
        {conversation.photo ? (
          <img src={conversation.photo} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-sm">
            {(conversation.name || '?')[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground truncate">{conversation.name}</h3>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">{conversation.time || ''}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{conversation.lastMessage || ''}</p>
      </div>
      {conversation.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-primary-foreground">{conversation.unread}</span>
        </div>
      )}
    </Link>
  );
}