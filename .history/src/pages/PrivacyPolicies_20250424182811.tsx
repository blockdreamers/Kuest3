import React from 'react';

const PrivacyPolicies = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-[Pretendard]">
      <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700">
        <p>
          본 서비스는 이용자의 개인정보를 매우 소중하게 생각하며, 관련 법령에 따라 이를 철저히 보호하고 있습니다. 본 개인정보처리방침은 당사가 수집하는 개인정보, 수집 목적, 보관 및 이용 기간, 제3자 제공, 보안 조치 및 이용자의 권리 등에 대해 설명합니다.
        </p>

        <h2 className="text-base font-semibold mt-6">1. 수집하는 개인정보 항목</h2>
        <p>
          당사는 회원가입, 서비스 이용, 이벤트 참여 등을 위해 아래와 같은 개인정보를 수집할 수 있습니다.
          <ul className="list-disc ml-5 mt-2">
            <li>필수 항목: 이메일 주소, 닉네임, 지갑 주소</li>
            <li>선택 항목: 프로필 이미지, 소셜 미디어 계정 링크, 관심 분야</li>
            <li>자동 수집 항목: 접속 IP, 브라우저 정보, 이용 기록, 쿠키</li>
          </ul>
        </p>

        <h2 className="text-base font-semibold mt-6">2. 개인정보 수집 및 이용 목적</h2>
        <p>
          수집한 개인정보는 다음의 목적을 위해 사용됩니다.
          <ul className="list-disc ml-5 mt-2">
            <li>회원 식별 및 인증, 부정 이용 방지</li>
            <li>서비스 제공 및 맞춤형 콘텐츠 제공</li>
            <li>고지사항 전달 및 고객 지원</li>
            <li>마케팅 및 광고 활용 (선택적 동의 시)</li>
          </ul>
        </p>

        <h2 className="text-base font-semibold mt-6">3. 개인정보 보유 및 이용기간</h2>
        <p>
          원칙적으로 개인정보 수집 및 이용 목적이 달성되면 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 의해 일정 기간 보관이 필요한 경우에는 예외로 합니다.
          <ul className="list-disc ml-5 mt-2">
            <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
            <li>전자금융 거래에 관한 기록: 5년 (전자금융거래법)</li>
            <li>로그인 기록: 3개월 (통신비밀보호법)</li>
          </ul>
        </p>

        <h2 className="text-base font-semibold mt-6">4. 개인정보 제3자 제공</h2>
        <p>
          당사는 이용자의 동의 없이는 개인정보를 제3자에게 제공하지 않습니다. 다만 법령의 규정에 따라 요청이 있는 경우에는 예외로 합니다.
        </p>

        <h2 className="text-base font-semibold mt-6">5. 개인정보 처리 위탁</h2>
        <p>
          당사는 원활한 서비스를 제공하기 위해 일부 업무를 외부 전문업체에 위탁할 수 있습니다. 이 경우, 위탁 업체 및 위탁 업무 내용을 명확히 고지하며, 계약 등을 통해 개인정보가 안전하게 관리되도록 조치합니다.
        </p>

        <h2 className="text-base font-semibold mt-6">6. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 본인의 개인정보를 열람, 수정, 삭제, 처리 정지 요청할 수 있습니다. 또한 마케팅 정보 수신 여부는 설정을 통해 자유롭게 변경할 수 있습니다.
        </p>

        <h2 className="text-base font-semibold mt-6">7. 개인정보 보호를 위한 기술적/관리적 조치</h2>
        <p>
          당사는 다음과 같은 보안 조치를 통해 개인정보를 보호합니다.
          <ul className="list-disc ml-5 mt-2">
            <li>개인정보 접근 권한 최소화</li>
            <li>암호화 기술 적용 및 보안 시스템 운영</li>
            <li>정기적인 보안 점검 및 내부 감사</li>
          </ul>
        </p>

        <h2 className="text-base font-semibold mt-6">8. 개인정보 보호책임자</h2>
        <p>
          본 서비스는 개인정보 보호에 관한 업무를 총괄하여 책임지는 개인정보 보호책임자를 지정하고 있습니다.
          <br />
          • 이름: 홍길동 <br />
          • 이메일: privacy@kuest3.com <br />
          • 문의 가능 시간: 평일 10:00 ~ 18:00
        </p>

        <h2 className="text-base font-semibold mt-6">9. 변경 사항 고지</h2>
        <p>
          본 개인정보처리방침은 관련 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해 사전 공지합니다.
        </p>

        <p className="text-xs text-gray-400 mt-8">최종 업데이트: 2025년 4월 24일</p>
      </div>
    </div>
  );
};

export default PrivacyPolicies;
