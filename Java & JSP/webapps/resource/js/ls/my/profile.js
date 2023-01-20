(function() {
    /*** 정보 수정 ***/
    var nicknameInput = document.querySelector("input[name='nickname']");
    var nicknameError = nicknameInput.nextElementSibling;
    var nicknameChecker;
    function attachInputEventListener() {
        nicknameChecker = InputEventListener.on(['input', 'focus'], nicknameInput, nicknameError, 14, "닉네임을 입력해주세요");
        window.removeEventListener('load', attachInputEventListener);
    }
    window.addEventListener('load', attachInputEventListener);

    var profile = document.querySelector(".host-edit-form-image.profile");
    function initCroppr() {
        imageUploader(profile, {
            aspectRatio: 1,
            width: 150,
            height: 150,
            success: function(path) {
                profile.style.cssText = "background:url(" + path + ") no-repeat center center/cover;";
                profile.imagePath = path;
            },
            error : function(error) {
                alert("이미지 업로드에 실패하였습니다.\n" + error);
            }
        });
    }

    if(typeof(Croppr) == "undefined") {
        loadJsList([location.getResource("assets/croppr/croppr.min.js"), "https://cdn.jsdelivr.net/gh/fengyuanchen/compressorjs/dist/compressor.min.js", location.getResource("assets/croppr/imguploader.js")], initCroppr);
        loadCss(location.getResource("assets/croppr/croppr.min.css"));
    }


	function requestUpdateProfile() {
		var param = "nickname=" + nicknameInput.value;
		if(profile.imagePath) param += "&profile=" + encodeURIComponent(profile.imagePath);
		majax.load(document.body, "/account/profile", "PATCH", param, undefined, true)
			.then(function() {
				alert("변경되었습니다.");
				location.reload(true);
				//location.href = '/my/profile?timestamp=' + Date.now();
			}).catch(function(xhr) {
				alert("변경 실패 : " + xhr.responseText);
			});
	}

	function forceCrop() {
		doLoading(document.body, true);
		profile._imageUploader.doCrop();

		var currentImagePath = profile.imagePath;
		new Promise(function(resolve) {
			var intervalId = setInterval(function() {
				if(profile.imagePath != currentImagePath) {
					stopLoading(document.body);
					resolve();
					clearInterval(intervalId);
					requestUpdateProfile();
				}
			}, 100);
		});
	}

    document.querySelector(".js-form-info").addEventListener('click', function(event) {
        event.preventDefault();
        if(nicknameChecker()) {
			if(profile._imageUploader.doCrop) {
				forceCrop();
			} else requestUpdateProfile();
        }
    });


    document.querySelector(".js-form-withdraw").addEventListener('click', function(event) {
        event.preventDefault();
        location.href = "/withdraw";
    });

    /*** 비밀번호 변경 ***/
    var newPasswordInput = document.querySelector("input[name='password']");
    var newPasswordError = newPasswordInput.nextElementSibling;
    var newPasswordInput2 = document.querySelector("input[name='_password']");
    var newPasswordError2 = newPasswordInput2.nextElementSibling;
    var curPasswordInput = document.querySelector("input[name='current_password']");
    //var regPw = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    var regPw = /^.*(?=^.{4,16}$).*$/;
    
    function checkNewPassword() {
        var result = true;
        var value1 = newPasswordInput.value;
        var value2 = newPasswordInput2.value;

        if(regPw.test(value1)) {
            newPasswordError.className = "error-text hidden";
        } else {
            newPasswordError.className = "error-text";
            //newPasswordError.textContent = "비밀번호는 대소문자, 특수문자, 숫자를 포함한 8 ~ 16 글자이어야 합니다";
            newPasswordError.textContent = "비밀번호는 4 ~ 16 글자이어야 합니다";
            result = false;
        }

        if(value1 == value2) {
            newPasswordError2.className = "error-text hidden";
        } else {
            newPasswordError2.className = "error-text";
            newPasswordError2.textContent = "새로운 비밀번호와 다릅니다.";
            result = false;
        }

        return result;
    }

    newPasswordInput.addEventListener('input', checkNewPassword);
    newPasswordInput2.addEventListener('input', checkNewPassword);
    document.querySelector(".js-form-pw").addEventListener('click', function(event) {
        event.preventDefault();
        if(checkNewPassword()) {
            var rsa = new RSAKey();
            var m = document.getElementById("m").value;
            var e = document.getElementById("e").value;
            rsa.setPublic(m, e);
            var np = encodeURIComponent(rsa.encrypt(newPasswordInput.value));
            var cp = encodeURIComponent(rsa.encrypt(curPasswordInput.value));
            var param = "new=" + np + "&cur=" + cp;
            majax.load(document.body, "/account/password", "PATCH", param, undefined, true)
                .then(function() {
                    alert("변경되었습니다.\n새로운 비밀번호로 다시 로그인해주십시오.");
                    location.href = '/sign';
                }).catch(function(xhr) {
                    alert("변경 실패 : " + xhr.responseText);
                });
        }
    });
}());