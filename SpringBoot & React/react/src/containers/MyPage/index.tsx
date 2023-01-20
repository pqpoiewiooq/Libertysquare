import { memo } from 'react';
import Tickets from './Tickets';
import Organizations from './Organizations';
import Events from './Events';
import Profile from './Profile';
import { withBaseComponents, withAxios } from 'components/HOC';
import { Routes, Route } from 'react-router';
import { getAffiliatedOrganizationEvents, getAttendEventList } from 'utils/api/EventApi';
import { getMyOrganizations } from 'utils/api/OrganizationApi';
import { Document } from 'components/organisms';


export const navs = [
	{
		to: '/my/tickets',
		text: "내 티켓"
	},
	{
		to: '/my/organizations',
		text: "호스트"
	},
	{
		to: '/my/events',
		text: "주최한 행사"
	},
	{
		to: '/my/profile',
		text: "프로필"
	},
	{
		to: '/logout',
		text: "로그아웃"
	}
];

const MyPage = () => {
	return (
		<Document navs={navs}>
			<Routes>
				<Route path="tickets" element={
					withAxios({
						axios: getAttendEventList,
						Success: Tickets
					})
				} />

				<Route path="organizations" element={
					withAxios({
						axios: getMyOrganizations,
						Success: Organizations
					})
				} />

				<Route path="events" element={
					withAxios({
						axios: getAffiliatedOrganizationEvents,
						Success: Events
					})
				}/>

				<Route path="profile" element={<Profile />} />
			</Routes>
		</Document>
	);
};

export default memo(withBaseComponents(MyPage));