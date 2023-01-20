package servlet.restapi;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import account.User;
import exception.MyServletException;
import net.MailSender;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.RequestParser;

public class FeedbackAPI extends MyHttpServlet {
	private static final long serialVersionUID = -1645517314446861561L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		User user = getUser(request, false);

		int starlate = RequestParser.getInt(request, "starlate", 10);
		if (starlate < 0) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "starlate");

		String content = RequestParser.get(request, "content");
		
		sendFeedbackToMail(user, starlate, content);
	}

	public void sendFeedbackToMail(User user, int starlate, String str) throws MyServletException {
		StringBuffer content = new StringBuffer();
		content.append("<html><head></head><body>");
		content.append("유저 : " + (user == null ? "비회원" : user.getUUID() + " - " + user.getName() + " - " + user.getNickname()));
		content.append("<br>별점 : " + starlate + "<br>");
		content.append(str);
		content.append("</body></html>");
		
		MailSender.send("[자유광장] 피드백", content.toString());
	}
}