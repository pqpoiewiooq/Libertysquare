package community.dao;

import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.List;

import community.entity.Board;
import dao.DefaultDAO;
import database.Table;
import database.query.DeleteQuery;
import database.query.QueryFactory;
import database.query.UpdateQuery;

public class BoardDAO extends DefaultDAO<Board> {

	public BoardDAO() {
		super(Table.BOARD);
	}

	public long insert(String name, String ko, int priority) {
		return executeInsert(QueryFactory.insert(getTable())
				.add(null)
				.add(name.toUpperCase())
				.add(ko)
				.add(priority));
	}
	
	@Override
	public synchronized boolean update(Board board) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("name", board.name())
				.set("name_ko", board.ko())
				.set("priority", board.priority())
				.eq("ordinal", board.ordinal());
		
		return executeUpdate(query);
	}
	
	@Override
	public boolean delete(long ordinal) {
		return delete((int) ordinal);
	}
	
	public boolean delete(int ordinal) {
		DeleteQuery query = QueryFactory.delete(getTable())
				.eq("ordinal", ordinal);

		return executeUpdate(query);
	}

	@Override
	@Deprecated
	public long insert(Board board) {
		return -1;
	}

	public Board[] getAll() throws Exception {
		Constructor<Board> constructor = Board.class.getDeclaredConstructor(String.class, int.class, String.class, int.class);
		constructor.setAccessible(true);

		Board[] boards = null;
		try {
			boards = executeQuery(QueryFactory.select(getTable()), sequence -> {
				List<Board> list = new ArrayList<>();
	
				while (sequence.next()) {
					int ordinal = sequence.nextInt();
					String name = sequence.nextString();
					String ko = sequence.nextString();
					int priority = sequence.nextInt();
					try {
						list.add(constructor.newInstance(name, ordinal, ko, priority));
					} catch (Exception e) {}
				}
	
				return list.toArray(new Board[list.size()]);
			});
		} catch(Exception e) {
			throw e;
		} finally {
			constructor.setAccessible(true);
		}
		
		return boards;
	}
}
