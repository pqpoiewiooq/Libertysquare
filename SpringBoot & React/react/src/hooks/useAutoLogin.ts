import { useEffect, useCallback, useRef } from "react";
import { useDispatch , useSelector, shallowEqual } from "react-redux";
import { RootState } from "store/reducers";
import { reissueRequest } from "store/reducers/member";
import { getExpiration, getAccessToken } from "utils/JwtUtil";

type LoginStatus = "loading" | "ready" | "idle";

export function useAutoLogin() {
	const dispatch = useDispatch();
	const [ memberInfo, reissueLoading ] = useSelector(
		(state: RootState) => [
			state.member.memberInfo,
			state.member.loading.reissue
		], shallowEqual
	);
	
	const status = useRef<LoginStatus>(getAccessToken() ? "idle" : "ready");

	const reissue = useCallback(() => {
		dispatch(reissueRequest());
	}, [dispatch]);

	useEffect(() => {
		const accessToken = getAccessToken();
		if(accessToken) {
			if(memberInfo) {
				const exp = getExpiration(accessToken);
				setTimeout(reissue, exp - (1000 * 60 * 10));// 만료 10분 전 호출
			} else {
				status.current = "loading";
				reissue();
			}
		}
	}, [reissue, memberInfo]);
	
	if(status.current === "loading" && !reissueLoading) {
		status.current = "ready";
	}

	return status.current;
}