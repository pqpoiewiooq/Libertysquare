import React from 'react';
import { Header, Footer, Feedback } from 'components/organisms';

const withBaseComponents = <P extends object>(Component: React.ComponentType<P>) => {
	const WithBaseComponents = ({ ...props } : P) => {
		return (
			<>
				<Header />
				<Component {...props} />
				<Footer />
				<Feedback />
			</>
		)
	};

	return WithBaseComponents;
};

export default withBaseComponents;