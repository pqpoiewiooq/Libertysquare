import React from 'react';
import styles from './IndexTop.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import logo from 'assets/image/logo.png';
import { Link } from 'react-router-dom';
import { simpleNickname } from 'utils/TextUtil';

const IndexTop = () => {
	const { memberInfo } = useSelector((state: RootState) => state.member);

	const onClick = (when: number) => {};

	return (
		<>
			<div id={styles.top}>
				<div className={styles['top-container']}>
					<img className={styles['logo']} src={logo} alt="logo"/>
					<ul className={styles['top-link-box']}>
						<li><Link to="/event/new">행사 주최하기</Link></li>
						<li><Link to="/document/help">헬프 데스크</Link></li>
						{
							memberInfo
							?
								<Link className={styles['btn-mypage']} to="/my/tickets">
									<div className={styles['inner2']}>
										{ simpleNickname(memberInfo.nickname) }
									</div>
								</Link>
							:
								<>
									<li><Link to="/sign">로그인</Link></li>
									<li><Link to="/signup">회원가입</Link></li>
								</>
						}
					</ul>
				</div>

				<ul className={styles['lnb']}>
					<button onClick={()=>{onClick(0)}}>추천</button>
					<button onClick={()=>{onClick(1)}}>최신</button>
					<button onClick={()=>{onClick(2)}}>온라인</button>
					<button onClick={()=>{onClick(3)}}>마감 임박</button>
					<button onClick={()=>{onClick(4)}}>무료</button>
				</ul>
			</div>

			<div id={styles.top_mobile}>
				<img className={styles['logo-mobile']} src={logo} alt="logo-mobile"/>
				{
					memberInfo
					?
						<div className={`${styles['dropdown-btn']} ${styles['dropdown-menu-user-icon']}`}>
							<div className={styles['dropdown-menu-user-icon-inner']}>
								{ simpleNickname(memberInfo.nickname) }
							</div>
						</div>
					:
						<div className={`${styles['dropdown-btn']} ${styles['dropdown-btn-icon']}`}></div>
				}
				<div className={styles['header-search-bar-mobile']}>
					<div className={styles['header-search-icon-mobile']}></div>
					<input className={styles['header-search-input-mobile']} placeholder="어떤 행사를 찾고 있나요?" readOnly />
				</div>
				<ul className={styles['lnb-mobile']}>
					<li onClick={()=>{onClick(0)}}>추천</li>
					<li onClick={()=>{onClick(1)}}>최신</li>
					<li onClick={()=>{onClick(2)}}>온라인</li>
					<li onClick={()=>{onClick(3)}}>마감 임박</li>
					<li onClick={()=>{onClick(4)}}>무료</li>
				</ul>
			</div>
		</>
	);
};

export default React.memo(IndexTop);