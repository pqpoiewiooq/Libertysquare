import axios from './ApiClient';

const requestUri = '/image';

export function uploadImage(blob: File | (Blob & { name: string } )) {
	let formdata = new FormData();    
	formdata.append('file', blob, blob.name);
	return axios.post<string>(requestUri, formdata);
}

// export type OrganizationCreateParams = {
// 	name: string;
// 	simpleIntroduce?: string;
// 	organizer: Array<string>;
// };

// export const createOrganization = ({ ...payload } : OrganizationCreateParams) =>  axios.post(requestUri, payload);
// export const getMyOrganizations = () => axios.get(`${requestUri}/my`);
// export const getOrganization = (id: number) => axios.get(`${requestUri}/${id}`);
// export const existsOrganization = (name: string) => axios.get(`${requestUri}/name/${name}`).then(()=>true).catch(()=>false);

const ImageApi = { uploadImage };
export default ImageApi;