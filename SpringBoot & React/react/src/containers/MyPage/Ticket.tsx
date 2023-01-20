import MyPageStyle from './MyPage.module.scss';
import { Error, ContentCardList } from 'components/organisms';
import { isEmpty } from 'utils/ArrayUtil';
import { fullFormat, toDate } from 'utils/DateUtil';
import { Navigate } from 'react-router-dom';

type TicketProps = {
	data?: any;
};

const Ticket = ({ data } : TicketProps) => {
	if(isEmpty(data)) {
		return <Navigate to="/my/tickets"/>;
	}


	return (
		<>
		</>
	);
};

export default Ticket;