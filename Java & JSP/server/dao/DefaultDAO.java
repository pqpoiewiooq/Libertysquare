package dao;

import java.io.Closeable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import database.ResultSetSequence;
import database.Table;
import database.query.ExecuteConsumer;
import database.query.ExecuteFunction;
import database.query.Query;
import exception.MyServletException;

public abstract class DefaultDAO<T> implements Closeable {
	protected DataSource dataSource;

	protected Connection conn;

	private Table table;

	public DefaultDAO(Table table) {
		setTable(table);
	}
	
	public boolean open() {
		try {
			dataSource = DataSourceManager.getInstance().getDataSource();
			if(conn == null || conn.isClosed()) conn = dataSource.getConnection();
			return true;
		} catch (Exception e) {}
		return false;
	}

//	protected void executeQuery(Query query) throws MyServletException {
//		PreparedStatement pstmt = null;
//		ResultSet rs = null;
//		try {
//			pstmt = query.createQueryStatement(conn);
//			rs = pstmt.executeQuery();
//		} catch(Exception e) {
//			throw MyServletException.DB_ERROR;
//		} finally {
//			try {
//				if(rs != null) rs.close();
//				if(pstmt != null) pstmt.close();
//			} catch(Exception e) {}
//		}
//	}
	
	public abstract long insert(T obj);
	@Deprecated
	public T get(long id) {
		return null;
	}
	@Deprecated
	public boolean update(T obj) {
		return false;
	}
	@Deprecated
	public boolean delete(long id) {
		return false;
	}
	
	protected <R> R executeQuery(PreparedStatement pstmt, ExecuteFunction<ResultSetSequence, R> func) throws MyServletException {
		ResultSet rs = null;
		try {
			rs = pstmt.executeQuery();
			
			return func.apply(new ResultSetSequence(rs));
		} catch(SQLException e) {
			e.printStackTrace();
			throw MyServletException.DB_ERROR;
		} finally {
			try {
				if(rs != null) rs.close();
			} catch(Exception e) {}
		}
	}
	
	protected <R> R executeQuery(Query<?> query, ExecuteFunction<ResultSetSequence, R> func) throws MyServletException {
		PreparedStatement pstmt = null;
		try {
			pstmt = query.createQueryStatement(conn);
			return executeQuery(pstmt, func);
		} catch (SQLException e) {
			e.printStackTrace();
			throw MyServletException.DB_ERROR;
		} finally {
			try {
				if(pstmt != null) pstmt.close();
			} catch(Exception e) {}
		}
	}
	
	protected void executeQuery(Query<?> query, ExecuteConsumer consumer) throws MyServletException {
		executeQuery(query, sequence -> {
			consumer.accept(sequence);
			return Void.TYPE;
		});
	}
	
	protected void executeQuery(PreparedStatement pstmt, ExecuteConsumer consumer) throws MyServletException {
		executeQuery(pstmt, sequence -> {
			consumer.accept(sequence);
			return Void.TYPE;
		});
	}
	
	protected boolean executeExists(Query<?> query) throws MyServletException {
		return executeQuery(query, sequence -> {
			return sequence.next();
		});
	}
	
	protected boolean executeUpdate(Query<?> query) throws MyServletException {
		PreparedStatement pstmt = null;
		try {
			pstmt = query.createQueryStatement(conn);
			return pstmt.executeUpdate() > 0;
		} catch(SQLException e) {
			e.printStackTrace();
			throw MyServletException.DB_ERROR;
		} finally {
			try {
				if(pstmt != null) pstmt.close();
			} catch(Exception e) {}
		}
	}
	
	protected synchronized long executeInsert(Query<?> query) throws MyServletException {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = query.createQueryStatement(conn);
			if(pstmt.executeUpdate() < 1) return -1;
			
			rs = pstmt.executeQuery("SELECT LAST_INSERT_ID()");
			return rs.next() ? rs.getLong(1) : -1;
		} catch(SQLException e) {
			e.printStackTrace();
			throw MyServletException.DB_ERROR;
		} finally {
			try {
				if(rs != null) rs.close();
				if(pstmt != null) pstmt.close();
			} catch(Exception e) {}
		}
	}
	
	protected void setTable(Table table) {
		this.table = table;
	}
	
	public Table getTable() {
		return this.table;
	}
	
	public void close() {
		try {
			if (conn != null) conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			conn = null;
		}
	}

	public void setAutoCommit(boolean commit) throws SQLException {
		if (conn != null) conn.setAutoCommit(commit);
	}

	public boolean getAutoCommit() throws SQLException {
		return conn == null ? true : conn.getAutoCommit();
	}
	
	public void commit() throws SQLException {
		if (conn != null) conn.commit();
	}

	public void rollback() throws SQLException {
		if (conn != null) conn.rollback();
	}
}
