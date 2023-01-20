import styles from './Index.module.scss';
import NeonHeader from './NeonHeader';
import IndexTop from './IndexTop';
import IndexFooter from './IndexFooter';
import { ContentList, ContentListProps } from 'components/organisms';
import { Link } from 'react-router-dom';
import { getMainEvents } from 'utils/api/EventApi';
import { useEffect, useState } from 'react';
import { dateFormat, wasExpired, toDate } from 'utils/DateUtil';

const Index = () => {
	const [eventList, setEventList] = useState<Array<ContentListProps>>([]);

	useEffect(() => {
	getMainEvents()
		.then((response) => {
		const data = response.data as any;
		if(!data) throw new Error("데이터를 찾을 수 없습니다.");

		const responseList = new Array<ContentListProps>();
		function push(content: ContentListProps) {
			if(Array.isArray(content.contents) && content.contents.length > 0) {
			responseList.push(content);
			}
		}

		push({
			title: "추천 행사",
			description: `${process.env.REACT_APP_NAME}에서 추천하는 행사입니다!`,
			contents: data.recommendation
		});
		push({
			title: "최신 밋업과 행사",
			description: "등록된지 얼마 안된 따끈따끈한 행사를 만나봐요!",
			contents: data.recency
		});
		push({
			title: "온라인 행사",
			description: "집에서 안전하게! 어디서나 들을 수 있는 온라인 행사를 들으러 오세요.",
			contents: data.online
		});
		push({
			title: "마감 임박",
			description: "티켓 판매가 곧 마감되는 행사들입니다.",
			contents: data.imminent
		});
		push({
			title: "무료 행사",
			description: "결제 없이 참가하실 수 있습니다.",
			contents: data.free
		});

		// response data를 content item props에 맞게 변환
		responseList.forEach(
			dataset => dataset.contents.forEach(
				(content) => {
				let event: MyEvent = content as any;
				content.to = `/event/${event.id}`;
				content.src = event.coverPath;
				content.extraText = dateFormat(event.dtStart, event.isOnline);
				//content.title = content.title;
				content.tag = event.hashtag?.join(' ');
				content.expired = wasExpired(toDate(event.dtEnd));
				}
			)
		);
		
		const temp = responseList.filter(dataset => dataset.contents);
		if(temp.length < 1) alert('현재 게시된 행사가 없습니다.');
		else setEventList(temp);
		})
		.catch(() => alert("행사를 불러오지 못했습니다.\n잠시 후 다시 시도해 주세요."));
	}, []);
	
	return (
	<div className={styles.inner}>
		<IndexTop />
		<NeonHeader />
		<main className={styles.main}>
			{eventList.map(event => <ContentList { ...event } key={event.title}/>)}
		</main>
		<section className={styles.bottom}>
		<Link to="/events">
			<button type="button" className={styles.btn}>모든 행사 보러가기</button>
		</Link>
		</section>
		<IndexFooter />
	</div>
	);
};


export default Index;
