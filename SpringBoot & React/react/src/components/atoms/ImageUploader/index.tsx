import { memo, useEffect, useRef} from 'react';
import styles from './ImageUploader.module.scss';
import { useCss } from 'hooks';
import { uploadImage } from 'utils/api/ImageApi';
import { useScriptAll } from 'hooks/useScript';
import { Loading, Button } from 'components/atoms';
import { renderToHTMLElement } from 'utils/DomUtil';

type ImageUploaderProps = {
	aspectRatio: number,
	width: number,
	height?: number,
	shape: 'circle' | 'rectangle';
	description?: string;
	path?: string;
	onUpload?: (uploadedUrl: string) => void;
}

const scriptList = ["/assets/croppr/imguploader.js", "/assets/croppr/croppr.min.js", "https://cdn.jsdelivr.net/gh/fengyuanchen/compressorjs/dist/compressor.min.js", "/assets/croppr/imguploader.js"];
const ImageUploader = ({ aspectRatio, width, height, shape, description, path, onUpload } : ImageUploaderProps) => {
	const style = path ? { background: `url(${path}) center center / cover no-repeat` } : undefined;

	useCss(`${process.env.PUBLIC_URL}/assets/croppr/croppr.min.css`);
	const status = useScriptAll(scriptList);
	const giflib = `${process.env.PUBLIC_URL}/assets/croppr/giflib.min.js`;


	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if(status === "ready" && imageRef.current && !imageRef.current._imageUploader) {
			const loading = renderToHTMLElement(<Loading />);
			loading.style.position = "absolute";

			imageUploader(imageRef.current, {
				aspectRatio,
				width,
				height,
				giflib,
				processor: (result: any) => {
					uploadImage(result)
						.then((response) => {
							const data = response.data;
							imageRef.current!.style.background = `url(${data}) center center / cover no-repeat`;
							onUpload?.(data);
						})
						.catch((error) => {
							let msg = '이미지 업로드에 실패하였습니다.';
							if(error.response && error.response.data) {
								alert(`${msg}\n${error.response.data}`)
							} else {
								alert(msg);
							}
						});
				},
				button: renderToHTMLElement(<Button buttonStyle="form" color="secondary" text=""/>),
				loading
			});
		}
	}, [status, shape, aspectRatio, width, height, onUpload]);

	return (
	<>
		{ description && <div className={styles.description}>{description}</div> }
		<div className={styles.body}>
			<div className={styles.container}>
				<div className={`${styles.image} ${styles[shape]}`} style={style} ref={imageRef}></div>
			</div>
		</div>
	</>
	)
}

export default memo(ImageUploader);