import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { Navigate } from 'react-router-dom';

const withLogin = <P extends object>(Component: React.ComponentType<P>) => {
	const WithLogin = ({ ...props }) => {
		const { memberInfo } = useSelector((state: RootState) => state.member);

		return memberInfo ? <Component {...props as P} /> : <Navigate to="/sign" replace />;
	};

	// return WithLogin;
	// 객체를 보내면, Route에서 사용하지 못해서 component로 return
	return <WithLogin />;
};

export default withLogin;