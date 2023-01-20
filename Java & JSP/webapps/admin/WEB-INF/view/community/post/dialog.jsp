<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="servlet.util.RequestParser"%>
<%@page import="community.entity.*"%>
<%@page import="community.dao.*"%>
<%@page import="exception.*"%>

<%-- <%
	try (PostDAO dao = new PostDAO()) {
		long id = RequestParser.getLong(request, "id");

		if(!dao.open()) throw new MyServletException("DB Connection failed");

		Post post = dao.get(id);
		pageContext.setAttribute("post", post);
	} catch(MyServletException se) {
		%><script>alert('<%= se.getMessage() %>');</script><%
		return;
	} catch(Exception e) {
		%><script>alert('잘못된 요청입니다.');</script><%
		return;
	}
%> --%>

<style>
	hr {clear: both;width: 100%;height: 0;border: 0;}
	img {width: 100%;height: auto;}
	ul, ol, li {list-style: none;}
	input {ime-mode: active;}

	.dialog form.write {max-width: none;width: auto;margin: 0 1rem;}

	.write {position: relative;margin-bottom: 5px;border: 2px solid #d6d6d6;box-sizing: border-box;}
	.write p {padding: 15px;border-bottom: 1px solid #e3e3e3;background-color: #fff;margin: 0;}
	.write .title {width: 100%;height: 20px;line-height: 20px;border: 0;color: #292929;font-size: 16px;font-weight: bold;outline: 0;}
	.write .content {width: 100%;height: 350px;border: 0;color: #292929;font-size: 14px;resize: none; outline: 0; display: inline-block; overflow: auto;}
	.write .content[contenteditable=true]:empty:before {content: attr(aria-placeholder);user-select: none;display: block;color: #999;font-size: 12px;white-space: pre-wrap;cursor: text;}
	.content img {width: auto;max-width: 100%;display: block;}
	.write .file {display: none;}
	.write .thumbnails {display: none;padding: 16px 12px 12px 16px;border-bottom: 1px solid #e3e3e3;}
	.write .thumbnails li {display: inline-block;margin: 0 4px 4px 0;width: 85px;height: 85px;border: 1px solid #d6d6d6;cursor: pointer;background-size: cover;}
	.write .thumbnails .new {background: transparent url(/icon/ic_plus.png) no-repeat center center;background-size: 24px 24px;}
	.write > .question {display: none;}
	.write > .question > span {padding: 8px;border-radius: 8px;line-height: 18px;color: #0CA5AF;font-size: 12px;background-color: #EEFBFC; height: auto; display: block;}
	.write .options {padding: 0;}
	.write .options li {width: 40px;height: 40px;background-repeat: no-repeat;background-position: center center;background-size: 40px 40px;cursor: pointer;}
	.write .options .hashtag {background-image: url(https://ls2020.cafe24.com/icon/ic_hashtag.png); float: left;}
	.write .options .attach {background-image: url(https://ls2020.cafe24.com/icon/ic_attach.png); float: left;}
	.write .options .submit {background-image: url(https://ls2020.cafe24.com/icon/ic_write_white.png); float: right; background-color: #c62917;}
	.write .options .anonym {background-image: url(https://ls2020.cafe24.com/icon/ic_anonym.png); float: right; margin-right: 15px;}
	.write .options .anonym.active {background-image: url(https://ls2020.cafe24.com/icon/ic_anonym_active.png);}
	.write .options .question {background-image: url(https://ls2020.cafe24.com/icon/ic_question.png); float: right; margin-right: 15px;}
	.write .options .question.active {background-image: url(https://ls2020.cafe24.com/icon/ic_question_active.png);}
</style>

<t:dialog title="게시글 관리">
	<form class="write">
		<p><input class="title" autocomplete="off" placeholder="글 제목"></p>
		<p>
			<span class="content" contenteditable="true"></span>
		</p>

		<input class="file" name="file" type="file" accept="image/*" multiple="">

		<hr>

		<p class="question">
			<span>질문 글을 작성하면 게시판 상단에 일정 기간 동안 노출되어, 더욱 빠르게 답변을 얻을 수 있게 됩니다.</span>
		</p>
		
		<ul class="options">
			<li class="hashtag"></li>
			<li class="attach"></li>
			<li class="submit"></li>
			<li class="anonym"></li>
			<li class="question"></li>
		</ul>
		<hr>
	</form>

	<script>
		(() => {
			function addEnterListener(elem, callback) {
				elem.addEventListener('keydown', (e) => {
					if (e.keyCode === 13) {
						callback(e);
					}
				});
			}

			function addLimitListener(elem, limit) {
				const property = (elem instanceof HTMLTextAreaElement || elem instanceof HTMLInputElement) ? 'value' : 'innerHTML';
				
				elem.addEventListener('keydown', function(e) {
					if(elem[property].length > limit) {
						e.preventDefault();
					}
				});
				elem.addEventListener('input', function() {
					if(elem[property].length > limit) {
						elem[property] = elem[property].substring(0, limit);
					}
				});
			}

			function addActiveListener(elem, callback) {
				elem.active = false;
				elem.addEventListener('click', function() {
					if(elem.active) {
						elem.active = false;
						elem.classList.remove("active");
					} else {
						elem.active = true;
						elem.classList.add("active");
					}
					if(callback) callback(!elem.active);
				});
			}

			const Editor = (function() {
				function getRange() {
					if (window.getSelection) {
						var sel = window.getSelection();
						if (sel.getRangeAt && sel.rangeCount) {
							return sel.getRangeAt(0);
						}
					} else if (document.selection && document.selection.createRange) {
						return document.selection.createRange();
					}
					return null;
				}
			
				function restoreRange(range) {
					if (range) {
						if (window.getSelection) {
							var sel = window.getSelection();
							sel.removeAllRanges();
							sel.addRange(range);
						} else if (document.selection && range.select) {
							range.select();
						}
					}
				}
			
				function moveRangeAfter(range, node) {
					var move = range.cloneRange();
					move.setStartAfter(node);
					move.collapse(true);
					return move;
				}
			
				function addEmptyChanger(elem) {
					elem.addEventListener('input', function() {
						if(elem.children.length == 1) {
							if(elem.children[0].tagName == 'BR') {
								elem.children[0].remove();
							}
						}
					});
				}
			
				function setRangeLogic(elem, editor) {
					var range;
			
					elem.addEventListener('blur', function() {
						range = getRange();
					});
					elem.addEventListener('focus', function() {
						range = null;
					});
			
					function move(node) {
						if(!range) range = document.createRange();
						range = moveRangeAfter(range, node);
						restoreRange(range);
						ragne = getRange();
					}
			
					function process(processor) {
						var removed = false;
						if(!range) {
							range = getRange();
							removed = true;
						}
						
						if(range) {
							if(elem.isSameNode(range.commonAncestorContainer)) {
								range.deleteContents();
							} else {
								range = null;
							}
						}
			
						processor();
			
						if(removed) range = null;
					}

					function append(node) {
						const lastChild = elem.lastChild;
						if(lastChild && lastChild.nodeName == 'BR') {
							lastChild.remove();
							elem.append(node);
							elem.append(lastChild);
						} else elem.append(node);
					}
			
					editor.insertNode = function(node) {
						process(function() {
							var lastNode;
							if(!Array.isArray(node)) node = [node];
							for(var n of node) {
								if(range) range.insertNode(n);
								else append(n);
								lastNode = n;
							}
							
							move(lastNode);
						});
					}
			
					editor.insertText = function(text) {
						if(typeof text != 'string') throw "parameter 1 is not of type 'string'";
						process(function() {
							try {
								const node = range.commonAncestorContainer;
								const offset = range.endOffset;
								node.insertData(offset, text);
				
								const move = range.cloneRange();
								move.setStart(node, offset + text.length);
								move.collapse(true);
								range = move;
								restoreRange(range);
								range = getRange();
							} catch(error) {
								const node = document.createTextNode(text);
								append(node);
								move(node);
							}
						});
					}
				}

				return {
					on: function(elem, option) {
						//if(!(elem instanceof HTMLDivElement)) throw "parameter 1 is not of type 'HTMLDivElement'";
						if(elem instanceof HTMLInputElement) throw "parameter 1 must not 'HTMLInputElement'";
						if(elem instanceof HTMLTextAreaElement) throw "parameter 1 must not 'HTMLTextAreaElement'";
						if(typeof option != 'object') throw "2 arguments required, but only 1 present.";
						if(typeof option.limit != 'number') throw "option.limit are NaN";
				
						elem.contentEditable = true;
				
						addLimitListener(elem, option.limit);
						addEnterListener(elem, function() {});
						addEmptyChanger(elem);
						const editor = {};
						elem.contenteditor = editor;
						setRangeLogic(elem, editor);
					}
				}
			})();

			
			const MAX_TITLE = 300;
			const MAX_CONTENT = 15000;

			const title = document.querySelector('.title');
			addLimitListener(title, MAX_TITLE);
			addEnterListener(title, function(event) {
				event.preventDefault();
			});

			const content = document.querySelector('.content');
			content.ariaPlaceholder = "플랫탑은 누구나 기분 좋게 참여할 수 있는 커뮤니티를 만들기 위해 커뮤니티 이용규칙을 제정하여 운영하고 있습니다. 위반 시 게시물이 삭제되고 서비스 이용이 일정 기간 제한될 수 있습니다."
					+ "\n"
					+ "\n" + "게시물 작성 전 커뮤니티 이용규칙 전문을 반드시 확인하시기 바랍니다."
					+ "\n"
					+ "\n" + "※ 홍보 및 판매 관련 행위 금지"
					+ "\n" + "- 영리 여부와 관계 없이 사업체·기관·단체·개인에게 직간접적으로 영향을 줄 수 있는 게시물을 반복해서 작성 행위"
					+ "\n" + "- 위와 관련된 것으로 의심되거나 예상될 수 있는 행위"
					+ "\n" + "* 해당 게시물은 홍보게시판에만 작성 가능합니다."
					+ "\n"
					+ "\n" + "※ 그 밖의 규칙 위반"
					+ "\n" + "- 타인의 권리를 심각하게 침해하거나 불쾌감을 주는 행위"
					+ "\n" + "- 범죄, 불법 행위 등 법령을 위반하는 행위"
					+ "\n" + "- 음란물, 성적 수치심을 유발하는 행위";
			Editor.on(content, { limit: MAX_CONTENT });

			const file = document.querySelector('.file');
			const uploadedImages = new Array();
				// const { images } = optimizePostContent(post.content);
				// uploadedImages.length = images;
			function createImg(src) {
				var img = document.createElement('img');
				img.src = src;
				return img;
			}
			const imageUploadListener = createImageListener(async function(files) {
					if((files.length + uploadedImages.length) > 99) {
						alert('사진은 최대 99장까지 가능합니다.');
						return;
					}

					doLoading(contentWrapper);
					const data = new FormData();
					let i = 0;
					for(; i < files.length; i++) {
						const file = files[i];
						const resizedImage = await resize(file, 650);
						data.append("file" + i, resizedImage.size > file.size ? file : resizedImage, file.name);
					}

					const progress = createElement('div');
					progress.style.cssText = "font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; height: 100%;";
					progress.textContent = '0/' + i;
					contentWrapper.querySelector(".loading-container").append(progress);

					for(let complete = 0; complete < i; complete++) {
						await majax.uploadImage(data.get('file' + complete), null,
							function(url) {
								uploadedImages.push(url);
								content.contenteditor.insertNode(createImg(url));
							},
							function() {
								complete = i;
							});
						progress.textContent = (complete + 1) + '/' + i;
					}
					stopLoading(contentWrapper);
				});
		
		
			
			file.addEventListener('change', imageUploadListener);
			content.addEventListener('drop', imageUploadListener);
			const selectFile = () => file.click();

			const hashtag = document.querySelector('.hashtag');
			hashtag.addEventListener('click', function() {
				content.contenteditor.insertText('#');
				content._scrollTop(true, false);
			});
			
			const attach = document.querySelector('.attach');
			attach.addEventListener('click', selectFile);

			const questionNotice = document.querySelector('p.question');
			const question = document.querySelector('li.question');

		})();
		function createPostEditor() {
			// anonym
			const anonym = createElement('li', 'anonym');
			addActiveListener(anonym);
			if(post && post.isAnonymity) anonym.dispatchEvent(new CustomEvent('click'));
			options.append(anonym);

			// question
			const question = createElement('li', 'question');
			addActiveListener(question, function(active) {
				questionNotice.style.display = active ? "" : "block";
			});
			if(post && post.isQuestion) anonym.dispatchEvent(new CustomEvent('click'));
			options.append(question);


			// submit logic
			submit.addEventListener('click', function() {
				const formdata = new FormData();
				formdata.append('title', title.value);
				formdata.append('content', content.innerHTML);
				formdata.append('board', board);
				formdata.append('isAnonymity', anonym.active);
				formdata.append('isQuestion', question.active);
				for(let contentImg of uploadedImages) {
					if(contentImg) {
						formdata.append('content_img', contentImg);
					}
				}
				
				if(board) {
					majax.load(submit, '/post', 'post', formdata.toString())
						.then(function() {
							WindowManager.load('/board/' + board);
						})
						.catch(function(xhr) {
							handleError(xhr, '게시글을 올리지 못하였습니다.');
						});
				} else if(post) {
					majax.load(submit, '/post/' + post.id, 'patch', formdata.toString())
						.then(function() {
							WindowManager.load('/post/' + post.id);
						})
						.catch(function(xhr) {
							handleError(xhr, '게시글을 수정하지 못하였습니다.');
						});
				}
			});

			/* options end */

			// end
			form.append(hr());
			fragment.append(hr());

			return fragment;
		}
	</script>
</t:dialog>