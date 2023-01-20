import styles from './Error404.module.scss';
import img404 from 'assets/image/error-404.png';

export type ErrorProps = {
	style?: React.CSSProperties;
	title: string;
	titleClassName?: string;
	subtitle?: string;
	img?: string;
	alt?: string;
}

const Error = ({ style, title, titleClassName, subtitle, img, alt } : ErrorProps) => {
	return (
		<div className={styles.container} style={style}>
			<h1 className={titleClassName || styles.title}>{title}</h1>
			{ subtitle && <h2 className={styles.subtitle}>{subtitle}</h2> }
			<img className={styles.img} src={img || img404} alt={alt || "404 에러"} />
		</div>
	);
};

export default Error;
