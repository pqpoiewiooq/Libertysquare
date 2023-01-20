package com.libertysquare.chat.mvc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.libertysquare.chat.exception.ValidateException;
import com.libertysquare.common.util.CryptoUtils;

import account.User;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MysqlDao {
	private DataSource dataSource;
	
	private static final String QUERY_FROM_COMMENT = "SELECT comment.post, comment.isAnonymity, user.uuid, user.nickname, user.path_profile, user.fcmToken FROM comment INNER JOIN user ON user.uuid=comment.user WHERE comment.id = ";
	private static final String QUERY_FROM_POST = "SELECT post.id, post.isAnonymity, user.uuid, user.nickname, user.path_profile, user.fcmToken FROM post INNER JOIN user ON user.uuid=post.writer WHERE post.id = ";
	
	public ContactTarget getTarget(ContactRequest request) {
		try (
			Connection conn = dataSource.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery((request.getType() == ContactRequest.Type.POST ? QUERY_FROM_POST : QUERY_FROM_COMMENT) + request.getId());
		) {
			rs.next();// 없으면 어차피 오류 나오니까 if문 사용 없이 바로 데이터 가공
			
			long postId = rs.getLong(1);
			boolean isAnonymity = rs.getBoolean(2);
			User user = new User();
			user.setUUID(CryptoUtils.byteArrayToHexString(rs.getBytes(3)));
			user.setNickname(rs.getString(4));
			user.setProfilePath(rs.getString(5));
			user.setFCMToken(rs.getString(6));
			
			return ContactTarget.builder()
					.postId(postId)
					.isAnonymity(isAnonymity)
					.user(user)
					.build();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new ValidateException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "대상 정보를 가져오지 못하였습니다.");
		}
	}
}
