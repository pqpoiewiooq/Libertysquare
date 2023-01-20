import Error from './';
import { withBaseComponents } from 'components/HOC';

// style={{margin: "0 auto", minHeight: "auto", paddingTop: "54px"}}
const Error404 = () => {
	return (
		<Error
			title="죄송합니다."
			subtitle="요청하신 페이지를 찾을 수 없습니다."/>
	)
};

export default withBaseComponents(Error404);