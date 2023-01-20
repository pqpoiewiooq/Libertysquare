package com.libertysquare.chat.mvc;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.libertysquare.chat.exception.ValidateException;
import com.libertysquare.chat.user.ChatUser;

import account.User;

@Controller
public class PageController implements ErrorController {
	@Autowired
	private ContactService contactService;
	
	@RequestMapping
	public ModelAndView main(ContactRequest contactRequest, HttpServletRequest request, HttpServletResponse response) {
		User fromUser = contactService.parseUser(request);
		if(fromUser == null) return new ModelAndView("redirect:https://community.libertysquare.co.kr/sign");
		
		String fromUserId = null;
		try {
			fromUserId = contactService.getChatUserId(fromUser);
		} catch(Exception e) {
			e.printStackTrace();
			return new ModelAndView("redirect:https://community.libertysquare.co.kr/error404");
		}
		
		ModelAndView mv = new ModelAndView("index");
		mv.addObject("contactRequest", null);
		mv.addObject("nickname", fromUser.getNickname());
		mv.addObject("d", fromUserId);
		try {
			contactService.validateContactRequest(contactRequest);
			ContactTarget target = contactService.getTargetOrRequest(contactRequest);
			User toUser = target.getUser();
			
			UUID roomId = contactService.getContactRoomId(fromUserId, toUser.getID(), target);
			if(roomId == null) {
				mv.addObject("roomId", -1);
				mv.addObject("contactRequest", "type=" + contactRequest.getType() + "&id=" + contactRequest.getId());
				mv.addObject("contactPostId", target.getPostId());
				if(target.isAnonymity()) {
					mv.addObject("contactUserNickname", ChatUser.ANONYMOUS.getNickname());
					mv.addObject("contactUserProfilePath", ChatUser.ANONYMOUS.getProfilePath());
				} else {
					mv.addObject("contactUserNickname", toUser.getNickname());
					mv.addObject("contactUserProfilePath", toUser.getProfilePath());
				}
			} else {
				mv.addObject("roomId", roomId.toString());
			}
		} catch(ValidateException e) {e.printStackTrace();}
		catch(Exception e) {e.printStackTrace();}
		
		return mv;
	}
	
	
	
	private static final String REDIRECT_URL = "redirect:/";
	@RequestMapping("/error")
	public String error() {
		return REDIRECT_URL;
	}
}
