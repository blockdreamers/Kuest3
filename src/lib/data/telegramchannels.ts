const telegramChannels = [
    {
      id: 1,
      channelName: 'MBM KORE-NNECT',
      username: 'MBMweb3',
      content: '진짜 궁금한데 이더 불장 오긴 하나??',
      timestamp: '2024-04-22 16:31',
      views: 86,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 2,
      channelName: '운용고 공지방 📢',
      username: 'unyolog_announcement',
      content: '# 라인 미니밋 : 트위터 1분컷 이벤트\n✅ 이벤트 일정\n- 발표 : 4월 29일 오전 9시\n✅ 이벤트 보상\n- 100명 추첨 1억 5천원 상당 300 $KAIA',
      timestamp: '2024-04-22 16:31',
      views: 123,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 3,
      channelName: '갱생코인',
      username: 'gensecoin',
      content: '문자 인증 대신 패스키 등의 대체 수단을 적극적으로 활용합시다.',
      timestamp: '2024-04-22 16:31',
      views: 86,
      replies: 3,
      forwards: 0,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 4,
      channelName: '에어드랍코리아 (Airdropkorea)',
      username: 'airdrop_kor',
      content: '로밍 차단된대서 전 일단 안하긴했슴다',
      timestamp: '2024-04-22 16:29',
      views: 137,
      replies: 0,
      forwards: 3,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 5,
      channelName: 'COINNESS News Feed (코인니스)',
      username: 'coinnesskr',
      content: '[홍준표 "CBDC 도입, 원화 스테이블 코인 발행 검토"]',
      timestamp: '2024-04-22 16:27',
      views: 259,
      replies: 3,
      forwards: 0,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 6,
      channelName: '이든지 메타버스 공지사항',
      username: 'leedoogin2',
      content: '가입하면 안돼, 해외 로밍 서비스 사용이 불가한 상황이라 한국이나 해외에서 거주하거나 로밍해서 사용하는 분들은 적용 안됨',
      timestamp: '2024-04-22 16:25',
      views: 151,
      replies: 2,
      forwards: 0,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 7,
      channelName: '블록미디어',
      username: 'blockmedia',
      content: '신원 사기와 딜레이에 대응, 휴머니티 프로토콜 #HumanityProtocol 2단계 인증 메커니즘',
      timestamp: '2024-04-22 16:25',
      views: 341,
      replies: 0,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 8,
      channelName: '코인같이투자 정보 에어드랍',
      username: 'WeCryptoTogether',
      content: '이거 가입하면 해외 로밍 전면 차단되네요.',
      timestamp: '2024-04-22 16:24',
      views: 857,
      replies: 0,
      forwards: 2,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 9,
      channelName: '코릿트 체크 공지방 ✨ (구 클레이 체크)',
      username: 'KLAYcheck',
      content: 'ZK candy 무료민팅 퀘스트 - Sugar Rush\n총 3개 참여하면 보상 지급됨, 1개는 기본 퀘스트\n퀘스트 참여시 메타마스크 필요함',
      timestamp: '2024-04-22 16:21',
      views: 176,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 10,
      channelName: '코인같이투자 정보 에어드랍',
      username: 'WeCryptoTogether',
      content: '언제나 즐거운 커뮤니티 3: Falcon Finance 디스코드 AMA\n📅 기간 : ~ 4월 30일\n🎁 보상\n- 치킨 기프티콘 5명\n- 아마존 아이패드 100명 추첨',
      timestamp: '2024-04-22 16:21',
      views: 690,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 11,
      channelName: 'MBM KORE-NNECT',
      username: 'MBMweb3',
      content: '진짜 궁금한데 이더 불장 오긴 하나??',
      timestamp: '2024-04-22 16:31',
      views: 86,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 12,
      channelName: '운룡고 공지방 📢',
      username: 'yunlong_announcement',
      content: '🔥라인 미팅 : 트위터 1분컷 이벤트\n📅 일정 : 4월 29일 오전 9시\n🎁 보상 : 100$ $KAIA (100명 추첨 | 약 5만원)',
      timestamp: '2024-04-22 16:31',
      views: 82,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 13,
      channelName: '갱생코인',
      username: 'gensecoin',
      content: '문자 인증 대신 패스키 등의 대체 수단을 적극적으로 활용합시다.',
      timestamp: '2024-04-22 16:31',
      views: 92,
      replies: 0,
      forwards: 0,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 14,
      channelName: '에어드랍코리아',
      username: 'airdrop_kor',
      content: '로밍 차단되면서 전 일단 안하긴했습니다.\n당장 돈에 해악기는 다른 방법은 없다',
      timestamp: '2024-04-22 16:29',
      views: 137,
      replies: 0,
      forwards: 3,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 15,
      channelName: 'COINNESS News Feed',
      username: 'coinnesskr',
      content: '[홍준표 “CBDC 도입, 원화 스테이블 코인 법정 검토”]\n뉴스에 따르면 홍준표 국민의힘 대선경선후보는... (요약)',
      timestamp: '2024-04-22 16:27',
      views: 259,
      replies: 0,
      forwards: 3,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 16,
      channelName: '이준모 메타버스 공지사항',
      username: 'leedogin2',
      content: '가입하고 나면, 해외 로밍 서비스 사용이 불가한 상황이라 한국에서 해외에서 거주하거나 로밍해서 사용하는 분들은 적용 안됨',
      timestamp: '2024-04-22 16:25',
      views: 151,
      replies: 2,
      forwards: 0,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 17,
      channelName: '블록미디어',
      username: 'blockmedia',
      content: '신원 사기와 딜레이에 대응, 휴머니티 프로토콜 (Humanity Protocol) 2단계 인증 메커니즘',
      timestamp: '2024-04-22 16:25',
      views: 341,
      replies: 1,
      forwards: 0,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 18,
      channelName: '코인라이투자 정보 에어드랍',
      username: 'WeCryptoTogether',
      content: '이거 가입하면 해외 로밍 전면 차단되네요.\n유심달고 서비스라고 신청했더니 알림은 로밍 완전 차단 서비스라고 답장옴. 효과있는 거 맞나 ㅋ',
      timestamp: '2024-04-22 16:24',
      views: 857,
      replies: 0,
      forwards: 2,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 19,
      channelName: '크립토 체크 공지방',
      username: 'KLAYcheck',
      content: 'ZK candy 무료민팅 퀘스트 - Sugar Rush\n0.004ETH 브릿지 필요, okx wallet으로 오류나거나 메타마스크 이상무',
      timestamp: '2024-04-22 16:21',
      views: 176,
      replies: 1,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    },
    {
      id: 20,
      channelName: '코인라이투자 정보 에어드랍',
      username: 'WeCryptoTogether',
      content: '언제나 즐거운 2개피헌장 3: Falcon Finance 디스코드 AMA\n📅 기간: ~ 4월 30일\n🎁 보상: 치킨 기프티콘 – 5명\n👶 아이다노기 타노 – 100 명',
      timestamp: '2024-04-22 16:21',
      views: 611,
      replies: 0,
      forwards: 1,
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
    }
  ];
  
  export default telegramChannels;
  