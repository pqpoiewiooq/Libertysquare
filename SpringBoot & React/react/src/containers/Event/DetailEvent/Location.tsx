import styles from './DetailEvent.module.scss';

type LocationProps = {
	isOnline?: boolean;
	venue: string;
	detailVenue: string;
	venueDescription?: string;
	isMobile?: boolean;
};
const iframeStyle = { width: "100%", height: "100%", border: "0" };
const Location = ({ isOnline, venue, detailVenue, venueDescription, isMobile } : LocationProps) => {
	return (
		<article className={styles['location-container']}>
			{
				isOnline
				?
				<>
					<div className={styles['map-container']}>
						<iframe
							title="google-map-frame"
							style={iframeStyle}
							loading="lazy"
							src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&q=${venue}`}
							allowFullScreen />
					</div>
					{ !isMobile && <div className={styles['location-label']}>장소</div> }
					<div className={styles['location-name']}>{venue}</div>
					<div className={styles['location-label']}>{detailVenue}</div>
				</>
				:
				<>
					<div className={styles['location-label']}>{venue}</div>
					<div className={styles['location-name']}>{detailVenue}</div>
				</>
			}

			{ venueDescription && <div className={styles['location-desc']}>{venueDescription}</div> }
		</article>
	);
};

export default Location;