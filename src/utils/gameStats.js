const STORAGE_KEY = 'exam-practice-game-stats';

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Could not read game stats from localStorage:', error);
    return {};
  }
}

export function saveStoredStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function resetStats() {
  localStorage.removeItem(STORAGE_KEY);
}

export function recordGameResult(gameId, result) {
  const currentStats = getStoredStats();
  const previous = currentStats[gameId] || {
    plays: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    bestScore: null,
    bestTimeSeconds: null,
  };

  const next = {
    ...previous,
    plays: previous.plays + 1,
    wins: previous.wins + (result.outcome === 'win' ? 1 : 0),
    losses: previous.losses + (result.outcome === 'loss' ? 1 : 0),
    draws: previous.draws + (result.outcome === 'draw' ? 1 : 0),
  };

  if (typeof result.score === 'number') {
    next.bestScore = previous.bestScore === null ? result.score : Math.max(previous.bestScore, result.score);
  }

  if (typeof result.timeSeconds === 'number') {
    next.bestTimeSeconds =
      previous.bestTimeSeconds === null
        ? result.timeSeconds
        : Math.min(previous.bestTimeSeconds, result.timeSeconds);
  }

  const updatedStats = {
    ...currentStats,
    [gameId]: next,
  };

  saveStoredStats(updatedStats);
  return updatedStats;
}

export function getLeaderboardRows(gameCatalog, stats) {
  return gameCatalog.map((game) => {
    const gameStats = stats[game.id] || {};
    const plays = gameStats.plays || 0;
    const wins = gameStats.wins || 0;
    const losses = gameStats.losses || 0;
    const draws = gameStats.draws || 0;
    const winRate = plays > 0 ? Math.round((wins / plays) * 100) : 0;

    return {
      id: game.id,
      title: game.title,
      route: game.route,
      winMetric: game.winMetric,
      plays,
      wins,
      losses,
      draws,
      winRate,
      bestScore: gameStats.bestScore ?? '-',
      bestTimeSeconds: gameStats.bestTimeSeconds ?? '-',
    };
  });
}
