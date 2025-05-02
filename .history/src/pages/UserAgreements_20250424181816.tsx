import React from 'react';

const UserAgreements = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-['Pretendard','Montserrat'] px-4 py-12">
      <div className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">이용약관</h1>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            본 약관은 Kuest3(이하 “회사”)가 제공하는 서비스(이하 “서비스”)의 이용과 관련하여, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
          </p>

          <h2 className="font-semibold text-base mt-6">제1조 (회원가입)</h2>
          <p>
            회원은 회사가 정한 절차에 따라 회원가입을 신청하고, 회사가 이를 승낙함으로써 서비스 이용계약이 체결됩니다. 회원은 본인의 이메일 또는 Google 계정으로 가입할 수 있으며, 회사는 필요한 경우 본인확인 절차를 추가할 수 있습니다.
          </p>

          <h2 className="font-semibold text-base mt-6">제2조 (개인정보 수집 및 이용)</h2>
          <p>
            회사는 서비스 제공을 위해 최소한의 개인정보를 수집하며, 수집된 정보는 개인정보처리방침에 따라 안전하게 보호됩니다. 회원은 언제든지 수집에 대한 동의를 철회할 수 있으며, 철회 시 서비스 이용이 제한될 수 있습니다.
          </p>

          <h2 className="font-semibold text-base mt-6">제3조 (마케팅 정보 수신 동의)</h2>
          <p>
            회원은 회사가 제공하는 이벤트, 프로모션, 뉴스레터 등의 마케팅 정보를 이메일 또는 SMS로 수신하는 것에 동의할 수 있습니다. 수신 동의는 언제든지 철회 가능합니다.
          </p>

          <h2 className="font-semibold text-base mt-6">제4조 (서비스의 변경 및 중단)</h2>
          <p>
            회사는 서비스의 일부 또는 전부를 사전 통지 없이 변경하거나 중단할 수 있으며, 이에 대해 책임을 지지 않습니다. 단, 유료 서비스의 경우 별도의 약관이 적용됩니다.
          </p>

          <h2 className="font-semibold text-base mt-6">제5조 (회원의 의무)</h2>
          <p>
            회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>타인의 정보를 도용하거나 허위 정보를 입력하는 행위</li>
            <li>회사의 서비스 운영을 방해하는 행위</li>
            <li>법령에 위반되는 행위 및 공공질서, 미풍양속에 반하는 행위</li>
          </ul>

          <p className="mt-6 text-xs text-gray-500 text-right">최종 업데이트: 2025년 4월</p>
        </div>
      </div>
    </div>
  );
};

export default UserAgreements;
