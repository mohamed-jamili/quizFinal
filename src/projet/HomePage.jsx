import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage({
  progress,
  userName,
  onStartLevel,
  onChangeName,
  theme,
  setTheme,
  lang,
  setLang,
  totalStars,
  t
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const getDifficulty = (level) => {
    if (level <= 15) return "Easy";
    if (level <= 30) return "Medium";
    if (level <= 45) return "Hard";
    return "Expert";
  };

  return (
    <div className={`app-container home-page`}>
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left nav-logo" onClick={() => navigate("/home")}>
             <h1 className="nav-logo-text">
              <span className="brand-main">QuizByJamili</span>
            </h1>
          </div>

          <div className="nav-center">
            <div className="user-info" onClick={() => setShowMenu(!showMenu)}>
              <span className="user-name">{userName}</span>
               <div className="user-avatar">{userName[0]?.toUpperCase()}</div>
               <svg className="dropdown-icon" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
               
               {showMenu && (
                <div className="dropdown-menu">
                  <div
                    className="menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeName();
                      setShowMenu(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="menu-icon">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    </svg>
                    {t('changeName')}
                  </div>
                  <div className="menu-item-info">
                    <svg viewBox="0 0 24 24" className="menu-icon">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    </svg>
                    {t('level')}: {progress.unlockedLevels}/50
                  </div>
                  <div className="menu-item" onClick={(e) => {
                      e.stopPropagation();
                      navigate("/stats");
                    }}>
                    <svg viewBox="0 0 24 24" className="menu-icon">
                      <path d="M3 3v18h18" />
                    </svg>
                    {t('stats')}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="nav-right">
            <div className="stars-wallet">
              <span>⭐ {totalStars}</span>
            </div>
            
            <button
              className="theme-btn"
              onClick={() => setLang(lang === "en" ? "fr" : lang === "fr" ? "ar" : "en")}
            >
              🌐 {lang.toUpperCase()}
            </button>

            <button
              className="theme-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="header-section">
          <h2 className="main-title">{t('selectLevel')}</h2>
          <p className="main-subtitle">{t('unlockNext')}</p>
        </div>

        <div className="levels-grid">
          {Array.from({ length: 50 }, (_, i) => i + 1).map((level) => {
            const isUnlocked = level <= progress.unlockedLevels;
            const score = progress.levelScores[level];
            const difficulty = getDifficulty(level);

            return (
              <div
                key={level}
                className={`level-card ${isUnlocked ? "unlocked" : "locked"} difficulty-${difficulty.toLowerCase()}`}
                onClick={() => isUnlocked && onStartLevel(level)}
              >
                {!isUnlocked && (
                  <svg className="lock-icon" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}

                {score !== undefined && (
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}

                <div className="card-content">
                  <div className="level-number">#{level}</div>
                  <div className="difficulty-badge">
                    {t(difficulty.toLowerCase())}
                  </div>
                  {score !== undefined && (
                    <div className="score-display">
                      <svg
                        className="star-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>{score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 QuizMaster Pro — Master all 50 levels!</p>
        </div>
      </footer>
    </div>
  );
}
