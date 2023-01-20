import styles from './DetailEvent.module.scss';

type ContactProps = {
	email?: string;
	tel?: string;
};

const Contact = ({ email, tel } : ContactProps) => {
	return (
		<div className={styles['contact-wrapper']}>
			<div className={styles['contact-label']}>주최자 연락처</div>
			<div className={styles['contact-inner']}>
				{
					email
					&&
					<div className={styles['fsize0']}>
						<svg viewBox="0 0 24 24" height="18px" width="14px" aria-hidden="true" focusable="false" fill="currentColor">
							<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
						</svg>
						<div className={styles['contact-text']}>
							<a href={`mailto:${email}`} style={{ textDecoration: "underline" }}>{email}</a>
						</div>
					</div>
				}
				{
					tel
					&&
					<div className={styles['fsize0']}>
						<svg viewBox="0 0 24 24" height="18px" width="14px" aria-hidden="true" focusable="false" fill="currentColor">
							<path d="M14.594 13.994l-1.66 1.66c-.577-.109-1.734-.471-2.926-1.66-1.193-1.193-1.553-2.354-1.661-2.926l1.661-1.66.701-.701-5.414-5.414-.701.701-1 1a.991.991 0 0 0-.291.649c-.015.25-.302 6.172 4.291 10.766C11.6 20.414 16.618 20.707 18 20.707c.202 0 .326-.006.358-.008a.994.994 0 0 0 .649-.291l1-1 .697-.697-5.414-5.414-.696.697z"></path>
						</svg>
						<div className={styles['contact-text']}>{tel}</div>
					</div>
				}
			</div>
		</div>
	);
};

export default Contact;