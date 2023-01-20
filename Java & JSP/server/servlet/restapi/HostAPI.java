package servlet.restapi;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import dao.DAOFactory;
import dao.DefaultDAO;
import dao.HostDAO;
import dao.UserDAO;
import data.Host;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.MyParser;
import servlet.util.RequestParser;
import util.JsonUtil;

public class HostAPI extends MyHttpServlet {
	public static final String ATTRIBUTE_HOST = "selectedHost";
	public static final String ATTRIBUTE_HOST_MEMBER_ID_LIST = "selectedHostMemberIDs";
	private static final long serialVersionUID = -1890131850773364888L;

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String uri = request.getRequestURI();
		String method = request.getMethod().toUpperCase();
		 if (uri.equals("/host/subscribe")) {
			if ("POST".equals(method)) {
				toggleSubscribe(request, response);
				return;
			} else if("OPTIONS".equals(method)) {
				doOptions(request, response);
			} else {
				response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
				return;
			}
		}

		super.service(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String type = RequestParser.get(request, "type").toLowerCase();
		
		if("name".equals(type)) {
			String name = RequestParser.get(request, "name");
			processDAO(HostDAO.class, dao -> {
				if (!dao.hasHost(name)) throw MyServletException.NOT_FOUND;
			});
		} else {
			HttpSession session = getSession(request);
			long hostId = RequestParser.getLong(request, "id");
			
			processDAO(HostDAO.class, dao -> {
				Host host = dao.get(hostId);
				
				UserDAO udao = DAOFactory.convert(dao, UserDAO.class);
				String[] tempArray = host.getMembers();
				String[] idArray = udao.getUserIDArray(tempArray);
				if (idArray == null) throw new MyServletException(ServletStatus.NOT_FOUND, "member");
				host.setMembers(idArray);
				
				String json = JsonUtil.toJson(host);// idArray로 된 host를 보내주기 위해 미리 json으로 변환
				host.setMembers(tempArray);// jsp에서는 uuid가 필요해서, 다시 uuid array로 설정
				
				session.setAttribute(ATTRIBUTE_HOST, host);
				session.setAttribute(ATTRIBUTE_HOST_MEMBER_ID_LIST, idArray);
				
				print(response, json);
			});
		}// 현 else건은 else if로 변경하고, else 해서 invalid_parameter 설정할것
	}

	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
		doHostManagement(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		doHostManagement(request, response);
	}

	private void toggleSubscribe(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		long hostId = RequestParser.getLong(request, "hostID");
		
		processDAO(HostDAO.class, dao -> {
			if(!dao.toggleSubscribe(hostId, user.getUUID())) throw new MyServletException(ServletStatus.DB_ERROR);
		});
	}
	
	private void addRequester(Host host, String requester, DefaultDAO<?> dao) {// 멤버 목록에 본인 자동 추가
		String[] members = host.getMembers();
		if (members == null) {
			members = new String[] { requester };
		} else {
			UserDAO udao = DAOFactory.convert(dao, UserDAO.class);
			members = udao.getUserUUIDArray(members);
			ArrayList<String> tempList = new ArrayList<>(Arrays.asList(members));
			if (!tempList.contains(requester)) {
				tempList.add(0, requester);
				members = tempList.toArray(new String[tempList.size()]);
			}
		}
		host.setMembers(members);
	}
	
	private void doHostManagement(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		HostDAO dao = null;
		try {
			String method = request.getMethod();

			Host host = new Host();
			String userUUID = user.getUUID();

			String name = request.getParameter("name");
			if ("".equals(name)) name = null;
			String introduceSimple = request.getParameter("s_intro");
			if ("".equals(introduceSimple)) introduceSimple = null;
			String[] members = request.getParameterValues("member");
			host.setName(name);
			host.setIntroduceSimple(introduceSimple);
			host.setMembers(members);
			
			switch (method) {
			case "POST":
				dao = DAOFactory.create(HostDAO.class);
				if(dao.hasHost(name)) throw new MyServletException("중복된 이름의 호스트가 이미 존재 합니다.");

				addRequester(host, userUUID, dao);
				
				dao.setAutoCommit(false);
				host.setCoverPath(ImageAPI.getHostCover());
				host.setProfilePath(ImageAPI.getHostProfile());
				
				if(introduceSimple == null) host.setIntroduceSimple("");
				host.setIntroduce("");
				host.setVenue("");
				host.setDetailVenue("");
				host.setThemeColor("FF2D54");
				long insertedID = dao.insert(host);
				if (insertedID < 0) throw new MyServletException(ServletStatus.DB_ERROR, "insert host");
				dao.commit();
				dao.setAutoCommit(true);
				break;
			case "PATCH":
				MyParser parser = new MyParser(request, true);
				long id = parser.getLong("hid");
				host.setID(id);
				
				String since = request.getParameter("since");
				String introduce = request.getParameter("introduce");
				
				host.setSince(since);
				host.setIntroduce(introduce);
				
				String profilePath = parser.get("profile");
				if(profilePath != null) host.setProfilePath(ImageAPI.upload(request, ImageAPI.HOST_ROOT, profilePath));
				
				String coverPath = parser.get("cover");
				if(coverPath != null) host.setCoverPath(ImageAPI.upload(request, ImageAPI.HOST_ROOT, coverPath));
				
				String venue = parser.get("venue");
				if(venue != null) host.setVenue(venue);
				
				String detailVenue = parser.get("detail_venue");
				if(detailVenue != null) host.setDetailVenue(detailVenue);
				
				String theme = parser.getHexColor("theme");
				if(theme != null) host.setThemeColor(theme);

				String intro = host.getIntroduce();
				if (intro != null) {
					String[] introImages = request.getParameterValues("intro_img");
					if (introImages != null) {
						for (int i = 0; i < introImages.length; i++) {
							String introImage = introImages[i];
							if (ImageAPI.isTemp(introImage)) {
								String newPath = ImageAPI.upload(request, ImageAPI.HOST_ROOT, introImage);
								intro = intro.replace(introImage, newPath);
							}
						}
						host.setIntroduce(intro);
					}
				}
				
				dao = DAOFactory.create(HostDAO.class);
				if(dao.hasHost(name, id)) throw new MyServletException("중복된 이름의 호스트가 이미 존재 합니다.");
				Host origin = dao.get(id);
				if (!origin.containMember(userUUID)) throw MyServletException.FORBIDDEN;
				addRequester(host, userUUID, dao);

				if (!dao.update(host)) throw new MyServletException(ServletStatus.DB_ERROR, "update host");
			}
		} catch(MyServletException e) {
			response.setStatus(e.getStatus());
			response.getWriter().print(e.getMessage());
			return;
		} catch(Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().print(e.getMessage());
		} finally {
			try {
				if (dao != null) {
					if(!dao.getAutoCommit()) dao.rollback();
					dao.close();
				}
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
}