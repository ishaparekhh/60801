import { Link } from 'react-router-dom';
import { gameCatalog } from '../data/gameCatalog.js';

function HomePage() {
  return (
    <main className="page">
      <h1>Exam Practice Games</h1>
      <p>
        This home page is only included so the starter repo is easy to test. You can replace this with your own
        navigation, sidebar, header, or footer.
      </p>

      <section className="card">
        <h2>Pages</h2>
        <ul className="link-list">
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          {gameCatalog.map((game) => (
            <li key={game.id}>
              <Link to={game.route}>{game.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default HomePage;
