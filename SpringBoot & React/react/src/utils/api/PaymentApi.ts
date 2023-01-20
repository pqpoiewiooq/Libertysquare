import axios from './ApiClient';

const requestUri = '/payment';

type RequestTicketPaymentParams = Required<Pick<EventTicket, 'id' | 'quantity'>>;

export const requestTicketPayment = ({ ...params }: RequestTicketPaymentParams) => axios.get(`${requestUri}/ticket`, { params })
export const sendFailure = () => axios.delete(`${requestUri}/failure`);

const PaymentApi = { requestTicketPayment, sendFailure };
export default PaymentApi;