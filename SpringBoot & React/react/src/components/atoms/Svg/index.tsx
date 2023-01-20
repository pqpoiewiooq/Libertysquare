import React from 'react';
import styles from './Svg.module.scss';

type SvgProps = Omit<React.SVGAttributes<SVGSVGElement>, "className">;

const Svg = ({ ...props } : SvgProps) => {
	return (
		<svg { ...props } className={styles.svg} >{props.children}</svg>
	)
};

export default React.memo(Svg);