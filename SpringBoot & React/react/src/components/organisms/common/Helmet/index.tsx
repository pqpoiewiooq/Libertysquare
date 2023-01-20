import {Helmet} from "react-helmet-async";


type HelmetProps = {
	title: string;
	description?: string;
	keywords?: string;
	image?: string;
	css?: Array<string>;
	js?: Array<string>;
	children?: any;
};

const ReactHelmet = ({ title, description, keywords, image, css, js, children } : HelmetProps) => {
	const transTitle = title === process.env.REACT_APP_NAME ? title : `${title} | ${process.env.REACT_APP_NAME}`;

	return (
		<Helmet>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			
			<title>{transTitle}</title>
			<meta property="og:title" content={transTitle} />
			<meta property="og:image" content={image} />
			<meta property="og:site_name" content="" />
			<meta property="og:description" content={description} />

			<meta name="twitter:title" content={transTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
			<meta name="twitter:card" content="summary" />

			{css ? css.map(href => <link rel="stylesheet" type="text/css" href={href} />) : null}
			{js ? js.map(src => <script type="text/javascript" src={src}></script>) : null}

			{children}
		</Helmet>
	);
};

ReactHelmet.defaultProps = {
	title: process.env.REACT_APP_NAME,
	description: process.env.REACT_APP_DESCRIPTION,
	image: 'aseets/images/og.png'
};

export default ReactHelmet;