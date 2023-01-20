import { useLocation } from 'react-router';

export const useLocationState = (state: string) => {
	const location = useLocation();

	return location.state ? location.state[state] : undefined;
};