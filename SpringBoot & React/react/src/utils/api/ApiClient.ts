import axios from 'axios';
import { getAccessToken } from 'utils/JwtUtil';

const ApiClient = axios.create({
	//baseURL: 'https://api.' + process.env.REACT_APP_DOMAIN,
	timeout: 3000,
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		useQueryString: 'true',
	}
});

ApiClient.interceptors.request.use(
	function (config) {
		if(config.headers){
			config.headers['X-Requested-With'] = 'XMLHttpRequest';

			const token = getAccessToken();
			if(token) config.headers.Authorization = `Bearer ${token}`;
		}
		
		return config;
	},
	
	function (error) {
		return Promise.reject(error);
	}
);

ApiClient.interceptors.response.use(
	function (response) {
		return response;
	},

	function (error: AxiosError) {
		if (error.response) {
			if (error.response.status) {
				switch(error.response.status) {
					case 500:
						alert(error.response.data);
						break;
					case 403://Forbidden
						alert(error.response.data);
						break;
				}
			}
		}
		
		error.alert = function(message: any) {
			if (error.response?.status) {
				message += `\n${error.response.data}`;
			}
			alert(message);
		}
	
		return Promise.reject(error);
	}
);

export default ApiClient;