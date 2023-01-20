import React, { forwardRef } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
	className?: string;
	style?: React.CSSProperties;
	type?: "button" | "submit" | "reset";
	buttonStyle: "form" | "checkplus" | "confirm";
	color?: "primary" | "secondary";
	text: string;
	withContainer?: true | "right";
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({className, style, type, buttonStyle, color, text, withContainer, disabled, onClick} : ButtonProps, ref) => {
	if(className) className += ` ${styles[buttonStyle]}`;
	else className = styles[buttonStyle];
	if(color && color !== "primary") className += ` ${styles[color]}`;

	return (
		withContainer
		?
		<article className={withContainer === "right" ? `${styles.container} ${styles.right}` : styles.container}>
			<button 
				type={type}
				style={style}
				className={className}
				onClick={onClick}
				disabled={disabled}
				ref={ref}>
					{text}
			</button>
		</article>
		:
		<button 
			type={type}
			style={style}
			className={className}
			onClick={onClick}
			disabled={disabled}
			ref={ref}>
				{text}
		</button>
	)
});

Button.defaultProps = {
	type: "button",
	color: "primary",
	disabled: false
};



export default Button;