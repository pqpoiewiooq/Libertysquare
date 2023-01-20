(function() {
    let pwInput = document.querySelector(".input-field[name='password']");
    let pwError = pwInput.nextElementSibling;
    //var regPw = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    var regPw = /^.*(?=^.{4,16}$).*$/;
    var submitButton = document.querySelector("button[type='submit']");
    var form = document.querySelector("form");

    function checkPw(){
        return regPw.test(pwInput.value);
    }

    function pwInputEvent(event) {
        var len = pwInput.value.length;

        if(len == 0) {
            pwError.className = "error-text";
            pwError.textContent = "비밀번호를 입력해주세요";
            if(submitButton) submitButton.disabled = true;
            event.stopImmediatePropagation();
        } else if(!checkPw()) {
            pwError.className = "error-text";
            //pwError.textContent = "비밀번호는 대소문자, 특수문자, 숫자를 포함한 8 ~ 16 글자이어야 합니다";
            pwError.textContent = "비밀번호는 4 ~ 16 글자이어야 합니다";
            if(submitButton) submitButton.disabled = true;
            event.stopImmediatePropagation();
        } else {
            if(event.currentTarget.isSameNode(form)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                submitEncryptedForm();
            } else {
                pwError.className = "error-text hidden";
                if(submitButton) submitButton.disabled = false;
            }
        }
    }

    function submitEncryptedForm() {
        var rsa = new RSAKey();
        var m = document.getElementById("m").value;
        var e = document.getElementById("e").value;
        rsa.setPublic(m, e);
        var pw = rsa.encrypt(pwInput.value);

        var msg = form.dataset.msg;
        var method = form.getAttribute("method");
        
        if(msg) {
            var data = "password=" + encodeURIComponent(pw);
            majax.load(document.body, form.action, method, data, undefined, true)
                    .then(function() {
                        alert(msg);
                        location.href = '/sign';
                    }).catch(function(xhr) {
                        alert(xhr.responseText);
                        location.reload();
                    });
        } else {
            var securedForm = form.cloneNode(true);
            securedForm.style.display = "none";
            var p = securedForm.querySelector(".input-field[name='password']");
            p.type = "hidden";
            if(p) p.value = pw;
            document.body.append(securedForm);
            securedForm.submit();
        }
    }

    pwInput.addEventListener('input', pwInputEvent);
    form.addEventListener('submit', pwInputEvent, true);
}());