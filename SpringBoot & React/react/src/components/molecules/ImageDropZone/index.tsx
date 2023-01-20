import { forwardRef, memo, useRef, useState, useEffect } from 'react';
import styles from './ImageDropZone.module.scss';
import { ErrorText, PreviewButton, Svg } from 'components/atoms';

type ImageDropZoneProps = {
	tabIndex?: number;
	onChange?: (uploadedUrl?: string) => void;
};

const ImageDropZone = forwardRef<HTMLDivElement, ImageDropZoneProps>(({ tabIndex, onChange }, ref) => {
	const [image, setImage] = useState<string>();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		onChange?.(image);
	}, [image, onChange]);

	return (
		image
		?
		<>
			<div className={`${styles.zone} ${styles.preview}`} tabIndex={tabIndex} style={{background: `url(${image}) center center / cover no-repeat`}} ref={ref}></div>
			<PreviewButton buttonStyle="delete" style={{width: "100px", marginLeft: "calc(100% - 100px)"}}>삭제</PreviewButton>
		</>
		:
		<>
			<div className={styles.zone} tabIndex={tabIndex} ref={ref}>
				<p>
					<Svg viewBox="0 0 24 24" height="3em" width="3em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>,<polyline points="17 8 12 3 7 8"></polyline>,<line x1="12" x2="12" y1="3" y2="15"></line>
					</Svg>
				</p>
				<p>4MB 이하의 png, jpg, jpeg, gif 이미지만 업로드 가능합니다.</p>
				<p>16:9 비율의 이미지가 가장 잘 어울립니다.</p>
				<input accept="image/jpeg, image/png, image/jpg, image/gif" type="file" style={{display: "none"}} ref={inputRef} />
			</div>
			<ErrorText text="" />
		</>
	);
});

export default memo(ImageDropZone);