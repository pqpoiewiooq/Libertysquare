import React from 'react';
import styles from './NeonHeader.module.scss';
import NeonImg1 from 'assets/image/neon/web.png';
import NeonImg2 from 'assets/image/neon/bulb.png';
import NeonImg3 from 'assets/image/neon/rocket.png';
import NeonImg4 from 'assets/image/neon/bulb2.png';
import NeonImg5 from 'assets/image/neon/rocket2.png';
import NeonImg6 from 'assets/image/neon/clock.png';

const NeonHeader = () => {
	return (
		<header className={styles.header}>
			<div className={styles['text-box']}>
				<div className={styles['animation-box']}>
					<span className={`${styles['animation-text']} ${styles.first}`}>{process.env.REACT_APP_NAME}</span>에서<br />
					<span className={`${styles['animation-text']} ${styles.second}`}>온라인 모임</span>과<br />
					<span className={`${styles['animation-text']} ${styles.third}`}>커뮤니티</span>를 만나세요.
				</div>
				<div className={styles.text}>강의, 모임, 행사 등 여러분이 생각하는 모든 것을 찾으세요.</div>
			</div>
			
			<div className={styles['search-bar']}>
				<div style={{width: "30%", maxWidth: "300px"}}>
					<div className={`${styles['search-bar-inner']} ${styles.input}`}>
						<div className={styles['search-bar-title']}>검색어</div>
						<input type="text" placeholder="제목, 호스트 이름으로 검색 하세요." className={styles['search-bar-input']} />
					</div>
				</div>
				<div style={{width: "22%", maxWidth: "200px"}}>
					<div className={`${styles['search-bar-inner']} ${styles.select}`}>
						<div className={styles['search-bar-title']}>행사 유형</div>
						<div className={styles['search-bar-text']}>전체</div>
					</div>
				</div>
				<div style={{width: "23%", maxWidth: "250px"}}>
					<div className={`${styles['search-bar-inner']} ${styles.select}`}>
						<div className={styles['search-bar-title']}>카테고리</div>
						<div className={styles['search-bar-text']}>전체</div>
					</div>
				</div>

				<div style={{width: "100%", maxWidth: "85px"}}>
					<div className={`${styles['search-bar-inner']} ${styles.select}`}>
						<div className={styles['search-bar-title']}>유/무료</div>
						<div className={styles['search-bar-text']}>전체</div>
					</div>
				</div>

				<button className={styles['search-btn']}>검색</button>
			</div>

			<div className={styles['search-container']}>
				<img src={NeonImg1} style={{position: "absolute", width: "171px", height: "172px", top: "56px", left: "calc(40% - 350px)"}} alt="neon1"/>
				<img src={NeonImg2} style={{position: "absolute", width: "195px", height: "194px", top: "179px", left: "calc(30% - 410px)"}} alt="neon2"/>
				<img src={NeonImg3} style={{position: "absolute", width: "156px", height: "152px", top: "393px", left: "calc(30% - 280px)"}} alt="neon3"/>
				<img src={NeonImg4} style={{position: "absolute", width: "161px", height: "151px", top: "88px", left: "calc(60% + 150px)"}} alt="neon4"/>
				<img src={NeonImg5} style={{position: "absolute", width: "172px", height: "175px", top: "166px", left: "calc(70% + 150px)"}} alt="neon5"/>
				<img src={NeonImg6} style={{position: "absolute", width: "195px", height: "191px", top: "389px", left: "calc(70% + 200px)"}} alt="neon6"/>
			</div>
		</header>
	);
};

export default React.memo(NeonHeader);