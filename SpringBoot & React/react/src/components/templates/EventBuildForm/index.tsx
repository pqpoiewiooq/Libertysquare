import React, { useRef, useState, useCallback } from 'react';
import styles from './EventBuildForm.module.scss';
import { CheckBox, Dropdown, GoogleMap, RadioButton, Button, ErrorText } from 'components/atoms';
import { Slot, InputField, DateTimeField, HashtagField, ContactField, ContentField, ImageDropZone, MultiDropdown } from 'components/molecules';
import { TicketBuilder, TicketRef } from 'components/organisms';
import { useRefState, useForceUpdate, useScrollTop } from 'hooks';
import { postEvent } from 'utils/api/EventApi';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'utils/DateUtil';

type EventBuildFormProps = {
	organization: Organization;
	eventType: MyEventType;
};

const EventBuildForm = ({ organization, eventType } : EventBuildFormProps) => {
	const forceUpdate = useForceUpdate();
	const scrollTop = useScrollTop({ focus: true, smooth: false });
	const navigate = useNavigate();

	// 공개 여부
	const isPublicRef = useRef<HTMLInputElement>(null);

	// 제목
	const titleRef = useRef<HTMLInputElement>(null);
	const [title, setTitle] = useRefState();

	// 링크
	const applyLinkRef = useRef<HTMLInputElement>(null);
	const [applyLink, setApplyLink] = useRefState();

	// 시작 날짜
	const startDateTimeRef = useRef<HTMLDivElement>(null);
	const [startDateTime, setStartDateTime] = useRefState<DateTime>();

	// 종료 날짜
	const endDateTimeRef = useRef<HTMLDivElement>(null);
	const [endDateTime, setEndDateTime] = useRefState<DateTime>();

	// 카테고리
	const categoryRef = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useRefState<Array<DropdownOptionObject>>();

	// 유형
	const genre = useRef<string>();
	const setGenre = useCallback((event: DropdownEvent) => {
		genre.current = event.detail.after.value;
	}, []);

	// 해시태그
	const [hashtags, setHashtags] = useRefState<Array<string>>();

	// 연락처
	const contactRef = useRef<HTMLInputElement>(null);
	const [contact, setContact] = useRefState<{ tel?: string, email?: string }>();

	// 온라인 여부
	const [isOnline, setOnlineState] = useState(false);
	const isOnlineRef = useRef<HTMLInputElement>(null);
	const onChangeOnline = useCallback(() => {
			setOnlineState(isOnlineRef.current?.checked || false);
		}, []
	);

	// 온라인

	// 온라인 - 줌 | 커스텀 여부
	const [isZoom, setZoomFlag] = useState(true);
	const radioZoomRef = useRef<HTMLInputElement>(null);
	const radioCustomRef = useRef<HTMLInputElement>(null);
	const onChangeZoomFlag = useCallback(() => {
		if(!(radioZoomRef.current && radioCustomRef.current)) return;

		if(radioZoomRef.current.checked) {
			radioCustomRef.current.checked = false;
			setZoomFlag(true);
		} else {
			radioZoomRef.current.checked = false;
			setZoomFlag(false);
		}
		}, []
	);

	// 온라인 - 줌
	const zoomLinkRef = useRef<HTMLInputElement>(null);
	const [zoomLink, setZoomLink] = useRefState();
	const onZoomLinkChange = useCallback(
		(isValid: boolean, value: string) : void | string | boolean => {
			if(!value) return false;

			if(isNaN(value)) {
				if(isValid) {
					setZoomLink(value);
					return true;
				} else {
					return '올바르지 않은 줌 링크 입니다.';
				}
			} else {
				if(value.length !== 10) {
					return '올바르지 않은 회의 ID 입니다.';
				} else {
					setZoomLink(value);
					return true;
				}
			}
		}, [setZoomLink]
	);

	const [zoomPassword, setZoomPassword] = useRefState();

	// 온라인 - 커스텀
	const platformRef = useRef<HTMLInputElement>(null);
	const [platform, setPlatform] = useRefState();
	const platformDescriptionRef = useRef<HTMLInputElement>(null);
	const [platformDescription, setPlatformDescription] = useRefState();

	// 오프라인
	const venueRef = useRef<HTMLInputElement>(null);
	const [venue, setVenue] = useRefState();

	const detailVenueRef = useRef<HTMLInputElement>(null);
	const [detailVenue, setDetailVenue] = useRefState();
	
	const [venueDescription, setVenueDescription] = useRefState();

	// cover image
	const imageRef = useRef<HTMLDivElement>(null);
	const [image, setImage] = useRefState();

	// 내용
	const contentEditor = useRef<TinymceEditor>();
	const onInitEditor = useCallback((editor: TinymceEditor) => {
		contentEditor.current = editor;
	}, []);

	// 티켓
	const ticketList = useRef<Array<{ key: number, ticket?: EventTicket, ref?: TicketRef}>>([{ key: Date.now() }]);
	const addTicket = useCallback(() => {
		ticketList.current.push({
			key: Date.now(),
		});
		forceUpdate();
	}, [forceUpdate]);
	const onTicketChange = useCallback((index: number, ticket?: EventTicket) => {
		const i = ticketList.current.findIndex(ticket => ticket.key === index);
		ticketList.current[i].ticket = ticket;
	}, []);
	const removeTicket = useCallback((index: number) => {
		const i = ticketList.current.findIndex(ticket => ticket.key === index);
		ticketList.current.splice(i, 1);
		forceUpdate();
	}, [forceUpdate]);

	const onSubmit = useCallback(() => {
		if(!title.current) return scrollTop(titleRef.current!, { alert: '제목을 입력해 주세요.' });
		if(!contact.current) return scrollTop(contactRef.current!, { alert: '정확한 연락처를 입력해 주세요.' });
		if(!startDateTime.current) return scrollTop(startDateTimeRef.current!, { alert: '시작 날짜를 선택해 주세요.' });
		const dtStart = startDateTime.current.toString();
		if(!dtStart) return scrollTop(startDateTimeRef.current!, { alert: '정확한 시작 날짜를 선택해 주세요.' });
		if(!endDateTime.current) return scrollTop(endDateTimeRef.current!, { alert: '종료 날짜를 선택해 주세요.' });
		const dtEnd = endDateTime.current.toString();
		if(!dtEnd) return scrollTop(endDateTimeRef.current!, { alert: '정확한 종료 날짜를 선택해 주세요.' });
		if(!category.current || category.current.length < 1) return scrollTop(categoryRef.current!, { alert: '카테고리를 1개 이상 선택해 주세요.' });
		const _category = new Array<string>();
		for(let i = 0; i < category.current.length; i++) {
			let citem = category.current[i];
			_category.push(citem.value);
		}

		let _venue;
		let _detailVenue;
		let _venueDescription;
		if(isOnline) {
			if(isZoom) {
				if(!zoomLink.current) return scrollTop(zoomLinkRef.current!, { alert: '정확한 줌 링크 또는 회의 ID를 입력해 주세요.' });
				_venue = "zoom";
				_detailVenue = zoomLink.current;
				_venueDescription = zoomPassword.current;
			} else {
				if(!platform.current) return scrollTop(platformRef.current!, { alert: '온라인 플랫폼을 입력해 주세요.' });
				if(!platformDescription.current) return scrollTop(platformDescriptionRef.current!, { alert: '참여 방법을 입력해 주세요.' });
				_venue = platform.current;
				_detailVenue = platformDescription.current;
			}
		} else {
			if(!venue.current) return scrollTop(venueRef.current!, { alert: '주소를 입력해 주세요.' });
			if(!detailVenue.current) return scrollTop(detailVenueRef.current!, { alert: '상세 주소를 입력해 주세요.' });
			_venue = venue.current;
			_detailVenue = detailVenue.current;
			_venueDescription = venueDescription.current;
		}

		if(!image.current) return scrollTop(imageRef.current!, { alert: '메인 이미지를 업로드 해 주세요.' });

		if(!contentEditor.current) return alert('오류가 발생하였습니다.\n새로고침 후 다시 시도해 주세요.');
		let content = contentEditor.current.getContent();
		let contentImage = new Array<string>();
		if(content) {
			let contentImageList = contentEditor.current.contentDocument.images;
			for(let i = 0; i < contentImageList.length; i++) {
				let src = contentImageList[i].getAttribute("src");
				if(!src) continue;
				if(src.startsWith("blob")) {
					alert('내용 중, 업로드 중인 이미지가 존재합니다.\n잠시 후 다시 시도해 주세요.');
					return;
				}
				contentImage.push(src);
			}
		} else {
			content = " ";
		}

		const _ticket = new Array<EventTicket>();
		if(eventType === "INSIDE") {
			if(!ticketList.current || ticketList.current.length < 1) return alert('티켓은 최소 한 개 이상이어야 합니다.');
			for(let i = 0; i < ticketList.current.length; i++) {
				const ticket = ticketList.current[i].ref?.parse();
				if(!ticket) return scrollTop(ticketList.current[i].ref?.element!, { alert: '올바른 티켓 정보를 입력해 주세요.' });
				_ticket.push(ticket);
			}
		}
		
		postEvent({
			organizationId: organization.id,
			type: eventType,
			isPublic: isPublicRef.current!.checked,
			applyLink: applyLink.current,
			title: title.current,
			contactEmail: contact.current.email,
			contactTel: contact.current.tel,
			dtStart,
			dtEnd,
			category: _category,
			genre: genre.current!,
			hashtag: hashtags.current,
			isOnline,
			venue: _venue,
			detailVenue: _detailVenue,
			venueDescription: _venueDescription,
			coverPath: image.current,
			content: contentEditor.current.getContent(),
			ticket: _ticket,
		}).then(() => {
			alert('주최되었습니다.');
			navigate('/');
		}).catch((error) => {
			alert("행사를 주최하지 못하였습니다.\n반복될 경우, 고객센터로 문의 바랍니다.\n" + error.response.data);
		});
	}, [isOnline, isZoom]);

	return (
		<form>
			<Slot
				title="공개 여부"
				desc={`행사 공개를 하지 않으면 링크로는 행사를 접속 할 수 있지만 ${process.env.REACT_APP_NAME}의 메인 페이지에는 나타나지 않습니다. 아직 공개 할 준비가 안 되어 있거나, 메인에 공개 하고 싶지 않으면 체크를 해제 하세요.`}>
				<CheckBox name="isPublic" ref={isPublicRef} defaultChecked/>
			</Slot>

			<Slot
				title="행사 제목"
				desc="주제를 잘 나타내는 멋진 제목을 입력해 주세요.">
				<InputField
					title="행사 제목"
					name="title"
					placeholder={`${process.env.REACT_APP_NAME} 아카데미`}
					maxLength={55}
					onValidate={setTitle}
					mode="NO_WRAPPER"
					inputRef={titleRef}/>
			</Slot>

			<Slot
				title="주최자 연락처"
				desc="참가자들이 행사에 대해 문의할 수 있는 수단이 최소 한 개 필요합니다. 이메일 혹은 전화번호중 최소 한 개는 입력해 주세요. 연락처는 행사 페이지에 노출됩니다.">
				<ContactField onChange={setContact} ref={contactRef}/>
			</Slot>

			{
				eventType === "OUTSIDE"
				&& 
				<Slot
					title="행사 신청 링크"
					desc="행사 신청을 누르면 이동할 링크를 넣어주세요.">
					<InputField
						title="행사 신청 링크"
						name="applyLink"
						type="url"
						placeholder={process.env.PUBLIC_URL}
						onValidate={setApplyLink}
						mode="NO_WRAPPER"
						inputRef={applyLinkRef}/>
				</Slot>
			}

			<Slot
				title="행사 날짜 및 시간"
				desc="행사가 진행되는 날짜와 시간을 입력해 주세요.">
				<DateTimeField title="시작" onChange={setStartDateTime} ref={startDateTimeRef} />
				<DateTimeField title="종료" onChange={setEndDateTime} ref={endDateTimeRef} />
			</Slot>
			
			<Slot
				title="카테고리"
				desc="행사의 주제에 알맞은 카테고리를 선택해 주세요. 최대 3개 까지 가능 합니다.">
				{/* <Dropdown config="category_event" onOptionSelect={selectCategory}/> */}
				<MultiDropdown name="카테고리" min={1} max={3} onChange={setCategory} config="category_event" ref={categoryRef}/>
			</Slot>

			<Slot
				title="행사 유형"
				desc="행사의 방식이나 규모에 따라 행사 유형을 선택해 주세요.">
				<Dropdown config="genre_event" onChange={setGenre} />
			</Slot>

			<Slot
				title="해시태그"
				desc="해시태그는 5개 까지 입력 가능 합니다. 삭제하려면 태그를 클릭하세요.">
				<HashtagField title="hashtags" onChange={setHashtags}/>
			</Slot>

			<Slot
				title="온라인 여부"
				desc="온라인 행사 진행시 관련 플랫폼을 선택 합니다.">
				<CheckBox name="isOnline" onChange={onChangeOnline} ref={isOnlineRef}/>
			</Slot>

			{
				isOnline
				?
				<>
					<Slot
						title="온라인 플랫폼"
						desc="참가자들이 이용할 플랫폼을 선택해 주세요.">
						<RadioButton name="platform" text="Zoom" onChange={onChangeZoomFlag} ref={radioZoomRef} defaultChecked={isZoom}/>
						<RadioButton name="platform" text="사용자 지정" onChange={onChangeZoomFlag} ref={radioCustomRef} defaultChecked={!isZoom}/>
					</Slot>

					{
						isZoom
						?
							<>
								<Slot
									title="링크 또는 회의 ID"
									desc="참가자들이 행사에 참여할 수 있는 수단이 최소 한 개 필요합니다. 링크 또는 회의 ID 중 최소 한 개는 입력해 주세요. 관련 정보는 티켓을 구매한 회원들에게만 공개됩니다.">
									<InputField
										title="줌 링크 또는 회의 ID"
										name="zoomLink"
										type="url"
										onChange={onZoomLinkChange}
										placeholder="줌 회의에 사용되는 링크 또는 회의 ID 중 하나를 입력해 주세요."
										mode="NO_WRAPPER"
										inputRef={zoomLinkRef}/>
								</Slot>

								<Slot
									title="암호"
									desc="Zoom 암호가 있다면 입력해 주세요.">
									<InputField
										title="암호"
										name="zoomPassword"
										type="text"
										onValidate={setZoomPassword}
										placeholder="입장 페이지에서 암호를 확인할 수 있습니다."
										mode="NO_WRAPPER"
										empty />
								</Slot>
							</>
						:
							<>
								<Slot
									title="온라인 플랫폼"
									desc="참가자들이 이용할 플랫폼을 입력해 주세요.">
									<InputField
										title="온라인 플랫폼"
										name="customPlatform"
										type="text"
										onValidate={setPlatform}
										placeholder="Google Meet 등"
										maxLength={55}
										mode="NO_WRAPPER"
										inputRef={platformRef} />
								</Slot>

								<Slot
									title="참여 방법"
									desc="참가자들이 온라인 행사로 찾아갈 수 있는 방법을 설명해 주세요.">
									<InputField
										title="참여 방법"
										name="customPlatformDescription"
										type="text"
										onValidate={setPlatformDescription}
										placeholder="시작 당일 2시간 전에 이메일로 링크를 발송할 예정입니다."
										mode="NO_WRAPPER"
										inputRef={platformDescriptionRef}/>
								</Slot>
							</>
					}
				</>
				:
				<>
					<Slot
						title="주소"
						desc="행사는 어떤 장소에서 진행되나요?">
						<InputField
							title="장소"
							name="venue"
							type="text"
							maxLength={55}
							placeholder="대한민국 서울특별시 강남구 삼성동 테헤란로 파르나스타워"
							mode="NO_WRAPPER"
							onValidate={setVenue}
							inputRef={venueRef}/>
						<GoogleMap inputRef={venueRef} />
					</Slot>

					<Slot
						title="상세 주소"
						desc="쉽게 찾아갈 수 있도록 정확한 주소를 입력해 주세요.">
						<InputField
							title="상세 주소"
							name="detailVenue"
							type="text"
							maxLength={512}
							placeholder="41층 그랜드볼룸"
							mode="NO_WRAPPER"
							onValidate={setDetailVenue}
							inputRef={detailVenueRef}/>
					</Slot>

					<Slot
						title="장소 설명"
						desc="장소에 대해 안내가 필요하다면 적어주세요.">
						<InputField
							title="장소 설명"
							name="venueDescription"
							type="text"
							maxLength={255}
							placeholder="주차는 인근 주차장에서 가능합니다."
							mode="NO_WRAPPER"
							onValidate={setVenueDescription}
							empty />
					</Slot>
				</>
			}

			<Slot
				title="대표 이미지"
				desc="이미지에 글자가 많으면 매력적이지 않습니다.">
				<ImageDropZone onChange={setImage} ref={imageRef}/>
			</Slot>

			<Slot
				title="내용"
				desc="행사의 상세한 내용을 알리는 글을 작성해 주세요."
				fullMode>
				<ContentField onInit={onInitEditor} />
			</Slot>

			<Slot
				title="티켓"
				desc="판매할 티켓을 설정해 주세요."
				fullMode>
				{ticketList.current.map(
					(ticket) => <TicketBuilder _key={ticket.key} onChange={onTicketChange} onRemove={removeTicket} key={ticket.key} ref={(ref) => ticket.ref = ref}/>
				)}
				<button type="button" className={styles['ticket-add-button']} onClick={addTicket}>+ 티켓 추가</button>
				{ticketList.current.length < 1 && <ErrorText text="티켓은 최소 한 개 이상이어야 합니다." />}
			</Slot>

			<Button text="행사 주최하기" buttonStyle="confirm" withContainer="right" onClick={onSubmit}/>
		</form>
	);
};

export default React.memo(EventBuildForm);