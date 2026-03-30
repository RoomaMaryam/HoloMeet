'use client';

import React from 'react';

interface HostPanelProps {
  roomName: string;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 23,   name: "History" },
  { id: 9,    name: "General Knowledge" },
  { id: 18,   name: "Computers" },
  { id: 17,   name: "Science & Nature" },
  { id: 10,   name: "English" },
];

const TIME_OPTIONS = [
  { value: 5,  label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" },
];

const QUESTIONS_OPTIONS = [
  { value: 5,  label: "5 Questions" },
  { value: 10, label: "10 Questions" },
  { value: 15, label: "15 Questions" },
  { value: 20, label: "20 Questions" },
];

export function HostPanel({ roomName, onClose }: HostPanelProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [showQuizModal, setShowQuizModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('9');
  const [timeLimit, setTimeLimit] = React.useState(10);
  const [questionCount, setQuestionCount] = React.useState(10);
  const [quizPassword, setQuizPassword] = React.useState('');
  const [quizLoading, setQuizLoading] = React.useState(false);
  const [quizLink, setQuizLink] = React.useState('');
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const [resultsLoading, setResultsLoading] = React.useState(false);
  const [correctAnswers, setCorrectAnswers] = React.useState<any[]>([]);
  const [copied, setCopied] = React.useState(false);

  const handleMuteAll = async () => {
    try {
      const res = await fetch('/api/meeting/mute-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, mute: true }),
      });
      if (res.ok) setIsMuted(true);
    } catch (err) {
      console.error('Mute error:', err);
    }
  };

  const handleUnmuteAll = async () => {
    try {
      const res = await fetch('/api/meeting/mute-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, mute: false }),
      });
      if (res.ok) setIsMuted(false);
    } catch (err) {
      console.error('Unmute error:', err);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizPassword.trim()) {
      alert('Please enter a quiz password!');
      return;
    }
    setQuizLoading(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          category: selectedCategory,
          timeLimit: timeLimit * 60,
          password: quizPassword,
          questionCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const link = `${window.location.origin}/quiz/${roomName}`;
        setQuizLink(link);
        setQuizStarted(true);
        setShowQuizModal(false);
      } else {
        alert('Quiz generation failed: ' + data.error);
      }
    } catch (err) {
      console.error('Quiz error:', err);
      alert('Quiz generation failed!');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleCopyLink = () => {
    const fullText = `Quiz Link: ${quizLink}\nPassword: ${quizPassword}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeeResults = async () => {
  setResultsLoading(true);
  setShowResults(true);

  try {
    const res = await fetch(`/api/quiz/results?roomName=${roomName}`);
    const data = await res.json();

    if (data.success) {
      setResults(data.results);
      setCorrectAnswers(data.correctAnswers || []);
    }
  } catch (err) {
    console.error('Results error:', err);
  } finally {
    setResultsLoading(false);
  }
};
  const handleDownloadCSV = () => {
    if (results.length === 0) return;
    const headers = ['Rank', 'Name', 'Roll No', 'Category', 'Score', 'Percentage', 'Time (seconds)'];
    const rows = results.map(r => [
      r.rank, r.participantName, r.rollNumber,
      r.category, `="${r.scoreDisplay}"`, `${r.percentage}%`, r.timeTaken,
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${roomName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Main Panel */}
      <div style={{
        position: 'fixed', bottom: '70px', right: '14px',
        zIndex: 99999, backgroundColor: '#1a1a2e',
        border: '1px solid rgba(74,144,217,0.4)',
        borderRadius: '12px', padding: '14px',
        minWidth: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '8px', marginBottom: '10px',
        }}>
          <span style={{ color: '#4a90d9', fontWeight: 'bold', fontSize: '13px' }}>
            Host Controls
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '16px',
          }}>X</button>
        </div>

        <button onClick={handleMuteAll} disabled={isMuted} style={{
          width: '100%', backgroundColor: isMuted ? '#444' : '#e74c3c',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: isMuted ? 'not-allowed' : 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          Mute All
        </button>

        <button onClick={handleUnmuteAll} disabled={!isMuted} style={{
          width: '100%', backgroundColor: !isMuted ? '#444' : '#2ecc71',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: !isMuted ? 'not-allowed' : 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          Unmute All
        </button>

        <button onClick={() => setShowQuizModal(true)} style={{
          width: '100%', backgroundColor: quizStarted ? '#27ae60' : '#f39c12',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: 'pointer',
          fontSize: '13px', marginBottom: '8px', textAlign: 'left',
        }}>
          {quizStarted ? 'Quiz Active' : 'Introduce Quiz'}
        </button>

        {quizLink && (
          <div style={{
            backgroundColor: 'rgba(74,144,217,0.1)',
            border: '1px solid rgba(74,144,217,0.3)',
            borderRadius: '8px', padding: '8px', marginBottom: '8px',
          }}>
            <p style={{ color: '#4a90d9', fontSize: '11px', margin: '0 0 4px' }}>Quiz Link:</p>
            <p style={{ color: 'white', fontSize: '11px', margin: '0 0 4px', wordBreak: 'break-all' }}>{quizLink}</p>
            <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 6px' }}>
              Password: <strong style={{ color: 'white' }}>{quizPassword}</strong>
            </p>
            <button onClick={handleCopyLink} style={{
              width: '100%', backgroundColor: copied ? '#27ae60' : '#4a90d9',
              color: 'white', border: 'none', borderRadius: '6px',
              padding: '6px', cursor: 'pointer', fontSize: '12px',
            }}>
              {copied ? 'Copied!' : 'Copy Link + Password'}
            </button>
          </div>
        )}

        <button onClick={handleSeeResults} style={{
          width: '100%', backgroundColor: '#9b59b6',
          color: 'white', border: 'none', borderRadius: '8px',
          padding: '9px 12px', cursor: 'pointer',
          fontSize: '13px', textAlign: 'left',
        }}>
          See Results
        </button>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.4)',
            borderRadius: '16px', padding: '28px', width: '380px',
          }}>
            <h3 style={{ color: '#4a90d9', marginTop: 0, marginBottom: '20px' }}>Create Quiz</h3>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Category:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Quiz Category"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Number of Questions:</label>
            <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}
              aria-label="Question Count"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
              {QUESTIONS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Time Limit:</label>
            <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}
              aria-label="Time Limit"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '16px' }}>
              {TIME_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quiz Password:</label>
            <input type="text" placeholder="Enter quiz password..." value={quizPassword}
              onChange={(e) => setQuizPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f0f1a', color: 'white', border: '1px solid rgba(74,144,217,0.4)', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowQuizModal(false)} style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                color: 'white', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
              <button onClick={handleGenerateQuiz} disabled={quizLoading} style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                border: 'none', background: '#4a90d9',
                color: 'white', cursor: quizLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: 'bold',
              }}>
                {quizLoading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#1a1a2e', border: '1px solid rgba(74,144,217,0.4)',
            borderRadius: '16px', padding: '28px',
            width: '650px', maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#4a90d9', margin: 0 }}>Quiz Results</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {results.length > 0 && (
                  <button onClick={handleDownloadCSV} style={{
                    backgroundColor: '#27ae60', color: 'white',
                    border: 'none', borderRadius: '8px',
                    padding: '8px 16px', cursor: 'pointer', fontSize: '13px',
                  }}>
                    Download CSV
                  </button>
                )}
                <button onClick={() => setShowResults(false)} style={{
                  background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px',
                }}>X</button>
              </div>
            </div>

            {results.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'rgba(74,144,217,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(74,144,217,0.2)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a90d9' }}>{results.length}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Total Attempts</div>
                </div>
                <div style={{ backgroundColor: 'rgba(46,204,113,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(46,204,113,0.2)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>{results[0]?.scoreDisplay}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Top Score</div>
                </div>
                <div style={{ backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(243,156,18,0.2)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                    {Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Avg Score</div>
                </div>
              </div>
            )}

            {resultsLoading ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
            ) : results.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>No results yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(74,144,217,0.4)' }}>
                    {['Rank', 'Name', 'Roll No', 'Score', '%', 'Time'].map(h => (
                      <th key={h} style={{ color: '#4a90d9', padding: '10px 8px', textAlign: 'left', fontSize: '12px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i === 0 ? 'rgba(46,204,113,0.08)' : 'transparent' }}>
                      <td style={{ padding: '10px 8px', fontSize: '16px' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${r.rank}`}
                      </td>
                      <td style={{ padding: '10px 8px', color: 'white', fontSize: '13px' }}>{r.participantName}</td>
                      <td style={{ padding: '10px 8px', color: '#aaa', fontSize: '13px' }}>{r.rollNumber}</td>
                      <td style={{ padding: '10px 8px', color: '#2ecc71', fontWeight: 'bold', fontSize: '13px' }}>{r.scoreDisplay}</td>
                      <td style={{ padding: '10px 8px', fontSize: '13px', color: r.percentage >= 80 ? '#2ecc71' : r.percentage >= 50 ? '#f39c12' : '#e74c3c' }}>{r.percentage}%</td>
                      <td style={{ padding: '10px 8px', color: '#aaa', fontSize: '13px' }}>{r.timeTaken}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}

              {/* Correct Answers Section */}
              {correctAnswers && correctAnswers.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ color: '#4a90d9', marginBottom: '12px' }}>Answer Key</h4>
                  {correctAnswers.map((item: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: 'rgba(46,204,113,0.08)',
                      border: '1px solid rgba(46,204,113,0.2)',
                      borderRadius: '8px', padding: '10px 14px',
                      marginBottom: '8px',
                    }}>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px' }}>
                        Q{item.questionNo}:
                        <span dangerouslySetInnerHTML={{ __html: ' ' + item.question }}></span>
                      </p>
                      <p style={{ color: '#2ecc71', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                        Correct: <span dangerouslySetInnerHTML={{ __html: item.correctAnswer }}></span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            
          </div>
        </div>
      )}
    </>
  );
}
