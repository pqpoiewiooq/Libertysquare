import React, { useCallback, useEffect } from 'react';
import styles from './FormField.module.scss';
import { DatePicker, Label, Dropdown } from 'components/atoms';
import { useRefState } from 'hooks';
import { DateTime } from 'utils/DateUtil';

type DateTimeFieldProps = {
	title: string;
	onChange?: (value: DateTime) => void;
};

const DateTimeField = React.forwardRef<HTMLDivElement, DateTimeFieldProps>(({ title, onChange }, ref) => {
	const [value, setValue] = useRefState<DateTime>(new DateTime());

	const onDateChange = useCallback(
		(date: Date) => {
			setValue(prev => new DateTime(date, prev.time));
			onChange?.(value.current);
		}, []
	); 

	const onTimeChange = useCallback(
		(event: DropdownEvent) => {
			setValue(prev => new DateTime(prev.date, event.detail.after.value));
			onChange?.(value.current);
		}, []
	);

	useEffect(() => {
		onChange?.(value.current);
	}, [onChange]);

	return (
		<div className={styles.wrapper} ref={ref}>
			<Label text={title}/>
			<div className={`${styles.flex} ${styles.responsive}`}>
				<DatePicker defaultDate={ value.current.date } onChange={onDateChange} />
				<Dropdown defaultValue={ value.current.time } onChange={onTimeChange} />
			</div>
		</div>
	)
});

export default React.memo(DateTimeField);