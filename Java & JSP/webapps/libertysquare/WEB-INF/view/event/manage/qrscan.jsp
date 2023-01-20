<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<% User user = (User) session.getAttribute("user"); %>
<html lang="ko">
<head>
	<jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="Libertysquare qr scanner" />
	</jsp:include>
    <meta charset="utf-8">

    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/qrscan.css">
</head>
<body>
    <main id="root">
        <div id="inner">
            <section class="qr-top-container">
                <a href="/"><img class="qr-top-logo" src="https://ls2020.cafe24.com/img/ls/logo.png"/></a>
                행사를 만나는 가장 쉬운 방법.
                <article class="qr-top-version">Libertysquare QR Scanner v0.20</article>
                <article class="qr-top-host-box">Organizer : <%= user.getNickname() %></article>
            </section>
            <section class="qr-body">
                <article class="qr-canvas-wrapper">
                    <div class="qr-canvas-inner">
                        <canvas id="qr-canvas"></canvas>
                        <div class="qr-canvas-accent-area"></div>
                    </div>
                </article>
                <article id="qr-notice">
                    ⌛ 스캔 기능을 활성화 중입니다.<br>카메라 액세스를 허용해주세요.
                </article>
            </section>
        </div>
    </main>
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/common.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/qr/jsQR.js"></script>
<script>
(function() {
    var inner = document.getElementById("inner");
    var video = document.createElement("video");		
    var canvasElement = document.getElementById("qr-canvas");
    var canvas = canvasElement.getContext("2d");
    var noticeElement = document.getElementById("qr-notice");

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    // 카메라 사용시
    var constrainsts = { audio: false, video: { facingMode: { exact: "environment" } } };

    function start(stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);// iOS 사용시 전체 화면을 사용하지 않음을 전달
        video.play();
        requestAnimationFrame(tick);
    }

    const STATUS_READY = "ready";
    const STATUS_STANBY = "stanby";
    const STATUS_SUCCESS = "success";
    const STATUS_CONFLICT = "conflict";
    const STATUS_UNAUTHORIZED = "";
    function notice(text, status, isHtml) {
        if(isHtml) noticeElement.innerHTML = text;
        else noticeElement.textContent = text;
        if(status) inner.className = status;
    }

    navigator.mediaDevices.getUserMedia(constrainsts).then(start).catch(function(err) {
        notice("후면 카메라를 찾지 못했거나 접근 불가합니다.\n\n" + err);

        if(confirm("후면 카메라를 찾지 못했거나 접근 불가합니다.\n전면 카메라를 사용하시겠습니까?")) {
            constrainsts.video = {facingMode: "user"};
            navigator.mediaDevices.getUserMedia(constrainsts).then(start).catch(function(err) {
                notice("전면 카메라를 찾지 못했거나 접근 불가합니다.\n\n" + err);
                if(navigator.mediaDevices.enumerateDevices) {
                    if(confirm("전면 카메라를 찾지 못했거나 접근 불가합니다.\n자동으로 사용 가능한 카메라를 찾아서 사용하시겠습니까?")) {
                        navigator.mediaDevices.enumerateDevices().then(async function(devices) {
                            while(devices.length > 0) {
                                var device = devices.pop();
                                if(device.kind == "videoinput") {
                                    let stream = null;
                                    try {
                                        constrainsts.video = {deviceId: device.deviceId};
                                        stream = await navigator.mediaDevices.getUserMedia(constrainsts);
                                        start(stream);
                                        return;
                                    } catch(err) {
                                        notice("카메라 연결 실패\n[" + device.deviceId + "]" + err);
                                    }
                                }
                            }
                            notice("사용 가능한 카메라를 찾지 못하였습니다.");
                        }).catch(function(err) {
                            notice("사용 가능한 카메라를 찾지 못하였습니다.\n\n" + err);
                        });
                    }
                }
            });
        }
    });

    var regex = /^https:\/\/libertysquare\.co\.kr\/manage\/attend\/[0-9]+$/;

    function tick() {
        if(video.readyState === video.HAVE_ENOUGH_DATA) {
            // 읽어들이는 비디오 화면의 크기
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
        
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);

            var code = jsQR(imageData.data, imageData.width, imageData.height, {inversionAttempts : "dontInvert"});
            
            // QR코드 인식에 성공한 경우
            if(code) {
                if(regex.test(code.data)) {
                    /*
                    notice("출석 처리중입니다. 잠시만 기다려주세요.", STATUS_STANBY);
                    var param = "id=" + code.data.replace(/[^0-9]/g, "") + "&state=ATTEND";
                    majax.do("/api/attendant", "PATCH", param, function(xhr) {
                        notice(xhr.responseText + "님 환영합니다.", STATUS_SUCCESS);
                        requestTickDelayed();
                    }, function(xhr) {
                        switch(xhr.status) {
                        case 409:// Conflict
                            notice("이미 참석 처리된 티켓입니다.", STATUS_CONFLICT);
                            requestTickDelayed();
                            break;
                        case 401:// Unauthorized
                            notice("세션이 만료되었거나 로그인이 되지 않았습니다. 현재 브라우저의 다른 탭에서 <a class=\"qr-link\" href=\"window.location.href\" target=\"_blank\">자유광장</a>에 관리자 계정으로 로그인을 해주세요.", STATUS_UNAUTHORIZED, true);
                            break;
                        case 422:
                            notice("잘못된 요청입니다.", STATUS_CONFLICT);
                            break;
                        default:
                            alert("서버 처리중 문제가 발생하였습니다.\n반복될 경우 고객센터로 문의바랍니다.\n" + xhr.responseText);
                            location.reload();
                        }
                    });
                    */
                    try {
                        notice("출석 처리중입니다. 잠시만 기다려주세요.", STATUS_STANBY);
                        var param = "id=" + code.data.replace(/[^0-9]/g, "") + "&state=ATTEND";
                        majax.do("https://api.libertysquare.co.kr/attendant", "PATCH", param, function(xhr) {
                            try{
                                notice(xhr.responseText + "님 환영합니다.", STATUS_SUCCESS);
                                requestTickDelayed();
                            } catch(e2) {
                                notice("알 수 없는 오류가 발생하였습니다.\n" + e2, STATUS_CONFLICT);
                            }
                        }, function(xhr) {
                            try{
                                switch(xhr.status) {
                                case 409:// Conflict
                                    notice("이미 참석 처리된 티켓입니다.", STATUS_CONFLICT);
                                    requestTickDelayed();
                                    break;
                                case 401:// Unauthorized
                                    notice("세션이 만료되었거나 로그인이 되지 않았습니다. 현재 브라우저의 다른 탭에서 <a class=\"qr-link\" href=\"window.location.href\" target=\"_blank\">자유광장</a>에 관리자 계정으로 로그인을 해주세요.", STATUS_UNAUTHORIZED, true);
                                    break;
                                case 422:
                                    notice("잘못된 요청입니다.", STATUS_CONFLICT);
                                    break;
                                default:
                                    alert("서버 처리중 문제가 발생하였습니다.\n반복될 경우 고객센터로 문의바랍니다.\n" + xhr.responseText);
                                    location.reload();
                                }
                            } catch(e3) {
                                notice("알 수 없는 오류가 발생하였습니다.\n" + e3, STATUS_CONFLICT);
                            }
                        });
                    } catch(exception) {
                        notice("서버에 요청하는데 실패하였습니다.\n" + exception, STATUS_CONFLICT);
                    }
                    return;
                } else {
                    notice("올바르지 않은 QR CODE입니다.", STATUS_CONFLICT);
                }
            } else {// QR코드 인식에 실패한 경우 
                notice("QR CODE를 화면의 사각형 안에 맞춰주세요.", STATUS_READY);
            }
        } else {
            notice("⌛ 스캔 기능을 활성화 중입니다.", STATUS_READY);
        }

        requestAnimationFrame(tick);
    }

    const scanDelay = 1500;
    function requestTick() {
        requestAnimationFrame(tick);
    }

    function requestTickDelayed() {
        setTimeout(requestTick, scanDelay);
    }
}());
</script>
</html>