import React, { useEffect } from 'react';
import styles from 'components/atoms/Input/Input.module.scss';
import { useScript, useForwardedRef } from 'hooks';

type DropdownProps = {
	config?: DropdownConfig | keyof typeof DropdownConfigs;
	defaultValue?: string;
	confirm?: boolean;
	children?: React.ReactNode;
	onChange?: DropdownEventListener;
	onOptionSelect?: DropdownEventListener;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(({ config, defaultValue, confirm, children, onChange, onOptionSelect }, ref) => {
	const value = useForwardedRef<HTMLDivElement>(ref);

	const status = useScript(`${process.env.PUBLIC_URL}/js/dropdown.js`);
	useEffect(
		() => {
			if(!value.current) return;
			if(status !== "ready") return;

			if(onChange) {
				value.current.addEventListener("optionchange", onChange);
				value.current.addEventListener("optioninit", onChange);
			}
			if(onOptionSelect) value.current.addEventListener("optionselect", onOptionSelect);

			if(!value.current._dropdown) {
				let _config;
				if(!config) {
					_config = DropdownConfigs.time_half;
				} else if(typeof config == "string") {
					_config = DropdownConfigs[config];
				} else {
					_config = config;
				}
				value.current.dropdown(defaultValue ? { ..._config, defaultValue } : _config);
			}

			return () => {
				if(value.current) {
					if(onChange) {
						value.current.removeEventListener("optionchange", onChange);
						value.current.removeEventListener("optioninit", onChange);
					}
					if(onOptionSelect) value.current.removeEventListener("optionselect", onOptionSelect);
				}
			}
		},
		[status, onChange, onOptionSelect]
	);

	useEffect(() => {
		if(value.current) {
			if(confirm === true) {
				value.current.classList.add(styles.confirm);
				value.current.classList.remove(styles.error);
			} else if(confirm === false) {
				value.current.classList.add(styles.error);
				value.current.classList.remove(styles.confirm);
			} else {
				value.current.classList.remove(styles.error);
				value.current.classList.remove(styles.confirm);
			}
		}
	}, [value, confirm]);

	return <div ref={value} className={`${styles.input} ${styles.styled}`}>{children}</div>
});

export default React.memo(Dropdown);