package dao;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import data.Account;
import data.BusinessType;
import data.Host;
import data.Support;
import data.SupportCategory;
import database.ResultSetSequence;
import database.Table;
import database.query.DeleteQuery;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;

public class SupportDAO extends DefaultDAO<Support> {
	private static long countPerPage = 10;

	protected SupportDAO() {
		super(Table.SUPPORT);
	}
	
	@Override
	public synchronized long insert(Support support) {
		InsertQuery query = QueryFactory.insert(Table.SUPPORT)
				.add(null)
				.addCommand("uuid()")
				.add(support.getLink())
				.add(support.isPublic())
				.add(support.getTitle())
				.add(support.getContactEmail())
				.add(support.getContactTel())
				.addToJson(support.getAccount())
				.add(support.getCategories())
				.add(support.getBusinessType().name())
				.add(support.getHashtags())
				.add(support.getContent())
				.add(support.getCoverPath())
				.add(support.getHost())
				.add(null)
				.add(null);
		
		return executeInsert(query);
	}
	
	protected static Support parse(ResultSetSequence sequence) {
		Support support;
		try {
			if(!sequence.next()) return null;
			
			support = new Support();
			
			support.setID(sequence.nextInt());
			support.setUUID(sequence.nextString());
			support.setLink(sequence.nextString());
			support.setPublic(sequence.nextBoolean());
			support.setTitle(sequence.nextString());
			support.setContactEmail(sequence.nextString());
			support.setContactTel(sequence.nextString());
			support.setAccount(sequence.nextFromJson(Account.class));
			support.setCategories(sequence.nextFromJson(SupportCategory[].class));
			support.setBusinessType(sequence.nextFrom(BusinessType::valueOf));
			support.setHashtags(sequence.nextFromJson(String[].class));
			support.setContent(sequence.nextString());
			support.setCoverPath(sequence.nextString());
			support.setHost(sequence.nextLong());
			support.setGeneratedDateTime(sequence.nextString());
			support.setUpdateDateTime(sequence.nextString());
		} catch (Exception e) {
			e.printStackTrace();
			support = null;
		}
		return support;
	}
	
	@Override
	public Support get(long id) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", id);
		return executeQuery(query, SupportDAO::parse);
	}
	
	/**
	 * @param eventID id or uuid
	 * */
	public Support get(String idOrUUID) {
		SelectQuery query =QueryFactory.select(getTable())
				.eq("id", idOrUUID)
				.or()
				.eq("uuid", idOrUUID);
		return executeQuery(query, SupportDAO::parse);
	}
	
	public Map<String, Object> getDetail(int id) {
		return _getDetail(get(id));
	}
	
	/**
	 * @param eventID id or uuid
	 * */
	public Map<String, Object> getDetail(String idOrUUID) {
		return _getDetail(get(idOrUUID));
	}
	
	public synchronized Map<String, Object> _getDetail(Support support) {
		if (support == null) return null;

		Map<String, Object> map = new HashMap<>();
		map.put("support", support);
		
		SelectQuery hostQuery = QueryFactory.select(Table.HOST)
				.eq("id", support.getHost());
		Host host = executeQuery(hostQuery, sequence ->  {
			return sequence.next() ? HostDAO.parse(sequence) : null;
		});
		map.put("host", host);
		
		return map;
	}
	
	public synchronized boolean update(Support support) {
		UpdateQuery query = QueryFactory.update(Table.SUPPORT)
				.set("link", support.getLink())
				.set("_public", support.isPublic())
				.set("title", support.getTitle())
				.set("contact_email", support.getContactEmail())
				.set("contact_tel", support.getContactTel())
				.setToJson("account", support.getAccount())
				//.set("category", support.getCategories())
				//.set("business_type", support.getBusinessType() == null ? null : support.getBusinessType().name())
				//.set("hashtag", support.getHashtags())
				.set("content", support.getContent())
				.set("path_cover", support.getCoverPath())
				.eq("id", support.getID());
		
		return executeUpdate(query);
	}
	
	private static SelectQuery createListQuery(int pageNumber) {
		return QueryFactory.select(Table.SUPPORT + " INNER JOIN host ON support.host=host.id")
				.addResults("support.id", "support.title", "support.hashtag", "support._public", "support.path_cover", "host.name", "host.id")
				.pagination(pageNumber, countPerPage);
	}
	
	public ArrayList<Support> getList(SelectQuery query) {
		return executeQuery(query, sequence -> {
			ArrayList<Support> list = new ArrayList<>();
			try {
				while (sequence.next()) {
					Support support = new Support();
					try {
						support.setID(sequence.nextInt());
						support.setTitle(sequence.nextString());
						support.setHashtags(sequence.nextFromJson(String[].class));
						support.setPublic(sequence.nextBoolean());
						support.setCoverPath(sequence.nextString());
						support.setHostName(sequence.nextString());
						support.setHost(sequence.nextLong());
					} catch(Exception e) {
						support = null;
					}
					if(support != null) list.add(support);
				}
			} catch (Exception e) {
				e.printStackTrace();
				list = null;
			}
			return list;
		});
	}

	// 추천 행사
	public ArrayList<Support> getRecommendationList(int pageNumber) {
		return getRecencyList(pageNumber);
	}

	// 최신 행사 (등록 기준)
	public ArrayList<Support> getRecencyList(int pageNumber) {
		return getList(createListQuery(pageNumber)
				.eq("support._public", true)
				.orderByDesc("support.gen_time"));
	}

	// 베스트 - 주최(호스트) 좋아요 순
	public ArrayList<Support> getBestList(int pageNumber) {
//		SelectQuery query = QueryFactory.select(Table.SUPPORT)
//				.setResultField("support.id, support.title, support.hashtag, support._public, support.path_cover, support.host, (SELECT COUNT(*) FROM subscribe WHERE subscribe.host=support.host) as cnt")
//				.orderByDesc("cnt")
//				.pagination(pageNumber, countPerPage);
		
		SelectQuery query = QueryFactory.select(Table.SUPPORT, Table.HOST)
				.setResult("support.id, support.title, support.hashtag, support._public, support.path_cover, host.name, (IFNULL(LENGTH(host.subscribe) - LENGTH(REPLACE(host.subscribe, ',', '')) + 1, 0)) as cnt")
				.command("support.host=host.id")
				.orderByDesc("cnt")
				.pagination(pageNumber, countPerPage);
		
		return executeQuery(query, sequence -> {
			Map<Integer, ArrayList<Support>> map = new LinkedHashMap<>();
			try {
				while (sequence.next()) {
					Support support = new Support();
					int subscriber = 0;
					try {
						support.setID(sequence.nextInt());
						support.setTitle(sequence.nextString());
						support.setHashtags(sequence.nextFromJson(String[].class));
						support.setPublic(sequence.nextBoolean());
						support.setCoverPath(sequence.nextString());
						support.setHostName(sequence.nextString());
						subscriber = sequence.nextInt();
					} catch(Exception e) {
						support = null;
					}
					
					if(support != null) {
						ArrayList<Support> list = map.get(subscriber);
						if(list == null) {
							list = new ArrayList<>();
							map.put(subscriber, list);
						}
						list.add(support);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
			
			ArrayList<Support> result = new ArrayList<>();
			Object[] mapkey = map.keySet().toArray();
			Arrays.sort(mapkey);
			for (Object key : mapkey) {
				ArrayList<Support> list = map.get(key);
				Collections.shuffle(list);
				result.addAll(list);
			}
			
			return result;
		});
	}
	
	
	
	
	// /events 페이지의 리스트. (최신과 동일하되, host 정보 포함)
	public ArrayList<Support> getDetailList(int pageNumber) {
		return getList(createListQuery(pageNumber)
					.eq("support._public", true)
					.orderByDesc("support.gen_time"));
	}
	
	
	public static ArrayList<Support> getHostedSupportList(Connection conn, long hostId) {
		@SuppressWarnings("resource")
		SupportDAO dao = new SupportDAO();
		dao.conn = conn;
		
		SelectQuery query = QueryFactory.select(Table.SUPPORT + " INNER JOIN host ON support.host=host.id")
			.setResult("support.id, support.title, support.hashtag, support._public, support.path_cover, support.business_type, host.id, host.name")
			.eq("support.host", hostId)
			.orderByDesc("support.gen_time");
		
		return dao.executeQuery(query, sequence -> {
			ArrayList<Support> list = new ArrayList<>();
			try {
				while (sequence.next()) {
					Support support = new Support();
					try {
						support.setID(sequence.nextInt());
						support.setTitle(sequence.nextString());
						support.setHashtags(sequence.nextFromJson(String[].class));
						support.setPublic(sequence.nextBoolean());
						support.setCoverPath(sequence.nextString());
						support.setBusinessType(sequence.nextFrom(BusinessType::valueOf));
						support.setHost(sequence.nextLong());
						support.setHostName(sequence.nextString());
					} catch(Exception e) {
						support = null;
					}
					if(support != null) list.add(support);
				}
			} catch (Exception e) {
				e.printStackTrace();
				list = null;
			}
			return list;
		});
	}
	
	public static void setCountPerPage(long cnt) {
		SupportDAO.countPerPage = cnt;
	}
	
	@Override
	public synchronized boolean delete(long id) {
		DeleteQuery query = QueryFactory.delete(getTable())
				.eq("id", id);
		
		return executeUpdate(query);
	}
}
