import { Link } from 'react-router-dom';
import { recordGameResult } from '../utils/gameStats.js';

function GamePlaceholder({ game }) {
  function addFakeWin() {
    recordGameResult(game.id, {
      outcome: 'win',
      score: Math.floor(Math.random() * 100),
      timeSeconds: Math.floor(Math.random() * 120) + 10,
    });
    alert(`Sample win recorded for ${game.title}. Check the leaderboard.`);
  }

  function addFakeLoss() {
    recordGameResult(game.id, { outcome: 'loss' });
    alert(`Sample loss recorded for ${game.title}. Check the leaderboard.`);
  }

  return (
    <main className="page">
      <Link to="/">← Back to games</Link>
      <h1>{game.title}</h1>
      <p>{game.description}</p>

      <section className="card">
        <h2>Implementation notes</h2>
        <p>
          Replace this placeholder with the actual game. When a game finishes, call <code>recordGameResult</code> from
          <code> src/utils/gameStats.js</code> so the leaderboard updates.
        </p>
        <pre>{`recordGameResult('${game.id}', {
  outcome: 'win', // 'win', 'loss', or 'draw'
  score: 10,
  timeSeconds: 45,
});`}</pre>
      </section>

      <section className="card">
        <h2>Test buttons</h2>
        <p>These buttons are only for checking that the leaderboard is connected.</p>
        <div className="button-row">
          <button onClick={addFakeWin}>Record sample win</button>
          <button onClick={addFakeLoss}>Record sample loss</button>
          <Link to="/leaderboard">View leaderboard</Link>
        </div>
      </section>
    </main>
  );
}

export default GamePlaceholder;
