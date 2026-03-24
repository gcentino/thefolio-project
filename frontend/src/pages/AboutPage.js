import React, { useState } from 'react'; // Tinanggal na natin ang useEffect para mawala ang warning

const AboutPage = () => {
  // State para lumipat sa pagitan ng Timeline at Quiz [cite: 522]
  const [isQuizMode, setIsQuizMode] = useState(false); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [feedback, setFeedback] = useState("");

  const quizData = [
    { question: "In what year did Greshamin first encounter badminton?", options: ["2016", "2017", "2018", "2019"], answer: 1 },
    { question: "Which team won a bronze medal in 2024?", options: ["High School Team", "District Team", "CCS Badminton Team", "Municipal Team"], answer: 2 },
    { question: "What is the official name of the 'birdie'?", options: ["Shuttlecock", "Badminton Ball", "Flyer", "Spear"], answer: 0 },
    { question: "When did Greshamin join the municipal level contest?", options: ["2017", "2018", "2019", "2020"], answer: 2 },
    { question: "What prize did the CCS team win in 2024?", options: ["Gold", "Silver", "Bronze", "MVP"], answer: 2 },
    { question: "How does Greshamin describe the sound of hitting the shuttlecock?", options: ["Loud", "Satisfying/Crisp", "Annoying", "Quiet"], answer: 1 },
    { question: "In 2022-2023, what level did Greshamin compete in?", options: ["Municipal", "Apps District", "National", "Olympics"], answer: 1 },
    { question: "Badminton is Greshamin's way to escape what?", options: ["Housework", "School stress", "Coding", "Cooking"], answer: 1 },
    { question: "Badminton is played up to how many points?", options: ["15", "21", "25", "30"], answer: 1 },
    { question: "Where did Badminton originate?", options: ["USA", "Philippines", "China", "India"], answer: 3 }
  ];

  const handleNext = () => {
    if (selectedOpt === quizData[currentIdx].answer) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Correct: ${quizData[currentIdx].options[quizData[currentIdx].answer]}`);
    }

    setTimeout(() => {
      setFeedback("");
      setSelectedOpt(null);
      if (currentIdx + 1 < quizData.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setShowFinal(true);
      }
    }, 1200);
  };

  return (
    <div className="page-container">
      {!isQuizMode ? (
        <section id="about-content" className="about-section">
          <h2>What I Love About Badminton</h2>
          <p>Badminton is more than just a sport for me; it's a way to escape the stress of school and stay fit...</p>
          
          <div className="img-container">
            <img src="/picture/badminton 🏸.jpg" alt="Me playing" style={{width:'50%', borderRadius:'10px'}} />
          </div>

          <blockquote>"Your opponent is not the person across the net; it is the person inside you."</blockquote>

          <h2>My Journey Timeline</h2>
          <ol>
            <li><strong>2017:</strong> First encounter through a friend.</li>
            <li><strong>2018:</strong> First experience playing as a high school student.</li>
            <li><strong>2019:</strong> Joined high school team, municipal level contest.</li>
            <li><strong>2022-2023:</strong> Competed at Apps District.</li>
            <li><strong>2024:</strong> CCS Badminton team wins Bronze Medal.</li>
            <li><strong>2024-Present:</strong> Played as a cherished hobby and join Olympics.</li>
          </ol>

          <div className="img-container">
            <img src="/picture/rack1.jpg" alt="My racket" style={{width:'50%', borderRadius:'10px'}} />
          </div>

          <button className="btn-action" onClick={() => setIsQuizMode(true)}>Proceed to Quiz Game 🏸</button>
        </section>
      ) : (
        <section className="quiz-container">
          <button onClick={() => setIsQuizMode(false)} style={{background:'none', border:'none', color:'#1e4d8c', cursor:'pointer', fontWeight:'bold'}}>
            ← Back to Timeline
          </button>

          {showFinal ? (
            <div style={{textAlign:'center', padding: '20px'}}>
              <h2>Quiz Complete!</h2>
              <h3>Final Score: {score} / {quizData.length}</h3>
              <button className="btn-action" onClick={() => { setIsQuizMode(false); setShowFinal(false); setScore(0); setCurrentIdx(0); }}>
                Restart Journey
              </button>
            </div>
          ) : (
            <div>
              <h3>🏸 Ultimate Badminton Quiz</h3>
              <p>Question {currentIdx + 1} of {quizData.length}</p>
              <h2>{quizData[currentIdx].question}</h2>
              <div className="options">
                {quizData[currentIdx].options.map((opt, i) => (
                  <div key={i} className={`option ${selectedOpt === i ? 'selected' : ''}`} onClick={() => setSelectedOpt(i)}>
                    {opt}
                  </div>
                ))}
              </div>
              <button className="btn-action" onClick={handleNext} disabled={selectedOpt === null} style={{width:'100%', opacity: selectedOpt === null ? 0.5 : 1}}>
                Submit Answer
              </button>
              <p style={{textAlign:'center', fontWeight:'bold'}}>{feedback}</p>
            </div>
          )}
        </section>
      )}
      <footer style={{ 
        background: 'var(--footer-bg)', 
        color: 'white', 
        textAlign: 'center', 
        padding: '15px 0', 
        marginTop: 'auto',
        width: '100%'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>&copy; 2026 All Rights Reserved. Greshamin Centino</p>
      </footer>
    </div>
  );
};

export default AboutPage;