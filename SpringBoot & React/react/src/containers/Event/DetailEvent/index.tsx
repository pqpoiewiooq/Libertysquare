import { useRef, useCallback } from 'react';


import styles from './DetailEvent.module.scss';
import Location from './Location';
import TicketInfo from './TicketInfo';
import Contact from './Contact';

import { Link } from 'react-router-dom';
import { Svg, Button } from 'components/atoms';
import { useParams } from 'react-router';
import { getEvent } from 'utils/api/EventApi';
import { Error404, ReactHelmet } from 'components/organisms';
import { withAxios, withBaseComponents } from 'components/HOC';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { termFormat, toDate } from 'utils/DateUtil';
import EventUtil from 'utils/EventUtil';
import { containsOrganizer } from 'utils/ArrayUtil';
import { useEventListener } from 'hooks';
import { useEffect } from 'react';

const standardWidth = 1024;

type DetailEventProps = {
	data: DetailEvent;
};

const DetailEvent = ({ data } : DetailEventProps) => {
	const e = EventUtil.pretty(data);
	const { 
		event,
		organization,
		ticket,
		personnel,
		buyButtonText,
		buyLink,
		priceString,
		wasExpiredEvent
	} = e;

	const memberId = useSelector((state: RootState) => state.member.memberInfo?.id);
	const hosted = memberId ? containsOrganizer(organization.organizer, memberId) : false;

	/* 스타일 정의 */
	const imageStyle = { background: `url(${event.coverPath}) center center / cover no-repeat` };
	const desktopTitleStyle = hosted ? { marginTop: "5px" } : undefined;

	/* element 정의 */
	const mainImage = <div className={styles['main-image']} style={imageStyle}></div>;

	const managerTabElement = hosted ? (
		<div className={styles['manager-tab-container']}>
			<div className={styles['manager-tab-notice']}>이 행사는 내가 주최 중입니다</div>
			<div className={styles['manager-tab-button-row']}>
				<Link to={`/manage/edit/${event.id}`}><Button buttonStyle="confirm" text="행사 수정하기" className={styles['manager-tab-button']} /></Link>
				<Link to={`/manage/attendee/${event.id}`}><Button buttonStyle="confirm" text="참가자 목록" className={styles['manager-tab-button']} /></Link>
			</div>
		</div>
	) : undefined;

	const dateElement = (
		<div className={styles['date-wrapper']}>
			<div className={styles['meta-title']}>일시</div>
			<div className={styles['meta-text']}>{termFormat(toDate(event.dtStart), toDate(event.dtEnd))}</div>
		</div>
	);

	const ticketElement = <TicketInfo tickets={ticket}/>;

	const contactElement = <Contact email={event.contactEmail} tel={event.contactTel}/>;

	const organizationElement = (
		<div className={styles['organizer-wrapper']}>
			<div className={styles['meta-title']}>주최</div>
			<Link className={`${styles['host-box']} ${styles.fsize0}`} to={`/host/${organization.id}`}>
				<img className={styles['host-image']} src={organization.profilePath} alt="host-profile"/>
				<div className={styles['host-text']}>{organization.name}</div>
				<svg viewBox="0 0 576 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" style={{ margin: "11px" }}>
					<path fill="currentColor" d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z"></path>
				</svg>
			</Link>
		</div>
	);

	const atElement = <div className={styles['primary-venue']}>at {event.isOnline ? event.detailVenue : event.venue}</div>;
	
	const hrElement = <hr className={styles['primary-hr']}></hr>;


	/* 이벤트 설정 */
	const isLargeScreen = useRef<boolean>(false);
	const isFixed = useRef<boolean>(false);
	const infoBar = useRef<HTMLDivElement>(null);
	const fakeInfoBar = useRef<HTMLDivElement>(null);
	const infoBarTop = useRef(0);
	const mobileBottomPaddingElement = useRef(document.createElement("div"));

	const changeFixed = useCallback((f: boolean) => {
		if(!infoBar.current || !fakeInfoBar.current) return;

		if(f) {
			infoBar.current.className = styles['info-bar--fixed'];
			fakeInfoBar.current.style.display = "block";
			isFixed.current = true;
		} else {
			infoBar.current.className = styles['info-bar'];
			fakeInfoBar.current.style.display = "none";
			isFixed.current = false;
		}
	}, []);

	const mScorllEventListener = useCallback(() => {
		let scrollLocation = document.documentElement.scrollTop;
		
		if(isFixed.current === false && scrollLocation >= infoBarTop.current){
			changeFixed(true);
		} else if(isFixed.current === true && scrollLocation < infoBarTop.current){
			changeFixed(false);
		}
	}, [changeFixed]);
	
	const initVariable = useCallback(() => {
		if(!infoBar.current || !fakeInfoBar.current) return;

		let width = window.innerWidth;
		
		if (isLargeScreen.current === false && width >= standardWidth) {
			infoBarTop.current = infoBar.current.getBoundingClientRect().top + window.pageYOffset;
			isLargeScreen.current = true;
			mScorllEventListener();
			window.addEventListener('scroll', mScorllEventListener);
			mobileBottomPaddingElement.current.remove();
		} else if(isLargeScreen.current === true && width < standardWidth) {
			isLargeScreen.current = false;
			changeFixed(false);
			window.removeEventListener('scroll', mScorllEventListener);
			mobileBottomPaddingElement.current.className = styles['bottom-padding'];
			document.getElementById("root")!.append(mobileBottomPaddingElement.current);
		}
	}, [mScorllEventListener, changeFixed]);

	useEventListener("resize", initVariable);
	useEffect(() => {
		initVariable();
		window.addEventListener('scroll', mScorllEventListener);
	});

	return (
	<>
		<ReactHelmet />

		<div id="desktopView">
			<section className={styles.container}>
				<article className={styles['info-box']}>
					<div className={styles['image-wrapper']}>
						{ mainImage }
					</div>
					<div className={styles['primary-wrapper']}>
						{ managerTabElement }
						<h1 className={styles['primary-title']} style={desktopTitleStyle}>{event.title}</h1>
						
						{ atElement }
						{ dateElement }
						{ organizationElement }
					</div>
				</article>
				
				<div className={styles['main-price']}>{ priceString }</div>
				<div className={styles['info-bar-default-height']} ref={fakeInfoBar}></div>
				<article className={styles['info-bar']} ref={infoBar}>
					<div className={styles['info-bar-wrapper']}>
						<div className={styles['info-bar-inner']}>
							<div>
								<div className={styles['info-bar-title']}>{ event.title }</div>
								<span className={styles['personnel fsize0']}>
									<Svg viewBox="0 0 640 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></Svg>
									<span>&nbsp;{personnel}명</span>
								</span>
							</div>
						</div>
						<Link className={wasExpiredEvent ? `${styles['buy-button']} ${styles['expired-button']}` : styles['buy-button']} to={buyLink}>{buyButtonText}</Link>
					</div>
				</article>

				<article className={styles['desktop-info-container']}>
					<div className={styles['content-box']}>{event.content}</div>
					<div className={styles['ticket-box']}>
						{ ticketElement }
						{ contactElement }
					</div>
				</article>
				
				<Location { ...event }/>
			</section>
		</div>


		{/* <!-- 모바일 뷰 --> */}
		<div id="mobileView">
			{ mainImage }
			<section className={styles.container}>
				<article className={styles['primary-wrapper']}>
					{ managerTabElement }
					<h1>{ event.title }</h1>
					{ atElement }
					<div className={`${styles.personnel} ${styles.fsize0}`}>
						<svg viewBox="0 0 24 24" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
						</svg>
						<span>{ personnel }명</span>
					</div>
					{ hrElement }
					{ dateElement }
					{ organizationElement }
					{ hrElement }
				</article>
				<article className={styles['content-box']}>{event.content}</article>
				<Location { ...event } isMobile={true} />
				{ ticketElement }
				{ contactElement }
			</section>
			<article className={styles['mobile-info-bar']}>
				<Link className={wasExpiredEvent ? `${styles['mobile-buy-button']} ${styles['expired-button']}` : styles['mobile-buy-button']} to={buyLink}>{buyButtonText}</Link>
			</article>
		</div>
	</>
	)
};

const DetailEventWrapper = () => {
	const params = useParams();
	const id = params.id;
	
	return (
		id
		?
		withAxios({
			axios: getEvent,
			payload: id as number | string,
			Success: withBaseComponents(DetailEvent),
			Error: <Error404 />
		})
		:
		<Error404 />
	);
}

export default DetailEventWrapper;
