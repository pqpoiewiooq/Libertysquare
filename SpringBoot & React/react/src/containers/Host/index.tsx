import { Routes, Route, useParams, Navigate, Link } from 'react-router-dom';
import styles from './Host.module.scss';
import { Svg, Nav, Loading } from 'components/atoms';
import { Error404 } from 'components/organisms';
import { sinceFormat, toDate } from 'utils/DateUtil';
import { containsOrganizer } from 'utils/ArrayUtil';

import { useDispatch, useSelector } from 'react-redux';
import { lookupRequest } from 'store/reducers/organization';

import Events from './Events';
import Information from './Information';
import Edit from './Edit';

function imageStyle(url: string) {
	return { background: `url(${url}) center center / cover no-repeat` };
}

const Host = (): JSX.Element => {
	const params = useParams() as Params<number>;
	const id = params.id;

	const memberId = useSelector((state) => state.member.memberInfo?.id);
	const organization = useSelector((state) => state.organization.organization);
	const dispatch = useDispatch();
	
	if(isNaN(id)) return <Error404 />
	if(!organization || organization.id !== id) {
		dispatch(lookupRequest(id!));
		return <Loading />;
	}
	
	const subscribeStyle = `.${styles.subscribe} { border: 1px solid ${organization.themeColor}; color: ${organization.themeColor}; }`;
	const navStyle = `.${styles.menu}.${styles.active} { color: ${organization.themeColor}; }`;
	const footerStyle = `#${styles.footer} { color: ${organization.themeColor}; }`;

	const navStyleProps = { className: styles.menu, classNameActive: `${styles.menu} ${styles.active}` };

	return (
		<div id={styles.template}>
			<style>
				{subscribeStyle}
				{navStyle}
				{footerStyle}
			</style>

			<header id={styles.header}>
				<div className={styles.banner} style={imageStyle(organization.coverPath)}></div>
			</header>

			<main id={styles.main}>
				<section>
					<div className={styles['info-container']}>
						<div className={styles.profile} style={imageStyle(organization.profilePath)}></div>
						<div>
							<div className={styles.name}>{organization.name}</div>
							<div className={styles.since}>{sinceFormat(toDate(organization.since))}</div>
							<div className={styles.introduce}>{organization.simpleIntroduce}</div>
							<div className={styles['info-inner']}>
								<button type="button" className={organization.hasSubscribed ? `${styles.subscribe} ${styles.on}` : styles.subscribe}>
									<Svg viewBox="0 0 512 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></Svg>
									<div className={styles['subscribe-count']}>{organization.subscribeCount}</div>
								</button>
								<div className={styles.info}>주최한 행사 {organization.hostedEventCount} | 참가자 {organization.totalAttendee} 명</div>
							</div>
						</div>
					</div>

					<div className={styles['menu-bar']}>
						<Nav {...navStyleProps} to={`/host/${organization.id}`}>행사</Nav>
						<Nav {...navStyleProps} to={`/host/${organization.id}/info`}>호스트 정보</Nav>
						{ containsOrganizer(organization.organizer, memberId) && <Nav {...navStyleProps} to={`/host/${organization.id}/edit`}>호스트 관리</Nav> }
					</div>
				</section>

				<section id={styles.content}>
					<Routes>
						<Route path="/" element={<Events />} />
						<Route path="info" element={<Information />} />
						{ containsOrganizer(organization.organizer, memberId) && <Route path="edit" element={<Edit />} /> }
						<Route path="*" element={<Navigate to=".."/>} />
					</Routes>
				</section>

				<footer id={styles.footer}>
					<Link to="/">
						<div className={styles['footer-logo-wrapper']}>{process.env.REACT_APP_NAME}</div>
						<div className={styles.copyright}>© 2021</div>
					</Link>
				</footer>
			</main>
		</div>
	);
};


export default Host;