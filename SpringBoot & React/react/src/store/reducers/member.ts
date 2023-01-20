import { createReducer } from "typesafe-actions";

export const LOGIN_REQUEST = 'member/LOGIN_REQUEST' as const;
const LOGIN_SUCCESS = 'member/LOGIN_SUCCESS' as const;
const LOGIN_FAILURE = 'member/LOGIN_FAILURE' as const;

export const REISSUE_REQUEST = 'member/REISSUE_REQUEST' as const;
const REISSUE_SUCCESS = 'member/REISSUE_SUCCESS' as const;
const REISSUE_FAILURE = 'member/REISSUE_FAILURE' as const;

export const LOGOUT_REQUEST = 'member/LOGOUT_REQUEST' as const;
const LOGOUT_SUCCESS = 'member/LOGOUT_SUCCESS' as const;
const LOGOUT_FAILURE = 'member/LOGOUT_FAILURE' as const;

export const UPDATE_PROFILE_REQUEST = 'member/UPDATE_PROFILE_REQUEST' as const;
const UPDATE_PROFILE_SUCCESS = 'member/UPDATE_PROFILE_SUCCESS' as const;
const UPDATE_PROFILE_FAILURE = 'member/UPDATE_PROFILE_FAILURE' as const;

export const UPDATE_PASSWORD_REQUEST = 'member/UPDATE_PASSWORD_REQUEST' as const;
const UPDATE_PASSWORD_SUCCESS = 'member/UPDATE_PASSWORD_SUCCESS' as const;
const UPDATE_PASSWORD_FAILURE = 'member/UPDATE_PASSWORD_FAILURE' as const;

export const loginRequest = ({ ...payload } : LoginParams) => ({ type: LOGIN_REQUEST, payload });
export const loginSuccess = (memberInfo: MemberInfo) => ({ type: LOGIN_SUCCESS, payload: memberInfo });
export const loginFailure = (error: any) => ({ type: LOGIN_FAILURE, error });

export const reissueRequest = () => ({ type: REISSUE_REQUEST });
export const reissueSuccess = (memberInfo: MemberInfo) => ({ type: REISSUE_SUCCESS, payload: memberInfo });
export const reissueFailure = (error: any) => ({ type: REISSUE_FAILURE, error });

export const logoutRequest = () => ({ type: LOGOUT_REQUEST });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });
export const logoutFailure = (error: any) => ({ type: LOGOUT_FAILURE, error });


export const updateProfileRequest = ({ ...payload } : ProfileUpdateParams) => ({ type: UPDATE_PROFILE_REQUEST, payload });
export const updateProfileSuccess = (memberInfo: MemberInfo) => ({ type: UPDATE_PROFILE_SUCCESS, payload: memberInfo });
export const updateProfileFailure = (error: any) => ({ type: UPDATE_PROFILE_FAILURE, error });

export const updatePasswordRequest = ({ ...payload } : PasswordUpdateParams) => ({ type: UPDATE_PASSWORD_REQUEST, payload });
export const updatePasswordSuccess = () => ({ type: UPDATE_PASSWORD_SUCCESS });
export const updatePasswordFailure = (error: any) => ({ type: UPDATE_PASSWORD_FAILURE, error });

interface State {
	memberInfo: MemberInfo | null;
	loading: {
		signup: boolean;
		login: boolean;
		reissue: boolean;
		logout: boolean;
		existsMember: boolean;
		updateProfile: boolean;
		updatePassword: boolean;
	};
	error: {
		login?: string | Error;
		reissue?: boolean;
		signup?: string | Error;
		logout?: string | Error;
		existsMember?: string | Error;
		updateProfile?: string | Error;
		updatePassword?: string | Error;
	} | null;
}

export type Action =
	| ReturnType<typeof loginRequest>
	| ReturnType<typeof loginSuccess>
	| ReturnType<typeof loginFailure>
	| ReturnType<typeof reissueRequest>
	| ReturnType<typeof reissueSuccess>
	| ReturnType<typeof reissueFailure>
	| ReturnType<typeof logoutRequest>
	| ReturnType<typeof logoutSuccess>
	| ReturnType<typeof logoutFailure>
	| ReturnType<typeof updateProfileRequest>
	| ReturnType<typeof updateProfileSuccess>
	| ReturnType<typeof updateProfileFailure>
	| ReturnType<typeof updatePasswordRequest>
	| ReturnType<typeof updatePasswordSuccess>
	| ReturnType<typeof updatePasswordFailure>;

const initialState: State = {
	memberInfo: null,
	loading: {
		signup: false,
		login: false,
		reissue: false,
		logout: false,
		existsMember: false,
		updateProfile: false,
		updatePassword: false
	},
	error: null
};

const MemberReducer = createReducer(initialState, {
	[LOGIN_REQUEST]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				login: true
			}
		};
	},
	[LOGIN_SUCCESS]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				login: false
			},
			memberInfo: action.payload
		};
	},
	[LOGIN_FAILURE]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				login: false
			},
			error: {
				login: action.error
			},
			memberInfo: null
		};
	},



	[REISSUE_REQUEST]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				reissue: true
			}
		};
	},
	[REISSUE_SUCCESS]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				reissue: false
			},
			memberInfo: action.payload
		};
	},
	[REISSUE_FAILURE]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				reissue: false
			},
			error: {
				reissue: action.error
			},
			memberInfo: null
		};
	},



	[LOGOUT_REQUEST]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				logout: true
			},
			error: null
		};
	},
	[LOGOUT_SUCCESS]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				logout: false
			},
			memberInfo: null
		};
	},
	[LOGOUT_FAILURE]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				logout: false
			},
			error: {
				logout: action.error
			}
		};
	},

	[UPDATE_PROFILE_REQUEST]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				updateProfile: true
			}
		};
	},
	[UPDATE_PROFILE_SUCCESS]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				updateProfile: false
			},
			memberInfo: action.payload
		};
	},
	[UPDATE_PROFILE_FAILURE]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				updateProfile: false
			},
			error: {
				updateProfile: action.error
			}
		};
	},



	[UPDATE_PASSWORD_REQUEST]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				updatePassword: true
			}
		};
	},
	[UPDATE_PASSWORD_SUCCESS]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				updatePassword: false
			},
			memberInfo: null
		};
	},
	[UPDATE_PASSWORD_FAILURE]: (state, action) => {
		return {
			...state,
			loading: {
				...state.loading,
				updatePassword: false
			},
			error: {
				updatePassword: action.error
			}
		};
	}
});

// default: {
//	 return { ...state };
// }

export default MemberReducer;