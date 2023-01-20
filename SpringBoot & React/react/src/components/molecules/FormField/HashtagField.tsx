import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './FormField.module.scss';
import { PreviewButton, Input, HashtagItem } from 'components/atoms';

type HashtagFieldProps = {
	title: string;
	onChange?: (hashtags: Array<string>) => void;
};

const LIMIT = 5;
const PREFIX = '#';

const HashtagField = ({ title, onChange } : HashtagFieldProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [hashtags, setHashtags] = useState<Array<string>>([]);

	const text = useRef('');
	const onChangeText = useCallback(
		(isValid: boolean, value: string) => {
			text.current = value;
		}, [text]
	);

	const onClickAdd = useCallback(
		() => {
			if(hashtags.length >= LIMIT) return;
			if(!text.current) return;

			let addText = text.current.trim();
			if(!addText.startsWith(PREFIX)) {
				addText = `${PREFIX}${addText}`;
			}

			const index = hashtags.indexOf(addText);
			if(index !== -1) return;

			if(inputRef.current) {
				text.current = "";
				inputRef.current.value = "";
			}
			setHashtags(current => [...current, addText]);
		}, [hashtags, text, inputRef]
	);

	const onClickItem = useCallback(
		(value: string) => {
			const index = hashtags.indexOf(value);
			if(index == -1) return;

			const removed = hashtags.slice();
			removed.splice(index, 1);
			setHashtags(removed);
		}, [hashtags]
	);

	useEffect(() => {
		onChange?.(hashtags);
	}, [hashtags, onChange]);

	return (
	<>
		<div className={styles.flex}>
			<Input name="hashtag" type="text" ref={inputRef} maxLength={255} onChange={onChangeText} onEnter={onClickAdd} empty />
			<PreviewButton buttonStyle="edit" onClick={onClickAdd}>추가</PreviewButton>
		</div>
		<div className={styles['hashtag-container']}>
			{hashtags.map(
				hashtag => <HashtagItem value={hashtag} onClick={onClickItem} key={hashtag} />
			)}
		</div>
	</>
	)
};

export default React.memo(HashtagField);