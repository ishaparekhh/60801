import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameCatalog } from '@/data/gameCatalog.js';
import { getStoredStats, resetStats } from '../utils/gameStats';

// ─── Extra games not yet in gameCatalog (hardcoded in Header) ────────────────
const EXTRA_GAMES = [
  { id: 'decode',       title: 'Decode',       route: '/decode' },
  { id: 'matcho',       title: 'Matcho',       route: '/matcho' },
  { id: 'catcher',      title: 'Catcher',      route: '/catcher' },
  { id: 'blanko',       title: 'Blanko',       route: '/blanko' },
  { id: 'slido',        title: 'Slido',        route: '/slido' },
  { id: 'tetro',        title: 'Tetro',        route: '/tetro' },
];

const ALL_GAMES = [...EXTRA_GAMES, ...gameCatalog];

function winRateColour(rate) {
  if (rate >= 70) return '#22c55e';  // green
  if (rate >= 40) return '#f59e0b';  // amber
  return '#ef4444';                  // red
}

export default function Leaderboard() {
  const [stats, setStats]       = useState({});
  const [sortKey, setSortKey]   = useState('title');
  const [sortAsc, setSortAsc]   = useState(true);
  const [filter, setFilter]     = useState('all'); // 'all' | 'played'

  function load() { setStats(getStoredStats()); }

  useEffect(() => { load(); }, []);

  function handleReset() {
    if (window.confirm('Reset ALL game stats? This cannot be undone.')) {
      resetStats();
      load();
    }
  }

  function toggleSort(key) {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  // Build rows
  const rows = ALL_GAMES.map((game) => {
    const s      = stats[game.id] || {};
    const plays  = s.plays  || 0;
    const wins   = s.wins   || 0;
    const losses = s.losses || 0;
    const draws  = s.draws  || 0;
    const winRate = plays > 0 ? Math.round((wins / plays) * 100) : null;
    return { ...game, plays, wins, losses, draws, winRate,
             bestScore: s.bestScore ?? null, bestTime: s.bestTimeSeconds ?? null };
  });

  const visible = (filter === 'played' ? rows.filter((r) => r.plays > 0) : rows)
    .sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      // null-safe: push nulls to bottom
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ?  1 : -1;
      return 0;
    });

  const totalPlays = rows.reduce((s, r) => s + r.plays, 0);
  const totalWins  = rows.reduce((s, r) => s + r.wins, 0);
  const overallRate = totalPlays > 0 ? Math.round((totalWins / totalPlays) * 100) : 0;
  const gamesPlayed = rows.filter((r) => r.plays > 0).length;

  function SortArrow({ col }) {
    if (sortKey !== col) return <span className="lb-arrow lb-arrow--inactive">↕</span>;
    return <span className="lb-arrow">{sortAsc ? '↑' : '↓'}</span>;
  }

  return (
    <div className="lb-page">

      {/* ── Hero ── */}
      <div className="lb-hero">
        <h1 className="lb-title">🏆 Leaderboard</h1>
        <p className="lb-subtitle">Your personal stats across all games</p>

        {/* Summary cards */}
        <div className="lb-summary">
          <div className="lb-card">
            <span className="lb-card-value">{gamesPlayed}</span>
            <span className="lb-card-label">Games played</span>
          </div>
          <div className="lb-card">
            <span className="lb-card-value">{totalPlays}</span>
            <span className="lb-card-label">Total rounds</span>
          </div>
          <div className="lb-card">
            <span className="lb-card-value">{totalWins}</span>
            <span className="lb-card-label">Total wins</span>
          </div>
          <div className="lb-card lb-card--highlight">
            <span className="lb-card-value">{overallRate}%</span>
            <span className="lb-card-label">Overall win rate</span>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="lb-controls-row">
        <div className="lb-filter-tabs">
          <button
            className={`lb-tab ${filter === 'all' ? 'lb-tab--active' : ''}`}
            onClick={() => setFilter('all')}
          >All games</button>
          <button
            className={`lb-tab ${filter === 'played' ? 'lb-tab--active' : ''}`}
            onClick={() => setFilter('played')}
          >Played only</button>
        </div>
        <button className="lb-reset-btn" onClick={handleReset}>
          🗑 Reset all stats
        </button>
      </div>

      {/* ── Table ── */}
      <div className="lb-table-wrap">
        <table className="lb-table">
          <thead>
            <tr>
              <th className="lb-th lb-th--name" onClick={() => toggleSort('title')}>
                Game <SortArrow col="title" />
              </th>
              <th className="lb-th" onClick={() => toggleSort('plays')}>
                Played <SortArrow col="plays" />
              </th>
              <th className="lb-th" onClick={() => toggleSort('wins')}>
                Wins <SortArrow col="wins" />
              </th>
              <th className="lb-th" onClick={() => toggleSort('losses')}>
                Losses <SortArrow col="losses" />
              </th>
              <th className="lb-th" onClick={() => toggleSort('draws')}>
                Draws <SortArrow col="draws" />
              </th>
              <th className="lb-th lb-th--rate" onClick={() => toggleSort('winRate')}>
                Win rate <SortArrow col="winRate" />
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="lb-empty">
                  No games played yet — go play something! 🎮
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const rate   = row.winRate;
              const colour = rate !== null ? winRateColour(rate) : '#94a3b8';
              const played = row.plays > 0;
              return (
                <tr key={row.id} className={`lb-row ${played ? '' : 'lb-row--unplayed'}`}>

                  {/* Game name — clickable */}
                  <td className="lb-td lb-td--name">
                    <Link to={row.route} className="lb-game-link">
                      {row.title}
                    </Link>
                    {!played && <span className="lb-badge">New</span>}
                  </td>

                  <td className="lb-td lb-td--num">{row.plays || '—'}</td>
                  <td className="lb-td lb-td--num lb-td--win">{played ? row.wins : '—'}</td>
                  <td className="lb-td lb-td--num lb-td--loss">{played ? row.losses : '—'}</td>
                  <td className="lb-td lb-td--num">{played ? row.draws : '—'}</td>

                  {/* Win-rate bar */}
                  <td className="lb-td lb-td--rate">
                    {played ? (
                      <div className="lb-bar-wrap">
                        <div
                          className="lb-bar"
                          style={{ width: `${rate}%`, background: colour }}
                        />
                        <span className="lb-bar-label" style={{ color: colour }}>
                          {rate}%
                        </span>
                      </div>
                    ) : (
                      <span className="lb-no-data">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
