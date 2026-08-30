import React from 'react';

function PostCard({ post }) {
  // პოსტის ტიპის მიხედვით ფერების მინიჭება
  const typeStyles = {
    broadcast: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    intel: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    challenge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/30 p-4 rounded-xl transition-all duration-300 font-mono shadow-md mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={post.avatar_url || "https://via.placeholder.com/150"} 
            alt={post.username} 
            className="w-10 h-10 rounded-md border border-cyan-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-bold text-sm hover:text-cyan-400 cursor-pointer">
                {post.username}
              </span>
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                LVL {post.level}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Badge Type */}
        <span className={`text-[10px] border px-2 py-0.5 rounded uppercase tracking-wider ${typeStyles[post.type] || typeStyles.broadcast}`}>
          #{post.type}
        </span>
      </div>

      {/* Post Content */}
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-slate-800 focus:outline-none mb-4">
        {post.text}
      </p>

      {/* Post Actions (Reactions / Comments Area Placeholder) */}
      <div className="flex items-center gap-4 text-xs border-t border-slate-900 pt-3">
        <button className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
          💚 <span>{post.likes_count || 0}</span>
        </button>
        <button className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
          💬 <span>{post.comments_count || 0} Comments</span>
        </button>
      </div>
    </div>
  );
}

export default PostCard;