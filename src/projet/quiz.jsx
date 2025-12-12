
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestions } from "./data";

export default function Quiz({
  userName,
  onLevelComplete,
  totalStars,
  setTotalStars,
  t,
  lang
}) {
  const { level } = useParams();
  const navigate = useNavigate();
  const currentLevel = parseInt(level);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);
  
  // New features state
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    // Load questions (unified source)
    const allQuestions = getQuestions();
    if (allQuestions[currentLevel]) {
      setQuestions(allQuestions[currentLevel].questions);
    } else {
      // Fallback if level doesn't exist
      navigate("/home");
    }
    
    // Reset state
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setStreak(0);
    setTimeLeft(30); // Reset timer logic
  }, [currentLevel, navigate]);

  // Timer Effect
  useEffect(() => {
    if (showResult || selectedOption !== null || !questions.length || showExitModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showResult, selectedOption, questions, showExitModal]);

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  const handleTimeOut = () => {
    // Treat timeout as wrong answer
    setSelectedOption(-1); // -1 indicates timeout/no selection
    setIsCorrect(false);
    setStreak(0);
    
    setTimeout(() => {
      nextQuestion(score);
    }, 1500);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const correctNode = questions[currentQuestion].correct;
    
    const isRight = optionIndex === correctNode;
    setIsCorrect(isRight);

    if (isRight) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      nextQuestion(score + (isRight ? 1 : 0));
    }, 1500); 
  };

  const nextQuestion = (currentScore) => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishQuiz(currentScore);
      }
  };

  const handleSkip = () => {
     if (selectedOption !== null) return;
     nextQuestion(score); // No points for skip
  };

  const handleBuyAnswer = () => {
     if (selectedOption !== null || totalStars < 10) return;
     
     // Deduct stars
     setTotalStars(prev => prev - 10);
     
     // Show answer: simluate click on correct option
     const correctNode = questions[currentQuestion].correct;
     handleAnswer(correctNode);
  };

  const finishQuiz = (finalScore) => {
    const earnedStars = finalScore >= 9 ? 3 : finalScore >= 7 ? 2 : finalScore >= 5 ? 1 : 0;
    
    // Only update if not already completed/shown
    if (!showResult) {
       onLevelComplete(currentLevel, finalScore, earnedStars);
       setShowResult(true);
    }
  };

  const handleExitRequest = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    navigate("/home");
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  if (!questions || questions.length === 0) return <div className="app-container"><div className="main-content">Loading...</div></div>;

  const questionData = questions[currentQuestion];

  if (showResult) {
    const earnedStars = score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0;
    const isPass = score >= 5;

    return (
      <div className="app-container result-page">
        <div className="welcome-container">
          <div className="welcome-card result-card">
            
            <div className="result-emoji">
              {isPass ? '🎉' : '😢'}
            </div>
            
            <h2 className="main-title">
              {isPass ? t.congrats : t.gameOver || "Game Over"}
            </h2>
            
            <div className="score-display-large">
              <span>{t.score}: {score}/10</span>
            </div>

            <div className="stars-result-container">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`star-result ${i < earnedStars ? 'earned' : 'empty'}`}>⭐</span>
              ))}
            </div>

            <p className="result-message">
              {isPass 
                ? (score === 10 ? (t.perfect || "Perfect!") : (t.goodJob || "Good Job!"))
                : (t.tryAgainMsg || "Try Again!")}
            </p>

            <div className="result-actions">
               {isPass && currentLevel < 50 && (
                <button className="primary-btn pulse-btn" onClick={() => navigate(`/quiz/${currentLevel + 1}`)}>
                  {t.nextLevel} ➡️
                </button>
              )}
              
              <div className="secondary-actions">
                <button className="theme-btn" onClick={() => window.location.reload()}>
                  🔄 {t.retry}
                </button>
                <button className="theme-btn" onClick={() => navigate("/home")}>
                  🏠 {t.home}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container quiz-page">
       <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
             <div className="nav-logo-text-small">
               {t.level} {currentLevel} • {questions[0]?.category[lang]}
            </div>
          </div>
          
          <div className="nav-center">
             <div className={`timer-badge ${timeLeft <= 5 ? 'danger' : timeLeft <= 10 ? 'warning' : ''}`}>
               ⏳ {timeLeft}s
             </div>
          </div>

          <div className="nav-right">
             <div className="stars-wallet">
              ⭐ {totalStars}
            </div>
            <button className="theme-btn icon-btn" onClick={handleExitRequest}>
              ⬅️ {t.back || "Back"}
            </button>
          </div>
        </div>
      </nav>

      <div className="quiz-container">
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((currentQuestion) / 10) * 100}%` }}
          ></div>
        </div>

        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Question {currentQuestion + 1}/10</span>
            <span className="streak-badge">🔥 {streak}</span>
          </div>

          <h2 className="question-text">
            {questionData.q[lang]}
          </h2>

          <div className="options-grid">
            {questionData.opts[lang].map((opt, index) => {
              let btnClass = "option-btn";
              if (selectedOption !== null) {
                if (index === questionData.correct) btnClass += " correct";
                else if (index === selectedOption) btnClass += " incorrect";
                else if (selectedOption === -1 && index === questionData.correct) btnClass += " correct"; // Show correct if timed out
              }
              
              return (
                <button
                  key={index}
                  className={btnClass}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedOption !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="quiz-actions">
            <button 
              className="action-btn hint-btn" 
              onClick={handleBuyAnswer}
              disabled={totalStars < 10 || selectedOption !== null}
              title="Cost: 10 Stars"
            >
              💡 {t.buyAnswer || "Answer"} (-10 ⭐)
            </button>
             <button 
              className="action-btn skip-btn" 
              onClick={handleSkip}
              disabled={selectedOption !== null}
            >
              ⏭️ {t.skip || "Skip"}
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>⚠️ {t.exitConfirmTitle || "Quit Quiz?"}</h3>
            <p>{t.exitConfirmMsg || "Are you sure you want to quit? Your progress for this level will be lost."}</p>
            <div className="modal-actions">
              <button className="option-btn cancel-btn" onClick={cancelExit}>
                {t.cancel || "Cancel"}
              </button>
              <button 
                className="primary-btn quit-btn" 
                onClick={confirmExit}
              >
                {t.quit || "Quit"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
