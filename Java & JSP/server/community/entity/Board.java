package community.entity;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import community.dao.BoardDAO;
import dao.DAOFactory;
import lang.DynamicEnum;
import lang.DynamicEnumLoader;
import lang.DynamicEnumPolicy;

//FREE("자유게시판"),
//POLITICAL_AND_CURRENT_AFFAIRS("정치·시사"),
//PERSONAL_FINANCE("재테크"),
//PROMOTION_AND_MARKETPLACE("홍보·장터"),
//YOUTUBE("유튜브");
public class Board extends DynamicEnum<Board> {
	private static final DynamicEnumLoader<Board> loader = new DynamicEnumLoader<Board>() {
		@Override
		public Board[] load() {
			try (BoardDAO dao = DAOFactory.create(BoardDAO.class)) {
				return dao.getAll();
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
//			return new Board[] {
//					new Board("name1", 0, "이름1", 1),
//					new Board("name2", 1, "이름2", 3),
//					new Board("name3", 2, "이름3", 2),
//					new Board("name4", 3, "이름4", 4),
//				};
		}
		
		@Override
		public DynamicEnumPolicy getPolicy() {
			return DynamicEnumPolicy.LENIENT;
		}
	};
	
	public static Board[] values;
	public static Board[] mainBoards;
	public static Map<Integer, Board> ordinalMap;
	public static List<Board> valueList;// 관리자 페이지용
	
	private final String ko;
	private final int priority;
	
	private Board(String name, int ordinal, String ko, int priority) {
		super(name, ordinal);
		this.ko = ko;
		this.priority = priority;
	}
	
	public String ko() {
		return this.ko;
	}
	
	public int priority() {
		return this.priority;
	}
	
	// Override
	public static Board[] values() {
	    return values;
	}

	// Override
	public static Board valueOf(String name) {
		return valueOf(Board.class, name);
	}
	
	public static Board ordinalOf(int ordinal) {
		return ordinalMap.get(ordinal);
	}
	
	public static void load() {
		synchronized (Board.class) {
			values = load(Board.class, loader);
			valueList = Arrays.stream(values).collect(Collectors.toList());
			mainBoards = valueList.stream()
					.filter(board -> board.priority > 0)
					.sorted((lhs, rhs) -> lhs.priority - rhs.priority)
					.toArray(Board[]::new);
			ordinalMap = valueList.stream()
					.collect(Collectors.toMap(Board::ordinal, Function.identity()));
		}
	}
}