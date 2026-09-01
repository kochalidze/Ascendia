import React from 'react';

function Leaderboard({ topUsers }) {
  return (
    <div className="w-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md p-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
        <h3 className="text-cyan-400 font-mono tracking-wider font-bold text-lg uppercase">
          ⚡ CITY RANKINGS
        </h3>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
          TOP LEVEL
        </span>
      </div>

      <div className="space-y-3">
        {topUsers?.map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-2 rounded-lg font-mono border ${
              index === 0 
                ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                : index === 1 
                ? 'bg-slate-400/10 border-slate-400/20'
                : 'bg-slate-900/50 border-cyan-500/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Rank Number */}
              <span className={`w-6 text-center font-bold ${
                index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-400' : 'text-slate-500'
              }`}>
                #{index + 1}
              </span>

              {/* Avatar */}
              <div className="relative">
                <img 
                  src={user.avatar_url || "https://via.placeholder.com/150"} 
                  alt={user.username} 
                  className={`w-9 h-9 rounded-md border ${
                    index === 0 ? 'border-amber-400' : 'border-cyan-500/30'
                  }`}
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-950 border border-cyan-400 text-[10px] text-cyan-400 px-1 rounded">
                  L{user.level}
                </span>
              </div>

              {/* Username */}
              <span className="text-slate-200 font-medium truncate">
                {user.username}
              </span>
            </div>

            {/* XP Info */}
            <div className="text-right">
              <span className="text-xs text-cyan-400 block">{user.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;