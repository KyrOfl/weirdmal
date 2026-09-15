"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { questions } from "@/data/questions";

const COMPLETION_STORAGE_KEY = "weirdmal.daily-completion";
const BERLIN_TIME_ZONE = "Europe/Berlin";

type DailyCompletion = {
  score: number;
  unlockAt: number;
};

function berlinDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BERLIN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function nextBerlinUnlockTime(from: Date) {
  const currentDate = berlinDateKey(from);
  let lowerBound = from.getTime();
  let upperBound = lowerBound + 36 * 60 * 60 * 1000;

  while (berlinDateKey(new Date(upperBound)) === currentDate) {
    upperBound += 24 * 60 * 60 * 1000;
  }

  while (upperBound - lowerBound > 1) {
    const midpoint = Math.floor((lowerBound + upperBound) / 2);
    if (berlinDateKey(new Date(midpoint)) === currentDate) {
      lowerBound = midpoint;
    } else {
      upperBound = midpoint;
    }
  }

  return upperBound + 60 * 1000;
}

function remainingTime(timestamp: number) {
  const totalSeconds = Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completion, setCompletion] = useState<DailyCompletion | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState("");

  const question = questions[questionIndex];
  const hasAnswered = selectedChoice !== null;
  const pickedNormal = selectedChoice === question.normalChoice;

  useEffect(() => {
    const restoreCompletion = window.setTimeout(() => {
      const storedCompletion = window.localStorage.getItem(COMPLETION_STORAGE_KEY);

      if (storedCompletion) {
        try {
          const parsedCompletion = JSON.parse(storedCompletion);
          if (
            typeof parsedCompletion === "object" &&
            parsedCompletion !== null &&
            "score" in parsedCompletion &&
            "unlockAt" in parsedCompletion &&
            typeof parsedCompletion.score === "number" &&
            typeof parsedCompletion.unlockAt === "number" &&
            parsedCompletion.unlockAt > Date.now()
          ) {
            setCompletion(parsedCompletion);
            setCountdown(remainingTime(parsedCompletion.unlockAt));
          } else {
            window.localStorage.removeItem(COMPLETION_STORAGE_KEY);
          }
        } catch {
          window.localStorage.removeItem(COMPLETION_STORAGE_KEY);
        }
      }

      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(restoreCompletion);
  }, []);

  useEffect(() => {
    if (!completion) return;

    const updateCountdown = () => {
      if (completion.unlockAt <= Date.now()) {
        window.localStorage.removeItem(COMPLETION_STORAGE_KEY);
        setCompletion(null);
        setHasStarted(false);
        setQuestionIndex(0);
        setSelectedChoice(null);
        setScore(0);
        return;
      }

      setCountdown(remainingTime(completion.unlockAt));
    };

    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [completion]);

  function choose(choiceIndex: number) {
    if (hasAnswered) return;
    setSelectedChoice(choiceIndex);
    if (choiceIndex === question.normalChoice) setScore((currentScore) => currentScore + 1);
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      const dailyCompletion = {
        score,
        unlockAt: nextBerlinUnlockTime(new Date()),
      };
      window.localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(dailyCompletion));
      setCountdown(remainingTime(dailyCompletion.unlockAt));
      setCompletion(dailyCompletion);
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedChoice(null);
  }

  const header = (
    <header className="site-header">
      <Image className="header-logo" src="/weirdmal-logo.png" alt="WeirdMal" width={44} height={44} unoptimized />
      <span>WEIRDMAL</span>
    </header>
  );

  return (
    <main className="page-shell">
      {header}
      <section className={`game ${hasStarted && !completion ? "" : "game-preview"}`} aria-live="polite" aria-hidden={!hasStarted || Boolean(completion)}>
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
      {isReady && !hasStarted && !completion && (
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
      {isReady && completion && (
        <div className="welcome-backdrop">
          <section className="welcome-modal result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <Image className="welcome-logo" src="/weirdmal-logo.png" alt="WeirdMal" width={116} height={116} unoptimized />
            <p className="eyebrow">TODAY&apos;S SCORE</p>
            <h1 id="result-title">{completion.score}<span>/{questions.length}</span></h1>
            <p className="welcome-copy">{completion.score >= 7 ? "You have a strong sense of normal." : "Normal is more subjective than it looks."}</p>
            <p className="countdown-label">A new game opens in</p>
            <time className="countdown" aria-live="polite">{countdown}</time>
            <p className="next-game-note">Come back tomorrow to play again.</p>
          </section>
        </div>
      )}
    </main>
  );
}
