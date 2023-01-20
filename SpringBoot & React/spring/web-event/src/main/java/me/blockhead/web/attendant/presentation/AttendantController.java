package me.blockhead.web.attendant.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import me.blockhead.common.annotation.user.Login;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.web.attendant.service.AttendantDAO;
import me.blockhead.web.event.presentation.EventDTO;

@RestController
@RequestMapping("/attendant")
public class AttendantController {
	@Autowired
	private AttendantDAO attendantDao;
	
	@Login
	@GetMapping
	public List<EventDTO> requestAttendantList(UserDTO user) {
		return attendantDao.getAttendEventList(user.getUuid());
	}
}
