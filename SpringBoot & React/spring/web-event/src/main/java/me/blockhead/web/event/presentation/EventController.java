package me.blockhead.web.event.presentation;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import me.blockhead.common.annotation.user.Login;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.web.event.service.EventService;
import me.blockhead.web.event.service.NewEventRequest;

@RestController
@RequestMapping("/event")
public class EventController {
	@Autowired
	private EventService eventService;

	@Login
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public NewEventRequest create(@RequestBody @Valid NewEventRequest request, UserDTO user) {
		eventService.addEvent(request, user);
		return request;
	}
	
	/**
	 * Index Page에 표시될 행사 목록을 Map 형식으로 반환
	 * Map Key : recommendation, recency, online, imminent, free
	 */
	@GetMapping("")
	public Map<String, List<EventDTO>> requestMainEvents() {
		return eventService.getMainEventMap();//날짜, 사진, 제목, 온/오프, 해시태그
	}
	
	@GetMapping("/{id}")
	public Map<String, Object> get(@PathVariable("id") String id) {
		return eventService.getDetailEvent(id);
	}
	
	/**
	 * @return 200 OK
	 */
	@PatchMapping("")
	public void update() {
	}
	
	/**
	 * 요청 유저가 속한 Organization이 주최한 행사 목록 반환
	 */
	@Login
	@GetMapping("/affiliated")
	@ResponseStatus(HttpStatus.OK)
	public List<Map<String, Object>> requestHostedEvents(UserDTO user) {
		return eventService.getAffiliatedOrganizationEvents(user.getUuid());
	}

	@GetMapping("/list/{page}")
	@ResponseStatus(HttpStatus.OK)
	public List<EventDTO> requestList(@PathVariable int page) {
		return eventService.getList(page);
	}
//	/**
//	 * @return 204 No Content
//	 */
//	@DeleteMapping("")
//	@ResponseStatus(HttpStatus.NO_CONTENT)
//	public void delete() {}
}