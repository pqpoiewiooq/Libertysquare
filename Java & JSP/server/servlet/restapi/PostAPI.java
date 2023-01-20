package servlet.restapi;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import community.dao.PostDAO;
import community.dao.PostDAO.SearchType;
import community.dao.PostScrapDAO;
import community.entity.Board;
import community.entity.Post;
import community.entity.Post.Status;
import community.entity.PostList;
import community.entity.PostVO;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.PostParser;
import servlet.util.RequestParser;
import servlet.util.ServletHelper;

public class PostAPI extends MyHttpServlet {
	private static final long serialVersionUID = -199134711302370870L;
	
	private static final String BEST_BOARD_NAME = "BEST 게시판";
	private static final String HOT_BOARD_NAME = "HOT 게시물";
	
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if(Board.mainBoards == null) Board.load();
		super.service(request, response);
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String uri = request.getRequestURI();
		
		byte[] requester = getUserUuid(request, false);
		switch(uri) {
		case "/post/list/search":
			sendSearchListWithBoard(request, response, requester);
			break;
		case "/post/search":
			sendSearchList(request, response, requester);
			break;
		case "/post/rightside":
			sendRightSideList(response, requester);
			break;
		case "/post/list":
			sendList(request, response, requester);
			break;
		default:
			sendPost(request, response, requester);
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String uri = request.getRequestURI();
		byte[] requester = getUserUuid(request);
		
		if(uri.startsWith("/post/scrap")) {
			long postId = ServletHelper.getPathLong(request, 3);
			processDAO(PostScrapDAO.class, scrapDAO -> {
				scrapDAO.toggle(postId, requester);
			});
		} else {
			PostParser parser = new PostParser(request);
			Post post = parser.parse();
			post.setWriter(requester);
			post.setStatus(Status.ACTIVE);
			
			processDAO(PostDAO.class, postDAO -> {	
				postDAO.insert(post);
			});
		}
	}
	
	@Override
	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		byte[] userUUID = getUserUuid(request);
		long id = parseId(request);
		PostParser parser = new PostParser(request, true);
		Post post = parser.parse();
		post.setId(id);
		
		processDAO(PostDAO.class, postDAO -> {
			postDAO.update(post, userUUID);
		});
	}
	
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		byte[] userUUID = getUserUuid(request);
		long id = parseId(request);
		
		processDAO(PostDAO.class, postDAO -> {
			postDAO.delete(id, userUUID);
		});
	}
	
	private long parseId(HttpServletRequest request) throws MyServletException {
		String uri = request.getRequestURI();
		String[] uriArray = uri.split("/post/");
		String sid = uriArray.length > 1 ? uriArray[1] : uri;
		long id;
		try {
			id = Long.parseLong(sid);
		} catch(NumberFormatException e) {
			throw new MyServletException(HttpServletResponse.SC_BAD_REQUEST, sid + " is NaN");
		}
		return id;
	}
	
	private void sendList(HttpServletRequest request, HttpServletResponse response, byte[] requester) throws IOException {
		int page = RequestParser.getInt(request, "page", null, true);
		boolean hasBoardInfo = RequestParser.getBoolean(request, "hasBoardInfo", null);
		String board = RequestParser.get(request, "board").toLowerCase();
		
		switch(board) {
		case "best":
			processDAO(PostDAO.class, dao -> {
				List<Post> list = dao.getBestList(page, requester);
				if(hasBoardInfo) {
					printJson(response, new PostList(BEST_BOARD_NAME, "best", list));
				} else {
					printJson(response, list);
				}
			});
			break;
		case "hot":
			processDAO(PostDAO.class, dao -> {
				List<Post> list = dao.getHotList(page, requester);
				if(hasBoardInfo) {
					printJson(response, new PostList(HOT_BOARD_NAME, "hot", list));
				} else {
					printJson(response, list);
				}
			});
			break;
		case "myarticle":
			assertLogin(requester);
			processDAO(PostDAO.class, dao -> {
				List<Post> list = dao.getListByUser(requester, page);
				if(hasBoardInfo) {
					printJson(response, new PostList("내가 쓴 글", "myarticle", list));
				} else {
					printJson(response, list);
				}
			});
			break;
		case "mycommentarticle":
			assertLogin(requester);
			processDAO(PostDAO.class, dao -> {
				List<Post> list = dao.getListByCommented(requester, page);
				if(hasBoardInfo) {
					printJson(response, new PostList("댓글 단 글", "mycommentarticle", list));
				} else {
					printJson(response, list);
				}
			});
			break;
		case "myscrap":
			assertLogin(requester);
			processDAO(PostDAO.class, dao -> {
				List<Post> list = dao.getListByScraped(requester, page);
				if(hasBoardInfo) {
					printJson(response, new PostList("내 스크랩", "myscrap", list));
				} else {
					printJson(response, list);
				}
			});
			break;
		case "index":
			processDAO(PostDAO.class, dao -> {
				final int p = 1;
				final long limit = 3;
				
				List<PostList> list = new ArrayList<>();
				for(Board mainBoard : Board.mainBoards) {
					list.add(getPostList(dao, mainBoard, p, limit, requester));
				}
				
				printJson(response, list);
			});
			break;
		default:
			Board _board = toBoard(board);
			processDAO(PostDAO.class, dao -> {
				List<Post> list = dao.getList(_board, page, requester);
				if(hasBoardInfo) {
					printJson(response, new PostList(_board, list));
				} else {
					printJson(response, list);
				}
			});
		}
	}
	
	private PostList getPostList(PostDAO dao, Board board, int page, long limit, byte[] requester) {
		List<Post> list = dao.getList(board, page, limit, requester);
		return new PostList(board.ko(), board.ordinal() + "", list);
	}
	
	private void sendRightSideList(HttpServletResponse response, byte[] requester) throws IOException {
		processDAO(PostDAO.class, dao -> {
			//List<Post> best = dao.getBestList();
			List<Post> popular = dao.getPopularList(requester);
			List<Post> hot = dao.getHotList(requester);
			
			List<PostList> list = new ArrayList<>();
			list.add(new PostList("실시간 인기 글", null, popular));
			list.add(new PostList(HOT_BOARD_NAME, "hot", hot));
			list.add(new PostList(BEST_BOARD_NAME, "best", null));
			
			printJson(response, list);
		});
	}
	
	
	private void sendSearchList(HttpServletRequest request, HttpServletResponse response, byte[] requester) throws IOException {
		SearchType[] typeArray = RequestParser.getArray(request, "type", SearchType::valueOf, SearchType[]::new, SearchType.length, true);
		if(typeArray == null) typeArray = SearchType.values;
		
		String[] boardStringArray = RequestParser.getValues(request, "board", true);

		int page = RequestParser.getInt(request, "page", null, true);
		String keyword = RequestParser.get(request, "keyword");
		
		
		final SearchType[] type = typeArray;
		final Board[] board = boardStringArray == null ? null : Arrays.stream(boardStringArray).map(Integer::parseInt).map(Board::ordinalOf).toArray(Board[]::new);
		processDAO(PostDAO.class, dao -> {
			printJson(response, dao.search(requester, type, board, keyword, page));
		});
	}
	
	private void sendSearchListWithBoard(HttpServletRequest request, HttpServletResponse response, byte[] requester) throws IOException {
		SearchType[] typeArray = RequestParser.getArray(request, "type", SearchType::valueOf, SearchType[]::new, SearchType.length, true);
		if(typeArray == null) typeArray = SearchType.values;
		
		Board board = RequestParser.getTo(request, "board", this::toBoard);

		int page = RequestParser.getInt(request, "page", null, true);
		String keyword = RequestParser.get(request, "keyword");
		
		
		final SearchType[] type = typeArray;
		processDAO(PostDAO.class, dao -> {
			PostList list = new PostList(board, dao.search(requester, type, new Board[] {board}, keyword, page));
			printJson(response, list);
		});
	}
	
	private void sendPost(HttpServletRequest request, HttpServletResponse response, byte[] requester) throws IOException {
		long postId = RequestParser.getLong(request, "id");
		boolean hasBoardInfo = RequestParser.getBoolean(request, "hasBoardInfo", null);
		
		processDAO(PostDAO.class, dao -> {
			PostVO vo = dao.getPostWithComment(postId, hasBoardInfo, requester);
			printJson(response, vo);
		});
	}
	
	private void assertLogin(byte[] userUuid) {
		if(userUuid == null) throw MyServletException.UNAUTHORIZED;
	}
	
	public Board toBoard(String ordinalString) {
		try {
			return Board.ordinalOf(Integer.parseInt(ordinalString));
		} catch(Exception e) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, "board");
		}
	}
}
