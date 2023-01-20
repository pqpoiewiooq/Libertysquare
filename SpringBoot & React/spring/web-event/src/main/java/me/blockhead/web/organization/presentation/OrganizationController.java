package me.blockhead.web.organization.presentation;

import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import me.blockhead.common.annotation.user.InjectUser;
import me.blockhead.common.annotation.user.Login;
import me.blockhead.common.exception.DuplicateException;
import me.blockhead.common.user.domain.User;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.web.event.presentation.EventDTO;
import me.blockhead.web.organization.request.OrganizationCreateRequest;
import me.blockhead.web.organization.request.OrganizationSimpleUpdateRequest;
import me.blockhead.web.organization.request.OrganizationUpdateRequest;
import me.blockhead.web.organization.service.OrganizationService;

@RestController
@RequestMapping("/organization")
public class OrganizationController {
	@Autowired
	private OrganizationService organizationService;
	
	@Login
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public synchronized void create(@RequestBody @Valid OrganizationCreateRequest request, UserDTO user) {
		if(organizationService.exists(request.getName())) {
			throw new DuplicateException("동일한 이름의 호스트가 존재합니다.");
		}
		
		organizationService.create(request, user.getId());
	}
	
	/**
	 * 해당 유저가 속한 organization 목록 반환
	 */
	@Login
	@GetMapping("/my")
	@ResponseStatus(HttpStatus.OK)
	public Set<OrganizationDTO> requestAffiliated(UserDTO user) {
		return organizationService.getAffiliated(User.builder().uuid(user.getUuid()).build());
	}
	
	/**
	 * 해당 이름을 가진 organization이 있는지 확인
	 * @return Void
	 * @throws DuplicateException
	 */
	@GetMapping("/name/{name}")
	@ResponseStatus(HttpStatus.OK)
	public void exists(@PathVariable String name) {
		boolean exists = organizationService.exists(name);
		if(exists) throw new DuplicateException();
	}

	/**
	 * organizationId에 해당하는 Organization을 찾아서 반환
	 */
	@InjectUser
	@GetMapping("/{organizationId}")
	@ResponseStatus(HttpStatus.OK)
	public OrganizationDTO get(@PathVariable("organizationId") long organizationId, UserDTO user) {
		return organizationService.get(organizationId, user == null ? null : user.getUuid());
	}
	
	@GetMapping("/event/{organizationId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<EventDTO> requestHostedEvents(@PathVariable long organizationId) {
		return organizationService.getHostedEvent(organizationId);
	}

	
	@Login
	@PutMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void update(@RequestBody @Valid OrganizationUpdateRequest request, UserDTO user) {
		organizationService.update(request, user.getUuid());
	}
	
	@Login
	@PatchMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void updateSimple(@RequestBody @Valid OrganizationSimpleUpdateRequest request, UserDTO user) {
		organizationService.updateSimple(request, user.getUuid());
	}
}
