import { takeLatest, all, fork, put } from 'redux-saga/effects';
import MemberApi from 'utils/api/MemberApi';
import { decodeData, setAccessToken, removeAccessToken } from 'utils/JwtUtil';

import {
	Action,

	LOGIN_REQUEST,
	loginSuccess,
	loginFailure,

	REISSUE_REQUEST,
	reissueSuccess,
	reissueFailure,

	LOGOUT_REQUEST,
	logoutSuccess,
	logoutFailure,

	UPDATE_PROFILE_REQUEST,
	updateProfileSuccess,
	updateProfileFailure,

	UPDATE_PASSWORD_REQUEST,
	updatePasswordSuccess,
	updatePasswordFailure,
} from '../reducers/member';



function* login(action: Action) {
	if (action.type !== 'member/LOGIN_REQUEST') return;

	try {
		const { data } = yield MemberApi.login(action.payload);

		const info = decodeData<Member>(data);
		setAccessToken(data);

		yield put(loginSuccess(info));
	} catch (e) {
		console.log(e);
		yield put(loginFailure(e));
	}
}
function* refresh(action: Action) {
	if (action.type !== 'member/REISSUE_REQUEST') return;

	try {
		const { data } = yield MemberApi.reissue();

		const info = decodeData<Member>(data);
		setAccessToken(data);

		yield put(reissueSuccess(info));
	} catch (e) {
		yield put(reissueFailure(e));
	}
}
function* logout() {
	try {
		yield MemberApi.logout();
		removeAccessToken();
		yield put(logoutSuccess());
	} catch (e) {
		yield put(logoutFailure(e));
	}
}
function* updateProfile(action: Action) {
	if (action.type !== 'member/UPDATE_PROFILE_REQUEST') return;

	try {
		const { data } = yield MemberApi.updateProfile(action.payload);

		const info = decodeData<Member>(data);
		setAccessToken(data);

		yield put(updateProfileSuccess(info));
		alert('변경되었습니다.');
	} catch (e) {
		yield put(updateProfileFailure(e));
	}
}
function* updatePassword(action: Action) {
	if (action.type !== 'member/UPDATE_PASSWORD_REQUEST') return;

	try {
		yield MemberApi.updatePassword(action.payload);
		removeAccessToken();
		yield put(updatePasswordSuccess());
		alert('변경되었습니다.\n새로운 비밀번호로 다시 로그인해 주세요.');
	} catch (e) {
		yield put(updatePasswordFailure(e));
	}
}

function* watchLogin() {
	yield takeLatest(LOGIN_REQUEST, login);
}
function* watchRefresh() {
	yield takeLatest(REISSUE_REQUEST, refresh);
}
function* watchLogout() {
	yield takeLatest(LOGOUT_REQUEST, logout);
}
function* watchUpdateProfile() {
	yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfile);
}
function* watchUpdatePassword() {
	yield takeLatest(UPDATE_PASSWORD_REQUEST, updatePassword);
}


export default function* memberSaga() {
	yield all([fork(watchLogin), fork(watchRefresh), fork(watchLogout), fork(watchUpdateProfile), fork(watchUpdatePassword)]);
}