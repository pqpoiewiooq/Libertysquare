import { useState } from 'react';

export function useForceUpdate(){
	const state = useState(false);
	return () => state[1]((s) => !s);
}