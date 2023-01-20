import { createReducer } from "typesafe-actions";

/* 조회 */
export const ORGANIZATION_LOOKUP_REQUEST = 'organization/ORGANIZATION_LOOKUP_REQUEST' as const;
const ORGANIZATION_LOOKUP_SUCCESS = 'organization/ORGANIZATION_LOOKUP_SUCCESS' as const;
const ORGANIZATION_LOOKUP_FAILURE = 'organization/ORGANIZATION_LOOKUP_FAILURE' as const;

export const lookupRequest = (id: number) => ({ type: ORGANIZATION_LOOKUP_REQUEST, id });
export const lookupSuccess = (organization: Organization) => ({ type: ORGANIZATION_LOOKUP_SUCCESS, payload: organization });
export const lookupFailure = () => ({ type: ORGANIZATION_LOOKUP_FAILURE });

/* 테마 컬러 */
export const CHANGE_THEME_COLOR_REQUEST = 'organization/CHANGE_THEME_COLOR_REQUEST' as const;

export const changeThemeColorRequest = (themeColor: Organization['themeColor']) => ({ type: CHANGE_THEME_COLOR_REQUEST, themeColor }); 

/* 주최한 행사 불러오기 */
export const LOAD_HOSTED_EVENT_REQUEST = 'organization/LOAD_HOSTED_EVENT_REQUEST' as const;
const LOAD_HOSTED_EVENT_SUCCESS = 'organization/LOAD_HOSTED_EVENT_SUCCESS' as const;
const LOAD_HOSTED_EVENT_FAILURE = 'organization/LOAD_HOSTED_EVENT_FAILURE' as const;

export const loadHostedEventRequest = () => ({ type: LOAD_HOSTED_EVENT_REQUEST });
export const loadHostedEventSuccess = (data: DetailEventList) => ({ type: LOAD_HOSTED_EVENT_SUCCESS, payload: data });
export const loadHostedEventFailure = () => ({ type: LOAD_HOSTED_EVENT_FAILURE });



interface State {
	organization: Organization | null;
	hostedEvent: DetailEventList | null;
}

export type Action =
	| ReturnType<typeof lookupRequest>
	| ReturnType<typeof lookupSuccess>
	| ReturnType<typeof lookupFailure>
	
	| ReturnType<typeof loadHostedEventRequest>
	| ReturnType<typeof loadHostedEventSuccess>
	| ReturnType<typeof loadHostedEventFailure>;

const initialState: State = {
	organization: null,
	hostedEvent: null,
};

const OrganizationReducer = createReducer(initialState, {
	[ORGANIZATION_LOOKUP_REQUEST]: (state) => {
		return {
			...state,
		};
	},
	[ORGANIZATION_LOOKUP_SUCCESS]: (state, action) => {
		return {
			...state,
			organization: action.payload
		};
	},
	[ORGANIZATION_LOOKUP_FAILURE]: (state, action) => {
		return {
			...state,
			organization: null
		};
	},



	[CHANGE_THEME_COLOR_REQUEST]: (state, action) => {
		if(!state.organization) return state;

		return {
			...state,
			organization: {
				...state.organization,
				themeColor: action.themeColor
			}
		}
	},



	[LOAD_HOSTED_EVENT_REQUEST]: (state) => {
		return {
			...state,
		};
	},
	[LOAD_HOSTED_EVENT_SUCCESS]: (state, action) => {
		return {
			...state,
			hostedEvent: action.payload
		};
	},
	[LOAD_HOSTED_EVENT_FAILURE]: (state, action) => {
		return {
			...state,
			hostedEvent: null
		};
	},
});

export default OrganizationReducer;