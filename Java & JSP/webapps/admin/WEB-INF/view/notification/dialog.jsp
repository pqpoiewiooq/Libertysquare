<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="servlet.util.RequestParser"%>
<%
	String[] toArray = RequestParser.getValues(request, "to", true);
	if(toArray == null) toArray = new String[] {""};
	boolean isSole = (toArray.length == 1);

	pageContext.setAttribute("toArray", toArray);
	pageContext.setAttribute("isSole", isSole);
	pageContext.setAttribute("isMultiple", !isSole);
	pageContext.setAttribute("title", RequestParser.get(request, "title", true));
	pageContext.setAttribute("body", RequestParser.get(request, "body", true));
	pageContext.setAttribute("redirect", RequestParser.get(request, "redirect", true));
%>

<t:dialog title="알림 발송">
	<form>
		<section>
			<h2 required>대상</h2>
			<select name="target">
				<!-- 개발중이라 optgroup으로 선택하지 못하게 막아둠. -->
				<optgroup label="전체"></optgroup>
				<optgroup label="IOS"></optgroup>
				<optgroup label="Android"></optgroup>
				<optgroup label="Topic"></optgroup>
				<option value="sole" ${ isSole ? "selected" : "" }>개인</option>
				<option value="registration_ids" ${ isMultiple ? "selected" : null }>단체</option>
			</select>

			<div id="target-input-container" style="display: none;">
				<input type="text" name="sole" placeholder="Firebase Token..." value="${ isSole ? toArray[0] : null }">

				<div class="additional">
					<input type="text" name="registration_id" placeholder="Firebase Token...">
					<button type="submit">+</button>
				</div>
			</div>
		</section>
		
		<section>
			<h2 required>제목</h2>
			<input type="text" name="title" value="${title}">
			<mark></mark>
		</section>

		<section>
			<h2 required>내용</h2>
			<input type="text" name="body" value="${body}">
			<mark></mark>
		</section>
		
		<section>
			<h2>주소</h2>
			<input type="text" name="redirect" value="${ redirect }">
			<mark></mark>
		</section>

		<button type="submit" name="send" disabled>전송</button>
	</form>

	<script>
		addEventListener('DOMContentLoaded', () => {
			const ATTR_ERROR = 'error';

			const form = document.querySelector("form");
			
			const { target, title, body, redirect, send } = form;

			const targetInputContainer = document.getElementById('target-input-container');
			const sole = targetInputContainer.querySelector("[name='sole']");
			const additional = targetInputContainer.querySelector('.additional');
			const additionalButton = additional.querySelector("button");
			const additionalInputTemplate = additional.querySelector("input").cloneNode();
			function onChangeTarget() {
				switch(target.value) {
					case 'sole':
						targetInputContainer.show();
						sole.show();
						additional.hide();
						break;
					case 'registration_ids':
						targetInputContainer.show();
						sole.hide();
						additional.show();
						break;
				}
			}
			target.addEventListener('change', onChangeTarget);
			additionalButton.addEventListener('click', (e) => {
				e.preventDefault();

				const newInput = additionalInputTemplate.cloneNode();
				additionalButton.before(newInput);
				newInput.focus();
			});

			function evaluate() {
				let disabled = Validator.isEmpty(title);
				disabled = Validator.isEmpty(body) && disabled;

				send.disabled = !disabled;
			}

			title.addEventListener('input', evaluate);
			body.addEventListener('input', evaluate);

			form.addEventListener('submit', (e) => {
				e.preventDefault();

				const data = new FormData(form);
				
				data.delete('to');
				switch(target.value) {
					case 'sole':
						data.append('to', sole.value);
						break;
					case 'registration_ids':
						for(const id of data.getAll('registration_id')) {
							data.append('to', id);
						}
						break;
				}
				data.delete('sole');
				data.delete('registration_id')
				data.delete('target');

				if(!data.get('redirect')) data.delete('redirect');

				post('send', data);
			});

			onChangeTarget();
			evaluate();
		});
	</script>
</t:dialog>