import React, { useState, useEffect } from 'react';
import { Loading } from 'components/atoms';

//Promise<AxiosResponse<Organization, any>>
type withAxiosProps<P extends object, T, R> = {
	axios: (payload: T) => Promise<AxiosResponse<R, any>>;//((payload?: T) => Promise<any>) | ((payload: T) => Promise<any>);
	payload?: T;
	Success: React.ComponentType<P>;
	Error?: JSX.Element;
}

/**
 * 자식이 되는 Component에서는 props.data 로 결과를 받을 수 있음.
 * 
 * Error에 아무것도 넣지 않으면 data가 undefined인 상태로 Success 호출
 */
const withAxios = <P extends object, T, R>({ axios, payload, Success, Error } : withAxiosProps<P, T, R>) => {
	const WithAxios = ({ ...props }) => {
		const [data, setData] = useState<R | null>();

		useEffect(() => {
			axios(payload!)
			.then((response) => {
				setData(response.data);
			}).catch(() => {
				setData(null);
			});
		}, []);
		return data ? <Success {...props as P} data={data} /> : (data === undefined ? <Loading /> : (Error || <Success {...props as P}/>));
	};

	return <WithAxios />;
};

export default withAxios;