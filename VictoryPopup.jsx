import React, { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Crown } from "lucide-react";

const shimmerGradient = `
@keyframes popupFadeScale {
  0% { opacity: 0; transform: scale(0.9) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes starPop {
  0% { opacity: 0; transform: scale(0.4) translateY(12px); filter: drop-shadow(0 12px 16px rgba(0,0,0,0.25)); }
  60% { opacity: 1; transform: scale(1.15) translateY(-4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: drop-shadow(0 18px 28px rgba(12,74,110,0.25)); }
}

@keyframes shimmerMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
`;

const StarIcon = ({ size = 80, delay = 0, className = "" }) => (
  <svg
    className={`drop-shadow-[0_12px_18px_rgba(8,47,73,0.25)] ${className}`}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: `starPop 420ms ease-out forwards`,
      animationDelay: `${delay}ms`,
      opacity: 0,
    }}
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE79A" />
        <stop offset="50%" stopColor="#F9C846" />
        <stop offset="100%" stopColor="#B88917" />
      </linearGradient>
      <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFF3C7" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#D8A928" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path
      d="M32 4l7.78 16.02 17.72 2.58-12.8 12.48 3.02 17.62L32 44.36 16.28 52.7l3.02-17.62-12.8-12.48 17.72-2.58L32 4z"
      fill="url(#goldGradient)"
      stroke="url(#edgeGradient)"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path
      d="M32 9.6l6.38 13.13 14.5 2.12-10.49 10.24 2.48 14.47L32 43.24l-12.87 6.32 2.48-14.47-10.5-10.24 14.51-2.12L32 9.6z"
      fill="url(#edgeGradient)"
      opacity="0.35"
    />
  </svg>
);

const VictoryPopup = ({ score, time, onNext }) => {
  const [starStages, setStarStages] = useState([false, false, false]);
  const [progress, setProgress] = useState(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const timers = [0, 180, 360].map((delay, idx) =>
      setTimeout(() => {
        setStarStages((prev) => prev.map((v, i) => (i === idx ? true : v)));
      }, 260 + delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 3000;

    const tick = () => {
      const elapsed = performance.now() - start;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(percent);
      if (elapsed >= duration && !triggeredRef.current) {
        triggeredRef.current = true;
        onNext?.();
      }
    };

    const interval = setInterval(tick, 50);
    tick();
    return () => clearInterval(interval);
  }, [onNext]);

  const formattedScore = useMemo(
    () => score?.toLocaleString?.("en-US") ?? score,
    [score]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm">
      <style>{shimmerGradient}</style>
      <div
        className="relative w-[520px] max-w-[92vw] overflow-hidden rounded-3xl bg-gradient-to-b from-white via-sky-50 to-white p-8 shadow-2xl shadow-blue-900/20 ring-1 ring-blue-100"
        style={{ animation: "popupFadeScale 320ms ease-out" }}
      >
        <div className="pointer-events-none absolute inset-x-8 top-6 h-24 bg-gradient-to-r from-blue-100/0 via-blue-100/60 to-blue-100/0 blur-3xl" />

        <div className="relative flex flex-col items-center gap-4">
          <div className="relative flex h-32 w-full items-center justify-center">
            <div className="absolute -left-1/3 top-2 h-32 w-32 rounded-full bg-blue-50 blur-3xl" />
            <div className="absolute left-12 bottom-2 transform -rotate-6">
              {starStages[0] && <StarIcon size={86} delay={0} className="" />}
            </div>
            <div className="absolute top-0">
              {starStages[1] && <StarIcon size={110} delay={120} className="" />}
            </div>
            <div className="absolute right-12 bottom-2 transform rotate-6">
              {starStages[2] && <StarIcon size={86} delay={240} className="" />}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-blue-400">VICTORY</p>
            <h1 className="text-3xl font-black tracking-tight text-sky-800 drop-shadow-[0_6px_12px_rgba(14,116,144,0.15)]">
              STAGE CLEARED!
            </h1>
            <p className="mt-2 text-lg font-semibold text-amber-600">3 STARS EARNED!</p>
          </div>

          <div className="mt-2 grid w-full grid-cols-2 gap-3 rounded-2xl bg-white/80 p-4 shadow-inner ring-1 ring-blue-100">
            <div className="flex items-center gap-3 rounded-xl bg-blue-50/70 px-3 py-2 ring-1 ring-blue-100">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Time</p>
                <p className="text-lg font-bold text-sky-800">{time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-amber-50/80 px-3 py-2 ring-1 ring-amber-100">
              <Crown className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Score</p>
                <p className="text-lg font-bold text-amber-700">{formattedScore}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-blue-500">
              <span>Advancing</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_6px_14px_rgba(248,180,0,0.45)]"
                style={{
                  width: `${progress}%`,
                  transition: "width 80ms linear",
                  backgroundSize: "200% 100%",
                  animation: "shimmerMove 1.6s linear infinite",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup;

export const App = () => {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState(3);

  const handleNext = () => {
    setVisible(false);
    setStage((prev) => prev + 1);
    console.log("Auto-advanced to stage", stage + 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-bold text-slate-800">Stage {stage} Demo</h2>
        <p className="mt-2 text-slate-600">
          This wrapper component simulates a cleared stage. The popup automatically advances after the progress bar completes.
        </p>
      </div>

      {visible && (
        <VictoryPopup
          score={12500}
          time="2:45"
          onNext={handleNext}
        />
      )}
    </div>
  );
};
