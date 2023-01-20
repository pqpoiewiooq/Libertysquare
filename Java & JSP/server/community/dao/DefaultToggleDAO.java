package community.dao;

import community.entity.Toggle;
import dao.DefaultDAO;
import database.Table;
import database.query.DeleteQuery;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import exception.MyServletException;
import servlet.common.ServletStatus;

public class DefaultToggleDAO extends DefaultDAO<Toggle> {
	private Table target;
	
	public DefaultToggleDAO(Table table, Table target) {
		super(table);
		this.target = target;
	}

	protected long count(long targetId) throws MyServletException {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("COUNT(*)")
				.eq(target.toString(), targetId);
		
		return executeQuery(query, sequence -> {
			if(!sequence.next()) throw new MyServletException(ServletStatus.DB_ERROR, getTable() + " count error");
			
			return sequence.nextLong();
		});
	}
	
	@Override
	public synchronized long insert(Toggle like) {
		InsertQuery query = QueryFactory.insert(getTable())
				.add(null)
				.add(like.getTargetId())
				.add(like.getUser())
				.add(null)
				.add(null);
		return executeInsert(query);
	}

	@Override
	public synchronized boolean delete(long id) {
		DeleteQuery query = QueryFactory.delete(getTable())
				.eq("id", id);
		
		return executeUpdate(query);
	}
	
	public synchronized void toggle(long targetId, byte[] userId) throws MyServletException {
		SelectQuery select = QueryFactory.select(getTable())
				.eq(target.name(), targetId)
				.and()
				.eq("user", userId);
		
		executeQuery(select, (sequence) -> {
			if(sequence.next()) {
				delete(sequence.nextLong());
			} else {
				Toggle like = new Toggle();
				like.setTargetId(targetId);
				like.setUser(userId);
				if(insert(like) < 0) throw new MyServletException(ServletStatus.DB_ERROR, getTable() + " toggle failed");
			}
		});
	}
}
