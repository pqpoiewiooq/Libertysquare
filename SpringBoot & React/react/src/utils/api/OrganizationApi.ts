import axios from './ApiClient';

const requestUri = '/organization';

export const createOrganization = ({ ...payload } : OrganizationCreateParams) =>  axios.post(requestUri, payload);
export const getMyOrganizations = () => axios.get<Array<SimpleOrganization>>(`${requestUri}/my`);
export const getOrganization = (id: number) => axios.get<Organization>(`${requestUri}/${id}`);
export const existsOrganization = (name: string) => axios.get(`${requestUri}/name/${name}`).then(()=>true).catch(()=>false);
export const getHostedEvents = (id: number) => axios.get<DetailEventList>(`${requestUri}/event/${id}`);

type UpdateParams = Pick<Organization, 'id'>
	& PartialPick<Organization, 'name' | 'simpleIntroduce' | 'introduce' | 'coverPath' | 'profilePath' | 'venue' | 'detailVenue' | 'since' | 'themeColor'> & { organizer?: Array<string> };
export const updateOrganization = ({ ...payload } : UpdateParams) => axios.put(requestUri, payload);

type SimpleUpdateParams = Pick<Organization, 'id'>
	& PartialPick<Organization, 'name' | 'simpleIntroduce'> & { organizer?: Array<string> };
export const updateOrganizationSimple = ({ ...payload } : SimpleUpdateParams) => axios.patch(requestUri, payload);

const OrganizationApi = {
	createOrganization,
	getMyOrganizations,
	getOrganization,
	existsOrganization,
	getHostedEvents,
	updateOrganization,
	updateOrganizationSimple
};
export default OrganizationApi;