"use client";

import Image from "next/image";
import { useState } from "react";
import { questions } from "@/data/questions";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[questionIndex];
  const hasAnswered = selectedChoice !== null;
  const pickedNormal = selectedChoice === question.normalChoice;

  function choose(choiceIndex: number) {
    if (hasAnswered) return;
    setSelectedChoice(choiceIndex);
    if (choiceIndex === question.normalChoice) setScore((currentScore) => currentScore + 1);
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setIsComplete(true);
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedChoice(null);
  }

  function playAgain() {
    setQuestionIndex(0);
    setSelectedChoice(null);
    setScore(0);
    setIsComplete(false);
  }

  const header = (
    <header className="site-header">
      <Image className="header-logo" src="/weirdmal-logo.png" alt="WeirdMal" width={44} height={44} unoptimized />
      <span>WEIRDMAL</span>
    </header>
  );

  if (isComplete) {
    return (
      <main className="page-shell">
        {header}
        <section className="result-panel" aria-live="polite">
          <p className="eyebrow">TODAY&apos;S RESULT</p>
          <h1>{score}<span>/{questions.length}</span></h1>
          <p>{score >= 7 ? "You have a strong sense of normal." : "Normal is more subjective than it looks."}</p>
          <button className="primary-button" onClick={playAgain}>Play again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      {header}
      <section className={`game ${hasStarted ? "" : "game-preview"}`} aria-live="polite" aria-hidden={!hasStarted}>
        <div className="game-meta">
          <span>QUESTION {questionIndex + 1} OF {questions.length}</span>
          <span>SCORE {score}</span>
        </div>
        <div className="progress" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
        <p className="eyebrow">THERE IS NO NORMAL</p>
        <h1>{question.prompt}</h1>
        <p className="intro">Pick the thing you think more people would call normal.</p>
        <div className="card-grid">
          {question.choices.map((choice, index) => {
            const isNormal = index === question.normalChoice;
            const resultClass = hasAnswered ? (isNormal ? "normal" : "weird") : "";
            return (
              <button key={choice.label} className={`choice-card ${resultClass}`} onClick={() => choose(index)} disabled={hasAnswered}>
                <span className="choice-symbol" aria-hidden="true">{choice.symbol}</span>
                <span className="choice-label">{choice.label}</span>
                <span className="choice-detail">{choice.detail}</span>
                {hasAnswered && <span className="verdict">{isNormal ? "NORMAL" : "WEIRD"}</span>}
              </button>
            );
          })}
        </div>
        {hasAnswered && (
          <div className={`answer-panel ${pickedNormal ? "correct" : "incorrect"}`}>
            <p><strong>{pickedNormal ? "+1 — You got it." : "Not this time."}</strong> {question.agreement}% of players picked the normal answer.</p>
            <button className="primary-button" onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "See my score" : "Next question"}</button>
          </div>
        )}
      </section>
      {!hasStarted && (
        <div className="welcome-backdrop">
          <section className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <Image className="welcome-logo" src="/weirdmal-logo.png" alt="WeirdMal" width={116} height={116} priority unoptimized />
            <p className="eyebrow">DAILY PREDICTION GAME</p>
            <h1 id="welcome-title">What is normal?</h1>
            <p className="welcome-copy">Choose what you think everyone else would call normal. Ten questions. One score.</p>
            <button className="primary-button welcome-play-button" type="button" onClick={() => setHasStarted(true)}>Play today&apos;s game</button>
            <button className="support-button" type="button" disabled>Support WeirdMal <span>Coming soon</span></button>
          </section>
        </div>
      )}
    </main>
  );
}
