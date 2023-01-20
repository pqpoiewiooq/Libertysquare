package servlet.restapi;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import community.dao.CommentBlockDAO;
import community.dao.DefaultToggleDAO;
import community.dao.PostBlockDAO;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.util.ServletHelper;

public class BlockAPI extends MyHttpServlet {
	private static final long serialVersionUID = 101544298007958779L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		String uri = request.getRequestURI();
		
		final Class<? extends DefaultToggleDAO> daoClass;
		if(uri.startsWith("/block/post")) {
			daoClass = PostBlockDAO.class;
		} else if(uri.startsWith("/block/comment")) {
			daoClass = CommentBlockDAO.class;
		} else {
			daoClass = null;// IDE가 final을 인식할 수 있도록...
			throwNotImplemented();
		}
		
		byte[] reporter = getUserUuid(request);
		long id = ServletHelper.getPathLong(request, 3);
		
		processDAO(daoClass, dao -> {
			dao.toggle(id, reporter);
			
//			if(daoClass == CommentBlockDAO.class) {
//				CommentDAO commentDAO = DAOFactory.convert(dao, CommentDAO.class);
//				commentDAO.get
//			}
		});
	}
}
