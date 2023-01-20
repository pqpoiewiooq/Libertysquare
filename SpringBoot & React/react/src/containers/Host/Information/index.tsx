import styles from './Information.module.scss';
import { useSelector } from 'react-redux';
import { simpleNickname } from 'utils/TextUtil';
import { toDate, sinceFormat } from 'utils/DateUtil';


const Information = () => {
	const organization = useSelector((state) => state.organization.organization)!;
	
	return (
	<>
		<h2 className={styles.title}>소개</h2>
		<div className={styles.introduce}>
			{
				organization.simpleIntroduce?.split('\n').map(str => <p key={str}>{str}</p>)
			}
		</div>

		<div className={styles.container}>
			<h2 className={styles.title}>오거나이저</h2>
			<div className={styles.wrapper}>
				{
					organization.organizer.map(organizer => (
						<div className={styles.item} key={organizer.id}>
							<div className={styles['item-icon']}>{simpleNickname(organizer.nickname)}</div>
							&nbsp;
							<div className={styles['item-text']}>{organizer.nickname}</div>
						</div>
					))
				}
			</div>
			<div className={styles.since}>{sinceFormat(toDate(organization.since))}</div>
		</div>
	</>
	);
};

export default Information;