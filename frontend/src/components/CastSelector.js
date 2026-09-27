'use client';

export default function CastSelector({
  users,
  selectedUser,
  onSelectUser,
  onOpenAudit,
  onResetDemo,
  isResetting,
}) {
  const getRoleBadge = (u) => {
    if (u.role === 'DRIVER') {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Driver • Bullet (3 seats)
        </span>
      );
    }
    return (
      <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
        Passenger
      </span>
    );
  };

  const getStorySubtitle = (name) => {
    switch (name) {
      case 'Jashim':
        return 'Leaning against Bullet at Banani Road 11';
      case 'Nusrat':
        return 'Late for work, heading to Mohakhali';
      case 'Rafiq':
        return 'Booking 2 mins later to Gulshan 1';
      case 'Shirin':
        return 'Grabbing the 3rd & last seat';
      default:
        return '';
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* App Title */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Dhaka <span className="text-amber-400">Tesla</span> Pool
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Share a seat. Split the fare. Survive Dhaka traffic.
          </p>
        </div>

        {/* Story Cast Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Simulate Actor:
          </span>
          {users.map((u) => {
            const isSelected = selectedUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                className={`flex flex-col text-left px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? u.role === 'DRIVER'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold text-sm">{u.name}</span>
                  {getRoleBadge(u)}
                </div>
                <span className="text-[11px] text-slate-400">
                  {getStorySubtitle(u.name)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAudit}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            📋 Audit Log
          </button>
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold border border-red-800/60 transition disabled:opacity-50"
          >
            {isResetting ? 'Resetting...' : '🔄 Reset Demo'}
          </button>
        </div>
      </div>
    </header>
  );
}
