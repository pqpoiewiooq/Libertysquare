import React from 'react';
import styles from './Auth.module.scss';
import { Feedback } from 'components/organisms';
import { Link } from 'react-router-dom';

type AuthProps = {
	title?: string;
	children?: React.ReactNode;
};

const Auth = ({ title, children } : AuthProps) => {
	return (
		<>
			<div className={styles['auth-container']}>
				<header className={styles.header}>
					<Link to="/" className={styles.logo}> </Link>
					<h1 className={styles.h1}>{title}</h1>
				</header>

				<main className={styles['form-container']}>
					{children}
				</main>
			</div>
			
			<Feedback />
		</>
	);
};


export default Auth;