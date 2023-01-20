import React, { useCallback, useEffect } from 'react';
import { useScript } from 'hooks';
import { useRef } from 'react';

type onInitListener = (editor: TinymceEditor) => void;
type ContentFieldProps = {
	onInit?: onInitListener;
	defaultValue?: string;
};

function initTinyMce(elem: Element, onInit?: onInitListener) {
	tinymce.init({
		target: elem,
		external_plugins: {
			imageUploader: `${process.env.PUBLIC_URL}/assets/tinymce/plugins/ImageUploader.min.js`,
			autoLlink: `${process.env.PUBLIC_URL}/assets/tinymce/plugins/autolink.min.js`
		},
		plugins: "link charmap autolink imageUploader paste media",
		toolbar: ["undo redo styleselect bold italic underline strikethrough", "charmap link imageUploader media"],
		menubar: false,
		statusbar: false,
		language: "ko_KR",
		height: "550px",
		width: "100%",
		body_class: "content-editor",
		content_style: ".content-editor{max-width:700px;margin:auto;padding:10px;color:#4a4a4a;font-family:Spoqa Han Sans,sans-serif}img{width:100%}.mce-object-iframe{width:calc(100% - 4px)}.mce-object-iframe>iframe{width:100%;border:0}p{font-size:14px;line-height:1.8}h3+p{margin-top:10px}h1{font-size:20px;line-height:2}*+h1{margin-top:40px}h2{font-size:18px;line-height:1.2}p+h2{margin-top:40px}h3{font-size:16px;margin-bottom:10px}p+h3{margin-top:25px}a{color:#ff4500;text-decoration:none;word-break:break-all}*{word-break:keep-all}@media screen and (min-width:800px){p{font-size:15px}h1{font-size:27px}h2{font-size:21px}h3{font-size:17px}.content-editor{margin-top:30px}}",
		object_resizing: false,
		forced_root_block: "p",
		paste_as_text: true,
		/* 사진 drag & drop - start */
		paste_data_images: true,
		automatic_uploads: true,
		images_upload_credentials: true,
		convert_urls : false,
		images_upload_handler: function (blob: Blob, success: Function, failure: Function, progress: Function) {
			progress(0);
			// majax.uploadImage(blob.blob(), undefined, function(ph) {
			//	 success(ph);
			// }, function(xhr) {
			//	 failure('Image upload failed' + xhr ? '\n' + xhr.responseText : '', {remove: true});
			// }, function(e) {
			//	 progress(Math.floor(e.loaded / e.total * 100));
			// });
		},
		/* 사진 drag & drop - end */
		default_link_target: "_blank",
		media_live_embeds: true,
		media_alt_source: false,
		media_poster: false,
		media_dimensions: false,
		style_formats:[{title:"\uc81c\ubaa91",block:"h1"},{title:"\uc81c\ubaa92",block:"h2"},{title:"\uc81c\ubaa93",block:"h3"},{title:"\ubcf8\ubb38",block:"p"}],
		init_instance_callback: onInit,
		// imageUploader 플러그인 callback
		imageUploaderHandler: function (editor: any, blob: Blob, close: Function) {
			
		}
		// tinyMCE.activeEditor.getParam("paste_as_text");
	});
}


const ContentField = ({ onInit, defaultValue } : ContentFieldProps) => {
	const status = useScript("https://cdn.tiny.cloud/1/x3mzugv485f8ydwz41c9eioaa1q6afipoglhxehonabc52v0/tinymce/5/tinymce.min.js");
	const ref = useRef(false);
	const elem = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if(status === "ready" && !ref.current) {
			ref.current = true;
			
			initTinyMce(elem.current!, onInit);
		}
	}, [status, elem, onInit]);

	return <div ref={elem}>{defaultValue}</div>;
};

export default React.memo(ContentField);