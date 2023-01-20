package servlet.restapi;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import dao.DAOFactory;
import dao.HostDAO;
import dao.SupportDAO;
import data.Host;
import data.Support;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.MyParser;
import servlet.util.RequestParser;
import servlet.util.SupportParser;
import util.JsonUtil;

public class SupportAPI extends MyHttpServlet {
	private static final long serialVersionUID = -8332359278690903853L;
	
	private static SupportDAO dao = DAOFactory.create(SupportDAO.class);
	{
		dao.close();
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String uri = request.getRequestURI();
		switch(uri) {
		case "/support/main":
			sendMainList(response);
			break;
		case "/support/search":
			sendSearchList(request, response);
			break;
		case "/support/list":
			sendDetailList(request, response);
			break;
		case "/support/info":
			sendSupportInfomation(request, response);
			break;
		default:
			throwNotImplemented();
		}
	}
	
	private void sendMainList(HttpServletResponse response) throws IOException {
		dao.open();
		
		ArrayList<Support> recommendation = dao.getRecommendationList(1);
		if(recommendation == null) throw new MyServletException(ServletStatus.NOT_FOUND, "recommendation");
		
		ArrayList<Support> recency = dao.getRecencyList(1);
		if(recency == null) throw new MyServletException(ServletStatus.NOT_FOUND, "recency");
		
		ArrayList<Support> best = dao.getBestList(1);
		if(best == null) throw new MyServletException(ServletStatus.NOT_FOUND, "best");

		dao.close();
		
		Map<String, List<Support>> map = new HashMap<>();
		map.put("recommendation", recommendation);
		map.put("recency", recency);
		map.put("best", best);
		
		printJson(response, map);
	}
	
	private void sendSearchList(HttpServletRequest request, HttpServletResponse response) throws IOException {
//		MyParser parser = new MyParser(request, true);
//		
//		String keyword = parser.get("keyword");
//		Boolean isOnline = parser.getBoolean("isOnline");
//	    Event.Genre[] genres = parser.getArray("genre", Event.Genre::valueOf, Event.Genre[]::new);
//	    Event.Category[] categories = parser.getArray("category", Event.Category::valueOf, Event.Category[]::new);
//	    Boolean isFree = parser.getBoolean("isFree");
//		
//		User user = (User) request.getSession().getAttribute("user");
//		dao.open();
//		HashMap<String, Object> map = dao.search(1, keyword, isOnline, genres, categories, isFree, (user == null ? "" : user.getUUID()));
//		dao.close();
//		if(map == null) throw new MyServletException(ServletStatus.NOT_FOUND);
//		
//		response.getWriter().print(new GsonBuilder().create().toJson(map));
	}
	
	private void sendDetailList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		MyParser parser = new MyParser(request);
		int page = parser.getInt("page");
		
		dao.open();
		ArrayList<Support> list = dao.getDetailList(page);
		dao.close();
		if(list == null) {
			throw new MyServletException(ServletStatus.NOT_FOUND, "supports");
		} else if(list.size() > 0) {
			response.getWriter().print(JsonUtil.toJson(list));
		} else {
			response.setStatus(HttpServletResponse.SC_NO_CONTENT);
		}
	}
	
	private void sendSupportInfomation(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String id = RequestParser.get(request, "id");
		
		dao.open();
		Support support = dao.get(id);
		dao.close();
		if(support == null) throw new MyServletException(ServletStatus.NOT_FOUND, "support");
		
		support.setHost(null);
		support.setUpdateDateTime(null);
		support.setGeneratedDateTime(null);
		
		printJson(response, support);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = getSession(request);
		User user = getUser(session);
		
		Host host = (Host) session.getAttribute(HostAPI.ATTRIBUTE_HOST);
		if(host == null) throw new MyServletException(HttpServletResponse.SC_BAD_REQUEST, "No host specified");
		
		if(!Arrays.stream(host.getMembers()).anyMatch(member -> member.equals(user.getUUID()))) {
			throw MyServletException.FORBIDDEN;
		}
		
		SupportParser parser = new SupportParser(request, false);
		
		Support support = parser.parse();
		support.setHost(host.getID());

		processDAO(SupportDAO.class, dao -> {
			dao.setAutoCommit(false);
			
			String coverPath = ImageAPI.upload(request, ImageAPI.SUPPORT_ROOT, parser.parseCoverImage());
			support.setCoverPath(coverPath);
			
			
			List<String> pathList = parser.getImageList("content_img", true);
			String content = support.getContent();
			content = ImageAPI.uploadWith(request, ImageAPI.SUPPORT_ROOT, content, pathList);
			support.setContent(content);
			
			long supportID = dao.insert(support);
			if(supportID == -1) {
				dao.rollback();
				throw new MyServletException(ServletStatus.DB_ERROR, "Insert Support");
			}
			
			dao.commit();
		});
	}
	
	@Override
	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		SupportParser parser = new SupportParser(request, true);
		Support support = parser.parse();
		
		processDAO(SupportDAO.class, dao -> {
			Support origin = dao.get(support.getID());
			if(origin == null) throw new MyServletException(ServletStatus.NOT_FOUND, "support");
			
			HostDAO hostDAO = DAOFactory.convert(dao, HostDAO.class);
			Host host = hostDAO.get(origin.getHost());
			if(host == null) throw new MyServletException(ServletStatus.NOT_FOUND, "host");
			if(!host.containMember(user.getUUID())) throw MyServletException.FORBIDDEN;
			
			String coverPath = parser.parseCoverImage();
			if(coverPath != null) {
				coverPath = ImageAPI.upload(request, ImageAPI.SUPPORT_ROOT, coverPath);
				support.setCoverPath(coverPath);
			}
			
			List<String> pathList = parser.getImageList("content_img", true);
			String content = support.getContent();
			content = ImageAPI.uploadWith(request, ImageAPI.SUPPORT_ROOT, content, pathList);
			support.setContent(content);
			
			if(!dao.update(support)) throw new MyServletException(ServletStatus.DB_ERROR, "event");
		});
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		long id = RequestParser.getLong(request, "id");
		
		processDAO(SupportDAO.class, dao -> {
			Support support = dao.get(id);

			HostDAO hostDAO = DAOFactory.convert(dao, HostDAO.class);
			Host host = hostDAO.get(support.getHost());
			if(!host.containMember(user.getUUID())) throw MyServletException.FORBIDDEN;
			
			dao.delete(id);
		});
	}
}
