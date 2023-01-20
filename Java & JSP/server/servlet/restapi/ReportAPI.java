package servlet.restapi;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import community.dao.ReportDAO;
import database.Table;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.util.RequestParser;

public class ReportAPI extends MyHttpServlet {
	private static final long serialVersionUID = 101544298007958779L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		String uri = request.getRequestURI();
		
		Table table = null;
		if(uri.startsWith("/report/post")) {
			table = Table.POST;
		} else if(uri.startsWith("/report/comment")) {
			table = Table.COMMENT;
		} else {
			throwNotImplemented();
		}
		
		final Table _table = table;
		byte[] reporter = getUserUuid(request);
		long id = RequestParser.getLong(request, "id");
		String reason = RequestParser.get(request, "reason", ReportDAO.LENGTH_REASON);
		
		processDAO(ReportDAO.class, dao -> {
			dao.report(_table, id, reporter, reason);
		});
	}
}
