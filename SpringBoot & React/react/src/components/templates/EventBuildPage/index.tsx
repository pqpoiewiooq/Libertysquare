import styles from './EventBuildPage.module.scss';
import { StepList } from 'components/molecules';
import { withBaseComponents } from 'components/HOC';

type EventBuildPageProps = {
	children: React.ReactNode;
	step: number;
}

const title = "행사 주최하기";
const desc = <>새로운 행사를 주최하기 위해선 다음 단계들이 필요해요!<br/>행사를 만들면 바로 게시됩니다.</>;
const steps = ["1. 주최할 호스트 선택", "2. 행사 종류 선택", "3. 행사 정보 및 티켓 설정"];

const EventBuildPage = ({children, step} : EventBuildPageProps) => {
	return (
		<main className={styles.container}>
			<StepList
				title={title}
				desc={desc}
				steps={steps}
				current={step} />
			
			<section className={styles.body}>
				{children}
			</section>
		</main>
	);
};

export default withBaseComponents(EventBuildPage);