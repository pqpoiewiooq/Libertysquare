import React, { useCallback } from 'react';
import styles from './PreviewButton.module.scss';

type PreviewButtonProps = {
	size: "normal" | "small";
	buttonStyle?: "confirm" | "edit" | "delete";
	disabled?: boolean;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	children?: React.ReactNode;
};

const PreviewButton = ({size, buttonStyle, disabled, style, onClick, children} : PreviewButtonProps) => {
	const onClickHandler = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();

			onClick?.(event);

			event.currentTarget.blur();
		}, [onClick]
	);

	return (
		<button 
			type="button"
			className={buttonStyle ? `${styles[size]} ${styles[buttonStyle]}` : styles[size]}
			onClick={onClickHandler}
			disabled={disabled}
			style={style}>
				{children}
		</button>
	)
};

PreviewButton.defaultProps = {
	size: "normal",
};

export default React.memo(PreviewButton);