import { takeLatest, all, fork, put, select } from 'redux-saga/effects';
import OrganizationApi from 'utils/api/OrganizationApi';

import {
	Action,

	ORGANIZATION_LOOKUP_REQUEST,
	lookupSuccess,
	lookupFailure,

	LOAD_HOSTED_EVENT_REQUEST,
	loadHostedEventSuccess,
	loadHostedEventFailure,
} from '../reducers/organization';

function* lookup(action: Action) {
	if (action.type !== 'organization/ORGANIZATION_LOOKUP_REQUEST') return;

	try {
		const { data } = yield OrganizationApi.getOrganization(action.id);
		
		yield put(lookupSuccess(data));
	} catch (e) {
		yield put(lookupFailure());
	}
}
function* loadHostedEvent(action: Action) {
	if (action.type !== 'organization/LOAD_HOSTED_EVENT_REQUEST') return;

	try {
		let organization: Organization = yield select((state: RootState) => state.organization.organization);
		if(!organization) throw new Error("organization information is not loaded. please dispatch Action('organization/ORGANIZATION_LOOKUP_REQUEST') first");
		const { data } = yield OrganizationApi.getHostedEvents(organization.id);
		
		yield put(loadHostedEventSuccess(data));
	} catch (e) {
		yield put(loadHostedEventFailure());
	}
}

function* watchLookup() {
	yield takeLatest(ORGANIZATION_LOOKUP_REQUEST, lookup);
}

function* watchLoadHostedEvent() {
	yield takeLatest(LOAD_HOSTED_EVENT_REQUEST, loadHostedEvent);
}


export default function* organizationSaga() {
	yield all([fork(watchLookup), fork(watchLoadHostedEvent)]);
}