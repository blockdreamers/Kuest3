import styles from './QuestDetail.module.css'; // 상단에 추가

// 아래 부분 관련 퀘스트 카드 스타일 변경
{relatedQuests.slice(0, 4).map((quest) => (
  <Link
    key={quest.id}
    to={`/quest/${quest.id}`}
    className={`${styles.questBox} block hover:shadow-md transition-all duration-200`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-white">{quest.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{quest.description}</p>
        <div className="flex items-center mt-2 text-sm text-gray-400">
          <Users className="h-4 w-4 mr-1" />
          <span>{quest.participants.toLocaleString()}명 참여</span>
        </div>
      </div>
      <div className="flex items-center text-green-400 font-medium">
        <DollarSign className="h-4 w-4 mr-1" />
        <span>{quest.reward} {quest.rewardType}</span>
      </div>
    </div>
  </Link>
))}
