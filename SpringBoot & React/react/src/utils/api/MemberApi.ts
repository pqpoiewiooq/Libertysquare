import axios from './ApiClient';

export const signup = ({ ...payload } : SignUpParams) =>  axios.post('/member', payload);
export const login = ({ ...payload } : LoginParams) => axios.post('/login', payload);
export const reissue = () => axios.post('/reissue');
export const logout = () => axios.post('/logout/');//알 수 없는 이유로, spring security에서 자꾸 redirect 시켜서 뒤에 / 하나 추가
export const updateProfile = ({ ...payload } : ProfileUpdateParams) => axios.patch('/member/profile', payload);
export const updatePassword = ({ ...payload } : PasswordUpdateParams) => axios.patch('/member/password', payload);

export const existsMember = (id: string) => axios.get(`/member/${id}`);

const MemberApi = { signup, login, reissue, logout, updateProfile, updatePassword, existsMember };
export default MemberApi;