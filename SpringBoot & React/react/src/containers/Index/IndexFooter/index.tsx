import React from 'react';
import styles from './IndexFooter.module.scss';
import { Link } from 'react-router-dom';
import logo from 'assets/image/logo.png';

const IndexFooter = () => {

	return (
		<footer id={styles.footer}>
			<div>
				<img className={styles.logo} src={logo} alt="logo"/>
				<span className={styles.copylight}><br />© 2020 Libertysqaure, Inc. All rights reserved.</span>
			</div>
			<div>
				<div className={styles.section}>
					<ul className={styles['link-container']}>
						<li><Link to={`mailto:${process.env.REACT_APP_QA_EMAIL}`}>고객센터: {process.env.REACT_APP_QA_EMAIL}</Link></li>|
						<li><Link to="/document/help">자주 묻는 질문</Link></li>|
						<li><Link to="/document/code-of-conduct">{process.env.REACT_APP_NAME} 규칙</Link></li>|
						<li><Link to="/document/terms">이용약관</Link></li>|
						<li><Link to="/document/privacy">개인정보처리방침</Link></li>
					</ul>
				</div>
				<div className={`${styles.section} ${styles.mobile}`}>
					<Link to={`mailto:${process.env.REACT_APP_QA_EMAIL}`}><strong>고객센터: {process.env.REACT_APP_QA_EMAIL}</strong></Link>
					<br />
					<ul className={styles['link-container']}>
						<li><Link to="/document/help">자주 묻는 질문</Link></li>|
						<li><Link to="/document/code-of-conduct">{process.env.REACT_APP_NAME} 규칙</Link></li>|
						<li><Link to="/document/terms">이용약관</Link></li>|
						<li><Link to="/document/privacy">개인정보처리방침</Link></li>
					</ul>
				</div>
			</div>

			<div>
				<div className={styles.section}>
					<span className={styles['info-text']}>㈜ {process.env.REACT_APP_NAME}</span>|
					<span className={styles['info-text']}>{process.env.REACT_APP_BIZ_ADDRESS}</span>|
					<span className={styles['info-text']}>대표 : {process.env.REACT_APP_CEO_NAME}</span>|
					<span className={styles['info-text']}>사업자 등록번호 : {process.env.REACT_APP_BIZ_NUMBER}</span>|
					<span className={styles['info-text']}>{process.env.REACT_APP_MAIL_ORDER_SALES_NUMBER}</span>|
					<span className={styles['info-text']}>대표번호 : {process.env.REACT_APP_BIZ_CONTACT}(문의는 이메일로 주세요)</span>
				</div>
				<div className={`${styles.section} ${styles.mobile}`}>
					<b>㈜ {process.env.REACT_APP_NAME}</b>
					<br />
					<span className={styles['info-text']}>{process.env.REACT_APP_BIZ_ADDRESS}</span>|
					<span className={styles['info-text']}>대표 : {process.env.REACT_APP_CEO_NAME}</span>|
					<span className={styles['info-text']}>사업자 등록번호 : {process.env.REACT_APP_BIZ_NUMBER}</span>|
					<span className={styles['info-text']}>{process.env.REACT_APP_MAIL_ORDER_SALES_NUMBER}</span>|
					<span className={styles['info-text']}>대표번호 : {process.env.REACT_APP_BIZ_CONTACT}(문의는 이메일로 주세요)</span>
				</div>
			</div>

			<p>{process.env.REACT_APP_NAME}은 통신판매중개자로써 행사에 대한 거래 당사자 및 주최자가 아니며 , 주최자가 등록한 모든 내용과 거래에 대해 {process.env.REACT_APP_NAME}은 일체의 책임을 지지 않습니다.</p>

			<span className={`${styles.section} ${styles.mobile}`}>© 2021 Libertysqaure, Inc. All rights reserved.</span>
		</footer>
	);
};

export default React.memo(IndexFooter);