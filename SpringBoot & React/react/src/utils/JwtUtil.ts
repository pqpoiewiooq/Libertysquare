import decode from 'jwt-decode';

type JwtTokenData = {
	exp: number;
	info: string;
}

const ACCESS_TOKEN_KEY = "lsat";

const decodeJwt = (token: string) => {
	const jwt = decode<JwtTokenData>(token);
	return jwt;
}

const getExpiration = (token: string) => {
	const jwt = decodeJwt(token);
	return jwt.exp;
};

const wasExpired = (token: string) => {
	const now = new Date();
	return (now.getTime() - getExpiration(token) <= 0);
};

const setAccessToken = (accessToken: string) => {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

const getAccessToken = () => {
	const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
	if(!accessToken || wasExpired(accessToken)) removeAccessToken();
	return accessToken;
};

const removeAccessToken = () => {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
}

const decodeData = <T>(token: string) : T => {
	const claims = decodeJwt(token);
	return JSON.parse(claims.info);
}

export { decodeJwt, getExpiration, setAccessToken, getAccessToken, removeAccessToken, decodeData };