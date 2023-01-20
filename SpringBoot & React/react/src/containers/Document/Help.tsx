import { ReactHelmet } from 'components/organisms';

const Help = () => {
	const anchorStyle = { color: "orange" };
	
	return (
		<>
			<ReactHelmet title="헬프 데스크" />

			<h1>LSquare Help Desk</h1>
			<h1>안녕하세요, 저는 ________</h1>

			<section>
				<h2 id="attendee"><a href="#attendee">참가자입니다 🎟</a></h2>
				<hr />
				<article>
					<h3>1. 구입한 티켓은 어디서 확인하나요?</h3>
					<p>로그인 하신 후 ‘내 티켓' 페이지로 들어가시면 구입한 티켓들이 표시됩니다.</p>
				</article>
				<article>
					<h3>2. 구입한 티켓은 언제까지 환불할 수 있나요?</h3>
					<p>구입한 티켓은 주최자가 지정한 환불 마감일 이전에는 언제든 환불을 신청할 수 있습니다. 구입한 티켓의 환불 신청 버튼을 클릭함으로써 환불 마감일을 확인할 수 있고, 환불 신청을 진행할 수 있습니다. 환불 신청 시 별도 수수료 없이 해당 결제가 즉시 취소됩니다.</p>
					<p>환불 마감일 이후에는 {process.env.REACT_APP_NAME}에서 환불처리를 할 수 없습니다. 본 서비스는 참가자의 결제 금액을 주최자에게 전달하는 서비스이기 때문입니다. 환불 마감일 이후 환불 문의는 주최자에게 직접 해야하며, 주최자의 판단으로 환불 처리될 수도 있습니다.</p>
					<p>행사가 종료된 후에는 {process.env.REACT_APP_NAME}에서는 어떠한 환불조치도 가능하지 않습니다.</p>
				</article>
				<article>
					<h3>3. 티켓을 구입했는데 사이트에 접속할 수 없는 상황입니다.</h3>
					<p>주최자는 참가자격을 다양한 방법을 통해 확인할 수 있습니다. 행사장에서 이름, 전화번호 또는 이메일을 얘기하시면 주최자가 해당 기능을 통해 참가자격을 확인할 것입니다.</p>
				</article>
				<article>
					<h3>4. 티켓을 결제했는데 다른 카드로 변경할 수 있나요?</h3>
					<p>이미 결제된 카드의 결제 방식을 변경하는 것은 불가능합니다. 필요하신 경우, 새로운 카드로 다시 구입하시고 기존 티켓은 환불신청 하셔야 합니다. 이때 티켓이 충분히 남았는지 반드시 확인하시길 바랍니다. 새로 구입하는 과정에서 티켓이 매진되어 구입하지 못하는 경우 {process.env.REACT_APP_NAME}에서 어떠한 조치도 취해드릴 수 없습니다.</p>
				</article>
				<article>
					<h3>5. 티켓을 구입하니 제 카드가 저장되어있습니다</h3>
					<p>{process.env.REACT_APP_NAME}은 참가자가 행사에 손쉽게 참가할 수 있도록 카드를 저장하여 다음 번 결제에 사용할 수 있게 합니다. 다만 {process.env.REACT_APP_NAME}에서 저장하는 카드 정보는 카드 번호 마지막 4자리와 유효기간 뿐이며 그 외의 정보는 보안을 위해 저장하지 않습니다. 결제는 카드사에서 발급된 임시 암호로 이루어집니다. 따라서 중요한 카드정보는 유출되지 않으니 안심하셔도 됩니다.</p>
				</article>
				<article>
					<h3>6. 현금영수증 / 세금계산서 발급받을 수 있나요?</h3>
					<p>{process.env.REACT_APP_NAME}은 카드결제만 지원하므로 현금영수증 및 세금계산서 발급이 가능하지 않습니다. 사업자 매입증명을 위해서는 신용카드매출전표를 이용하시거나 사업자 신용카드 또는 법인카드로 결제해주시길 바랍니다. 기부금 영수증은 주최자에게 문의하시기 바랍니다.</p>
				</article>
			</section>

			<section>
				<h2 id="host"><a href="#host">주최자입니다 🎇</a></h2>
				<hr />
				<article>
					<h3>1. 주최자는 '{process.env.REACT_APP_NAME}'에서 무엇을 할 수 있나요?</h3>
					<p>다음과 같이 {process.env.REACT_APP_NAME}을 이용해보세요.</p>
					<ul itemType="circle">
						<li>쉽고 간편하게 <strong>행사 페이지</strong>를 만들 수 있어요.</li>
						<li>유튜브처럼 개인 브랜드를 키울 수 있도록 <strong>호스트 페이지</strong>를 만들 수 있어요.</li>
						<li><strong>참가자 목록</strong>을 사이트에서 조회하고 검색할 수 있어요.</li>
						<li><strong>출석 체크</strong> 기능으로 행사에 몇명이 참가했는지 알 수 있어요.</li>
						<li><strong>QR 스캐너</strong>를 띄워서 참가자들이 QR 코드를 직접 찍어 입장할 수 있어요.</li>
						<li>참가자가 구입한 티켓을 <strong>직접 환불</strong> 처리할 수 있어요.</li>
						<li>활용성이 무궁무진한 <strong>티켓 옵션</strong> 기능을 사용할 수 있어요. 티켓 구입 전에 <strong>사전 질문</strong>을 작성하게 하거나,<strong>재고가 한정된 선물</strong>을 고르게 할 수 있어요. 선택하는 아이템마다 <strong>별도의 가격</strong>을 티켓에 더할 수도 있어요.</li>
						<li>미리 신청을 받아놓고 <strong>주최자가 승인한 사람만</strong> 자동결제 시킬 수 있어요.</li>
						<li>더 좋은 기능들을 계속해서 개발하고 있습니다. 출석 체크, QR코드 출석 기능에 대한 자세한 안내문은 <a href="/qr-manual.pdf" style={anchorStyle}>여기서</a> 다운로드 받으세요.</li>
					</ul>
				</article>
				<article>
					<h3>2. 제 행사에 참가하는 회원들은 어떤 방식으로 결제하게 되나요?</h3>
					<p>현재는 카드결제만 지원합니다. 별도의 결제창이 뜨지 않고 카드 정보 일부를 작성하여 결제합니다.</p>
				</article>
				<article>
					<h3>3. 참가자가 본인 티켓을 직접 환불 할 수 있나요?</h3>
					<p>각 티켓의 환불 마감일 이전에는 참가자가 사이트에서 언제든 직접 환불할 수 있습니다. 이는 {process.env.REACT_APP_NAME}의 운영방침으로서, 주최자가 참가자의 환불을 금지할 수 없습니다.</p>
					<p>티켓의 환불 마감일이 지난 후에는 참가자는 해당 티켓을 직접 환불할 수 없습니다. 환불 마감일 후 ~ 행사 종료 전까지는 주최자가 '환불 처리 기능’을 이용하여 직접 환불 처리할 수 있으나, 이 기간동안의 환불 가능여부는 주최자께서 결정하여 진행해주시면 되겠습니다.</p>
					<p>행사라는 상품의 특성상 행사 종료 후 환불 및 결제 취소는 불가능 합니다. 행사 종료 후 참가자가 환불 요청을 하거나 결제 방식 변경을 위한 재결제를 요청할 수도 있습니다. 이런 경우 {process.env.REACT_APP_NAME}에서의 결제는 취소할 수 없음을 알리셔야 합니다. 다만 주최자가 판단하기에 환불이 불가피한 경우라면 주최자가 직접 현금으로 환급해주는 등의 해결책을 마련하시기 바랍니다.</p>
					<p>환불 시 주최자나 참가자에게 부담되는 수수료는 없으며 전액 결제취소됩니다.</p>
				</article>
				<article>
					<h3>4. 수수료는 얼마인가요?</h3>
					<p>무료 행사는 수수료가 없습니다.</p>
					<p>{process.env.REACT_APP_NAME} 이용료는 전체 판매 금액의 1.7% 입니다. 결제대행사 관련 수수료는 3.3% 입니다. (VAT별도)</p>
				</article>
				<article>
					<h3>5. 정산은 어떻게 진행되나요?</h3>
					<p>행사 종료 후 통상 10 영업일 전후로 정산서를 보내드립니다. 정산서를 확인하신 후 다음과 같은 서류를<a href="mailto:{process.env.REACT_APP_QA_EMAIL}" style={anchorStyle}>{process.env.REACT_APP_QA_EMAIL}</a>로 전달해주세요.</p>
					<p>
						<li>개인 : 신분증 사본, 통장 사본</li>
						<li>사업자 : 사업자등록증 사본, 통장 사본</li>
						<li>비영리, 면세사업자 : 사업자등록증 또는 고유번호증 사본, 통장 사본</li>
					</p>
					<p>{process.env.REACT_APP_NAME}에서 서류 확인 후 전체 판매 금액에서 수수료를 제외한 금액을 입금해드립니다. 또한 전체 수수료에 대하여 세금계산서를 발행합니다. 주최자는 참가자들로 부터 수익을 얻게 된 것이므로 의무적으로 세금 신고를 하시기 바랍니다. {process.env.REACT_APP_NAME}에서 제공하는 정산서를 참고하여 서비스 수수료를 포함한 전체 판매 금액으로 소득을 신고하시면 되겠습니다.</p>
				</article>
			</section>
			
			<section>
				<h2 id="supporter"><a href="#supporter">후원자입니다 💸</a></h2>
				<hr />
				<article>
					<h3>1. 어떻게 후원을 하나요?</h3>
					<p>후원단체가 등록한 계좌 혹은 별도의 URL을 통해 후원하실 수 있습니다.</p>
				</article>
				<article>
					<h3>2. 후원단체는 믿을만 한가요?</h3>
					<p>본 서비스는 보다 더 많은 단체가 홍보할 수 있도록 별도의 진입장벽을 규정하지 않습니다. 후원자는 후원단체의 진위 여부, 활동 등을 확인 후 신중히 후원하시기 바랍니다.</p>
				</article>
				<article>
					<h3>3. 후원 내역은 어디서 확인하나요?</h3>
					<p>본 서비스는 후원단체가 후원자에게 단체를 홍보하는 서비스입니다. {process.env.REACT_APP_NAME} 플랫폼을 통해 이루어지는 후원이 아니기 때문에 {process.env.REACT_APP_NAME}은 후원 내역에 대한 정보가 없습니다. 후원 정보에 대해서는 후원단체에게 문의하시기 바랍니다.</p>
				</article>
				<article>
					<h3>4. 후원 금액은 언제까지 환불할 수 있나요?</h3>
					<p>환불 문의는 후원단체에게 직접 해야 하며, 후원단체의 판단으로 환불 처리될 수도 있습니다.</p>
				</article>
				<article>
					<h3>5. 현금영수증 / 세금계산서 발급받을 수 있나요?</h3>
					<p>{process.env.REACT_APP_NAME}은 후원 내역에 대한 정보가 전혀 없습니다. 기부금 영수증은 후원단체에게 문의하시기 바랍니다.</p>
				</article>
			</section>
			
			<section>
				<h2 id="support-host"><a href="#support-host">후원단체입니다 💖</a></h2>
				<hr />
				<article>
					<h3>1. 후원단체는 '{process.env.REACT_APP_NAME}'에서 무엇을 할 수 있나요?</h3>
					<p>다음과 같이 {process.env.REACT_APP_NAME}을 이용해보세요.</p>
					<ul itemType="circle">
						<li>간편하고 안전한 <strong>후원 페이지</strong>를 만들 수 있어요.</li>
						<li>유튜브처럼 단체 브랜드를 키울 수 있도록 <strong>호스트 페이지</strong>를 만들 수 있어요.</li>
						<li>후원 페이지에 단체를 <strong>상단 배치</strong> 및 <strong>광고</strong>할 수 있어요.</li>
					</ul>
				</article>
				<article>
					<h3>2. 후원자들은 어떤 방식으로 결제하게 되나요?</h3>
					<p>후원단체 등록 시 입력한 링크를 통해 후원하거나 공개한 계좌번호를 통해 후원자가 직접 후원합니다.</p>
				</article>
				<article>
					<h3>3. 후원자가 후원을 직접 취소할 수 있나요?</h3>
					<p>{process.env.REACT_APP_NAME}은 후원자의 후원 내역에 대한 정보가 전혀 없습니다. 후원단체가 직접 환급해 주는 등의 해결책을 마련하시기 바랍니다.</p>
				</article>
			</section>
		</>
	);
};

export default Help;