const VotingCard = ({ coin, rank }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`voting-card flex items-center justify-between px-4 py-2 ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="voting-rank">{rank}</div>
        <img
          src={coin.logo}
          alt={coin.name}
          className="voting-coin-logo"
        />
        <div>
          <div className="voting-name">{coin.name}</div>
          <div className="voting-symbol">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-8 min-w-fit">
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">${(coin.votes / 100).toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 누적 Pick</p>
          <p className="vote-stat-value">{coin.totalPick ? coin.totalPick.toLocaleString() : 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">24시간 Pick</p>
          <p className="vote-stat-value">{coin.dailyPick ? coin.dailyPick.toLocaleString() : 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 에어드랍 물량</p>
          <p className="vote-stat-value">{coin.totalAirdrop ? coin.totalAirdrop.toLocaleString() : 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">에어드랍 소진율</p>
          <p className="vote-stat-value">{coin.airdropUtilization ? coin.airdropUtilization : 'N/A'}%</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">잔여 에어드랍 비율</p>
          <p className="vote-stat-value">{coin.airdropRemaining ? coin.airdropRemaining : 'N/A'}%</p>
        </div>
        {isHovered && <button className="vote-button">투표하기</button>}
      </div>
    </div>
  );
};
