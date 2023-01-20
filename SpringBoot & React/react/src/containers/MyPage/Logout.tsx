import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { logoutRequest } from 'store/reducers/member';
import { Navigate } from 'react-router';
import { Document } from 'components/organisms';
import { navs } from './index';

const Logout = () => {
	const memberInfo = useSelector((state: RootState) => state.member.memberInfo);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if(memberInfo) dispatch(logoutRequest());
	}, [memberInfo, dispatch]);

	return (
		memberInfo
		?
		<Document navs={navs}>
			Logout...
		</Document>
		:
		<Navigate to="/" />
	);
};

export default Logout;