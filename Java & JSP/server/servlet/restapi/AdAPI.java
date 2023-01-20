package servlet.restapi;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;

import account.User;
import exception.MyServletException;
import net.MailSender;
import servlet.common.MyHttpServlet;
import servlet.util.MultipartRequestParser;

public class AdAPI extends MyHttpServlet {
	private static final long serialVersionUID = 101544298007958779L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		MultipartRequest mr = ImageAPI.createMultipartRequest(request);
		//Enumeration<?> fileNames = mr.getFileNames();
		File file = mr.getFile("file");
//		if(fileNames.hasMoreElements()) {
//			String name = (String) fileNames.nextElement();
//			mr.get
//		}
		
		User user = getUser(request, false);
		
		String title = MultipartRequestParser.get(mr, "title");
		String content = MultipartRequestParser.get(mr, "content");
		String company = MultipartRequestParser.get(mr, "company");
		String proponent = MultipartRequestParser.get(mr, "proponent");
		String job_position = MultipartRequestParser.get(mr, "job_position", true);
		String tel = MultipartRequestParser.get(mr, "tel");
		String email = MultipartRequestParser.get(mr, "email");
		String homepage = MultipartRequestParser.get(mr, "homepage", true);
		//String file = RequestParser.get(request, "file");file
		
		StringBuffer sb = new StringBuffer();
		sb.append("<html><head></head><body>")
			.append("유저 : ").append(user == null ? "비회원" : user.getUUID() + " - " + user.getName() + " - " + user.getNickname())
			.append("<br>[제목]: ").append(title)
			.append("<br>[회사(기관)명]: ").append(company)
			.append("<br>[제안자명]: ").append(proponent)
			.append("<br>[직책]: ").append(job_position)
			.append("<br>[전화번호]: ").append(tel)
			.append("<br>[이메일]: ").append(email)
			.append("<br>[홈페이지]: ").append(homepage)
			.append("<br>[문의 내용]<br>").append(content)
			.append("</body></html>");
		
		MailSender.send("[FLATTOP] 광고 문의", sb.toString(), file);
	}
}
