import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WelcomePage from "./projet/WelcomePage";
import HomePage from "./projet/HomePage";
import Quiz from "./projet/quiz";
import StatsPage from "./projet/StatsPage";
import { translations } from "./projet/translations";

function AppContent() {
  const navigate = useNavigate();
  
  // Language State Management
  const [lang, setLang] = useState(localStorage.getItem("quizLang") || "en");

  useEffect(() => {
    localStorage.setItem("quizLang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key) => {
      return translations[lang]?.[key] || key;
  };

  const [userName, setUserName] = useState(localStorage.getItem("quizUserName") || "");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [totalStars, setTotalStars] = useState(parseInt(localStorage.getItem("quizStars") || "0"));

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("quizProgress");
    return saved ? JSON.parse(saved) : {
      unlockedLevels: 1,
      levelScores: {},
      achievements: [],
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("quizStars", totalStars);
  }, [totalStars]);

  useEffect(() => {
    localStorage.setItem("quizProgress", JSON.stringify(progress));
  }, [progress]);

  const handleStart = (name) => {
    if (!name.trim()) return;
    setUserName(name);
    localStorage.setItem("quizUserName", name);
    navigate("/home");
  };

  const handleChangeName = () => {
    setUserName("");
    localStorage.removeItem("quizUserName");
    navigate("/");
  };

  const handleLevelComplete = (level, score, earnedStars) => {
    setTotalStars(prev => prev + earnedStars);

    setProgress(prev => {
      const newScores = { ...prev.levelScores, [level]: score };
      const newUnlocked = score >= 5 ? Math.max(prev.unlockedLevels, level + 1) : prev.unlockedLevels;

      const achievements = new Set(prev.achievements);
      if (score >= 5) achievements.add("First Win");
      if (score === 10) achievements.add("Perfect Score");

      const stars = score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0;
      const newHistory = [
        { level, score, stars, date: new Date().toISOString() },
        ...prev.history
      ].slice(50);

      return {
        unlockedLevels: newUnlocked,
        levelScores: newScores,
        achievements: Array.from(achievements),
        history: newHistory
      };
    });
  };

  return (
    <Routes>
      <Route path="/" element={
        <WelcomePage 
          onStart={handleStart} 
          t={translations[lang]}
          lang={lang}
          setLang={setLang}
        />
      } />
      
      <Route
        path="/home"
        element={
          userName ? (
            <HomePage
              userName={userName}
              progress={progress}
              onStartLevel={(lvl) => navigate(`/quiz/${lvl}`)}
              onChangeName={handleChangeName}
              theme={theme}
              setTheme={setTheme}
              totalStars={totalStars}
              lang={lang}
              setLang={setLang}
              t={t} // Passing function for dynamic keys if needed, or object
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/quiz/:level"
        element={
          userName ? (
            <Quiz 
              userName={userName} 
              onLevelComplete={handleLevelComplete} 
              totalStars={totalStars}
              setTotalStars={setTotalStars}
              lang={lang}
              t={translations[lang]}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/stats"
        element={
          userName ? (
            <StatsPage 
              progress={progress} 
              t={t}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route path="*" element={<Navigate to={userName ? "/home" : "/"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
