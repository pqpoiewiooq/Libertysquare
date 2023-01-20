import React from 'react';
import styles from './SelectableAddButton.module.scss';

type SelectableAddButtonProps = {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const SelectableAddButton = ({ children, onClick } : SelectableAddButtonProps) => {
	return (
		<button type="button" className={styles.container} onClick={onClick}>
			<div className={styles['icon-wrapper']}>
				<svg viewBox="0 0 448 512" aria-hidden="true" focusable="false" fill="currentColor" className={styles.icon}>
					<path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
				</svg>
			</div>
			<span className={styles.inner}>{children}</span>
		</button>
	);
};

export default React.memo(SelectableAddButton);