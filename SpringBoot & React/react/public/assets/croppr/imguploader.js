(function() {
    'use strict';

	function loadJs(src, onLoad) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = src;
		if(typeof(onLoad) === "function") {
			js.addEventListener('load', onLoad);
		}
		document.body.appendChild(js);
	}

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
                    const _URL = window.URL || window.webkitURL;
                    const originEl = croppr.originEl;

                    croppr.destroy();

                    originEl.remove();
                    originEl._parent.style = "display: block";
                    result.name = option.fname;
					if(typeof option.processor == 'function') option.processor(result);
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

			if(typeof option.processor == 'function') option.processor(blob);
        });
    }

    function createCropButton() {
        let btn = document.createElement("button");

        btn.className = "form-button preview-confirm-btn";
        btn.textContent = "?????????????????? ?????????";
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
        let btn = cropOption.button || createCropButton();
		btn.textContent = "?????????????????? ?????????";
        btn.style.cssText = "margin: 10px auto 0 auto; padding: 5px 20px; width: auto; height: auto; font-size: 13px;";
        
        container.style.display = "none";
        parent.append(tempImg);
        parent.append(btn);
        
        const croppr = new Croppr(tempImg, {aspectRatio: cropOption.aspectRatio});//0.26666666  0.5625
        tempImg._parent = container;
        croppr.originEl = tempImg;

        btn.addEventListener('click', function(event) {
            event.preventDefault();
            btn.remove();
			croppr.cropperEl.parentElement.append(cropOption.loading);
            if(dataURL.startsWith("data:image/gif")) {
                if(typeof(SuperGif) == "undefined") {
                    loadJs(cropOption.giflib, function() {uploadCroppedGif(croppr, cropOption);});
                } else uploadCroppedGif(croppr, cropOption);
            } else uploadCroppedImage(croppr, cropOption);
        });
    }

    function onFileRead(container, file) {
        let fileReader = new FileReader();
        fileReader.onload = function(e) {
            onCrop(container, e.target.result);
        };
        if(!container._imageUploader.option.fname) container._imageUploader.option.fname = file.name;
        fileReader.readAsDataURL(file);
    }

    function fileSelectListener(event) {
        event.stopPropagation();
        event.preventDefault();
        
        if(!event.dataTransfer && event.originalEvent) {
            event.dataTransfer = event.originalEvent.dataTransfer;
        }
        var files = event.target.files || event.dataTransfer.files;
        var f = files[0];

        event.target.value = "";// ?????? ????????? ?????????????????? ????????? ??? ????????? value ?????????

        if (files.length > 1) {
            alert('???????????? ????????? ?????? ???????????????.');
        } else if (f.type.match(/image.*/)) {
            onFileRead(event.target.parentElement, f);
        } else {
            alert('?????? ????????? ????????? ???????????????.');
        }
    }

    function appendFileSelectInput(container) {
        let fileSelector = document.createElement("input");
        fileSelector.accept = "image/jpeg, image/png, image/jpg, image/gif";
        fileSelector.type = "file";
        fileSelector.style.display = "none";

        fileSelector.addEventListener('change', fileSelectListener);
        container.addEventListener('click', function() {
            fileSelector.click();
        });

        container.append(fileSelector);
    }

    /*
     * [option]
     *
     * aspectRatio - ????????? ?????? ?????? ??????
     * width - ??????
     * height - ??????
	 * 
	 * button - ????????? ????????? ?????? ???
	 * loading - loading ????????? ????????? ??????
     * 
	 * processor - ?????? ????????? ????????? ??????
	 * giflib - giflib url
     */
    window.imageUploader = function(elem, option) {
        appendFileSelectInput(elem);

        elem._imageUploader = {
            option: option
        };
        // aspectRatio, width, height
    };
}());