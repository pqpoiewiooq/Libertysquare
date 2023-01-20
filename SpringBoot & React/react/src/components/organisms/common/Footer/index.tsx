import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import logo from 'assets/image/logo.png';

const Footer = () => {
	return (
		<footer className={styles.container}>
			<div className={styles.wrapper}>
				<Link to="/"><img className={styles.logo} src={logo} alt="로고" /></Link>
				<nav className={styles.fnb}>
					<Link to="/document/help">헬프 데스크</Link>
					<Link to="/document/code-of-conduct">COC</Link>
					<Link to="/document/terms">이용약관</Link>
					<Link to="/document/privacy">개인정보보호정책</Link>
				</nav>
				<p className={styles.text}>
					문의 이메일 {process.env.REACT_APP_QA_EMAIL}<br/>
					㈜ {process.env.REACT_APP_NAME} | 대표이사: {process.env.REACT_APP_CEO_NAME} | 개인정보관리책임자: 홍길동 | 사업자등록번호: {process.env.REACT_APP_BIZ_NUMBER}<br/>
					통신판매업 신고번호: {process.env.REACT_APP_MAIL_ORDER_SALES_NUMBER} | {process.env.REACT_APP_BIZ_ADDRESS}<br/>
					대표전화 {process.env.REACT_APP_BIZ_CONTACT} (문의는 이메일로 주세요.)
				</p>
			</div>
		</footer>
	);
};

export default React.memo(Footer);