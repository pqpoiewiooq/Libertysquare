import axios from './ApiClient';

const requestUri = '/event';

type MyEventCreateParams = {
	organizationId: number;
	contentImage?: Array<string>;
	ticket?: Array<any>;
} & Omit<MyEvent, 'id' | 'organization'>;
export const postEvent = ({ ...payload } : MyEventCreateParams) => axios.post(requestUri, payload);


type MainEventMap = { [key in string]?: Array<Pick<MyEvent, 'dtEnd' | keyof SimpleMyEvent>> };
export const getMainEvents = () => axios.get<MainEventMap>(requestUri);


export const getEvent = (id: string | number) => axios.get<MyEvent>(`${requestUri}/${id}`);


//type HostedEventList = Array<{ organization: Pick<Organization, 'id' | 'name'>, events: Array<SimpleMyEvent>}>;
/**
 * 소속된 Organization이 주최한 모든 행사 목록을 불러옴
 */
export const getAffiliatedOrganizationEvents = () => axios.get<AffiliatedOrganizationEventList>(`${requestUri}/affiliated`);

//type PurchasedEventList = Array<Pick<MyEvent, 'organization' | keyof SimpleMyEvent>>;
////export const getPurchasedEvents = () => axios.get<MyPageEventList>(`${requestUri}/purchased`);


export const getList = (page: number) => axios.get<DetailEventList>(`${requestUri}/list/${page}`);


/* 결제한 행사 목록 불러오기 */
export const getAttendEventList = () => axios.get<DetailEventList>('/attendant');


const EventApi = { postEvent, getMainEvents, getEvent, getAffiliatedOrganizationEvents, getList, getAttendEventList };
export default EventApi;