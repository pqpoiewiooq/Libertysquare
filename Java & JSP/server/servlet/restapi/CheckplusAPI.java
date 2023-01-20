package servlet.restapi;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import exception.MyServletException;
import net.NiceData;
import net.NiceHelper;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.RequestParser;

public class CheckplusAPI extends MyHttpServlet {
	private static final long serialVersionUID = -4188390057525826232L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String type = RequestParser.get(request, "type");
		
		String redirectUrl = null;
		switch(type) {
		case "pw":
			redirectUrl = "/checkplus_pw";
			break;
		case "signup":
			redirectUrl = "/checkplus_signup";
			break;
		default:
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, "type");
		}
		
		NiceData data = NiceHelper.createRequestData(request, redirectUrl, "/checkplus_fail");
		if(data.encData == null) throw new MyServletException(data.msg);
		else print(response, data.encData);
	}
}
