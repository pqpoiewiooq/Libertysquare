package servlet.restapi;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import dao.UserDAO;
import exception.MyServletException;
import net.NiceHelper;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.MyParser;
import servlet.util.RequestParser;
import servlet.util.ServletHelper;
import util.CryptoHelper;
import util.DateUtil;

public class AccountAPI extends MyHttpServlet {
	private static final long serialVersionUID = 6613723863041259691L;
	
	private static final String PARAM_PASSWORD = "password";
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String userID = request.getParameter("id");
		
		processDAO(UserDAO.class, dao -> {
			if(!dao.hasUser(userID)) throw MyServletException.NOT_FOUND;
		});
	}

	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = getSession(request);
		User user = getUser(session);
		
		byte[] password = RequestParser.getCryptoParameter(request, PARAM_PASSWORD, user.getSalt());
		if(!CryptoHelper.evaluateSHA512(password, user.getPassword())) throw new MyServletException(ServletStatus.INVALID_PARAMETER, PARAM_PASSWORD);
		
		processDAO(UserDAO.class, dao -> {
			if(dao.updateState(user.getUUID(), password, User.State.DEACTIVATE)) {
				session.invalidate();
			} else {
				throw MyServletException.DB_ERROR;
			}
		});
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		long signupAt = System.currentTimeMillis();
		
		String salt = CryptoHelper.createSalt();
		byte[] pw = RequestParser.getCryptoParameter(request, "password", salt);
		
		HttpSession session = getSession(request);
		session.removeAttribute("signup-data");// ????뭔지 모름
		
		processDAO(UserDAO.class, dao -> {
			User user = getCheckplusUserData(session);
			
			user.setUUID(CryptoHelper.randomUUID());
			user.setSalt(salt);
			user.setPassword(pw);
			user.setState(User.State.ACTIVATE);
			user.setSignupAt(DateUtil.defaultFormat(signupAt));
			
			Boolean duplicated = dao.checkDI(user.getDI());
			if(duplicated == null) throw new MyServletException(ServletStatus.DB_ERROR, "DI check failed");
			if(duplicated) throw MyServletException.CONFLICT;
			
			user.setProfilePath(ImageAPI.getUserProfile());
			
			Cookie cookie = ServletHelper.createLoginCookie();
			user = dao.register(user, cookie.getValue());
			if(user == null) throw new MyServletException(ServletStatus.DB_ERROR, "register failed");
		});
	}

	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
		switch(request.getRequestURI()) {
		case "/account/password":
			patchPassword(request, response);
			break;
		case "/account/profile":
			patchProfile(request, response);
			break;
		default:
			throwNotImplemented();
		}
	}
	
	private void patchPassword(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = getSession(request);
		final User user = getUser(session);
		
		MyParser parser = new MyParser(request);
		
		if(user == null) {
			final User checkplusUser = getCheckplusUserData(session);
			
			byte[] npw = parser.getCryptoParameter(PARAM_PASSWORD, checkplusUser.getSalt());
			
			processDAO(UserDAO.class, dao -> {
				if(!dao.updatePassword(checkplusUser.getDI(), npw)) throw MyServletException.DB_ERROR;
			});
		} else {
			String salt = user.getSalt();
			
			byte[] npw = parser.getCryptoParameter("new", salt);
			if(CryptoHelper.evaluateSHA512(npw, user.getPassword())) throw new MyServletException("현재 사용중인 비밀번호입니다.\npassword is currently in use");
			
			byte[] cpw = parser.getCryptoParameter("cur", salt);
			if(!CryptoHelper.evaluateSHA512(cpw, user.getPassword())) throw new MyServletException("현재 비밀번호와 일치하지 않습니다.\nmismatched passwords");
			
			processDAO(UserDAO.class, dao -> {
				if(!dao.updatePassword(user.getUUID(), cpw, npw)) throw MyServletException.DB_ERROR;
			});
		}
		session.invalidate();
	}
	
	private void patchProfile(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		String nickname = RequestParser.get(request, "nickname");
		String profile = RequestParser.get(request, "profile", true);
		
		boolean isSameProfile = user.getProfilePath().equals(profile);
		if(user.getNickname().equals(nickname) && isSameProfile) throw new MyServletException(ServletStatus.CONFLICT, "no change");
		
		String newProfile = null;
		if(!isSameProfile && profile != null) {
			newProfile = ImageAPI.upload(request, ImageAPI.USER_ROOT, profile);
		}
		
		final String updatedProfilePath = newProfile;
		processDAO(UserDAO.class, dao -> {
			if(!dao.updateProfile(user.getUUID(), nickname, updatedProfilePath)) throw MyServletException.DB_ERROR;
			user.setNickname(nickname);
			if(updatedProfilePath != null) user.setProfilePath(updatedProfilePath);
		});
	}
	
	private User getCheckplusUserData(HttpSession session) throws MyServletException {
		User user = (User) session.getAttribute(NiceHelper.ATTR_DATA);
		if(user == null) throw new MyServletException(ServletStatus.NOT_ACCEPTABLE);
		return user;
	}
}