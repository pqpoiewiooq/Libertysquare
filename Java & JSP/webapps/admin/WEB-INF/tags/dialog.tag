<%@ tag language="java" pageEncoding="UTF-8" description="Base Template" %>
<%@ attribute name="title"%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<!-- Meta -->
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">

	<!-- Page Info -->
	<title><%= title == null ? "관리자 페이지" : title + " | 관리자 페이지" %></title>

	<link rel="shortcut icon" type="image/x-icon" href="https://ls2020.cafe24.com/img/flattop/favicon.ico">
	<link rel="icon" type="image/x-icon" href="https://ls2020.cafe24.com/img/flattop/favicon.ico">

	<!-- css -->
	<style>
		html, body {width: 100%;height:100%;margin: 0;padding: 0;font-size: 16px;}

		:root {
			--primary-rgb: 200, 200, 200;
			--primary: rgb(var(--primary-rgb));

			--background: #fff;

			--text: #4a4a4a;

			--error-rgb: 255, 45, 84;
			--error: rgb(var(--error-rgb));

			--item-height: calc(2rem + 1px + 2px + 2px);/* (text-size * 2) + padding + border + border-radius */
		}

		::-webkit-scrollbar {opacity: 0;width: 0;height: 0;appearance: none;}
		::-webkit-scrollbar-button,
		::-webkit-scrollbar-corner,
		::-webkit-scrollbar-track,
		::-webkit-scrollbar-track-piece {
			background-color: transparent
		}
		::-webkit-scrollbar-thumb {background-color: transparent;border-radius: 0;}

		.dialog {display: flex;height: 100%;flex-direction: column;padding: 24px 0;background-color: rgba(var(--primary-rgb), .2);-webkit-box-flex: 1;-webkit-box-pack: start;flex-grow: 1;-webkit-box-pack: center;}

		.dialog *[disabled], .dialog:disabled {background: rgba(var(--primary-rgb), .4);cursor: default;pointer-events: none;}

		.dialog form {width: 100%;max-width: 20rem;margin: 0 auto;}

		.dialog section {width: 100%;margin-bottom: 1rem;white-space: nowrap;color: var(--text);}

		.dialog h2 {display: block;margin-bottom: calc(.5rem - 1px);font-size: 1rem;font-weight: bold;}
		.dialog h2[required]::after {margin-left: .125rem;content: "*";color: var(--error);}

		.dialog :where(input, select) {display: flex;box-sizing: border-box;width: 100%;height: var(--item-height);padding: 0 1rem;border: 1px solid var(--primary);border-radius: 2px;outline: none;background-color: var(--background);color: inherit;align-items: center;transition: background-color 0.25s ease 0s;}

		.dialog input[type='text']::placeholder {color: var(--primary);}

		.dialog mark {display: none;background-color: transparent;height: 1rem;color: var(--error);font-size: .75rem;}
		.dialog *[error] mark {display: block;}
		.dialog *[error] input[type='text'] {border: 1px solid var(--error);background-color: rgba(var(--error-rgb), .1);}

		.dialog button {--interval: calc(1rem + 4px);width: 100%;height: var(--item-height);margin-top: var(--interval);padding: 0 var(--interval);text-align: center;letter-spacing: -.1px;border: transparent;border-radius: 3px;background-color: var(--primary);color: var(--background);font-size: 1rem;font-weight: bold;cursor: pointer;transition: .1s ease 0s;}
		.dialog button[type='submit'] {background-color: var(--error);}

		.dialog .additional {display: flex;flex-wrap: wrap;margin-top: .5rem;}
		.dialog .additional * {margin-top: 3px !important;}
		.dialog .additional :nth-last-child(2) {flex: 1;}
		.dialog .additional button {width: auto;margin: 0 0 0 0.5rem;padding: 0 1rem;}
	</style>


	<!-- js -->
	<script>
		HTMLElement.prototype.show = function() {
			this.style.display = "";
		};
		HTMLElement.prototype.hide = function() {
			this.style.display = "none";
		};

		function post(path, formdata) {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = path;

			formdata.forEach((value, key) => {
				const hiddenField = document.createElement('input');
				hiddenField.type = 'hidden';
				hiddenField.name = key;
				hiddenField.value = value;
				form.appendChild(hiddenField);
			});
			document.body.appendChild(form);
			form.submit();
		}

		function getForm() {
			return document.querySelector("form");
		}

		function getPrepositionalParticles(korStr) {
			const finalChrCode = korStr.charCodeAt(korStr.length - 1);
			const finalConsonantCode = (finalChrCode - 44032) % 28;// 0 = 받침 없음, 그 외 = 받침 있음
			return finalConsonantCode !== 0 ? '을' : '를';
		}

		const Validator = Object.freeze((() => {
			const ATTR_ERROR = 'error';

			function removeErrorAttribute(input) {
				input.parentElement.removeAttribute(ATTR_ERROR);
			}

			function setError(input, msg) {
				input.nextElementSibling.textContent = msg;
				input.parentElement.setAttribute(ATTR_ERROR, '');
			}

			function isEmpty(input) {
				if(input.value) {
					removeErrorAttribute(input);
					return true;
				} else {
					const name = input.previousElementSibling.textContent.trim();
					const cause = name + getPrepositionalParticles(name) + " 입력해 주세요.";
					setError(input, cause);
					return false;
				}
			}

			function test(input, regex, regexErrorMessage) {
				if(regex.test(input.value)) {
					return true;
				} else {
					setError(input, regexErrorMessage);
					return false;
				}
			}

			return {
				isEmpty,
				test,
				isEmptyAndTest: (input, regex, regexErrorMessage) => {
					if(isEmpty(input)) {
						return test(input, regex, regexErrorMessage);
					}
				}
			}
		})());
	</script>
</head>
<body>
	<article class="dialog">
		<jsp:doBody/>
	</article>
</body>
</html>