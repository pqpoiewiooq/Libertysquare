import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import logo from 'assets/image/logo.png';
import { useEventListener } from 'hooks';

const Header = () => {
	const memberInfo = useSelector((state: RootState) => state.member.memberInfo);

	const [visibility, toggle] = useState(false);
	const didMount = useRef(false);

	const handleDropdown = useCallback(() => {
		toggle(current => !current);
	}, []);

	const dropdown = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if(!didMount.current) {
			didMount.current = true;
			return;
		}

		let remove, add;
		if(visibility) {
			remove = styles.fadeOut;
			add = styles.fadeIn;
		} else {
			remove = styles.fadeIn;
			add = styles.fadeOut;
		}
		if(dropdown.current) {
			dropdown.current.classList.remove(remove);
			void dropdown.current.clientWidth;
			dropdown.current.classList.add(add);
		}
	}, [visibility]);

	useEventListener("resize", () => {
		if(visibility) toggle(false);
	});

	return (
		<header className={styles.wrapper}>
			<nav id={styles.gnb}>
				<div className={styles.left}>
					<Link className={styles.link} to="/event/new">행사 주최하기</Link>
				</div>

				<Link to="/"><img className={styles.logo} src={logo} alt="logo" /></Link>

				<div className={styles.right}>
					<Link className={styles.link} to="/document/help">Help Desk</Link>
					{
						memberInfo
						? <Link className={styles.btn} to="/my/tickets">{memberInfo.nickname}</Link>
						: <Link className={styles.btn} to="/sign">가입 혹은 로그인</Link>
					}

					<svg onClick={handleDropdown} className={styles.icon} viewBox="0 0 448 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor">
						<path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
					</svg>
				</div>
			</nav>
			<nav id={styles.dropdown} ref={dropdown}>
				{
					memberInfo
					?
					<>
						<Link to="/my/profile">프로필</Link>
						<hr className={styles.hr}/>
						<Link to="/my/tickets">내 티켓</Link>
						<Link to="/my/hosts">호스트</Link>
						<Link to="/my/events">주최한 행사</Link>
						<hr className={styles.hr}/>
						<Link to="/event/new">행사 주최하기</Link>
						<Link to="/document/help">Help Desk</Link>
						<Link to="/logout">로그아웃</Link>
					</>
					:
					<>
						<Link to="/sign">가입 또는 로그인</Link>
						<hr className={styles.hr}/>
						<Link to="/event/new">행사 주최하기</Link>
						<Link to="/document/help">Help Desk</Link>
					</>
				}
			</nav>
		</header>
	);
};

export default React.memo(Header);