import styles from './StepList.module.scss';
import { Step } from 'components/atoms';
import img from 'assets/image/event-new.png'

type StepListProps = {
	title: string;
	desc: string | React.ReactNode;
	steps: Array<string>;
	current: number;
};

function renderStepList(steps: Array<string>, current: number)  {
	let result = [];
	for(let i = 0; i < steps.length; i++) {
		result.push(<Step text={steps[i]} current={i === current} key={steps[i]} />);
	}

	return result;
}

const StepList = ({ title, desc, steps, current } : StepListProps) => {
	return (
		<section className={styles.container}>
			<article>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.desc}>{desc}</p>
				<div className={styles['step-wrapper']}>
					{renderStepList(steps, current)}
				</div>
			</article>
			<img className={styles.img} src={img} alt="step-img"/>
		</section>
	);
};

export default StepList;