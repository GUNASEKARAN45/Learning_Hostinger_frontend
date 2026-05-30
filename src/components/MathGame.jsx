import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Trophy, Award, CheckCircle, XCircle, RefreshCw, HelpCircle } from 'lucide-react';

export default function MathGame({ user, onLogout }) {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const inputRef = useRef(null);

  // Generate a random math question
  const generateQuestion = () => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2;

    if (operator === '*') {
      // Keep multiplication simple
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
    }

    // Avoid negative answers for subtraction to keep it friendly
    if (operator === '-' && num1 < num2) {
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }

    let answer;
    switch (operator) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
      default: answer = num1 + num2;
    }

    setQuestion({ num1, num2, operator, answer });
    setUserAnswer('');
    setFeedback(null);
    
    // Refocus input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Generate first question on mount
  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer.trim() === '') return;

    const parsedAnswer = parseInt(userAnswer, 10);
    const isCorrect = parsedAnswer === question.answer;

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('wrong');
    }
    setTotal(prev => prev + 1);

    // Load next question automatically after 1.5 seconds
    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  return (
    <div className="container game-card">
      <div className="user-badge">
        <Award size={16} className="text-secondary" />
        <span>Logged in as <strong>{user?.username}</strong></span>
      </div>

      <div className="header">
        <h1 className="app-title">Brain Workout</h1>
        <p className="app-subtitle">Test your mental math power!</p>
      </div>

      {/* Score Stats Dashboard */}
      <div className="score-stats">
        <div className="stat-box">
          <div className="stat-val success-text">{score}</div>
          <div className="stat-lbl">Correct</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{total}</div>
          <div className="stat-lbl">Total Questions</div>
        </div>
      </div>

      {/* Math Question Container */}
      <div className="math-question-container">
        <div className="math-label">Solve this formula</div>
        <div className="math-question">
          {question.num1} {question.operator} {question.num2} = ?
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="answer-input">Your Answer</label>
          <div className="input-field-wrapper">
            <input
              id="answer-input"
              type="number"
              pattern="[0-9]*"
              inputMode="numeric"
              className="input-field"
              placeholder="Type answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              ref={inputRef}
              autoComplete="off"
              required
            />
            <HelpCircle className="input-icon" size={18} />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={feedback !== null || userAnswer.trim() === ''}
        >
          Submit Answer
        </button>
      </form>

      {/* Dynamic Feedback UI */}
      <div className="feedback-box">
        {feedback === 'correct' && (
          <span className="feedback-correct flex-center">
            <CheckCircle size={20} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Correct! (+1 Point)
          </span>
        )}
        {feedback === 'wrong' && (
          <span className="feedback-wrong flex-center">
            <XCircle size={20} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Wrong! Answer was {question.answer}
          </span>
        )}
        {feedback === null && total > 0 && (
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Preparing next challenge...
          </span>
        )}
      </div>

      {/* Manual Skip/Next Button */}
      {feedback !== null && (
        <button className="btn btn-outline" onClick={generateQuestion} style={{ marginTop: '10px' }}>
          <RefreshCw size={16} /> Next Question
        </button>
      )}

      {/* Sign Out Action */}
      <div className="logout-container">
        <button className="btn btn-logout" onClick={onLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
