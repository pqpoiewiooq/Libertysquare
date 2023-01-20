import { combineReducers } from 'redux';
import member from './member';
import organization from './organization';

const rootReducer = combineReducers({
	member, organization
});

export type RootState = ReturnType<typeof rootReducer>;
declare module 'react-redux' {
	interface DefaultRootState extends RootState { }
}

export default rootReducer;