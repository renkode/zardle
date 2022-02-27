import "../App.css";
import { memo } from "react";
import Countdown from "react-countdown";

interface StatsModalProps {
  darkMode: boolean;
  won: boolean | null;
  guesses: Array<string>;
  totalGames: number;
  winRate: number;
  streak: number;
  highestStreak: number;
  guessDistribution: {
    [key: string]: number;
  };
  share(): void;
  closeModal(): void;
}

const StatsModal = ({
  darkMode,
  won,
  guesses,
  totalGames,
  winRate,
  streak,
  highestStreak,
  guessDistribution,
  share,
  closeModal,
}: StatsModalProps) => {
  const findMaxFromDistribution = () => {
    let arr: Array<number> = [];
    Object.keys(guessDistribution).map((key) =>
      arr.push(guessDistribution[key])
    );
    return Math.max(...arr);
  };

  const getBarWidth = (num: number, total: number) => {
    return Math.round((num / total) * 100);
  };

  return (
    <div className="stats-modal">
      <div className="close-btn" onClick={closeModal}>
        X
      </div>
      <h3>STATISTICS</h3>
      <div className="stats-wrapper">
        <div className="stat-container">
          <span className="stat">{totalGames}</span>
          <span className="stat-label">Played</span>
        </div>

        <div className="stat-container">
          <span className="stat">{winRate}</span>
          <span className="stat-label">Win %</span>
        </div>

        <div className="stat-container">
          <span className="stat">{streak}</span>
          <span className="stat-label">Current Streak</span>
        </div>

        <div className="stat-container">
          <span className="stat">{highestStreak}</span>
          <span className="stat-label">Max Streak</span>
        </div>
      </div>
      <div className="distribution">
        <h3>GUESS DISTRIBUTION</h3>
        {Object.keys(guessDistribution).map((key, i) => {
          let count = guessDistribution[key];
          let max = findMaxFromDistribution();
          let barWidth = getBarWidth(count, max);
          let bgColor = "gray";
          if (won) {
            if (guesses.length === i + 1) bgColor = "rgb(128, 187, 52)";
          }
          return (
            <div className="bar-wrapper" key={i}>
              {i + 1}
              <div
                className="bar"
                style={{ width: `${barWidth}%`, backgroundColor: `${bgColor}` }}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>
      <div className="countdown-share-wrapper">
        <div className="countdown-container">
          <span>NEXT ZARDLE</span>
          <Countdown
            className="countdown"
            date={Date.now() + 100000}
            daysInHours={true}
          />
        </div>
        <div className="share-container">
          <button className="share" onClick={share}>
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(StatsModal);
