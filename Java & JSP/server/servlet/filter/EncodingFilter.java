package servlet.filter;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import account.User;
import util.UAgentInfo;

public class EncodingFilter implements Filter {
	private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
	private static Map<String, AgentInfo> map;
	
	public void init(FilterConfig config) throws ServletException {
		if(map != null) return;
		
		BufferedReader br = null;
		try {
			File file = new File("Connected Device.log");
			if(!file.exists()) {
				file.createNewFile();
				map = new LinkedHashMap<>();
				return;
			}

			StringBuffer buffer = new StringBuffer();
			br = new BufferedReader(new FileReader(file));
			String line = null;
			while ((line = br.readLine()) != null) {
				buffer.append(line);
			}
		    
		    map = gson.fromJson(buffer.toString(), new TypeToken<LinkedHashMap<String, AgentInfo>>() {}.getType());
		} catch(Exception e) {
			e.printStackTrace();
			map = new LinkedHashMap<>();
		}
		finally {
			try {
				if(br != null) br.close();
			} catch(Exception e) {}
		}
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		
		try {
			init(null);
		} catch(Exception e) {}
		
		if(request instanceof HttpServletRequest) {
			collectDevice((HttpServletRequest) request);
		}
		
		
		chain.doFilter(request, response);
	}
	
	private void collectDevice(HttpServletRequest request) {
		try {
			String userAgent = request.getHeader("User-Agent");
		    String httpAccept = request.getHeader("Accept");
			UAgentInfo info = new UAgentInfo(userAgent, httpAccept);
			
			HttpSession session = request.getSession(false);
			String uuid, id;
			uuid = id = null;
			User user = (User) session.getAttribute("user");
			if(user == null) {
				uuid = id = "unknown";
			} else {
				uuid = user.getUUID();
				id = user.getID();
			}
			
			AgentInfo a = map.get(uuid);
			if(a == null) {
				a = new AgentInfo();
				a.id = id;
				map.put(uuid, a);
			}
			if(info.detectAndroidTablet()) {
				a.androidTablet++;
			} else if(info.detectAndroidWebKit()) {
				a.androidWebKit++;
			} else if(info.isAndroidPhone) {
				a.androidPhone++;
			} else if(info.detectIpad()) {
				a.ipad++;
			} else if (info.detectIpod()) {
				a.ipod++;
			} else if (info.isIphone) {
				a.iphone++;
			} else {
				a.etc++;
			}
		} catch(Exception e) {}
	}

	@SuppressWarnings("unused")
	private class AgentInfo implements Serializable {
		private static final long serialVersionUID = 5919799574638915044L;
		
		String id;
		int etc = 0;
		int androidPhone = 0;
		int androidTablet = 0;
		int androidWebKit = 0;
		int iphone = 0;
		int ipad = 0;
		int ipod = 0;
	}
	
	public void destroy() {
		if(map == null || map.size() < 1) return;
		
		File file = new File("Connected Device.log");
		try(FileWriter writer = new FileWriter(file, false)) {// 덮어쓰기 모드(false)
			writer.write(gson.toJson(map));
		} catch(Exception e) {}
	}
}
