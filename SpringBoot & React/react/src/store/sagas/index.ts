import { all, call } from 'redux-saga/effects';
import member from './member';
import organization from './organization';

export default function* sagas() {
	yield all([call(member), call(organization)]);
}