import { memo, useRef, useState, useCallback, forwardRef } from 'react';
import styles from './MultiDropdown.module.scss';
import { Dropdown, ErrorText } from 'components/atoms';
import { isEndWithConsonant } from 'utils/TextUtil';
import { useEffect } from 'react';

type MultiDropdownProps = {
	name: string;
	min: number;
	max: number;
	onChange?: (array: Array<DropdownOptionObject>) => void;
	config?: DropdownConfig | keyof typeof DropdownConfigs;
};

type ItemProps = {
	value: DropdownOptionObject;
	onClick: (value: DropdownOptionObject) => void;
}
const Item = memo(({ value, onClick } : ItemProps) => {
	const ref = useRef<HTMLSpanElement>(null);

	const onClickListener = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault();
		event.stopPropagation();

		onClick(value);
	}, [value, onClick]);

	return (
		<span className={styles.item} ref={ref}>
			<span className={styles.icon} onClickCapture={onClickListener}>×</span>
			<span className={styles.text}>{value.text}</span>
		</span>
	)
});

const MultiDropdown = forwardRef<HTMLDivElement, MultiDropdownProps>(({ name, min, max, onChange, config }, ref) => {
	const [array, setArray] = useState<Array<DropdownOptionObject>>([]);

	const onOptionSelect = useCallback((event: DropdownEvent) => {
		event.preventDefault();
		
		if(array.length >= max) return;

		const select = event.detail.after;
		if(!array.find(item => item.value === select.value)) {
			setArray(prev => [...prev, select]);
		}
	}, [array, max]);

	const onClickItem = useCallback((value: DropdownOptionObject) => {
		const findIndex = array.findIndex(item => item.value === value.value);
		if(findIndex < 0) return;

		const removedArray = array.slice();
		removedArray.splice(findIndex, 1);
		setArray(removedArray);
	}, [array]);

	useEffect(() => {
		onChange?.(array);
	}, [array, onChange]);

	return (
		<>
			<Dropdown config={config} onOptionSelect={onOptionSelect} ref={ref}>
				{array.map(
					item => <Item value={item} key={item.value} onClick={onClickItem}/>
				)}
			</Dropdown>
			<ErrorText visibility text={array.length < min ? `${name}${isEndWithConsonant(name) ? "을" : "를"} 1개 이상 선택해 주세요.` : ""}/>
		</>
	);
});

export default memo(MultiDropdown);