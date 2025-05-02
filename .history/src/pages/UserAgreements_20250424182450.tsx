import React from 'react';

const UserAgreements = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-[Pretendard]">
      <h1 className="text-2xl font-bold mb-6">이용약관</h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700">
        <p>
          본 서비스에 회원가입함으로써 귀하는 본 이용약관에 동의하는 것으로 간주됩니다.
          본 서비스는 마케팅, 이벤트 및 혜택 관련 정보를 제공할 수 있으며, 귀하는 언제든지 수신을 거부할 수 있습니다.
        </p>
        <p>
          회원은 서비스 내에서 제공하는 정보와 콘텐츠를 상업적인 목적으로 무단 이용할 수 없습니다. 서비스 이용 중 불법 행위나 부정한 방법으로의 접근은 금지됩니다.
        </p>
        <p>
          본 약관은 수시로 변경될 수 있으며, 변경 시 사전 고지 후 적용됩니다. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
        </p>
        <p>
          기타 자세한 내용은 운영진에게 문의 주시기 바랍니다.
        </p>
      </div>
    </div>
  );
};

export default UserAgreements;
