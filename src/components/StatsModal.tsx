import "../App.css";
import { memo } from "react";

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
}: StatsModalProps) => {
  return (
    <div className="stats-modal">
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
      <h3>GUESS DISTRIBUTION</h3>
      <div className="distribution">
        {Object.keys(guessDistribution).map((key, i) => (
          <div className="bar" key={i}>{`${i + 1}: ${
            guessDistribution[key]
          }`}</div>
        ))}
      </div>

      <button onClick={share}>Share</button>
    </div>
  );
};

export default memo(StatsModal);
