import React, { useState, useRef, useCallback } from 'react';
import styles from './Feedback.module.scss';
import { StarRating } from 'components/molecules';

const Feedback = () => {
	const [isOpen, toggle] = useState(false);
	const [sendable, setSendable] = useState(false);

	const rate = useRef(0);

	const wrapper = useRef<HTMLDivElement>(null);
	const textarea = useRef<HTMLTextAreaElement>(null);
	const button = useRef<HTMLButtonElement>(null);

	const toggleFeedback = useCallback(() => {
		toggle(!isOpen);
	}, [isOpen]);

	const check = useCallback(() => {
		if(textarea.current && button.current) {
			setSendable(rate.current > 0 && textarea.current.value.length > 0);
		}
	}, []);

	const onRateChange = useCallback((num : number) => {
		rate.current = num;
		check();
	}, []);
	
	return (
		<div className={isOpen ? `${styles.wrapper} ${styles.open}` : styles.wrapper} ref={wrapper} >
			<div className={styles.head} onClick={toggleFeedback}>
				<div className={styles['close-ic']}></div>
				<div className={styles.ic}></div>
				<div className={styles.title}>피드백</div>
			</div>
			<div className={styles.body}>
				<div className={styles.label}>{process.env.REACT_APP_NAME} 이용 만족도</div>
				<StarRating onChange={onRateChange} />
				<div className={styles.question}>어떻게 하면 {process.env.REACT_APP_NAME}을 더 좋게 만들 수 있을까요?</div>
				<textarea placeholder="아이디어, 개선 사항, 사용 후기를 자유롭게 남겨주세요." ref={textarea} onInput={check} maxLength={2000} className={styles.textarea}></textarea>
				<div className={styles['bottom-row']}>
					<button className={styles['send-btn']} ref={button} disabled={!sendable}>보내기</button>
					<div className={styles['extra-text']}>{process.env.REACT_APP_NAME} 개선에 동참해주셔서<br/>진심으로 감사드립니다. </div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(Feedback);


