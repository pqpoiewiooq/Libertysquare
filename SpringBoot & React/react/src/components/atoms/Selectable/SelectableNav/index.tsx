import { memo } from 'react';
import styles from './SelectableNav.module.scss';
import { Nav, NavProps } from 'components/atoms';

type SelectableNavProps = {
	size: "large" | "small";
} & Omit<NavProps, 'className' | 'classNameActive'>;

const SelectableNav = ({ ...props } : SelectableNavProps) => {
	return (
		<Nav {...props}
			className={styles[props.size]}
			classNameActive={`${styles[props.size]} ${styles.active}`} />
	);
};

export default memo(SelectableNav);