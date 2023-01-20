import React from 'react';
import styles from './SelectableItem.module.scss';

type SelectableItemProps = {
	icon?: string;
	title: string;
	desc: string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	active?: boolean;
}

const SelectableItem = ({ icon, title, desc, onClick, active } : SelectableItemProps) => {
	let className = styles.container;
	if(active) className += ` ${styles.active}`;
	if(icon) className += ` ${styles.flex}`;
	return (
		<div className={className} onClick={onClick}>
			{
				icon
				?
				<>
					<div><img src={icon} alt={`${title} icon`} className={styles.icon} /></div>
					<div>
						<p className={styles.title}>{title}</p>
						<p className={styles.desc}>{desc}</p>
					</div>
				</>
				:
				<>
					<p className={styles.title}>{title}</p>
					<p className={styles.desc}>{desc}</p>
				</>
			}
		</div>
	);
};

export default React.memo(SelectableItem);