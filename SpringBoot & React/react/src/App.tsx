import { Routes, Route } from "react-router-dom";

import { Loading } from 'components/atoms';
import { ReactHelmet } from 'components/organisms';
import { useAutoLogin } from "hooks";

import Index from 'containers/Index';

import Login from 'containers/Auth/Signin';
import Sign from 'containers/Auth/Sign';
import Signup from 'containers/Auth/Signup';
import SignupPw from 'containers/Auth/SignupPw';

import Document from "containers/Document";

import MyPage from 'containers/MyPage';
import Logout from 'containers/MyPage/Logout';

import EventPayment from 'containers/Event/Payment';
import SelectHost from 'containers/Event/new/SelectHost';
import Organization from 'containers/Event/new/Organization';
import SelectType from 'containers/Event/new/SelectType';
import Info from 'containers/Event/new/Info';
import DetailEventWrapper from "containers/Event/DetailEvent";

import Host from "containers/Host";

import Error404 from 'components/organisms/common/Error/Error404';

import { withLogin } from 'components/HOC';

const App = () => {
	const status = useAutoLogin();
	
	return <>
		<ReactHelmet />
		{
			status !== "ready"
			?
			<Loading />
			:
			<Routes>
				<Route path="/" element={<Index />} />

				<Route path="/signin" element={<Login />} />
				<Route path="/sign" element={<Sign />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/signup-pw" element={<SignupPw />} />

				<Route path="/document/*" element={<Document />} />

				<Route path="/my/*" element={withLogin(MyPage)}/>
				<Route path="/logout" element={<Logout />} />

				<Route path="/event/*">
					<Route path="payment/:id" element={withLogin(EventPayment)} />

					<Route path="new/*">
						<Route path="" element={withLogin(SelectHost)} />
						<Route path="organization" element={withLogin(Organization)} />
						<Route path="select-type" element={withLogin(SelectType)} />
						<Route path="info" element={withLogin(Info)} />
					</Route>

					<Route path=":id" element={<DetailEventWrapper />}/>
				</Route>

				<Route path="/host/:id/*" element={<Host />}/>


				{/* <Route path="/test/*" element={<Test />} /> */}
				
				<Route path="*" element={<Error404 />} />
			</Routes>
		}
	</>
};

export default App;
