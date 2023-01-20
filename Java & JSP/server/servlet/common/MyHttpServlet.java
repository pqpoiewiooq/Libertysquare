package servlet.common;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.DAOFactory;
import dao.DefaultDAO;
import exception.MyServletException;

public class MyHttpServlet extends HttpServlet implements DefaultServletInterface {
	private static final long serialVersionUID = 1395139045760203938L;
	protected static final String ATTR_REDIRECT_AFTER_LOGIN = "redirect_after_login";
	
	boolean autoLoginCheck = false;
	
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			if(autoLoginCheck) getUser(request);
			
			if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
				doOptions(request, response);
			} else if ("PATCH".equalsIgnoreCase(request.getMethod())) {
				doPatch(request, response);
			} else {
				super.service(request, response);
			}
		} catch (Exception e) {
			e.printStackTrace(System.out);
			if(e instanceof MyServletException) {
				response.setStatus(((MyServletException) e).getStatus());
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
		}
	}
	
	protected void throwNotImplemented() {
		throw MyServletException.NOT_IMPLEMENTED;
	}
	
	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
	}
	
	private static final boolean DEFAULT_CLOSING = true;
	
	protected <DAO extends DefaultDAO<?>> void processDAO(Class<DAO> daoClass, DAOConsumer<DAO> consumer) throws IOException {
		DAO dao = DAOFactory.createThrow(daoClass);
		processDAO(dao, consumer, DEFAULT_CLOSING);
	}
	
	protected <DAO extends DefaultDAO<?>> void processDAO(Class<DAO> daoClass, DAOConsumer<DAO> consumer, boolean closing) throws IOException {
		DAO dao = DAOFactory.createThrow(daoClass);
		processDAO(dao, consumer, closing);
	}
	
	protected <DAO extends DefaultDAO<?>> void processDAO(DAO dao, DAOConsumer<DAO> consumer) throws IOException {
		processDAO(dao, consumer, DEFAULT_CLOSING);
	}
	
	protected <DAO extends DefaultDAO<?>> void processDAO(DAO dao, DAOConsumer<DAO> consumer, boolean closing) throws IOException {
		try {
			consumer.accept(dao);
		} catch(SQLException e) {
			throw MyServletException.DB_ERROR;
		} catch (Exception e) {
			throw e;
		} finally {
			if(dao == null) return;
			try {
				if(!dao.getAutoCommit()) {
					dao.rollback();
				}
				if(closing) {
					dao.close();
				}
			} catch(Exception e) {}
		}
	}
}
