import "../App.scss";
import { memo } from "react";
import Countdown from "react-countdown";

interface StatsModalProps {
  darkMode: boolean;
  won: boolean | null;
  guesses: Array<string>;
  winRate: number;
  stats: {
    totalGames: number;
    streak: number;
    highestStreak: number;
    losses: number;
    guessDistribution: { [key: string]: number };
  };
  share(): void;
  closeModal(): void;
}

const StatsModal = ({
  darkMode,
  won,
  guesses,
  winRate,
  stats,
  share,
  closeModal,
}: StatsModalProps) => {
  const findMaxFromDistribution = () => {
    let arr: Array<number> = [];
    Object.keys(stats.guessDistribution).map((key) =>
      arr.push(stats.guessDistribution[key])
    );
    return Math.max(...arr);
  };

  const getBarWidth = (num: number, total: number) => {
    return Math.round((num / total) * 100);
  };

  function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  function convertDateForIos(date: string) {
    let newDate;
    var arr = date.split(/[- :]/);
    const arrNums = arr.map((e: any) => parseInt(e));
    console.log(arrNums);
    newDate = new Date(
      arrNums[0],
      arrNums[1] - 1,
      arrNums[2],
      arrNums[3],
      arrNums[4],
      arrNums[5]
    );
    return newDate;
  }

  // timer until tomorrow at 9 PM PST
  let date = new Date();
  let time = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1, 5)
  );
  if (time.getTime() - Date.now() <= 0) time.setDate(date.getDate() + 2);

  return (
    <div className="stats-modal">
      <div className="close-btn" onClick={closeModal}>
        X
      </div>
      <h3>STATISTICS</h3>
      <div className="stats-wrapper">
        <div className="stat-container">
          <span className="stat">{stats.totalGames}</span>
          <span className="stat-label">Played</span>
        </div>

        <div className="stat-container">
          <span className="stat">{winRate}</span>
          <span className="stat-label">Win %</span>
        </div>

        <div className="stat-container">
          <span className="stat">{stats.streak}</span>
          <span className="stat-label">Current Streak</span>
        </div>

        <div className="stat-container">
          <span className="stat">{stats.highestStreak}</span>
          <span className="stat-label">Max Streak</span>
        </div>
      </div>
      <div className="distribution">
        <h3>GUESS DISTRIBUTION</h3>
        {Object.keys(stats.guessDistribution).map((key, i) => {
          let count = stats.guessDistribution[key];
          let max = findMaxFromDistribution();
          let barWidth = getBarWidth(count, max);
          let bgColor = "gray";
          if (won) {
            if (guesses.length === i + 1) bgColor = "rgb(128, 187, 52)";
          }
          return (
            <div className="bar-wrapper" key={i}>
              <div className="bar-label">{i + 1}</div>
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
          <Countdown className="countdown" date={time} daysInHours={true} />
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
