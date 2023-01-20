import { memo, useRef, useCallback } from 'react';
import styles from './Palette.module.scss';
import { validateHexColor, hexColorFilter } from 'utils/TextUtil';
import { useKeyFilter } from 'hooks';

type Color = string;

type PaintProps = {
	color: Color;
	onClick: (color: Color) => void;
};
const Paint = memo(({ color, onClick } : PaintProps) => 
	<div
		className={styles.paint}
		style={{ background: color }}
		onClick={() => onClick(color)}>
	</div>
);

type PaletteProps = {
	onChange?: (color: Color) => void;
	defaultValue?: Color;
}

const paintList = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];

const Palette = ({ onChange, defaultValue } : PaletteProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useKeyFilter(inputRef, hexColorFilter);
	
	const changeHandler = useCallback(() => {
		const elem = inputRef.current;
		if(elem) {
			const value = elem.value;
			if(value.length > 6) {
				elem.value = value.substring(0, 6);
				return;
			} else if(value.length === 0 ) {
				elem.classList.remove(styles.wrong);
				onChange?.('');
				return;
			}

			const hexColorValue = `#${value}`;
			if(validateHexColor(hexColorValue)) {
				elem.classList.remove(styles.wrong);
				onChange?.(hexColorValue);
			} else {
				elem.classList.add(styles.wrong);
			}
		}
	}, [onChange]);

	const onPaintClicked = useCallback((color: Color) => {
		const elem = inputRef.current;
		if(elem) {
			elem.value = color.replace('#', '');
			changeHandler();
		}
	}, [changeHandler]);

	return (
		<div className={styles.palette}>
			{paintList.map(paint => <Paint color={paint} key={paint} onClick={onPaintClicked}/>)}
			<div className={styles.hash}>#</div>
			<div className={styles['input-wrapper']}>
				<input className={styles.input} onChange={changeHandler} ref={inputRef} defaultValue={defaultValue?.replace('#', '')}/>
			</div>
		</div>
	)
};

export default memo(Palette);