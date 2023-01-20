import React, { useRef, useLayoutEffect, useCallback } from 'react';
import StyledInput from 'components/atoms/Input/StyledInput';
import { useCss, useScript, useEventListener } from 'hooks';

type DatePickerProps = {
	defaultDate?: Date;
	onChange?: (date: Date) => void;
	style?: React.CSSProperties;
	className?: string;
};

const DatePicker = ({ defaultDate, onChange, style, className } : DatePickerProps) => {
	const value = useRef<HTMLInputElement>(null);

	useCss(`${process.env.PUBLIC_URL}/assets/flatpickr/flatpickr.min.css`);
	const status = useScript(`${process.env.PUBLIC_URL}/assets/flatpickr/flatpickr-4.6.9.js`);
	useEventListener(
		"change",
		useCallback(() => {
			onChange?.(value.current?._flatpickr.selectedDates[0]);
		}, [value, onChange]),
		value
	);

	useLayoutEffect(
		() => {
			if(status === "ready" && value.current && !value.current._flatpickr) {
				flatpickr.localize(flatpickr.l10ns.ko);
				const option = {
					minDate: "today",
					defaultDate: defaultDate || new Date()
				};
				flatpickr(value.current, option);
				onChange?.(option.defaultDate);

				return () => {
					if(value.current && value.current._flatpickr) {
						value.current._flatpickr.clear();
						value.current._flatpickr.destroy();
						value.current._flatpickr = undefined;
					}
				}
			}
		}, [status, value]
	);
	
	return (
		<StyledInput ref={value} style={style} className={className}/>
	)
};

export default React.memo(DatePicker);