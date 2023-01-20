(function() {
    'use strict';

    function uploadCroppedImage(croppr, option) {
        const cropRect = croppr.getValue();
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = cropRect.width;
        canvas.height = cropRect.height;
        context.drawImage(
            croppr.imageEl,
            cropRect.x,
            cropRect.y,
            cropRect.width,
            cropRect.height,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        canvas.toBlob(function(blob) {
            new Compressor(blob, {
                strict: true,
                width: option.width,
                hegiht: option.height,
                success: function (result) {
                    const originEl = croppr.originEl;

                    croppr.destroy();

                    originEl.remove();
                    originEl._parent.style = "display: block";
                    result.name = option.fname;
                    majax.uploadImage(result, originEl._parent, option.success, option.error);
                },
                error: option.error ? option.error : function(err) {
                    console.log(err);
                }
            });
        });
    }

    function uploadCroppedGif(croppr, option) {
        const cropRect = croppr.getValue();
        var rub = new SuperGif({ gif: croppr.imageEl } );
        rub.load(function(){
            const imageDataList = rub.get_crop_data_list(cropRect);
            
            var ge = new GIFEncoder();
            ge.setRepeat(0);
            ge.setFrameRate(60);
            ge.setSize(cropRect.width, cropRect.height);

            ge.start();
            for(var i = 0; i < imageDataList.length; i++) {
                var data = imageDataList[i];
                ge.setDelay(data.delay);
                ge.addFrame(data.data, true);
            }
            ge.finish();

            const binary_gif = ge.stream().getData();
            
            const originEl = croppr.originEl;
            croppr.destroy();
            originEl.remove();
            originEl._parent.style = "display: block";
            
            var length = binary_gif.length;
            var tempArray = new Uint8Array(length);
            for (var i = 0; i < length; i++){
                tempArray[i] = binary_gif.charCodeAt(i);
            }

            const blob = new Blob([tempArray], { type: "image/gif" });
            blob.name = option.fname;

            majax.uploadImage(blob, originEl._parent, option.success, option.error);
        });
    }

    function createCropButton() {
        let btn = document.createElement("button");

        btn.className = "form-button preview-confirm-btn";
        btn.textContent = "선택영역만큼 자르기";
        btn.style.cssText = "margin: 10px auto 0 auto; padding: 5px 20px; width: auto; height: auto; font-size: 13px;";
        
        return btn;
    }

    function createCropTempImage(src) {
        let img = document.createElement("img");

        img.src = src;

        return img;
    }

    function onCrop(container, dataURL) {
        const parent = container.parentElement;
        const cropOption = container._imageUploader.option;

        let tempImg = createCropTempImage(dataURL);
        let btn = createCropButton();

        container.style.display = "none";
        parent.append(tempImg);
        parent.append(btn);
        
        const croppr = new Croppr(tempImg, {aspectRatio: cropOption.aspectRatio});//0.26666666  0.5625
        tempImg._parent = container;
        croppr.originEl = tempImg;

		function doCrop(event) {
			if(event instanceof Event) event.preventDefault();
			var temp = container._imageUploader;
			if(temp && temp.doCrop) delete temp.doCrop;

			btn.remove();
			doLoading(croppr.cropperEl);
			if(dataURL.startsWith("data:image/gif")) {
				if(typeof(SuperGif) == "undefined") {
					loadJs(location.getResource("assets/croppr/giflib.min.js"), function() {uploadCroppedGif(croppr, cropOption);});
				} else uploadCroppedGif(croppr, cropOption);
			} else uploadCroppedImage(croppr, cropOption);
		}
		container._imageUploader.doCrop = doCrop;
        btn.addEventListener('click', doCrop);
    }

    function onFileRead(container, file) {
        let fileReader = new FileReader();
        fileReader.onload = function(e) {
            onCrop(container, e.target.result);
        };
        if(!container._imageUploader.option.fname) container._imageUploader.option.fname = file.name;
        fileReader.readAsDataURL(file);
    }

    function appendFileSelectInput(container) {
        let fileSelector = document.createElement("input");
        fileSelector.accept = "image/jpeg, image/png, image/jpg, image/gif";
        fileSelector.type = "file";
        fileSelector.style.display = "none";

        fileSelector.addEventListener('change', createImageListener(function(files) {
			const f = files[0];
			if (files.length > 1) {
				alert('이미지는 하나만 등록 가능합니다.');
			} else if (f.type.match(/image.*/)) {
				onFileRead(container, f);
			} else {
				alert('사진 파일만 업로드 가능합니다.');
			}
		}));
        container.addEventListener('click', function() {
            fileSelector.click();
        });

        container.append(fileSelector);
    }

    /*
     * option
     *
     * aspectRatio 가로에 따른 세로 비율
     * witdh
     * height
     * 
     * success
     * error
     */

    window.imageUploader = function(elem, option) {
        appendFileSelectInput(elem);

        elem._imageUploader = {
            option: option
        };
        // aspectRatio, width, height
    };
}());