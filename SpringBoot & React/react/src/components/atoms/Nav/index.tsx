import React, { useCallback } from 'react';
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';

export type NavProps = {
	className: string;
	classNameActive: string;
} & NavLinkProps;

const Nav = ({ className, classNameActive, ...props } : NavProps) => {
	const location = useLocation();
	const isActive = location.pathname == props.to;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			if(isActive) {
				e.preventDefault();
			}
		},
		[location, props.to]
	);

	return (
		<NavLink {...props} onClick={onClick} className={isActive ? classNameActive : className} />
	);
};

export default React.memo(Nav);