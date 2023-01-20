package dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import account.User;
import database.ResultSetSequence;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import util.CryptoHelper;

public class UserDAO extends DefaultDAO<User> {
	protected UserDAO() {
		super(Table.USER);
	}
	
	public User login(String id, String pwd) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", id)
				.and()
				.eq("state", User.State.ACTIVATE.name());
		
		return executeQuery(query, sequence -> {
			if(sequence.next()) {
				User user = parse(sequence);
				if(!CryptoHelper.evaluateSHA512(user.getPassword(), CryptoHelper.encryptSHA512(pwd, user.getSalt()))) {
					return null;
				}
				
				return user;
			}
			return null;
		});
	}
	
	public static final String INVALID_COOKIE_VALUE = "_invalid_cookie_";
	public User loginByCookie(String cookie) {
		if(INVALID_COOKIE_VALUE.equals(cookie)) return null;
		
		SelectQuery query = QueryFactory.select(getTable())
				.eq("cookie", cookie)
				.and()
				.eq("state", User.State.ACTIVATE.name());
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}
	
	protected static User parse(ResultSet rs) {
		return parse(new ResultSetSequence(rs));
	}
	
	protected static User parse(ResultSetSequence sequence) {
		try {
			User user = new User();
			
			user.setUUID(CryptoHelper.byteArrayToHexString(sequence.nextBytes()));
			user.setID(sequence.nextString());
			user.setPassword(sequence.nextBytes());
			user.setSalt(sequence.nextString());
			user.setState(User.State.valueOf(sequence.nextString()));
			user.setName(sequence.nextString());
			user.setNickname(sequence.nextString());
			user.setBirth(sequence.nextInt());
			user.setGender(sequence.nextInt());
			user.setNational(User.National.valueOf(sequence.nextString()));
			user.setDI(sequence.nextString());
			user.setMobileCorp(sequence.nextString());
			user.setProfilePath(sequence.nextString());
			user.setFCMToken(sequence.nextString());
			sequence.jump(1);// cookie
			user.setDeactivatedAt(sequence.nextString());
			user.setSignupAt(sequence.nextString());
			
			return user;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public synchronized User register(User user, String cookie) {
		InsertQuery query = QueryFactory.insert(getTable())
				.addToBytes(user.getUUID())
				.add(user.getID())
				.add(user.getPassword())
				.add(user.getSalt())
				.add(user.getState().name())
				.add(user.getName())
				.add(user.getNickname())
				.add(user.getBirth())
				.add(user.getGender())
				.add(user.getNational().name())
				.add(user.getDI())
				.add(user.getMobileCorp())
				.add(user.getProfilePath())
				.add(user.getFCMToken())
				.add(cookie)
				.add(user.getDeactivatedAt())
				.add(user.getSignupAt());

		executeUpdate(query);
		
		return user;
	}
	
	public synchronized Boolean checkDI(String DI) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("DI")
				.eq("DI", DI)
				.and()
				.eq("state", User.State.ACTIVATE.name());
		
		return executeExists(query);
	}
	
	public boolean updatePassword(String DI, byte[] newPassword) {
		String query = "UPDATE " + getTable() + " SET pw = ?, cookie = ? WHERE DI = ?";
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setBytes(1, newPassword);
			pstmt.setNull(2, Types.VARCHAR);
			pstmt.setString(3, DI);
			
			return pstmt.executeUpdate() > 0;
		} catch(SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(pstmt != null) pstmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return false;
	}

	public boolean updatePassword(String uuid, byte[] curPassword, byte[] newPassword){
		String query = "UPDATE " + getTable() + " SET pw = ?, cookie = ? WHERE uuid = ? AND pw = ?";
		PreparedStatement pstmt = null;
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setBytes(1, newPassword);
			pstmt.setNull(2, Types.VARCHAR);
			pstmt.setBytes(3, CryptoHelper.hexStringToByteArray(uuid));
			pstmt.setBytes(4, curPassword);
			return pstmt.executeUpdate() > 0;
		} catch(SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(pstmt != null) pstmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return false;
	}
	
	public boolean updateState(String uuid, byte[] password, User.State state) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("state", state.name())
				.eq("uuid", CryptoHelper.hexStringToByteArray(uuid))
				.and()
				.eq("pw", password);
		
		return executeUpdate(query);
	}

	public synchronized final boolean updateCookieAndFcmToken(User user, String cookie, String token) {
		String currentToken = user.getFCMToken();
		boolean isSameToken = token == null ? currentToken == null : token.equals(user.getFCMToken());
		if(isSameToken) token = null;
	
		UpdateQuery query = QueryFactory.update(getTable())
				.set("cookie", cookie)
				.set("fcmToken", token)
				.eq("uuid", CryptoHelper.hexStringToByteArray(user.getUUID()));
		
		boolean result = executeUpdate(query);
		if(result && !isSameToken) {
			user.setFCMToken(token);
		}
		return result;
	}
	

	public final boolean hasUser(String id) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("id")
				.eq("id", id)
				.and()
				.eq("state", User.State.ACTIVATE.name());
		
		return executeExists(query);
	}
	
	public final boolean updateProfile(String uuid, String nickname, String profilePath) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("nickname", nickname)
				.set("path_profile", profilePath)
				.eq("uuid", CryptoHelper.hexStringToByteArray(uuid));
		
		return executeUpdate(query);
	}
	
	public final String getSalt(String userID) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("salt")
				.eq("id", userID);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? sequence.nextString() : null;
		});
	}
	
	public final String getFcmToken(byte[] userUUID) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("fcmToken")
				.eq("uuid", userUUID);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? sequence.nextString() : null;
		});
	}
	
	public final Set<String> getFcmTokenAll(Collection<byte[]> userUuids) {
		if(userUuids == null || userUuids.isEmpty()) return null;
		
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("fcmToken");
		
		Iterator<byte[]> it = userUuids.iterator();
		query.where("uuid IN (?", it.next());
		
		while(it.hasNext()) {
			query.where(",?", it.next());
		}
		query.command(")");
		
		return executeQuery(query, sequence -> {
			Set<String> fcmTokens = new HashSet<>();
			
			while(sequence.next()) {
				String token = sequence.nextString();
				if(token != null) fcmTokens.add(token);
			}

			return fcmTokens;
		});
	}
	
	public final String getUserNickname(String userUUID) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("nickname")
				.eq("uuid", CryptoHelper.hexStringToByteArray(userUUID));
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? sequence.nextString() : null;
		});
	}
	
	public final String[] getUserIDArray(String[] userUUIDArray) {
		if(userUUIDArray == null) return null;
		
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("id")
				.command("uuid=? AND state=?");
		
		try (PreparedStatement pstmt = query.createQueryStatement(conn)) {
			List<String> list = new ArrayList<>();
			
			pstmt.setString(2, User.State.ACTIVATE.name());
			for(String uuid : userUUIDArray) {
				pstmt.setBytes(1, CryptoHelper.hexStringToByteArray(uuid));
				executeQuery(pstmt, sequence -> {
					if(sequence.next()) {
						list.add(sequence.nextString());
					}
				});
			}
			
			return list.toArray(new String[list.size()]);
		} catch(SQLException e) {
			return null;
		}
	}
	
	public final String[] getUserUUIDArray(String[] userIDArray) {
		if(userIDArray == null) return null;
		
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("uuid")
				.command("id=?");
		
		try (PreparedStatement pstmt = query.createQueryStatement(conn)) {
			List<String> list = new ArrayList<>();
			
			for(String id : userIDArray) {
				pstmt.setString(1, id);
				executeQuery(pstmt, sequence -> {
					if(sequence.next()) {
						list.add(CryptoHelper.byteArrayToHexString(sequence.nextBytes()));
					}
				});
			}
			
			return list.toArray(new String[list.size()]);
		} catch(SQLException e) {
			return null;
		}
	}

	@Override
	@Deprecated
	public long insert(User user) {
		return -1;
	}

	/* 아래부터는 관리자 페이지용 */
	
//	public static enum SearchType {
//		NAME, NICKNAME, ID;
//		
//		public static final SearchType[] values = values();
//		public static final int length = values.length;
//	}
//	
//	/**
//	 * @param keyward 이름, 전화번호(ID)
//	 */
//	protected final List<User> search(SearchType[] types, String keyword, int offset, int limit) {
//		SelectQuery searchQuery = QueryFactory.select(getTable())
//				.setResult("name, nickname, id, path_profile, fcmToken")
//				.pagination(offset, limit);
//		
//		// isBlank를 쓰고 싶으나, java8 사용중이고, 관련 depenency가 없어서 일단 isEmpty 사용.
//		if(keyword != null && !keyword.isEmpty()) {
//			if(types == null || types.length < 1) types = SearchType.values;
//			
//			searchQuery.like(types[0].name().toLowerCase(), keyword);
//			
//			for(int i = 1; i < types.length ; i++) {
//				searchQuery.or().like(types[i].name().toLowerCase(), keyword);	
//			}
//		}
//		
//		return executeQuery(searchQuery, sequence -> {
//			List<User> list = new ArrayList<>();
//			while(sequence.next()) {
//				User user = new User();
//				user.setName(sequence.nextString());
//				user.setNickname(sequence.nextString());
//				user.setID(sequence.nextString());
//				user.setProfilePath(sequence.nextString());
//				user.setFCMToken(sequence.nextString());
//				list.add(user);
//			}
//			return list;
//		});
//	}
}