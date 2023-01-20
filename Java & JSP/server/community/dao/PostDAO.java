package community.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.StringTokenizer;

import account.SimpleUserInfo;
import community.entity.Board;
import community.entity.Comment;
import community.entity.Post;
import community.entity.PostVO;
import community.entity.Post.Status;
import dao.DAOFactory;
import dao.DefaultDAO;
import database.ResultSetSequence;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import exception.MyServletException;
import servlet.common.ServletStatus;
import util.CryptoHelper;

public class PostDAO extends DefaultDAO<Post> {
	private static long countPerPage = 20;

	public PostDAO() {
		super(Table.POST);
	}
	
	@Override
	public synchronized long insert(Post post) {
		InsertQuery query = QueryFactory.insert(Table.POST)
				.add(null)
				.add(post.getWriter())
				.add(post.getBoard().ordinal())
				.add(post.getTitle())
				.add(post.getContent())
				.add(post.isAnonymity())
				.add(post.isQuestion())
				.add(post.getStatus().name())
				.add(null)
				.add(null);
		return executeInsert(query);
	}
	
	protected static Post parse(ResultSetSequence sequence) {
		Post post = null;
		try {
			if(!sequence.next()) return null;
			
			post = new Post();
			post.setId(sequence.nextLong());
			post.setWriter(sequence.nextBytes());
			post.setBoard(Board.ordinalOf(sequence.nextInt()));
			post.setTitle(sequence.nextString());
			post.setContent(sequence.nextString());
			post.setAnonymity(sequence.nextBoolean());
			post.setQuestion(sequence.nextBoolean());
			post.setStatus(sequence.nextFrom(Post.Status::valueOf));
		} catch (Exception e) {
			e.printStackTrace();
			post = null;
		}
		return post;
	}
	
	@Override
	public Post get(long id) {
		SelectQuery query = QueryFactory.select(Table.POST)
				.eq("id", id);
		return executeQuery(query, PostDAO::parse);
	}
	
	public Post getDetail(long id, byte[] requester) {
		SelectQuery query = createDetailQuery(requester)
				.and("id", id);
		return executeQuery(query, sequence -> {
			return sequence.next() ? parseDetail(sequence) : null;
		});
	}
	
	private static SelectQuery createDetailQuery(byte[] requester) {
		return createDetailQuery(Table.POST.toString(), requester);
	}
	
	private static SelectQuery createDetailQuery(String preTable, byte[] requester) {
		return QueryFactory.select(preTable + " INNER JOIN user ON user.uuid=post.writer")
				.addResult("post.*")
				.addResult("(SELECT count(*) FROM post_like WHERE post_like.post=post.id) as likes")
				.addResult("(SELECT count(*) FROM comment WHERE comment.post=post.id) as comments")
				.addResult("(SELECT count(*) FROM post_scrap WHERE post_scrap.post=post.id) as scrap")
				.addResult("user.nickname")
				.addResult("user.path_profile")

				// 차단한 게시글은 리스팅 제외
				.from("LEFT JOIN post_block ON post_block.user=? AND post_block.post=post.id", requester)
				.command("post_block.id IS NULL");
	}
	
	private static SelectQuery createListQuery(int page, byte[] requester) {
		return createListQuery(page, countPerPage, requester);
	}
	
	private static SelectQuery createListQuery(int page, long limit, byte[] requester) {
		return createDetailQuery(requester).pagination(page, limit);
	}
	
	private Post parseDetail(ResultSetSequence sequence) {
		Post post = new Post();
		try {
			post.setId(sequence.nextLong());
			sequence.jump(1);//post.setWriter(sequence.nextString());
			post.setBoard(Board.ordinalOf(sequence.nextInt()));
			post.setTitle(sequence.nextString());
			post.setContent(sequence.nextString());
			boolean isAnonymity = sequence.nextBoolean();//post.setAnonymity(sequence.nextBoolean());
			post.setAnonymity(isAnonymity);
			post.setQuestion(sequence.nextBoolean());
			sequence.jump(1);//post.setStatus(sequence.nextFrom(Post.Status::valueOf));
			post.setGeneratedAt(sequence.nextLocalDateTime());
			sequence.jump(1);
			post.setLikes(sequence.nextInt());
			post.setComments(sequence.nextInt());
			post.setScrapCount(sequence.nextInt());
			SimpleUserInfo writer;
			if(isAnonymity) {
				writer = SimpleUserInfo.anonymous;
			} else {
				String nickname = sequence.nextString();
				String profilePath = sequence.nextString();
				writer = SimpleUserInfo.instance(nickname, profilePath);
			}
			post.setWriterInfo(writer);
		} catch (Exception e) {
			e.printStackTrace();
			post = null;
		}
		return post;
	}
	
	public List<Post> getAll(SelectQuery query) {
		return executeQuery(query, sequence -> {
			ArrayList<Post> list = new ArrayList<>();
			try {
				while (sequence.next()) {
					Post post = parseDetail(sequence);
					if(post != null) list.add(post);
//					String content = post.getContent();
//					if(content.length() > 80) post.setContent(content.substring(0, 80));
				}
			} catch (Exception e) {
				e.printStackTrace();
				list = null;
			}
			return list;
		});
	}
	
	public static enum SearchType {
		TITLE, CONTENT, WRITER;
		
		public static final SearchType[] values = values();
		public static final int length = values.length;
		
		public final String name;
		
		SearchType() {
			this.name = this.name().toLowerCase();
		}
	}
	
	public static String esNgram(String str, int n){
	    StringTokenizer stringTokenizer = new StringTokenizer(str.replaceAll("\\p{Z}", ""),"");
	    List<String> strArr = new ArrayList<>();
	    while(stringTokenizer.hasMoreTokens()){
	        String token = stringTokenizer.nextToken();
	        for(int i=0; i<token.length(); i++){
	            if(i+n > token.length()){
	                break;
	            }
	            strArr.add(token.substring(i,i+n));
	        }
	    }
	    return "+" + String.join(" +", strArr);
	}
	
	public List<Post> search(byte[] requester, SearchType[] typeArray, Board[] boardArray, String keyword, int page) {		
		String typeString = null;
		boolean containsWriter = false;
		
		if(typeArray != null && typeArray.length > 0) {
			SearchType type = typeArray[0];
			if(type == SearchType.WRITER) containsWriter = true;
			else typeString = type.name;
			
			for(int i = 1; i < typeArray.length; i++) {
				type = typeArray[i];
				if(type == SearchType.WRITER) {
					containsWriter = true;
					continue;
				}
				if(typeString == null) typeString = typeArray[i].name;
				else typeString += ", " + typeArray[i].name;
			}
		}
		
		SelectQuery query;
		if(boardArray == null || boardArray.length < 1) {
			query = createListQuery(page, requester);
		} else {
			if(boardArray.length == 1) {
				query = createDetailQuery("(SELECT * FROM post WHERE board=" + boardArray[0].ordinal() + ") post", requester);
			} else {
				Board board = boardArray[0];
				String boardString = board.ordinal() + "";
				for(int i = 1; i < boardArray.length; i++) {
					boardString += ", " + boardArray[i].ordinal();
				}
				query = createDetailQuery("(SELECT * FROM post WHERE board IN (" + boardString + ")) post", requester);
			}
			query.pagination(page, countPerPage);
		}
		
		if(typeString != null) {
			if(containsWriter) {
				query.and()
					.command("(")
						.where("MATCH(" + typeString + ") AGAINST(? IN BOOLEAN MODE)", esNgram(keyword, 2))
						.or()
						.like("(user.nickname", keyword).and().where("post.isAnonymity=?)", false)
					.command(")");
			} else {
				query.and().where("MATCH(" + typeString + ") AGAINST(? IN BOOLEAN MODE)", esNgram(keyword, 2));
			}
		} else if(containsWriter) {
			query.and().like("(user.nickname", keyword).and().where("post.isAnonymity=?)", false);
		}
		
		return getAll(query);
	}
	

	// 게시일 빠른 순 + 질문 글인 경우, 게시 시각으로부터 24시간 이내인 경우, 게시일 빠른 순서대로 제일 앞으로 가져옴.
	public List<Post> getList(Board board, int page, byte[] requester) {
		return getList(board, page, countPerPage, requester);
	}
	
	public List<Post> getList(Board board, int page, long limit, byte[] requester) {
		SelectQuery query = createListQuery(page, limit, requester)
				.and()
				.eq("board", board.ordinal())
				.orderByDesc("CASE WHEN (post.isQuestion = true AND (post.gen_time > DATE_ADD(now(), INTERVAL -1 DAY))) THEN 1 ELSE 2 END, post.gen_time");
		
		return getAll(query);
	}
	
	
	private static final int SPECIAL_LIST_DEFAULT_LIMIT = 4;
	
	// 좋아요 10개 이상.
	// 좋아요시 자동으로 리스팅 테이블에 저장. 해당 정보를 토대로 가져옴
	private SelectQuery hotQuery(byte[] requester) {
		return createDetailQuery("hot_post INNER JOIN post ON hot_post.post=post.id", requester)
				.orderByDesc("selected_at");
	}
	
	public List<Post> getHotList(byte[] requester) {
		return getAll(hotQuery(requester).limit(SPECIAL_LIST_DEFAULT_LIMIT));
	}
	
	public List<Post> getHotList(int page, byte[] requester) {
		return getAll(hotQuery(requester).pagination(page, countPerPage));
	}
	
	// 좋아요 50개 이상.
	// 좋아요시 자동으로 리스팅 테이블에 저장. 해당 정보를 토대로 가져옴
	private SelectQuery bestQuery(byte[] requester) {
		return createDetailQuery("best_post INNER JOIN post ON best_post.post=post.id", requester)
				.orderByDesc("selected_at");
	}
	
	public List<Post> getBestList(byte[] requester) {
		return getAll(bestQuery(requester).limit(SPECIAL_LIST_DEFAULT_LIMIT));
	}
	
	public List<Post> getBestList(int page, byte[] requester) {
		return getAll(bestQuery(requester).pagination(page, countPerPage));
	}
	
	
	// 프로시저로 미리 설정해둔 게시글들을 가져옴 - 자세한 조건은 mysql_query.txt 파일에 프로시저와 함께 작성해둠
	// 과한 DB 요청 막기 위해 메모이제이션 사용
//	private static LocalTime memoizedTime = LocalTime.now().minusHours(1);// 원래는 LocalTime.now().getHour()로 가져온 시간만을 이용하려 했으나, 요청이 없는 경우 익일로 넘어갈 수 있어서 제외
//	private static List<Post> memoizedPolularList = null;
//	private static final SelectQuery popularQuery = createDetailQuery().command("post.id IN (SELECT rtp_post.post FROM rtp_post)");
//	public List<Post> getPopularList() {
//		LocalTime now = LocalTime.now();
//		if(memoizedTime.isBefore(now)) {
//			memoizedTime = now.plusHours(1);
//			memoizedPolularList = getAll(popularQuery);
//		}
//		
//		return memoizedPolularList;
//	}
	
	public List<Post> getPopularList(byte[] requester) {
		SelectQuery popularQuery = createDetailQuery(requester)
				.and().command("post.id IN (SELECT rtp_post.post FROM rtp_post)");
		return getAll(popularQuery);
	}
	
	
	
	/* 밑 3 개의 함수들은 mypage에 사용될 것들로, createListQuery로 생성시, requester를 null로 줘서 필터링 하지 않도록 설정 */
	
	public List<Post> getListByUser(byte[] userUUID, int page) {
		return getAll(createListQuery(page, null)
				.and()
				.eq("writer", userUUID)
				.orderByDesc("post.id"));
	}
	
	public List<Post> getListByCommented(byte[] userUUID, int page) {
		return getAll(createListQuery(page, null)
				.from("INNER JOIN comment ON comment.user=?", userUUID)
				.and()
				.command("post.id=comment.post")
				.groupBy("post.id"));
	}
	
	public List<Post> getListByScraped(byte[] userUUID, int page) {
		return getAll(createListQuery(page, null)
				.from("INNER JOIN post_scrap ON post_scrap.user=?", userUUID)
				.and()
				.command("post.id=post_scrap.post")
				.groupBy("post.id"));
	}
	
	
	
	
	
	public PostVO getPostWithComment(long postId, boolean hasBoardInfo, byte[] requester) {
		SelectQuery query = QueryFactory.select(Table.POST + " INNER JOIN user ON user.uuid=post.writer")
				//https://honinbo-world.tistory.com/88 참고하였음
				.from("LEFT OUTER JOIN (SELECT post, MAX(user=?) as liked, COUNT(*) as likes FROM post_like GROUP BY post) post_like ON post_like.post=post.id", requester)
				.from("LEFT OUTER JOIN (SELECT post, MAX(user=?) as scraped, COUNT(*) as scrap FROM post_scrap GROUP BY post) post_scrap ON post_scrap.post=post.id", requester)
				.from("LEFT OUTER JOIN post_block ON post_block.user=? AND post_block.post=post.id", requester)
				.addResult("post.*")
				.addResult("IFNULL(post_like.likes, 0)")
				.addResult("IFNULL(post_like.liked, FALSE)")
				.addResult("IFNULL(post_scrap.scrap, 0)")
				.addResult("IFNULL(post_scrap.scraped, FALSE)")
				.addResult("post_block.id IS NOT NULL")
				.addResult("user.uuid")
				.addResult("user.nickname")
				.addResult("user.path_profile")
				.eq("post.id", postId);
		
		Post post = executeQuery(query, sequence -> {
			if(!sequence.next()) throw new MyServletException(ServletStatus.NOT_FOUND);
			
			Post p = new Post();
			p.setId(sequence.nextLong());
			sequence.jump(1);//post.setWriter(sequence.nextString());
			p.setBoard(Board.ordinalOf(sequence.nextInt()));
			p.setTitle(sequence.nextString());
			p.setContent(sequence.nextString());
			boolean isAnonymity = sequence.nextBoolean();//post.setAnonymity(sequence.nextBoolean());
			p.setAnonymity(isAnonymity);
			p.setQuestion(sequence.nextBoolean());
			sequence.jump(1);//post.setStatus(sequence.nextFrom(Post.Status::valueOf));
			p.setGeneratedAt(sequence.nextLocalDateTime());
			sequence.jump(1);
			p.setLikes(sequence.nextInt());
			p.setLiked(sequence.nextBoolean());
			p.setScrapCount(sequence.nextInt());
			p.setScraped(sequence.nextBoolean());
			if(sequence.nextBoolean()) p.setBlocked(true);
			byte[] writerUUID = sequence.nextBytes();
			p.setWriter(writerUUID);
			if(CryptoHelper.evaluateSHA512(writerUUID, requester)) {
				p.setMine(true);
			}
			SimpleUserInfo writer;
			if(isAnonymity) {
				writer = SimpleUserInfo.anonymous;
			} else {
				String nickname = sequence.nextString();
				String profilePath = sequence.nextString();
				writer = SimpleUserInfo.instance(nickname, profilePath);
			}
			p.setWriterInfo(writer);
			
			return p;
		});
		
		CommentDAO cdao = DAOFactory.convert(this, CommentDAO.class);
		List<Comment> comment = cdao.getByPost(post, requester);
		
		PostVO vo = new PostVO(post, comment, hasBoardInfo ? post.getBoard() : null);
		post.setComments(comment.size());
		post.setBoard(null);
		post.removeWriter();
		
		return vo;
	}

	public boolean update(Post post, byte[] requester) {
		SelectQuery query = QueryFactory.select(Table.POST)
				.addResults("status", "writer")
				.eq("id", post.getId());
		
		return executeQuery(query, sequence -> {
			if(!sequence.next()) throw new MyServletException(ServletStatus.NOT_FOUND, "post(" + post.getId() + ")");
			if(sequence.nextFrom(Status::valueOf) != Status.ACTIVE) throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY);
			if(!Arrays.equals(sequence.nextBytes(), requester)) throw new MyServletException(ServletStatus.FORBIDDEN);
			
			UpdateQuery update = QueryFactory.update(Table.POST)
					.set("title", post.getTitle())
					.set("content", post.getContent())
					.set("isAnonymity", post.isAnonymity())
					.set("isQuestion", post.isQuestion())
					.eq("id", post.getId());
			return executeUpdate(update);
		});
	}
	
	public void delete(long id, byte[] requester) {
		SelectQuery query = QueryFactory.select(Table.POST)
				.addResults("status", "writer")
				.eq("id", id);
		
		executeQuery(query, sequence -> {
			if(!sequence.next()) throw new MyServletException(ServletStatus.NOT_FOUND, "post(" + id + ")");
			if(sequence.nextFrom(Status::valueOf) != Status.ACTIVE) throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY);
			if(!Arrays.equals(sequence.nextBytes(), requester)) throw new MyServletException(ServletStatus.FORBIDDEN);
			
			executeUpdate(QueryFactory.delete(Table.POST).eq("id", id));
		});
	}
}
