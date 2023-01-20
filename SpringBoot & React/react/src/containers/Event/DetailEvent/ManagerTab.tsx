import styles from './DetailEvent.module.scss';
import { Link } from 'react-router-dom';

type ManagerTab = {
	to: string;
	text: string;
}

type ManagerTabProps = {
	title: string;
	tab: Array<ManagerTab>;
};

const ManagerTab = ({ title, tab } : ManagerTabProps) => {
	return (
		<div className={styles['manager-tab-container']}>
			<div className={styles['manager-tab-notice']}>{title}</div>
			<div className={styles['manager-tab-button-row']}>
				{tab.map(t => {
					<Link to={t.to} key={t.text}>
						<button className={styles['form-button blue manager-tab-button']}>{t.text}</button>
					</Link>
				})}
			</div>
		</div>
	);
};

export default ManagerTab;