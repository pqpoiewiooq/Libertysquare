import { ReactHelmet } from 'components/organisms';

const PaymentAgreement = () => {
	return (
		<>
			<ReactHelmet title="결제정보제공동의" />

			<h1>결제정보제공동의</h1>
			<h1>결제정보제공동의</h1>

			<section>
				<article>
					<p>
						{process.env.REACT_APP_NAME} 결제 대행사인 '토스페이먼츠(주)’에 카드 결제 처리를 위탁하기 위해 카드 정보와 생년월일을 제공합니다. 회원이 '티켓 구입' 버튼을 자발적으로 클릭하였을 시 위탁 사항에 대해 회원이 동의했음을 인지하고 개인정보가 제공됩니다. 전자상거래 등에서 소비자 보호에 관한 법률에 따라 전자금융의 기록은 5년 동안 보존됩니다.
						<br /><br />
						위탁업체 : 토스페이먼츠(주)<br />
						웹사이트 : https://www.tosspayments.com/<br />
						관련 방침 : 마이페이지 -&gt; help desk -&gt; 개인정보처리방침
					</p>
				</article>
			</section>
		</>
	);
};

export default PaymentAgreement;