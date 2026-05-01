import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { gameCatalog } from '../data/gameCatalog.js';
import { sampleGameStats } from '../data/sampleGameStats.js';
import { getLeaderboardRows, getStoredStats, resetStats, saveStoredStats } from '../utils/gameStats.js';

function LeaderboardPage() {
  const [stats, setStats] = useState(() => {
    const storedStats = getStoredStats();
    return Object.keys(storedStats).length > 0 ? storedStats : sampleGameStats;
  });

  const [sortBy, setSortBy] = useState('winRate');

  const rows = useMemo(() => {
    const unsortedRows = getLeaderboardRows(gameCatalog, stats);
    return [...unsortedRows].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b[sortBy] - a[sortBy];
    });
  }, [stats, sortBy]);

  const totals = rows.reduce(
    (acc, row) => ({
      plays: acc.plays + row.plays,
      wins: acc.wins + row.wins,
      losses: acc.losses + row.losses,
      draws: acc.draws + row.draws,
    }),
    { plays: 0, wins: 0, losses: 0, draws: 0 }
  );

  const overallWinRate = totals.plays > 0 ? Math.round((totals.wins / totals.plays) * 100) : 0;

  function loadSampleData() {
    saveStoredStats(sampleGameStats);
    setStats(sampleGameStats);
  }

  function clearData() {
    resetStats();
    setStats({});
  }

  return (
    <main className="page">
      <Link to="/">← Back to games</Link>
      <h1>Leaderboard</h1>
      <p>
        This page compares performance across every game using plays, wins, losses, draws, win rate, best score, and
        fastest completion time.
      </p>

      <section className="stats-grid" aria-label="Overall statistics">
        <article className="stat-card">
          <strong>{totals.plays}</strong>
          <span>Total plays</span>
        </article>
        <article className="stat-card">
          <strong>{totals.wins}</strong>
          <span>Total wins</span>
        </article>
        <article className="stat-card">
          <strong>{totals.losses}</strong>
          <span>Total losses</span>
        </article>
        <article className="stat-card">
          <strong>{overallWinRate}%</strong>
          <span>Overall win rate</span>
        </article>
      </section>

      <section className="card">
        <div className="toolbar">
          <label>
            Sort by:{' '}
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="winRate">Win rate</option>
              <option value="wins">Wins</option>
              <option value="plays">Plays</option>
              <option value="title">Game name</option>
            </select>
          </label>
          <div className="button-row">
            <button onClick={loadSampleData}>Load sample data</button>
            <button onClick={clearData}>Clear data</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Plays</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Draws</th>
                <th>Win rate</th>
                <th>Best score</th>
                <th>Fastest time</th>
                <th>Metric</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to={row.route}>{row.title}</Link>
                  </td>
                  <td>{row.plays}</td>
                  <td>{row.wins}</td>
                  <td>{row.losses}</td>
                  <td>{row.draws}</td>
                  <td>{row.winRate}%</td>
                  <td>{row.bestScore}</td>
                  <td>{row.bestTimeSeconds === '-' ? '-' : `${row.bestTimeSeconds}s`}</td>
                  <td>{row.winMetric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default LeaderboardPage;
