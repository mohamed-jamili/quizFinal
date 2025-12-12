import { useNavigate } from "react-router-dom";

export default function StatsPage({ progress, t }) {
  const navigate = useNavigate();
  
  const totalLevels = 50;
  const completedLevels = Object.keys(progress.levelScores).length;
  const totalScore = Object.values(progress.levelScores).reduce((a, b) => a + b, 0);
  const avgScore = completedLevels > 0 ? (totalScore / completedLevels).toFixed(1) : 0;

  return (
    <div className="app-container stats-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <button onClick={() => navigate('/home')} className="theme-btn">
              🏠 {t('home')}
            </button>
          </div>
          <div className="nav-center">
             <h1 className="nav-title">{t('stats')}</h1>
          </div>
          <div className="nav-right">
             {/* Empty for balance or could add something later */}
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
             <div className="stat-icon icon-gold">🏆</div>
             <div className="stat-value">{progress.achievements.length}</div>
             <div className="stat-label">{t('achievements')}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-blue">📊</div>
            <div className="stat-value">{avgScore}</div>
            <div className="stat-label">{t('average')}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon icon-yellow">⭐</div>
            <div className="stat-value">{totalScore}</div>
            <div className="stat-label">{t('score')}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-red">🎯</div>
            <div className="stat-value">{completedLevels}/50</div>
            <div className="stat-label">{t('levels')}</div>
          </div>
        </div>

        {progress.history.length > 0 && (
          <div className="history-section">
            <h2 className="history-title">{t('recentActivity')}</h2>
            <div className="history-list">
              {progress.history.slice(0, 10).map((item, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-level">{t('level')} {item.level}</span>
                  <span className="history-score">{item.score}/10</span>
                  <span className="history-stars">{'⭐'.repeat(item.stars)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
